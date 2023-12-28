import { Inject, Controller, Post, Files, Fields, Config } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import * as Minio from 'minio';
import * as moment from 'moment';
import * as cp from 'child_process';
import * as fs from 'fs';
import { ResponseBase, ResponseError, ResponseOk } from '../entity/common';
import { join } from 'path';
import { ServiceAccount } from '../service/service.account';
// @Controller('/files', { middleware: [JwtMiddleware] })
@Controller('/files')
export class AccountController {

    private bucketName: string = 'customerservice';
    @Config('hostConfig')
    hostConfig;
    private mimeImageArray: Array<string> = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    private mimeVideoArray: Array<string> = ['video/mp4'];

    @Inject()
    ctx: Context;

    @Inject()
    serviceAccount: ServiceAccount;

    @Post('/upload',)
    async accountInfo(@Files() files, @Fields() fields): Promise<ResponseBase> {
        if (files) {
            for (let i = 0; i < files.length; i++) {
                if (this.mimeImageArray.indexOf(files[i]['mimeType']) > -1) {
                    return await this.onMinioImage(files[i]);
                } else if (files[i]['mimeType'] == this.mimeVideoArray[0]) {
                    return await this.onMinioVideo(files[i]);
                } else {
                    return new ResponseError({ message: '格式不支持', code: -1, content: null });
                }
            }
        } else {
            return new ResponseError({ message: '参数有误', code: -1, content: null });
        }
    }

    private async onMinioImage(file): Promise<ResponseBase> {
        let minioClient = new Minio.Client(this.hostConfig.minio);
        let isExist = await minioClient.bucketExists(this.bucketName);
        if (!isExist) {
            //创建桶后，需要在管理界面修改public访问权限，默认是private
            this.ctx.logger.error('bucket 不存在！');
            return new ResponseError({ message: '服务器出错', code: -1, content: null });
        } else {
            return new Promise((resolve) => {
                const folder = moment().format("YYYYMMDD")
                minioClient.fPutObject(this.bucketName, `${folder}/${file.filename}`, file.data, {}, (res) => {
                    if (!res) {
                        resolve(new ResponseOk({ message: '文件上传成功', content: `http://${this.hostConfig.minio.endPoint}:${this.hostConfig.minio.port}/${this.bucketName}/${folder}/${file.filename}` }));
                        if (fs.existsSync(file.data)) {
                            fs.unlinkSync(file.data);
                        }
                    } else {
                        this.ctx.logger.error('文件上传失败：', res);
                        resolve(new ResponseError({ message: '文件上传失败', code: -1, content: null }));
                    }
                })
            })
        }
    }


    private async onMinioVideo(file): Promise<ResponseBase> {
        const dir = join(process.cwd(), 'video-cover')
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        const minioClient = new Minio.Client(this.hostConfig.minio);
        const isExist = await minioClient.bucketExists(this.bucketName);
        if (!isExist) {
            //创建桶后，需要在管理界面修改public访问权限，默认是private
            this.ctx.logger.error('bucket 不存在！');
            return new ResponseError({ message: '服务器出错', code: -1, content: null });
        }
        const folder = moment().format("YYYYMMDD")

        const video =
            new Promise<ResponseBase>((resolve, reject) => {
                minioClient.fPutObject(this.bucketName, `${folder}/${file.filename}`, file.data, {}, (res) => {
                    if (!res) {
                        resolve(new ResponseOk({
                            message: '文件上传成功',
                            content: `http://${this.hostConfig.minio.endPoint}:${this.hostConfig.minio.port}/${this.bucketName}/${folder}/${file.filename}`
                        }));
                        // 不能删除，应为还在为这个视频有可能还在生成分面中
                        // if (fs.existsSync(file.data)) {
                        //     fs.unlinkSync(file.data);
                        // }
                    } else {
                        this.ctx.logger.error('视频文件上传失败：', res);
                        reject();
                    }
                })
            })

        const image =
            new Promise<ResponseBase>((resolve, reject) => {
                const execGetSec = (pathFile, fileName, dir) => {
                    const cmd = `ffmpeg -i ${pathFile} -y -f image2 -ss 2 -frames 1 ${dir / fileName}`
                    //console.log('当前指令:', cmd)
                    cp.exec(cmd, async (err, stdout, errout) => {
                        if (!err) {
                            minioClient.fPutObject(this.bucketName, `${folder}/${fileName}`, `${dir / fileName}`, {}, (res) => {
                                if (!res) {
                                    resolve(new ResponseOk({
                                        message: '文件上传成功', content: `http://${this.hostConfig.minio.endPoint}:${this.hostConfig.minio.port}/${this.bucketName}/${folder}/${fileName}`
                                    }));
                                    // if (fs.existsSync(`${dir / fileName}`)) {
                                    //     fs.unlinkSync(`${dir / fileName}`);
                                    // }
                                } else {
                                    this.ctx.logger.error('上传视频封面失败:', stdout);
                                    reject('上传视频封面失败');
                                }
                            })
                        } else {
                            this.ctx.logger.error('生成视频封面失败:', err);
                            reject('生成视频封面失败');
                        }
                    })
                };
                const outputName = `${file.filename.slice(0, file.filename.lastIndexOf('.'))}.jpg`
                execGetSec(file.data, outputName, join(process.cwd(), `video-cover/${outputName}`))
            })

        const res = await Promise.all<ResponseBase>([image, video])
        //删除视频封面 图片文件
        if (fs.existsSync(`video-cover/${file.filename.slice(0, file.filename.lastIndexOf('.'))}.jpg`)) {
            fs.unlinkSync(`video-cover/${file.filename.slice(0, file.filename.lastIndexOf('.'))}.jpg`);
        }

        //删除源视频文件
        if (fs.existsSync(file.data)) {
            fs.unlinkSync(file.data);
        }
        return res[1];
    }
}