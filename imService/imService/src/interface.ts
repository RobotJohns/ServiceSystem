import { IdentificationType } from "./entity/account";

/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

declare module '@midwayjs/core' {
  interface Context {
    /**
     * 用户身份： 客服人员还是 用户
     */
    identificationType: IdentificationType,
    /**
     * 当 identificationType 是用户的时候      accountInfo 为 ConversationClient
     * 当 identificationType 是客服人员的时候  accountInfo 为 AccountService
     */
    accountInfo: any
  }
}