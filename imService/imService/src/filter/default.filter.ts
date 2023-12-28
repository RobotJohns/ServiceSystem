import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ResponseError } from '../entity/common';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    // 所有的未分类错误会到这里
    // return {
    //   success: false,
    //   message: err.message,
    // };
    // return new ResponseBase({
    //   success: false,
    //   message: err.message,
    //   code: 503,
    //   content: err
    // });
    return new ResponseError({
      message: err.message,
      code: 503,
      content: err
    })
  }
}
