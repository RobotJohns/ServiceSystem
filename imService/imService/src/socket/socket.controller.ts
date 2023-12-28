import { WSController, OnWSConnection, Inject, OnWSMessage, WSEmit, OnWSDisConnection } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { Context } from '@midwayjs/socketio';
import { SocketAuthMiddleware } from '../middleware/socket.auth.middleware';

import { IdentificationType } from "../entity/account";
import { EventEmit, EventOn, MessageData, MessageArrayDataService, MessageType, MessageDataService } from './io.event';
import { SocketService } from '../service/socket.services';
import { SocketClient } from '../service/socket.client';
import { ServiceSocket } from '../service/service.socket';

@WSController('/')
export class SocketController {

    @Inject()
    ctx: Context;
    @Inject()
    redisService: RedisService;
    @Inject()
    socketService: SocketService;
    @Inject()
    socketClient: SocketClient;

    @Inject()
    serviceSocket: ServiceSocket;

    @OnWSConnection({ middleware: [SocketAuthMiddleware] })
    async onConnectionMethod() {
        if (this.ctx.identificationType == IdentificationType.Service) {
            this.socketService.onConnection();
        } else if (this.ctx.identificationType == IdentificationType.Client) {
            this.socketClient.onConnection();
        }
    }

    /**
     * 用户发送的消息
     * @param target 
     * @param data 
     */
    @OnWSMessage(EventOn.chatClient)
    async chatClient(data: any) {
        let message;
        if (data.msgType == MessageType.video) {
            const cover = `${data.content.slice(0, data.content.lastIndexOf('.'))}.jpg`;
            message = new MessageData(data.msgType, { cover: cover, src: data.content }, Date.now(), false);
        } else {
            message = new MessageData(data.msgType, data.content, Date.now(), false);
        }
        this.ctx.emit(EventEmit.chatClient, message);
        this.socketClient.messageClientToServer(message)
    }


    /**
     * 客服端发送的消息
     * @param target 
     * @param data 
     */
    @OnWSMessage(EventOn.chatService)
    async chatGroupMessage(data: MessageDataService) {
        let message: MessageData;
        if (data.message.msgType == MessageType.video) {
            const cover = `${data.message.content.slice(0, data.message.content.lastIndexOf('.'))}.jpg`;
            message = new MessageData(data.message.msgType, { cover: cover, src: data.message.content }, Date.now(), true);
        } else {
            message = new MessageData(data.message.msgType, data.message.content, Date.now(), true);
        }
        //推送给给自己
        this.ctx.emit(EventEmit.messageToService, new MessageArrayDataService(data.conversationID, [message]));
        //推送给用户
        this.socketService.messageServerToClient(data.conversationID, [message])
    }

    /**
     * 客服查看未读消息
     * @param conversation 
     */
    @OnWSMessage(EventOn.chatServiceRead)
    async chatServiceRead(conversationID: string) {
        this.socketService.chatServiceRead(conversationID);
    }



    /**
     * 客服请求历史消息
     * @param conversationID 
     */
    @OnWSMessage(EventOn.chatServiceHistory)
    async chatServiceHistoryMessage(conversationID: string) {
        this.socketService.HistoryMessage(conversationID);
    }


    /**
     * 用户请求历史消息
     * @param conversationID 
     */
    @OnWSMessage(EventOn.chatClientHistory)
    async chatClientHistoryMessage(conversationID: string) {
        this.socketClient.HistoryMessage(conversationID);
    }


    @OnWSDisConnection()
    async onDisConnection(data) {
        if (this.ctx.identificationType == IdentificationType.Service) {
            this.socketService.onDisConnection();
        } else if (this.ctx.identificationType == IdentificationType.Client) {
            this.socketClient.onDisConnection();
        }
        // console.log('on client onDisConnection', data);
        // console.log(this.ctx.userContext)
        // if (this.ctx.userContext) {
        //     if (this.ctx.userContext.onLine) {
        //         this.ctx.userContext.onLine = false;
        //         const key = RedisUtils.generateKey(this.ctx.userContext.userId);
        //         const res = await this.redisService.set(key, JSON.stringify(this.ctx.userContext));
        //         if (res == "OK") {
        //             this.ctx.logger.info(`用户: ${this.ctx.userContext.userId}    离线`);
        //         }
        //     }
        // } else {
        //     this.ctx.logger.error(`用户:  离线异常`);
        // }
    }



    // /**
    //  * 单聊消息
    //  * @param data 
    //  * @returns 
    //  */
    // @OnWSMessage(EventOn.chatPerson)
    // async chatPersonMessage(data: any) {
    //     /// 1检查对方用户数据是否 再Redis 中合法
    //     const keyTarget = RedisUtils.generateKey(data['target']);
    //     const ucStrTarget = await this.redisService.get(keyTarget);
    //     if (!ucStrTarget) {
    //         this.ctx.logger.info(`没有找到 Redis 缓存的用户数据`);
    //         this.ctx.emit(EventEmit.authDrop, 'illegal user');
    //         this.ctx.disconnect(true);
    //         return;
    //     }
    //     const ucTarget: UserContext = JSON.parse(ucStrTarget);

    //     /// 2检查我的 好友中是否有对方
    //     /// 好友状态
    //     const userInfo = await this.userService.checkContacts(this.ctx.userContext, ucTarget);
    //     if (!userInfo) {
    //         /// 好友注销了
    //     }

    //     // 对法谁发的
    //     const chatDataOther = {
    //         userId: this.ctx.userContext['userId'],
    //         userName: this.ctx.userContext['userName'],
    //         phoneNum: this.ctx.userContext['phoneNum'],
    //         icon: this.ctx.userContext['icon'],
    //         state: this.ctx.userContext['state'],
    //         firstLetter: this.ctx.userContext['firstLetter'],
    //         data: data,
    //         // time: new Date().getTime(),
    //         time: data['time'],
    //     }
    //     const sockets = await this.ctx.in(ucTarget.socketId).fetchSockets();
    //     if (sockets.length > 0) {
    //         let res = sockets[0].emit(EventEmit.chatPerson, chatDataOther);
    //         if (!res) {
    //             console.log('发送不成功缓存聊天消息');
    //             //对方发送不成功缓存聊天消息
    //             //this.userService.insertContactsApplyOffline(user, apply);
    //         }
    //     } else {
    //         console.log('对方不在线 缓存离线聊天消息');
    //         //对方不在线 缓存聊天消息
    //         //this.userService.insertContactsApplyOffline(user, apply);
    //     }

    //     const chatDataSelf = {
    //         userId: ucTarget['userId'],
    //         userName: ucTarget['userName'],
    //         phoneNum: ucTarget['phoneNum'],
    //         icon: ucTarget['icon'],
    //         state: ucTarget['state'],
    //         firstLetter: ucTarget['firstLetter'],
    //         data: data,
    //         time: data['time'],
    //         // time: new Date().getTime()
    //     }
    //     //信息同步给自己回执  发给谁了
    //     this.ctx.emit(EventEmit.chatPersonHandle, chatDataSelf);
    // }

    // /**
    //  * 群聊消息
    //  * @param target 
    //  * @param data 
    //  */
    // @OnWSMessage(EventOn.chatGroup)
    // async chatGroupMessage(target: String, data: any) {
    //     console.log('chatGroupMessage', target, data);
    // }

    @OnWSMessage('myEvent1')
    @WSEmit('myEventResult')
    async gotMessage1() {
        return 'hello world';               // 这里将 hello world 字符串返回给客户端
    }
}
