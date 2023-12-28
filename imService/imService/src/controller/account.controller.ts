import { Inject, Controller, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ResponseBase, ResponseError } from '../entity/common';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { ServiceAccount } from '../service/service.account';
 
@Controller('/account')
export class AccountController {
    @Inject()
    ctx: Context;

    @Inject()
    serviceAccount: ServiceAccount;

    @Post('/login')
    async login(@Body('account') account: string, @Body('password') password: string): Promise<ResponseBase> {
        if (account && password) {
            return this.serviceAccount.login(account, password);
        } else {
            return new ResponseError({ message: '参数有误', code: -1, content: null });
        }
    }
    @Post('/register', { middleware: [JwtMiddleware] })
    async register(@Body('accountName') accountName: string, @Body('nickName') nickName: string, @Body('password') password: string): Promise<ResponseBase> {
        if (accountName && password && nickName) {
            return this.serviceAccount.register(accountName, nickName, password);
        } else {
            return new ResponseError({ message: '参数有误', code: -1, content: null });
        }
    }

    @Post('/accountList', { middleware: [JwtMiddleware] })
    async accountList(): Promise<ResponseBase> {
        // if (account && password && nickName) {
        //     return this.accountService.register(account, nickName, password);
        // } else {
        //     return new ResponseError({ message: '参数有误', code: -1, content: null });
        // }
        return this.serviceAccount.accountList();
    }


    @Post('/accountInfo', { middleware: [JwtMiddleware] })
    async accountInfo(@Body('account') account: string): Promise<ResponseBase> {
        if (account) {
            return this.serviceAccount.accountInfo(account);
        } else {
            return new ResponseError({ message: '参数有误', code: -1, content: null });
        }
    }

    @Post('/accountEditor', { middleware: [JwtMiddleware] })
    async accountEditor(
        @Body('accountName') accountName: string,
        @Body('password') password: string,
        @Body('nickName') nickName: string,
        @Body('avatar') avatar: string,
        @Body('state') state: boolean): Promise<ResponseBase> {
        if (accountName) {
            return this.serviceAccount.accountEditor(accountName, password, nickName, avatar, state);
        } else {
            return new ResponseError({ message: '参数有误', code: -1, content: null });
        }
    }
}