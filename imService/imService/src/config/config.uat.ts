import { MidwayConfig } from '@midwayjs/core';
// import { uploadWhiteList } from '@midwayjs/upload';
//import { tmpdir } from 'os';
import { join } from 'path';

export default {
  environment:'uat',
  // use for cookie sign key, should change to your own and keep security
  keys: '1701758057418_5030',
  koa: {
    port: 7001,
  },
  socketIO: {
    port: 3000,
    transports: ['websocket'],
  },
  redis: {
    client: {
      port: 6379, // Redis port
      host: "127.0.0.1", // Redis host
      //password: 'auth',
      db: 1,
    },
  },
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://127.0.0.1:27017/imService',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          // user: '***********',
          // pass: '***********'
        },
      }
    },
  },
  jwt: {
    secret: 'this.jwtService.signSync(payload, secretOrPrivateKey, options)', // fs.readFileSync('xxxxx.key')
    sign: {
      // signOptions
      expiresIn: '2d', // https://github.com/vercel/ms
    },
    verify: {
      // verifyOptions
    },
    decode: {
      // decodeOptions
    }
  },
  cors: {
    allowMethods: ['POST'],
    origin: '*',
    allowHeaders: ['content-type', 'authorization'],
  },
  hostConfig: {
    minio: {
      // 地址
      endPoint: '172.61.10.9',
      // 端口号，若地址为类似test.minio.com,就不必写端口号
      port: 9000,
      // 是否使用ssl 
      useSSL: false,
      accessKey: 'PiBq1Y8HmO7MVqKvP95g', // 登录的accessKey
      secretKey: 'xc2pEeoaUyEpWigtbxUTBVNl0UIWIntrzezhjWeT' // secretKey
    },
  },
  upload: {
    // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
    mode: 'file',
    // fileSize: string, 最大上传文件大小，默认为 10mb
    fileSize: '11mb',
    // whitelist: string[]，文件扩展名白名单
    whitelist: ['.jpg', '.jpeg', '.png', '.gif', '.mp4'],
    // 仅允许下面这些文件类型可以上传
    mimeTypeWhiteList: {
      '.jpg': 'image/jpeg',
      // 也可以设置多个 MIME type，比如下面的允许 .jpeg 后缀的文件是 jpg 或者是 png 两种类型
      '.jpeg': ['image/jpeg', 'image/png'],
      // 其他类型
      '.gif': 'image/gif',
      '.png': 'image/png',
      '.mp4': 'video/mp4',
    },
    //whitelist: uploadWhiteList.filter(ext => ext !== '.pdf'),
    // tmpdir: string，上传的文件临时存储路径
    //tmpdir: join(tmpdir(), 'midway-upload-files'),
    tmpdir: join(process.cwd(), 'midway-upload-files'),
    // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
    cleanTimeout: 3 * 60 * 1000,
    // base64: boolean，设置原始body是否是base64格式，默认为false，一般用于腾讯云的兼容
    base64: false,
    // 仅在匹配路径到 /files/upload 的时候去解析 body 中的文件信息
    match: /\/files\/upload/,
  },

  // 默认配置
  security: {
    csrf: {
      enable: true,
      type: 'ctoken',
      useSession: false,
      cookieName: 'csrfToken',
      sessionName: 'csrfToken',
      headerName: 'x-csrf-token',
      bodyName: '_csrf',
      queryName: '_csrf',
      refererWhiteList: [],
    },
    xframe: {
      enable: true,
      value: 'SAMEORIGIN',
    },
    csp: {
      enable: false,
    },
    hsts: {
      enable: false,
      maxAge: 365 * 24 * 3600,
      includeSubdomains: false,
    },
    noopen: {
      enable: false,
    },
    nosniff: {
      enable: false,
    },
    xssProtection: {
      enable: true,
      value: '1; mode=block',
    },
  },
} as MidwayConfig;
