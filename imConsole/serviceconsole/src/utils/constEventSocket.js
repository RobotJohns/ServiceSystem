/*
/Socket事件 事件名称 
*/
export const EventOn = {
  chatService: 'chatService',
  //会话列表更新
  serviceConversations: 'serviceConversations',
  //会话列表更新(单条)
  serviceConversationsOne: 'serviceConversationsOne',


  //服务端  转发用户消息 推送到 客服
  messageToService: 'messageToService',
  //回话历史消息
  messageToServiceHistory: 'messageToServiceHistory'


}
export const EventEmit = {
  chatService: 'chatService',
  messageToClient: 'messageToClient',
  chatServiceHistory: 'chatServiceHistory',
  //客服查看了消息
  chatServiceRead: 'chatServiceRead'
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
