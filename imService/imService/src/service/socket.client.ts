import { Config, Inject, Provide } from "@midwayjs/decorator";
import { RedisService } from "@midwayjs/redis";
import { Context } from "koa";
import { AccountService } from "../entity/account";
import { Conversation } from "../entity/common";
import { ConversationService } from "../entity/conversation";
import { EventEmit, MessageData, MessageArrayDataService, MessageType } from "../socket/io.event";
import { RedisUtils } from "../utils/RedisUtils";
import { ServiceSocket } from "./service.socket";




/**
 * Socket中 this.ctx.accountInfo == ConversationClient
 */
@Provide()
export class SocketClient {

    @Inject()
    ctx: Context;

    @Config('hostConfig')
    hostConfig;
    @Inject()
    serviceSocket: ServiceSocket;

    @Inject()
    redisService: RedisService;
    async onConnection() {
        this.ctx.logger.info(`用户连线成功 使用：userID ：${this.ctx.accountInfo.userID}, avatar ：${this.ctx.accountInfo.avatar}, nickName : ${this.ctx.accountInfo.nickName}, onLine : ${this.ctx.accountInfo.onLine}, socketID : ${this.ctx.accountInfo.socketId}, channel : ${this.ctx.accountInfo.channel}`);
        /// TODO
        /// 1 是否有未完成的会话： 如果有继续上次的聊， 如果没有新建会话 发送欢迎语：
        /// 2 如果有客服人员在线，为其分配客服人员,并且推送消息，   若不在线缓存回话消息


        const conversationKey = RedisUtils.generateConversationKey(this.ctx.accountInfo.userID);
        const redisStr = await this.redisService.get(conversationKey)
        if (redisStr) {
            ///存在历史更新会话：
            ///更新会话状态
            const conversation: Conversation = JSON.parse(redisStr);
            conversation.conversationClient = this.ctx.accountInfo;

            ///还没有分配 客服人员
            if (!conversation.conversationService) {
                const service = await this.AdaptService();
                if (service) {
                    conversation.conversationService = new ConversationService(
                        service.account,
                        service.nickName,
                        service.avatar,
                        0
                    );
                    this.ctx.logger.warn(`老的会话 成功配到客服人员 ${service.account}`);
                    /// TODO 通知客服更新会话列表
                    this.serviceSocket.notificationService(conversation.conversationService);
                    /// 推送客服人员信息
                    this.ctx.emit(EventEmit.serviceInfo, service);
                } {
                    this.ctx.logger.warn('老的会话 用户过来没有分配到客服人员');
                }
            } else {
                ///已经分配 客服人员
                this.serviceSocket.notificationService(conversation.conversationService);
                /// 推送客服人员信息
                this.ctx.emit(EventEmit.serviceInfo, conversation.conversationService);
            }
            ///已经隐藏会话 重新激活显示
            if (conversation.conversationState == 2) {
                /// 老会话 设置状态为激活
                conversation.conversationState = 1;
            }
            const res = await this.redisService.set(conversationKey, JSON.stringify(conversation));
            if (res != "OK") {
                this.ctx.logger.error('会话更新 redis 更新失败！！');
            }

            //同步历史消息给用户
            //this.serviceSocket.syncHistoryMessage(conversation);


            return conversation;
        } else {
            ///生成新的会话
            const conversation = new Conversation(
                this.ctx.accountInfo,
                null,
                []
            );

            ///生成欢迎语
            const welcome: MessageData = await this.welcomeWords();
            this.ctx.emit(EventEmit.chatClient, welcome);
            conversation.messageArray.push(welcome);

            const service = await this.AdaptService();
            if (service) {
                conversation.conversationService = new ConversationService(
                    service.account,
                    service.nickName,
                    service.avatar,
                    0
                );
                this.ctx.logger.warn(`新的会话 成功配到客服人员 ${service.account}`);
                /// TODO 通知客服更新会话列表,更新历史数据
                this.serviceSocket.notificationService(conversation.conversationService);
                /// 推送客服人员信息
                this.ctx.emit(EventEmit.serviceInfo, service);
            } else {
                this.ctx.logger.warn('新的会话 用户过来没有分配到客服人员', service);
            }
            // console.log('给用户 分配会话：', conversation)
            const res = await this.redisService.set(conversationKey, JSON.stringify(conversation));
            if (res != "OK") {
                this.ctx.logger.error('会话失败 redis 更新失败！！');
            }
            return conversation;
        }
    }

