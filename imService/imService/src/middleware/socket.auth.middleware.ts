import { Inject, Middleware } from "@midwayjs/decorator";
import { JwtService } from "@midwayjs/jwt";
import { RedisService } from "@midwayjs/redis";
import { Context, NextFunction } from '@midwayjs/koa';
import { RedisUtils } from "../utils/RedisUtils";

import { ConversationClient } from "../entity/conversation";
import { AccountService, IdentificationType } from "../entity/account";
import moment = require("moment");
import CryptoInterface from "../utils/CryptoInterface";

/**
 * Socket 链接 校验 JWT 安全验证   
 */
@Middleware()
export class SocketAuthMiddleware {
    @Inject()
    jwtService: JwtService;

    @Inject()
    redisService: RedisService;

    resolve() {
        return async (ctx: Context, next: NextFunction) => {
            // console.log(ctx.handshake)
            // console.log(ctx.id);
            if (ctx.handshake.headers) {
                if (ctx.handshake.auth['identification'] && ctx.handshake.auth['authorization']) {

                    if (ctx.handshake.auth['identification'] == 'service') {
                        const account = ctx.handshake.auth['account'];
                        const authorization = ctx.handshake.auth['authorization']


                        const parts = authorization.trim().split(' ');
                        if (parts.length !== 2) {
                            ctx.logger.error(`authorization 鉴权失败`);
                            ctx.disconnect('auth fail');
                            return;
                        }
                        const [scheme, token] = parts;
                        if (!/^Bearer$/i.test(scheme)) {
                            ctx.logger.error(`authorization 鉴权失败1`);
                            ctx.disconnect('auth fail');
                            return;
                        }
                        let payload: any = "";
                        // 验证token，过期会抛出异常
                        try {
                            const jwt = await this.jwtService.verify(token, { complete: true });
                            // jwt中存储的user信息
                            payload = jwt['payload'];
                            ctx.logger.info(`payload :${payload}`);
                        } catch (error) {
                            ctx.logger.error(`authorization 鉴权失败2`);
                            ctx.disconnect('auth fail');
                            return;
                        };
                        if (payload.account != account) {
                            ctx.logger.error(`authorization 鉴权失败3`);
                            ctx.disconnect('auth fail');
                            return;
                        }

                        const accountKey = RedisUtils.generateServiceKey(account);
                        const accountStr = await this.redisService.get(accountKey);
                        if (!accountStr) {
                            ctx.logger.info(`没有找到 Redis 数据`);
                            ctx.disconnect('auth fail');
                            return;
                        }
                        const accountInfo: AccountService = JSON.parse(accountStr);
                        if (accountInfo.state != '1') {
                            ctx.logger.info(`客服账号状态不对`);
                            ctx.disconnect('auth fail');
                            return;
                        }

                        if (accountInfo.token != token) {
                            ctx.logger.info(`客服账号状态不对`);
                            ctx.disconnect('auth fail');
                            return;
                        }

                        accountInfo.socketId = ctx.id;
                        accountInfo.online = true;
                        accountInfo.lastTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        const redisRes = await this.redisService.set(accountKey, JSON.stringify(accountInfo));
                        if (redisRes != "OK") {
                            ctx.logger.error('客服 redis 刷新 失败！！');
                        }
                        ctx.identificationType = IdentificationType.Service
                        ctx.accountInfo = accountInfo;

                    } else if (ctx.handshake.auth['identification'] == 'client') {


                        const userID = ctx.handshake.auth['userID'];
                        const avatar = ctx.handshake.auth['avatar'];
                        const nickName = ctx.handshake.auth['nickName'];
                        const channel = ctx.handshake.auth['channel'] ?? 'default';

                        if (!(userID && avatar && nickName && channel)) {
                            ctx.logger.error(`缺少请求头 1`);
                            ctx.disconnect('auth fail');
                            return;
                        }

                        //socket 鉴权
                        const authorization = ctx.handshake.auth['authorization']
                        const crypto = new CryptoInterface();
                        const strdec = await crypto.decrypt(authorization);
                        if (strdec) {
                            const info = JSON.parse(strdec);
                            if (info) {
                                if (info.userID != userID) {
                                    ctx.logger.error(`缺少请求头 2`);
                                    ctx.disconnect('auth fail');
                                    return;
                                }
                            } else {
                                ctx.logger.error(`缺少请求头 3`);
                                ctx.disconnect('auth fail');
                                return;
                            }
                        } else {
                            //解密失败， 认证失败
                            ctx.logger.error(`缺少请求头 4`);
                            ctx.disconnect('auth fail');
                            return;
                        }
                        ctx.identificationType = IdentificationType.Client;
                        ctx.accountInfo = new ConversationClient(userID, nickName, avatar, 0, true, ctx.id, channel);

                    } else {
                        ctx.logger.error(`缺少请求头 5`);
                        ctx.disconnect('auth fail');
                        return;
                    }

                } else {
                    ctx.logger.error(`缺少请求头 6`);
                    ctx.disconnect('auth fail');
                    return;
                }

            } else {
                ctx.logger.error(`缺少请求头2`);
                ctx.disconnect('auth fail');
                return;
            }
            await next();
        };
    }
}