/*
/eventBus Socket事件 事件名称 
*/
export const EventOn = {
	chatMessage: 'chatClient',
	messageToClient: 'messageToClient',
	messageToClientHistory: 'messageToClientHistory',
	serviceInfo: 'serviceInfo',
}
export const EventEmit = {
	chatMessage: 'chatClient',
	chatClientHistory:'chatClientHistory',
}
/*
/eventBus 页面事件 事件名称 
*/
export const EventView = {
	newMessage: 'newMessage',
}

export const MessageType = {
	//系统消息
	noticeSystem: 1,
	//机器人消息
	charactersRobot: 2,
	//文本内容
	characters: 3,
	//图片
	picture: 4,
	//视频
	video: 5
}