    async welcomeWords(): Promise<MessageData> {
        const time = new Date();
        let messageData: MessageData = null
        //工作日
        if (time.getDate() > 4) {
            if (time.getHours() >= 9 && time.getHours() < 18) {
                /// 欢迎语
                this.ctx.emit(EventEmit.chatClient, new MessageData(MessageType.noticeSystem, '欢迎来到品创,  正在为你分配客服人员', Date.now(), true));
                /// 礼貌提示
                messageData = new MessageData(MessageType.charactersRobot, {
                    avatar: `http://${this.hostConfig.minio.endPoint}:${this.hostConfig.minio.port}/customerservice/common/robot.jpg`,
                    message: '当前坐席繁忙，您可以先描述下你的问题，我们的客服将会在第一之间回复你。'
                }, Date.now(), true);

            } else {
                /// 欢迎语
                this.ctx.emit(EventEmit.chatClient, new MessageData(MessageType.noticeSystem, '欢迎来到品创,  客服工作时间 日早9点-晚6点', Date.now(), true));
                /// 礼貌提示
                messageData = new MessageData(MessageType.charactersRobot, {
                    avatar: `http://${this.hostConfig.minio.endPoint}:${this.hostConfig.minio.port}/customerservice/common/robot.jpg`,
                    message: '您可以先描述下你的问题，我们的客服将会在第一之间回复你。'
                }, Date.now(), true);
            }
        } else {
            /// 欢迎语
            this.ctx.emit(EventEmit.chatClient, new MessageData(MessageType.noticeSystem, '欢迎来到品创,  客服工作时间 工作日日早9点-晚6点', Date.now(), true));
            /// 礼貌提示
            messageData = new MessageData(MessageType.charactersRobot, {
                avatar: `http://${this.hostConfig.minio.endPoint}:${this.hostConfig.minio.port}/customerservice/common/robot.jpg`,
                message: '您可以先描述下你的问题，我们的客服将会在第一之间回复你。'
            }, Date.now(), true);

        }
        return messageData;
    }

    /**
     * 为会话分配 在线客服
     * 
     */
    async AdaptService(): Promise<AccountService> {
        ///遍历客服是否有在线的，在线的 优先分配在线客服人员
        const redisKey = RedisUtils.generateKeyArray(RedisUtils.USERSTATE);
        const keyArray = await this.redisService.keys(redisKey)
        const accountArray = [];
        for (let i = 0; i < keyArray.length; i++) {
            const accountStr = await this.redisService.get(keyArray[i]);
            const accountService: AccountService = JSON.parse(accountStr);
            if (accountService.state == '1' && accountService.type == '1' && accountService.online) {
                accountArray.push({
                    account: accountService.account,
                    nickName: accountService.nickName,
                    avatar: accountService.avatar,
                    online: true
                })
            }
        }

        ///没有在线的 暂时分配离线客服
        if (accountArray.length == 0) {
            this.ctx.logger.warn('没有在线客服 这里先分配一个离线的');
            for (let i = 0; i < keyArray.length; i++) {
                const accountStr = await this.redisService.get(keyArray[i]);
                const accountService: AccountService = JSON.parse(accountStr);
                if (accountService.state == '1' && accountService.type == '1') {
                    accountArray.push({
                        account: accountService.account,
                        nickName: accountService.nickName,
                        avatar: accountService.avatar,
                        online: false,
                    })
                }
            }
        }

        if (accountArray.length > 0) {
            ///随机 这里可以优化调整 安排其他规则
            //let index = Math.floor(Math.random() * (accountArray.length - 0 + 1)) + 0;
            let index = Math.random() * accountArray.length | 0;
            this.ctx.logger.warn('随机 这里可以优化调整 安排其他规则 index:', index);
            if (index >= accountArray.length) {
                this.ctx.logger.error(`安排客服人员出错 数字越界 ：length:${accountArray.length}, index:${index}`);
                index = 0;
            }
            return accountArray[index];
        } else {
            this.ctx.logger.error('当前无坐席 可分配 （连不在线的客服都没有）');
            return null;
        }
    }

