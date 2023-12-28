import { NextFunction } from "@midwayjs/core";
import { Middleware } from "@midwayjs/decorator";
import { Context } from "koa";
import { ResponseError } from "../entity/common";
import CryptoInterface from "../utils/CryptoInterface";


@Middleware()
export class AuthorizationMiddleware {
    resolve() {
        return async (ctx: Context, next: NextFunction) => {
            if (ctx.method != "POST") {
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-1' });
            }
            if (!ctx.headers['authorization']) {
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-2' });
            }

            const authorization = ctx.headers['authorization'];
            if (!authorization) {
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-3' });
            }
            const crypto = new CryptoInterface();
            // console.log('authorization:', authorization)
            // console.log(
            //     JSON.stringify({
            //         identification: 'client',
            //         userID: '100001',
            //         nickName: '王小二',
            //         channel: 'pinchuang',
            //         expirationTime: 1732982400000
            //     })
            // )
            const strdec = await crypto.decrypt(authorization);
            if (strdec) {
                const info = JSON.parse(strdec);
                if (info) {
                    if (info.userID != ctx.request.body['userID']) {
                        return new ResponseError({ code: 401, message: '鉴权失败', content: '401-4' });
                    }
                } else {
                    return new ResponseError({ code: 401, message: '鉴权失败', content: '401-5' });
                }
            } else {
                //解密失败， 认证失败
                // console.log('解密失败， 认证失败')
                return new ResponseError({ code: 401, message: '鉴权失败', content: '401-6' });
            }
            await next();
        };
    }
}