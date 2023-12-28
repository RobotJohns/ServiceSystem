import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ResponseBase } from '../entity/common';

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    // 404 错误会到这里
    //ctx.redirect('/404.html');

    return new ResponseBase({
      success: false,
      message: '404',
      code: 404,
      content: null
    });
  }
}