    /**
     * 用户 历史消息
     * @param conversationID 
     */
    async HistoryMessage(conversationID: string) {
        const conversationKey = RedisUtils.generateConversationKey(this.ctx.accountInfo.userID);
        const redisStr = await this.redisService.get(conversationKey)
        if (redisStr) {
            ///存在历史更新会话：
            ///更新会话状态
            const conversation: Conversation = JSON.parse(redisStr);
            if (conversation && conversation.messageArray.length > 0) {
                this.ctx.emit(EventEmit.messageToClientHistory, conversation.messageArray);
            }
        }
    }

    /**
     * 从 用户推送消息到 客服
     * @param service 
     * @param client 
     * @param message 
     */
    async messageClientToServer(message: MessageData) {
        ///查找当前回话信息
        const redisKey = RedisUtils.generateConversationKey(this.ctx.accountInfo.userID);
        const redisStr = await this.redisService.get(redisKey);
        const conversation: Conversation = JSON.parse(redisStr);
        if (conversation) {
            if (!conversation.conversationService) {
                this.ctx.logger.warn('未 给会话分配客服人员 无法推送到 客服！！');
                return;
            }
            /// 用户发来的消息 为客服人员未读状态
            conversation.conversationService.unReadCount++;
            conversation.messageArray.push(message)
            const redisStr = await this.redisService.get(RedisUtils.generateServiceKey(conversation.conversationService.account));
            if (redisStr) {
                const accountService: AccountService = JSON.parse(redisStr)
                if (accountService && accountService.online) {
                    await this.serviceSocket.emitMessageBySocketIDToService(
                        accountService.socketId,
                        new MessageArrayDataService(this.ctx.accountInfo.userID, [message])
                    )
                    await this.serviceSocket.refreshServiceConversationByID(accountService.socketId, conversation)
                } else {
                    this.ctx.logger.warn('客服不在线 无法推送到 客服！！');
                }
            }
            const res = await this.redisService.set(redisKey, JSON.stringify(conversation));
            if (res != "OK") {
                this.ctx.logger.error('同步消息到 会话redis 更新失败！！');
            }
        } else {
            this.ctx.logger.error('未找到 有效会话记录！！');
        }
    }







    /**
     * 用户离线
     */
    async onDisConnection() {
        /// 用户离线的时候  要检查当前回话，如果自己没有说话， 需要把回话关掉
        this.ctx.logger.info('用户离线：', this.ctx.accountInfo);
        this.ctx.accountInfo.onLine = false;
        const conversationKey = RedisUtils.generateConversationKey(this.ctx.accountInfo.userID);
        const redisStr = await this.redisService.get(conversationKey)
        if (redisStr) {
            const conversation: Conversation = JSON.parse(redisStr);
            ///更新离线状态
            conversation.conversationClient = this.ctx.accountInfo;
            const res = conversation.messageArray.some((ele) => {
                return !ele.fromService;
            })
            if (!res) {
                this.ctx.logger.info('用户离线：删除空的会话');
                ///持久化到数据库
                ///删除redis 缓存
                await this.redisService.del(conversationKey)
            } else {
                await this.redisService.set(conversationKey, JSON.stringify(conversation))
            }

            //客户离线要通知到 对应的客服变更会话状态
            if (conversation.conversationService) {
                this.serviceSocket.refreshConversation(conversation.conversationService);
            }
        }

    }

}