import { Provide, Inject, Init, Context } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { MongooseDataSourceManager } from '@midwayjs/mongoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Conversation } from '../entity/common';
import { ConversationEntity, ConversationItem, ServiceEntity, ServiceItem } from '../entity/common.entity';
import moment = require('moment');
import { RedisUtils } from '../utils/RedisUtils';
import { AccountService } from '../entity/account';


@Provide()
export class ServiceMongo {

    @Inject()
    ctx: Context;

    @Inject()
    redisService: RedisService;

    @Inject()
    dataSourceManager: MongooseDataSourceManager;

    @InjectEntityModel(ConversationEntity)
    conversationEntityMode: ReturnModelType<typeof ConversationEntity>;

    @InjectEntityModel(ServiceEntity)
    serviceEntityMode: ReturnModelType<typeof ServiceEntity>;

    @Init()
    async init() {
        // get default connection
        //this.conn = this.dataSourceManager.getDataSource('default');
    }

    /**
     * 关闭会话的时候将 redis 中的数据持久化到 MongoDB 中
     * @param conversation 
     * @returns 
     */
    async syncMongonConversation(conversation: Conversation): Promise<ConversationItem> {
        const conversationItem = new ConversationItem(conversation);
        // console.log('conversationItem.conversationItemID:', conversationItem.conversationItemID)
        //只返回 userID 
        const res = await this.conversationEntityMode.findOne({ _userID: conversation.conversationClient.userID }, { _userID: 1 })
        if (res) {
            const { acknowledged: scuess } = await this.conversationEntityMode.updateOne({ _userID: conversation.conversationClient.userID }, { $push: { conversationArray: conversationItem } }).exec();
            if (!scuess) {
                this.ctx.logger.error("syncMongonConversation 失败：", conversation.conversationClient.userID);
            } else {
                return conversationItem;
            }
        } else {
            const { _userID: userID } = await this.conversationEntityMode.create(
                {
                    _userID: conversation.conversationClient.userID,
                    nickName: conversation.conversationClient.nickName,
                    avatar: conversation.conversationClient.avatar,
                    conversationArray: [conversationItem]
                } as ConversationEntity);
            if (!userID) {
                this.ctx.logger.error("更新 客服人员的 服务记录 失败：", conversation.conversationService.account);
            } else {
                return conversationItem;
            }
        }
    }


    /**
     * 更新 客服人员的 服务记录
     * @param conversation 
     */
    async refreshServiceRecord(conversation: ConversationItem) {
        const serviceItem = new ServiceItem(conversation._id, conversation.conversationClient.userID, conversation.conversationClient.channel)
        const res = await this.serviceEntityMode.findOne({ _accountID: conversation.conversationService.account }, { _id: 1, _accountID: 1 })
        if (res) {
            const { acknowledged: scuess } = await this.serviceEntityMode.updateOne({ _accountID: conversation.conversationService.account }, { $push: { serviceItemArray: serviceItem } }).exec();
            if (!scuess) {
                this.ctx.logger.error("更新 客服人员的 服务记录 失败：", conversation.conversationService.account);
            }
            return scuess;
        } else {
            const { _accountID: accountID } = await this.serviceEntityMode.create(
                {
                    _accountID: conversation.conversationService.account,
                    serviceItemArray: [serviceItem]
                } as ServiceEntity);
            if (!accountID) {
                this.ctx.logger.error("更新 客服人员的 服务记录 失败：", conversation.conversationService.account);
            }
        }
        //new ServiceItem(new mongoose.Types.ObjectId(), conversation.conversationClient.userID,conversation.conversationClient.userID)
        // console.log('accountID:', accountID)
        // console.log('id:', id)
    }

    async servicePreview(): Promise<any> {
        //一个月
        const oneMonthAgoTimeStamp = moment().subtract(1, 'months').valueOf();
        // //一个星期
        // //以今天为起点
        const oneWeekAgoTimeStamp = moment().subtract(7, 'days').valueOf();
        //一天
        //获取今天0时0分0秒
        const oneDayAgoTimeStamp = moment().startOf('day').valueOf();

        let viewDay = {
            text: '客服接单个数（当天）',
            subtext: `${moment().format('YYYY-MM-DD')}`,
            data: [],
        }
        let viewWeek = {
            text: '客服接单个数（一周）',
            subtext: `${moment().subtract(7, 'days').format('YYYY-MM-DD')} 至 ${moment().format('YYYY-MM-DD')}`,
            data: [],
        }
        let viewMonth = {
            text: '客服接单个数（当月）',
            subtext: `${moment().subtract(30, 'days').format('YYYY-MM-DD')} 至 ${moment().format('YYYY-MM-DD')}`,
            dataTime: [],
            dataValues: [],
        }


        const res = await this.serviceEntityMode.aggregate([
            {
                $project: {
                    _accountID: 1,
                    serviceItemArray: {
                        $filter: {
                            input: "$serviceItemArray",
                            as: "item",
                            cond: { $gt: ["$$item.unixtime", oneMonthAgoTimeStamp] }
                        }
                    }
                }
            },
            {
                $match: {
                    serviceItemArray: { $ne: [] } // 筛选至少有一个满足条件的子元素的文档
                }
            }
        ]);

        let totalArray = [];
        for (let i = 0; i < res.length; i++) {
            const account = res[i]._accountID;
            const redisKey = RedisUtils.generateServiceKey(account);
            if (!redisKey) {
                this.ctx.logger.error(`notificationService  客服小姐姐 走丢了 ${account}`);
                return;
            }
            const accountStr = await this.redisService.get(redisKey);
            const accountService: AccountService = JSON.parse(accountStr);
            totalArray = totalArray.concat(res[i].serviceItemArray);


            if (accountService) {
                const nickName = accountService.nickName;
                viewDay.data.push(
                    {
                        name: nickName,
                        value: 0
                    }
                )
                viewWeek.data.push(
                    {
                        name: nickName,
                        value: 0
                    }
                )
                // console.log(res[i]);
                for (let j = 0; j < res[i].serviceItemArray.length; j++) {
                    if (res[i].serviceItemArray[j].unixtime > oneDayAgoTimeStamp) {
                        viewDay.data[i].value++;
                    }
                    if (res[i].serviceItemArray[j].unixtime > oneWeekAgoTimeStamp) {
                        viewWeek.data[i].value++;
                    }
                }
            }
        }
        for (let k = 30; k > 0; k--) {
            let count = 0
            for (let i = 0; i < totalArray.length; i++) {
                if (k > 1) {
                    if (moment().subtract(k, 'days').valueOf() < totalArray[i].unixtime && totalArray[i].unixtime <= moment().subtract(k - 1, 'days').valueOf()) {
                        count++;
                    }
                } else {
                    if (moment().subtract(k, 'days').valueOf() < totalArray[i].unixtime && totalArray[i].unixtime <= moment().endOf('day').valueOf()) {
                        count++;
                    }
                }
            }
            viewMonth.dataTime.push(moment().subtract(k - 1, 'days').format('YYYY-MM-DD'));
            viewMonth.dataValues.push(count);
        }
        totalArray = null;
        // console.log('viewDay :', viewDay)
        // console.log('viewWeek :', viewWeek)
        // console.log('viewMonth :', viewMonth)
        return { viewDay, viewWeek, viewMonth };
    }
}