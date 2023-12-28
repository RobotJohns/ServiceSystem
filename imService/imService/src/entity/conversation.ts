import { prop } from "@typegoose/typegoose";

/**
 * 会话中的 用户实体
 */
export class ConversationClient {
    @prop({
        required: true,
        type: () => String
    })
    public userID: string;
    @prop({
        required: true,
        type: () => String
    })
    public nickName: string;
    @prop({
        required: true,
        type: () => String
    })
    public avatar: string;
    @prop({
        required: true,
        type: () => String
    })
    public socketId: string;
    @prop({
        required: true,
        type: () => String
    })
    public channel: string;
    @prop({
        required: true,
        type: () => Number
    })
    public unReadCount: number;
    @prop({
        required: true,
        type: () => Boolean
    })
    public onLine: boolean;
    constructor(userID: string, nickName: string, avatar: string, unReadCount: number, onLine: boolean, socketId: string, channel: string) {
        this.userID = userID;
        this.nickName = nickName;
        this.avatar = avatar;
        this.onLine = onLine;
        this.unReadCount = unReadCount;
        this.socketId = socketId;
        this.channel = channel;
    }
}

/**
 * 会话中的 服务实体
 */
export class ConversationService {
    @prop({
        required: true,
        type: () => String
    })
    public account: string;
    @prop({
        required: true,
        type: () => String
    })
    public nickName: string;
    @prop({
        required: true,
        type: () => String
    })
    public avatar: string;
    @prop({
        required: true,
        type: () => Number
    })
    public unReadCount: number;
    constructor(account: string, nickName: string, avatar: string, unReadCount = 0) {
        this.account = account
        this.nickName = nickName;
        this.avatar = avatar;
        this.unReadCount = unReadCount;

    }
}


