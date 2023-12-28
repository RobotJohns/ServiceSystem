import { prop, Severity } from "@typegoose/typegoose";

export class EventOn {
    public static chatClient: string = 'chatClient';
    public static chatClientHistory: string = 'chatClientHistory';
    public static chatService: string = 'chatService';
    public static chatServiceHistory: string = 'chatServiceHistory';
    //客服查看了消息
    public static chatServiceRead: string = 'chatServiceRead';

    // public static chatPerson: string = "chatPerson";
    // public static chatGroup: string = "chatGroup";
    // /// 对方同意好友申请
    // public static contactsApply: string = 'contactsApply';
}


export class EventEmit {
    public static chatClient: string = 'chatClient';
    public static chatService: string = 'chatService';
    public static serviceInfo: string = 'serviceInfo';
    public static messageToService: string = 'messageToService';
    public static messageToServiceHistory: string = 'messageToServiceHistory';
    public static messageToClient: string = 'messageToClient';
    public static messageToClientHistory: string = 'messageToClientHistory';
    public static serviceConversations: string = 'serviceConversations';
    public static serviceConversationsOne: string = 'serviceConversationsOne';

    public static chatMessage: string = 'chatMessage';
}


export enum MessageType {
    //系统文本提示消息
    noticeSystem = 1,
    //机器人消息
    charactersRobot,
    //文本内容
    characters,
    //图片
    picture,
    //视频
    video
}



/**
 * 发送给 客服消息 传输实体
 */
export class MessageArrayDataService {
    public conversationID: string;
    public messages: Array<MessageData>;
    constructor(conversationID: string, message: Array<MessageData>) {
        this.conversationID = conversationID;
        this.messages = message;
    }
}


/**
 * 发送给 客服消息 传输实体
 */
export class MessageDataService {
    public conversationID: string;
    public message: MessageData;
    constructor(conversationID: string, message: MessageData) {
        this.conversationID = conversationID;
        this.message = message;
    }
}




/**
 * 发送的消息实体
 */
export class MessageData {
    @prop({
        required: true,
        type: Number
    })
    public msgType: MessageType;
    @prop({
        required: true,
        type: Object,
        allowMixed: Severity.ALLOW
    })
    public content: any;
    @prop({
        required: true,
        type: Number
    })
    public time: number;
    @prop({
        required: true,
        type: Boolean
    })
    public fromService: boolean;
    /**
     * 
     * @param msgType 消息类型
     * @param content 消息内容
     * @param time 消息事件
     * @param fromService 是否客服人员发送
     */
    constructor(msgType: MessageType, content: any, time: number, fromService: boolean = true) {
        this.msgType = msgType;
        this.content = content;
        this.time = time;
        this.fromService = fromService;
    }
}