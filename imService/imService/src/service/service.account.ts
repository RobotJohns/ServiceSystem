import { Config, Context, Inject, Provide } from "@midwayjs/core";
import { RedisService } from "@midwayjs/redis";
import { JwtService } from '@midwayjs/jwt';
import { IResponseBase, ResponseBase, ResponseError, ResponseOk } from "../entity/common";
import { RedisUtils } from "../utils/RedisUtils";
import { AccountService } from "../entity/account";
import { ConstUtils } from "../utils/ConstUtils";

@Provide()
export class ServiceAccount {

    @Inject()
    ctx: Context;
    @Inject()
    jwtService: JwtService;
    @Config('hostConfig')
    hostConfig;
    @Inject()
    redisService: RedisService;

    async register(accountName: string, nickName: string, password: string): Promise<IResponseBase> {
        const redisKey = RedisUtils.generateServiceKey(accountName);
        const accountInfo = await this.redisService.get(redisKey);
        console.log('redisKey:', redisKey)
        console.log('accountInfo:', accountInfo)
        if (!accountInfo) {
            const user = new AccountService(
                accountName,
                nickName,
                ConstUtils.MD5(password),
                `http://${this.hostConfig.minio.endPoint}:${this.hostConfig.minio.port}/customerservice/common/default_avatar.png`,
                '1',
                '1',
                null,
                false,
            );
            const ucStr = await this.redisService.set(redisKey, JSON.stringify(user));
            if (ucStr != "OK") {
                this.ctx.logger.info('用户注册失败 插入 redis 失败！！');
                return new ResponseError({ message: '用户注册失败', code: 10001, content: null });
            } else {
                return new ResponseOk({ message: '注册成功', content: null })
            }
        } else {
            return new ResponseError({ message: '账号已存在', code: -1, content: null });
        }
    }
    async login(account: string, pwd: string): Promise<IResponseBase> {
        const redisKey = RedisUtils.generateServiceKey(account);
        const accountInfo = await this.redisService.get(redisKey);
        if (accountInfo) {
            const accountData: AccountService = JSON.parse(accountInfo);
            if (accountData.password == ConstUtils.MD5(pwd)) {
                const jwtCode = await this.jwtService.sign({ account: account, userName: account });
                accountData.token = jwtCode;
                await this.redisService.set(redisKey, JSON.stringify(accountData));
                return new ResponseBase({ success: true, code: 0, message: '登录成功', content: jwtCode })
            } else {
                return new ResponseError({ message: '账号或密码有误', code: -1, content: null });
            }
        } else {
            return new ResponseError({ message: '登录账号有误', code: -1, content: null });
        }
    }

    async accountInfo(account: string): Promise<IResponseBase> {
        const redisKey = RedisUtils.generateServiceKey(account);
        const accountInfo = await this.redisService.get(redisKey);
        if (accountInfo) {
            const accountData: AccountService = JSON.parse(accountInfo);
            return new ResponseBase({
                success: true, code: 0, message: '获取成功', content: {
                    'account': accountData.account,
                    'nickName': accountData.nickName,
                    'avatar': accountData.avatar,
                    'state': accountData.state,
                    'type': accountData.type
                }
            })
        }
        return new ResponseError({ message: '账号有误', code: -1, content: null });
    }

    async accountList(): Promise<IResponseBase> {
        //只有管理员有权限只用该接口
        if (this.ctx.accountInfo.type == 9) {
            const redisKey = RedisUtils.generateKeyArray(RedisUtils.USERSTATE);
            const keyArray = await this.redisService.keys(redisKey)
            const accountArray = [];
            for (let i = 0; i < keyArray.length; i++) {
                const account = await this.redisService.get(keyArray[i]);
                const accountObj = JSON.parse(account);
                accountArray.push({
                    account: accountObj.account,
                    nickName: accountObj.nickName,
                    avatar: accountObj.avatar,
                    //avatar: `http://${this.hostConfig.minio.endPoint}:${accountObj.avatar}`,
                    state: accountObj.state,
                    type: accountObj.type
                })
            }
            return new ResponseOk({ message: '获取成功', content: accountArray });
        } else {
            return new ResponseError({ message: '账号有误', code: -1, content: null });
        }
    }

    async accountEditor(accountName: string, password: string, nickName: string, avatar: string, state: boolean): Promise<IResponseBase> {
        //只有管理员有权限只用该接口
        if (this.ctx.accountInfo.type == 9) {
            const redisKey = RedisUtils.generateServiceKey(accountName);
            const accountInfo = await this.redisService.get(redisKey);
            if (accountInfo) {
                const accountData: AccountService = JSON.parse(accountInfo);
                if (password) {
                    accountData.password = ConstUtils.MD5(password);
                }
                if (nickName) {
                    accountData.nickName = nickName;
                }
                if (avatar) {
                    accountData.avatar = avatar;
                }
                if (state) {
                    accountData.state = '1';
                } else {
                    accountData.state = '-1';
                }
                // console.log("accountData   :", accountData)
                const ucStr = await this.redisService.set(redisKey, JSON.stringify(accountData));
                if (ucStr != "OK") {
                    this.ctx.logger.info('用户注册失败 插入 redis 失败！！');
                    return new ResponseError({ message: '用户编辑失败', code: 10001, content: null });
                } else {
                    return new ResponseOk({ message: '用户编辑成功', content: null })
                }
            } else {
                return new ResponseError({ message: '账号有误', code: -1, content: null });
            }
        } else {
            return new ResponseError({ message: '账号有误', code: -1, content: null });
        }
    }
}