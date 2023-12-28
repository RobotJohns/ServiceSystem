import { Inject, Provide } from "@midwayjs/decorator";

import { RedisService } from "@midwayjs/redis";
import { Application as SocketApplication } from '@midwayjs/socketio';
import { App } from '@midwayjs/core';
import { Context } from "koa";
import { AccountService } from "../entity/account";
import { EventEmit, MessageData, MessageArrayDataService } from "../socket/io.event";
import { RedisUtils } from "../utils/RedisUtils";
import { Conversation } from "../entity/common";
import { ConversationService } from "../entity/conversation";

@Provide()
export class ServiceSocket {



    @Inject()
    ctx: Context;


    @App('socketIO')
    socketApp: SocketApplication;

    @Inject()
    redisService: RedisService;


    /**
     * 通知客服 有新的会话，需要在 客服后台刷新会话
     * 推送历史消息
     * @param service 需要通知到的客服信息
     */
    async notificationService(service: ConversationService) {
        //throw new Error("Method not implemented.");
        const redisKey = RedisUtils.generateServiceKey(service.account);
        if (!redisKey) {
            this.ctx.logger.error(`notificationService  客服小姐姐 走丢了 ${service.account}`);
            return;
        }
        const accountStr = await this.redisService.get(redisKey);
        const accountService: AccountService = JSON.parse(accountStr);

        if (accountService.online) {
            /** 
             import { Context } from "koa";
             @Inject()
             ctx: Context;
             可用的前置条件
             const sockets = await this.ctx.in(accountService.socketId).fetchSockets();
             
             import { Application as SocketApplication } from '@midwayjs/socketio';
             @App('socketIO')
             socketApp: SocketApplication;
             可用的前置条件
             const sockets = await this.socketApp.fetchSockets();
             */
            const sockets = await this.socketApp.in(accountService.socketId).fetchSockets();
            if (sockets.length > 0) {
                //let res = sockets[0].emit(EventEmit.chatService, '有用户分配给你了，刷新列表');
                sockets[0].emit(EventEmit.chatMessage, '有用户分配给你了，刷新列表');

                const array = await this.conversationArray(accountService);
                const res = sockets[0].emit(EventEmit.serviceConversations, array);
                if (!res) {
                    this.ctx.logger.error(`会话列表刷新失败： ,${res}`);
                }
            } else {
                console.log('客服不在线 缓存回话信息');
                //this.userService.insertContactsApplyOffline(user, apply);
            }
        } else {
            this.ctx.logger.info('当前没有在线的客服');
        }
    }


    /**
     * 查找该 客服 所有有有效的会话
     * @param service 
     * @returns 
     */
    async conversationArray(service: AccountService): Promise<Array<any>> {
        const redisKey = RedisUtils.generateKeyArray(RedisUtils.CONVERSATION);
        const keyArray = await this.redisService.keys(redisKey)
        const conversationArray = [];
        for (let i = 0; i < keyArray.length; i++) {
            const ridisStr = await this.redisService.get(keyArray[i]);
            const conversation: Conversation = JSON.parse(ridisStr);
            if (conversation.conversationService.account == service.account && conversation.conversationState == 1) {
                conversationArray.push({
                    userID: conversation.conversationClient.userID,
                    nickName: conversation.conversationClient.nickName,
                    avatar: conversation.conversationClient.avatar,
                    channel: conversation.conversationClient.channel,
                    //这里客户端发来的消息，是放在客服未读里面的
                    unReadCount: conversation.conversationService.unReadCount,
                    onLine: conversation.conversationClient.onLine
                })
            }
        }
        return conversationArray;
    }

    ///刷新客服会话信息
    async refreshConversation(conversationService: ConversationService) {
        const redisKey = RedisUtils.generateServiceKey(conversationService.account);
        const redisStr = await this.redisService.get(redisKey);
        if (redisStr) {
            const accountService: AccountService = JSON.parse(redisStr);
            if (accountService.online) {
                const sockets = await this.socketApp.in(accountService.socketId).fetchSockets();
                if (sockets.length > 0) {
                    const array = await this.conversationArray(accountService);
                    const res = sockets[0].emit(EventEmit.serviceConversations, array);
                    if (!res) {
                        this.ctx.logger.error(`会话列表刷新失败： ,${res}`);
                    }
                } else {
                    this.ctx.logger.error(`刷新客服会话信息: 没有找到对应的 socket`);
                }
            } else {
                this.ctx.logger.warn(`客服不在线 ：`, conversationService);
            }
        }
    }


    /**
     * 用户 推送消息到 到指定的 客服人员
     * @param socketId 客服的 socketId
     * @param message  消息内容
     */
    async emitMessageBySocketIDToService(socketId: string, message: MessageArrayDataService) {
        await this.emitMessageBySocketID(EventEmit.messageToService, socketId, message);
    }

    /**
     * 客服 推送客服消息 到指定的 用户
     * @param socketId  用户的 socketId
     * @param message   消息内容
     */
    async emitMessageBySocketIDToClient(socketId: string, message: Array<MessageData>) {
        await this.emitMessageBySocketID(EventEmit.messageToClient, socketId, message);
    }

    /**
     * 刷新客服 单个会话信息  用于用户更新未读消息个数
     */
    async refreshServiceConversationByID(socketId: string, conversation: Conversation) {
        //serviceConversationsOne
        this.emitMessageBySocketID(EventEmit.serviceConversationsOne,
            socketId,
            {
                userID: conversation.conversationClient.userID,
                nickName: conversation.conversationClient.nickName,
                avatar: conversation.conversationClient.avatar,
                unReadCount: conversation.conversationService.unReadCount,
                channel: conversation.conversationClient.channel,
                onLine: conversation.conversationClient.onLine
            });
    }


    // /**
    //  * 同步消息到 会话redis 
    //  * @param conversationID  会话ID
    //  * @param message  消息内容
    //  */
    // async syncChatMessageToRedis(conversationID: string, message: Array<MessageData>) {
    //     const conversationKey = RedisUtils.generateConversationKey(conversationID);
    //     const redisStr = await this.redisService.get(conversationKey)
    //     if (redisStr) {
    //         const conversation: Conversation = JSON.parse(redisStr);
    //         conversation.messageArray = conversation.messageArray.concat(message)
    //         const res = await this.redisService.set(conversationKey, JSON.stringify(conversation));
    //         if (res != "OK") {
    //             this.ctx.logger.error('同步消息到 会话redis 更新失败！！');
    //         }
    //     }
    // }



    /**
     * 根据 socketID 给指定 socket 发送消息
     * @param eventName 发送的事件名称
     * @param socketId  socketID
     * @param message  发送的消息
     * @returns 
     */
    private async emitMessageBySocketID(eventName: string, socketId: string, message: any) {
        const sockets = await this.socketApp.in(socketId).fetchSockets();
        if (sockets.length > 0) {
            let res = sockets[0].emit(eventName, message);
            if (!res) {
                this.ctx.logger.error(`发送给 socketId :${socketId} 的消息失败 ,${res}`);
                return sockets[0]
            }
        } else {
            this.ctx.logger.error(`发送给 socketId:${socketId} 的消息失败: 未找到对应的链接的 socketId`);
        }
    }
}