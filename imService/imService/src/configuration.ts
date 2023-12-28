import { Configuration, App, } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import * as redis from '@midwayjs/redis';
import * as typegoose from '@midwayjs/typegoose';
import * as socketio from '@midwayjs/socketio';
import * as passport from '@midwayjs/passport';
import * as jwt from '@midwayjs/jwt';
import * as crossDomain from '@midwayjs/cross-domain';
import * as upload from '@midwayjs/upload';
import * as cache from '@midwayjs/cache';

//import * as security from '@midwayjs/security';
import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import { ApplicationReady } from './utils/ApplicaitonReady';

@Configuration({
  imports: [
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    passport,   //  passport 鉴权  
    socketio,   //  socketio
    //security, //  security 安全组件
    redis,      //  redis  
    typegoose,  //  MongoDB  
    upload,     //  文件上传
    crossDomain,//  跨域相关配置
    cache,      //  数据缓存
    jwt,
  ],
  // importConfigs: [
  //   // 可以使用自定义的命名，只要中间部分带环境就行
  //   join(__dirname, './config/config.default')
  // ]
  importConfigs: [
    join(__dirname, './config/'),
  ]
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady(container) {

    // 设置时区
    process.env.TZ = "Asia/Shanghai";
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
    // 启动起来要执行的
    await container.getAsync(ApplicationReady);
  }
}

