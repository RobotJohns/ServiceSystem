import { prop } from "@typegoose/typegoose";
export enum IdentificationType {
    //客服人员
    Service,
    //用户
    Client,
}

export class AccountService {
    @prop()
    /**
     * 账号手机号码
     */
    public account: string;
    public nickName: string;
    @prop()
    public password: string;
    @prop()
    /**
    /头像
    */
    public avatar: string;
    @prop()
    /**
    /账号状态  禁用  -1， 可用1
    */
    public state: string;
    @prop()
    /**
    /账号类型 管理员9，普通1
    */
    public type: string;
    @prop()
    public token: string;

    @prop()
    /**
    /是否在线
    */
    public online: boolean;

    @prop()
    /**
    /socketId
    */
    public socketId: string;

    @prop()
    /**
    /lastTime
    */
    public lastTime: string;

    /**
     * 
     * @param account 
     * @param nickName 
     * @param password 
     * @param avatar 
     * @param state 
     * @param type 账号类型 管理员9，普通1
     * @param token 
     * @param online 
     */
    constructor(account: string, nickName: string, password: string, avatar: string, state: string, type: string, token: string,online:boolean) {
        this.account = account;
        this.nickName = nickName;
        this.password = password;
        this.avatar = avatar;
        this.state = state;
        this.type = type;
        this.token = token;
        this.online = online;
        this.lastTime = "-1";
    }
}
