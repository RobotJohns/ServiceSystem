import { Md5 } from 'ts-md5';
export class ConstUtils {
    static KEY = 'USERSTATE132';
    public static MD5(account: string): string {
        return Md5.hashStr(account + this.KEY);
    }
}