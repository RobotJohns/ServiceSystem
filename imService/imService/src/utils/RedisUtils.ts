export class RedisUtils {
    //Redis缓存客服人员KEY 
    static USERSTATE = 'USERSTATE';
    //Redis缓存 未完结会话单
    static CONVERSATION = 'SERVICE';

    /**
     * 获取客服人员Key
     */
    public static generateServiceKey(account: string): string {
        return RedisUtils.USERSTATE + ':' + account;
    }
    /**
     * 获取会话Key
     * @param id 
     * @returns 
     */
    public static generateConversationKey(id: string): string {
        return RedisUtils.CONVERSATION + ':' + id;
    }
    // public static generateServiceKey(account: string): string {
    //     return RedisUtils.SERVICE + ':' + account;
    // }
    public static generateKeyArray(key: string): string {
        return key + '*';
    }
}