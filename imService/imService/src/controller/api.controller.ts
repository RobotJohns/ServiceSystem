import { Inject, Controller, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { RedisService } from '@midwayjs/redis';
import { Conversation, ResponseBase, ResponseError, ResponseOk } from '../entity/common';
import { AuthorizationMiddleware } from '../middleware/authorization.middleware';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { ServiceMongo } from '../service/service.mongo';
import { ServiceSocket } from '../service/service.socket';
import { RedisUtils } from '../utils/RedisUtils';


@Controller('/api')
export class APIController {

  @Inject()
  ctx: Context;

  @Inject()
  redisService: RedisService;

  @Inject()
  serviceSocket: ServiceSocket;

  @Inject()
  serviceMongon: ServiceMongo;


  @Post('/preview', { middleware: [JwtMiddleware] })
  async preview(): Promise<ResponseBase> {
    return new ResponseOk({
      content: await this.serviceMongon.servicePreview()
    });

  }

  @Post('/hideConversation', { middleware: [JwtMiddleware] })
  async hideConversation(@Body('conversationID') conversationID: string): Promise<ResponseBase> {
    //查找当前回话信息
    const redisKey = RedisUtils.generateConversationKey(conversationID);
    const redisStr = await this.redisService.get(redisKey);
    const conversation: Conversation = JSON.parse(redisStr);
    if (conversation) {
      conversation.conversationState = 2;
      const res = await this.redisService.set(redisKey, JSON.stringify(conversation));
      ///同步会话状态到 客服端
      if (res == "OK") {
        this.serviceSocket.refreshConversation(conversation.conversationService);
        return new ResponseOk()
      } else {
        return new ResponseError({ message: '操作失败', code: -1, content: res });
      }
    } else {
      return new ResponseError({ message: '操作失败', code: -1, content: '没有找到对应的会话记录' });
    }

  }

  @Post('/colseConversation', { middleware: [JwtMiddleware] })
  async colseConversation(@Body('conversationID') conversationID: string): Promise<ResponseBase> {

    //查找当前回话信息
    const redisKey = RedisUtils.generateConversationKey(conversationID);
    const redisStr = await this.redisService.get(redisKey);
    const conversation: Conversation = JSON.parse(redisStr);
    if (conversation) {
      conversation.conversationState = 99;
      const res = await this.serviceMongon.syncMongonConversation(conversation);
      if (res) {
        await this.redisService.del(redisKey);
        await this.serviceMongon.refreshServiceRecord(res);
        this.serviceSocket.refreshConversation(conversation.conversationService);
        return new ResponseOk();
      } else {
        return new ResponseError({ message: '操作异常', code: -1, content: res });
      }
    } else {
      return new ResponseError({ message: '操作失败', code: -1, content: '没有找到对应的会话记录' });
    }
  }

  ///客户端刷新是否有新的消息
  @Post('/refreshNewMessage', { middleware: [AuthorizationMiddleware] })
  async refreshNewMessage(@Body('userID') userID: string): Promise<ResponseBase> {
    //查找当前回话信息
    const redisKey = RedisUtils.generateConversationKey(userID);
    const redisStr = await this.redisService.get(redisKey);
    const conversation: Conversation = JSON.parse(redisStr);
    if (conversation && conversation.conversationService) {
      return new ResponseOk({
        content: {
          unReadCount: conversation.conversationClient.unReadCount,
          nickName: conversation.conversationClient.nickName
        },
      });
    } else {
      return new ResponseOk({
        content: {
          unReadCount: 0,
          nickName: ''
        },
      });
    }
  }
}
