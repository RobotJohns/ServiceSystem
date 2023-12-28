import { EntityModel } from "@midwayjs/typegoose";
import { mongoose, prop } from "@typegoose/typegoose";
import { Conversation } from "./common";
import * as moment from "moment";
export class ServiceItem {
    @prop({
        unique: true,
        required: true,
        type: mongoose.Types.ObjectId,
    })
    public _id: mongoose.Types.ObjectId;
    @prop({
        required: true,
        type: String,
    })
    public userID: string
    @prop({
        required: true,
        type: String,
    })
    public channel: string
    @prop({
        required: true,
        type: Number,
    })
    public unixtime: number;
    @prop({
        required: true,
        type: String,
    })
    public time: String;
    constructor(_id: mongoose.Types.ObjectId, userID: string, channel: string) {
        //const time = new Date();
        const now = moment();
        this._id = _id;
        this.userID = userID;
        this.channel = channel;
        this.unixtime = now.valueOf();
        this.time = now.format('YYYY-MM-DD HH:mm:ss');
    }
}

export class ConversationItem extends Conversation {
    @prop({
        unique: true,
        required: true,
        type: mongoose.Types.ObjectId,
    })
    public _id: mongoose.Types.ObjectId;
    constructor(conversation: Conversation) {
        super(conversation.conversationClient, conversation.conversationService, conversation.messageArray, conversation.conversationState);
        this._id = new mongoose.Types.ObjectId();
    }
}

/**
 * 存储 mongodb   会话实体
 */
@EntityModel()
export class ConversationEntity {
    @prop({
        unique: true,
        required: true,
        type: String,
    })
    public _userID: string;
    @prop({
        required: true,
        type: String,
    })
    public nickName: string;
    @prop({
        required: true,
        type: String,
    })
    public avatar: string;
    @prop({
        required: true,
        type: [ConversationItem],
    })

    public conversationArray: Array<ConversationItem>;
}



/**
 * 存储 mongodb   客服记录实体
 */
@EntityModel()
export class ServiceEntity {
    @prop({
        unique: true,
        required: true,
        type: String,
    })
    public _accountID: string;
    @prop({
        required: true,
        type: [ServiceItem],
    })
    public serviceItemArray: Array<ServiceItem>;
}

