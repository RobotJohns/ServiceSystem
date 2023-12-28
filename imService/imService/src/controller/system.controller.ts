import { CacheManager } from "@midwayjs/cache";
import { Context } from "@midwayjs/core";
import { App, Config, Controller, Get, Inject } from "@midwayjs/decorator";
import { Application } from '@midwayjs/koa';
import { ResponseBase, ResponseOk } from "../entity/common";

@Controller('/system')
export class SystemController {

    @Inject()
    cacheManager: CacheManager;

    @Inject()
    ctx: Context;
    
    @Config('environment')
    environment;

    @App()
    app: Application;

    @Get('/environment',)
    async runtimeEnvironment(): Promise<ResponseBase> {
        //this.ctx.logger.info(`..................ApplicationReady>>>>>>>!!   Env:, ${this.app.getEnv()}, Config : ${this.environment}`);
        return new ResponseOk({content:`..................ApplicationReady>>>>>>>!!   Env:, ${this.app.getEnv()}, Config : ${this.environment}`})
    }

    @Get('/refreshCache',)
    async home(): Promise<ResponseBase> {
        return new ResponseOk();
    }
}