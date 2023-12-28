import { App, Autoload, Config, Init, MidwayEnvironmentService, Scope, ScopeEnum } from '@midwayjs/core';
import { Application } from '@midwayjs/koa';
import { Inject } from "@midwayjs/decorator";
import { RedisService } from "@midwayjs/redis";
import { AccountService } from '../entity/account';
import { Conversation } from '../entity/common';
import { RedisUtils } from './RedisUtils';
import { ILogger } from '@midwayjs/logger';
import { CacheManager } from '@midwayjs/cache';
//自执行代码：
//https://midwayjs.org/docs/auto_run

//生命周期
//https://midwayjs.org/docs/lifecycle
@Autoload()
@Scope(ScopeEnum.Singleton)
export class ApplicationReady {

    @Inject()
    logger: ILogger;

    @Inject()
    environmentService: MidwayEnvironmentService;

    @Config('environment')
    environment;

    @App()
    app: Application;

    @Inject()
    redisService: RedisService;

    @Inject()
    cacheManager: CacheManager;

    @Init()
    async init() {
        await this.resetServiceState();
        await this.resetConversationClient();
        await this.loadCache();
        this.logger.info(`..................ApplicationReady>>>>>>>!!   Env:, ${this.app.getEnv()}, Config : ${this.environment}`);
        //console.log(`..................ApplicationReady>>>>>>>!!   Env:, ${this.app.getEnv()}, Config : ${this.environment}`);
        //console.log(this.environmentService.getCurrentEnvironment());
    }
    /**
    * 设置初始值 防止服务器异常退出；造成缓存 服务在线数据 没有刷新
    */
    async resetServiceState() {

        const redisKey = RedisUtils.generateKeyArray(RedisUtils.USERSTATE);
        const keyArray = await this.redisService.keys(redisKey)
        for (let i = 0; i < keyArray.length; i++) {
            const accountStr = await this.redisService.get(keyArray[i]);
            const accountService: AccountService = JSON.parse(accountStr);
            accountService.online = false;
            await this.redisService.set(keyArray[i], JSON.stringify(accountService));
        }
        this.logger.info('设置所有客服状态为下线')
    }
    /**
    * 设置初始值 防止服务器异常退出；造成缓存 服务在线数据 没有刷新
    */
    async resetConversationClient() {
        const redisKey = RedisUtils.generateKeyArray(RedisUtils.CONVERSATION);
        const keyArray = await this.redisService.keys(redisKey)
        for (let i = 0; i < keyArray.length; i++) {
            const ridisStr = await this.redisService.get(keyArray[i]);
            const conversation: Conversation = JSON.parse(ridisStr);
            conversation.conversationClient.onLine = false;
            await this.redisService.set(keyArray[i], JSON.stringify(conversation));
        }
        this.logger.info('设置所有用户状态为下线')
    }

    async loadCache() {
        ///首次启动加载配置文件
        await this.cacheManager.set(`globalConfig`, 'stone-jin');


        ///配置有改动 可以通过API调用刷新 缓存
    }
}