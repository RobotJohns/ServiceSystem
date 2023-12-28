import { Inject, Provide } from "@midwayjs/decorator";
import { RedisService } from "@midwayjs/redis";
import { Context } from "koa";
import { Conversation } from "../entity/common";
// import { AccountService } from "../entity/account";
import { EventEmit, MessageArrayDataService, MessageData } from "../socket/io.event";
import { RedisUtils } from "../utils/RedisUtils";
import { ServiceSocket } from "./service.socket";

@Provide()
export class SocketService {


    @Inject()
    ctx: Context;
    @Inject()
    redisService: RedisService;
    @Inject()
    serviceSocket: ServiceSocket;


    async onConnection() {
        /// TODO  
        /// 客服连线成功
        /// 1, 更新客服状态 为在线
        /// 2, 查找当前客服 未完结的会话                    分配给他  
        /// 3, 新增历史会话单（客服非工作时间生成的）        分配给他（多个客服的话才用轮询的方式）

        this.ctx.logger.info('客服连线成功：', this.ctx.accountInfo);
        this.ctx.emit(EventEmit.chatMessage, '欢迎来到品创, 新的一天开始工作了');
        const redisServiceKey = RedisUtils.generateServiceKey(this.ctx.accountInfo.account);
        const accountStr = await this.redisService.get(redisServiceKey);
        if (accountStr) {
            const res = await this.redisService.set(redisServiceKey, JSON.stringify(this.ctx.accountInfo));
            if (res != "OK") {
                this.ctx.logger.error('客服人员在线状态 redis 更新失败！！');
            }
        } else {
            this.ctx.logger.error('客服人员连线 redis 数据查找 失败！！');
        }

        const array = await this.serviceSocket.conversationArray(this.ctx.accountInfo);
        this.ctx.emit(EventEmit.serviceConversations, array);
    }

    /**
     * 获取会话历史消息
     * @param conversationID 
     */
    async HistoryMessage(conversationID: string) {
        const conversationKey = RedisUtils.generateConversationKey(conversationID);
        const redisStr = await this.redisService.get(conversationKey)
        if (redisStr) {
            ///存在历史更新会话：推送历史消息
            const conversation: Conversation = JSON.parse(redisStr);
            if (conversation && conversation.messageArray.length > 0) {
                this.ctx.emit(EventEmit.messageToServiceHistory, new MessageArrayDataService(conversationID, conversation.messageArray));
            }
        }
    }

    /**
     * 设置会话未读消息个数为 0
     * @param conversationID 
     */
    async chatServiceRead(conversationID: string) {
        const conversationKey = RedisUtils.generateConversationKey(conversationID);
        const redisStr = await this.redisService.get(conversationKey)
        if (redisStr) {
            const conversation: Conversation = JSON.parse(redisStr);
            if (conversation) {
                conversation.conversationService.unReadCount = 0;
            }
            const res = await this.redisService.set(conversationKey, JSON.stringify(conversation));
            if (res != "OK") {
                this.ctx.logger.error('会话未读消息 更新失败！！');
            }
            this.ctx.emit(EventEmit.serviceConversationsOne, {
                userID: conversation.conversationClient.userID,
                nickName: conversation.conversationClient.nickName,
                avatar: conversation.conversationClient.avatar,
                unReadCount: conversation.conversationService.unReadCount,
                channel: conversation.conversationClient.channel,
                onLine: conversation.conversationClient.onLine
            });
        }
    }



    async onDisConnection() {
        this.ctx.logger.info('客服离线：', this.ctx.accountInfo);
        this.ctx.accountInfo.online = false;
        const redisServiceKey = RedisUtils.generateServiceKey(this.ctx.accountInfo.account);
        const accountStr = await this.redisService.get(redisServiceKey);
        if (accountStr) {
            const res = await this.redisService.set(redisServiceKey, JSON.stringify(this.ctx.accountInfo));
            if (res != "OK") {
                this.ctx.logger.error('客服人员在线状态 redis 更新失败！！');
            }
        } else {
            this.ctx.logger.error('客服人员连线 redis 数据查找 失败！！');
        }
    }

    /**
     * 从 客服推送消息到用户
     * @param service 
     * @param client 
     * @param message 
     */
    async messageServerToClient(conversationID: string, message: Array<MessageData>) {
        const redisKey = RedisUtils.generateConversationKey(conversationID);
        if (redisKey) {
            const redisStr = await this.redisService.get(redisKey);
            if (redisStr) {
                const conversation: Conversation = JSON.parse(redisStr);
                if (conversation) {
                    conversation.messageArray = conversation.messageArray.concat(message)
                    //推送消息
                    if (conversation.conversationClient.onLine) {
                        await this.serviceSocket.emitMessageBySocketIDToClient(conversation.conversationClient.socketId, message);
                    } else {
                        //不在线设置未读消息个数
                        conversation.conversationClient.unReadCount++;
                    }
                    //同步到 Redis回话中
                    const res = await this.redisService.set(redisKey, JSON.stringify(conversation));
                    if (res != "OK") {
                        this.ctx.logger.error('同步消息到 会话redis 更新失败！！');
                    }
                }
            }
        } else {
            this.ctx.logger.error('客服消息 回话查找失败');
        }
    }
}
