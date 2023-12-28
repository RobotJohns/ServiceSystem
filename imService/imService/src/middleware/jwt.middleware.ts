import { Inject, Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { RedisService } from '@midwayjs/redis';
import { RedisUtils } from '../utils/RedisUtils';
import { ResponseError } from '../entity/common';
import { AccountService } from '../entity/account';
/**
 * JWT 安全验证  /统一POST 方式
 */
@Middleware()
export class JwtMiddleware {

    @Inject()
    jwtService: JwtService;

    @Inject()
    redisService: RedisService;

    // @Config('security')
    // securityConfig;
    resolve() {
        return async (ctx: Context, next: NextFunction) => {
            if (ctx.method != "POST") {
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-1' });
            }

            if (!ctx.headers['authorization']) {
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-2' });
            }
            const parts = ctx.get('authorization').trim().split(' ');
            if (parts.length !== 2) {
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-3' });
            }
            const [scheme, token] = parts;
            if (!/^Bearer$/i.test(scheme)) {
                //throw new httpError.UnauthorizedError('缺少Bearer');
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-4' });
            }
            let payload: any = "";
            // 验证token，过期会抛出异常
            try {
                const jwt = await this.jwtService.verify(token, { complete: true });
                // jwt中存储的user信息
                payload = jwt['payload'];
            } catch (error) {
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-5' });
            };

            //const key = Constant.TOKEM + ':' + payload.userId + ':' + token;
            const key = RedisUtils.generateServiceKey(payload.account);
            const accountStr = await this.redisService.get(key);
            if (!accountStr) {
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-6' });
            }

            // 服务器端缓存中存储的user+token信息
            const accountData: AccountService = JSON.parse(accountStr);
            if (!accountData) {
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-7' });
            }

            if (accountData.token != token) {
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-8' });
            }
            //get 方法获取参数 if ( uc.userId != ctx.request.query['uid']) {
            //post 方法取值
            if (accountData.account != ctx.request.body['account']) {
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-9' });
            }
            if (accountData.state != '1') {
                return new ResponseError({ code: 401, message: '账号状态异常', content: '401-10' });
            }
            // 存储到访问上下文中
            ctx.accountInfo = accountData;
            await next();
        };
    }
    public static getName(): string {
        return 'JwtMiddleware';
    }
}