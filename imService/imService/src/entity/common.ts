import { prop } from "@typegoose/typegoose";
import * as moment from "moment";
import { MessageData } from "../socket/io.event";
import { ConversationClient, ConversationService } from "./conversation";

export interface IResponseBase {
    success: boolean;
    message: string;
    code: number;
    content: any;
}
export interface IResponseOK {
    // success: boolean;
    message?: string;
    // code: number;
    content?: any;
}

export interface IResponseError {
    // success: boolean;
    message?: string;
    code?: number;
    content?: any;
}

export class ResponseBase {
    public success: boolean;
    public message: string;
    public code: number;
    public content: any;
    constructor(base: IResponseBase) {
        this.success = base.success;
        this.message = base.message;
        this.code = base.code;
        this.content = base.content;
    }
}

export class ResponseOk extends ResponseBase {
    constructor(base?: IResponseOK) {
        super({
            success: true,
            code: 0,
            message: base ? base.message ? base.message : '请求成功' : '请求成功',
            content: base ? base.content ? base.content : null : null,
        });
    }
}

export class ResponseError extends ResponseBase {
    constructor(base: IResponseError) {
        super({
            success: false,
            code: base ? base.code ? base.code : -1 : -1,
            message: base ? base.message ? base.message : '请求失败' : '请求失败',
            content: base ? base.content ? base.content : null : null
        });
    }
}



export enum ConversationState {
    stateActivity = 1,
    stateHide = 2,
    stateClose = 99,
}


/**
 * 存储 redit   会话实体
 */
export class Conversation {
    @prop({
        required: true,
        type: ConversationClient
    })
    public conversationClient: ConversationClient;
    @prop({
        required: true,
        type: ConversationService
    })
    public conversationService: ConversationService;
    /**
     * 1  创建回话 初始值
     * 2  隐藏会话 当有新的消息的时候 才再次展示设置 1
     * 99 回话关闭 最终的值
     */
    @prop({
        required: true,
        type: Number
    })
    public conversationState: number;
    @prop({
        required: true,
        type: Number
    })
    public createTime: number;
    @prop({
        required: true,
        type: String
    })
    public createTimeStr: String;
    @prop({
        required: true,
        type: [MessageData]
    })
    public messageArray: Array<MessageData>;
    constructor(conversationClient: ConversationClient, conversationService: ConversationService, messageArray: Array<MessageData>, conversationState = 1) {
        const now = moment();
        this.conversationClient = conversationClient;
        this.conversationService = conversationService;
        this.createTime = now.valueOf();
        this.createTimeStr = now.format('YYYY-MM-DD HH:mm:ss');
        this.conversationState = conversationState
        this.messageArray = messageArray;
    }
}
