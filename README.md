# ServiceSystem 客服系统
    客服系统可以实现用户和公司的高效沟通，市面上成熟的商用客服系统。 按坐席分 单个坐席动辄几千块。业务也比较冗余（功能多），前段时间公司需要一个客服系统。决定纯手鲁一个：

# 邮箱基本不怎么看:aneglporthome@gmail.com
# 有问题沟通:[个人主页](https://blog.csdn.net/nicepainkiller)  

# 项目目录：
```javascript
imConsole   客服端      Vue2 + ElementUI
imH5        用户端      uniapp
imService   服务器相关  midWay
``` 

# 主要技术构成：
  * 用户端 ：uiapp 开发的 H5 页面，可以嵌入APP 或 单独 H5页面都行 --通用性高 [uiapp](https://uniapp.dcloud.net.cn/)  
  * 客服端 ：Vue2 + ElementUI; 分为客服人员 和 管理人员 [vue](https://cn.vuejs.org/guide/introduction.html)  
  * 服务端 ：采用 MidWay (nodejs) 框架开发 [MidWay](https://midwayjs.org/docs/quickstart)
  * 数据库 ：MongoDB 6.0  
  * 双向通信：socketIO (不用关心粘包，断线重连等等) [socketIO](https://socket.io/zh-CN/docs/v4/)
  * redis : redis
  * 文件存储：minio  [文件存储：minio](https://www.minio.org.cn/?bd_vid=11388473290616382141)
  * 功能特点：**可以一个客服同时服务多个用户， 同时也可创建多个客服（杜绝按坐席坐地起价）**
  * FFmpeg: 视频封面，运行 环境变量需要配置
  * 消息类型：消息支持 系统消息 文字 图片 视频（展示视频封面）； 当然你也可以自定义
  

# 功能展示：
## 用户端: 
    开发调试这边准备了 9个用户用于测试，用户信息 鉴权等等都是写死的，使用时候这个页面拿掉，传入真实用户信息
![RUNOOB 图标](https://github.com/RobotJohns/Assets/blob/main/client_1.gif?raw=true)
_________________


## 客服端： 分为管理人员和客服人员，单个客服人员可以同时对 多个用户进行沟通
    管理人员,可以对所有客服进行管理，而自己不参与客服行为
![RUNOOB 图标](https://github.com/RobotJohns/Assets/blob/main/service1.gif?raw=true)
## 客服人员：
    对来询问的用户 服务： 可以一个客服对应多个用户，优先分配在线的客服，会话没有结束前，还是由之前的客服人员继续服务
![RUNOOB 图标](https://github.com/RobotJohns/Assets/blob/main/service2.gif?raw=true)



# 运行项目：

## 运行环境：
1. MongoDB  (略过)        
2. Redis    (略过)
3. minio  [minio 安装的相关介绍](https://blog.csdn.net/nicepainkiller/article/details/131984051?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522170375554216800186595106%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=170375554216800186595106&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-1-131984051-null-null.nonecase&utm_term=minio&spm=1018.2226.3001.4450)
4. uniapp  (略过)
 
## Midway MongoDB Redis 配置
    客服端 和 用户端 基本上是 vue 项目应该没啥问题;
    问题应该主要还是 在 midway 相关配置方面
[MidWay](https://midwayjs.org/docs/extensions/redis)
![RUNOOB 图标](https://github.com/RobotJohns/Assets/blob/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20231228173700.png?raw=true)

## 启动的时候你那边应该没有 管理员账号数据: 可以把鉴权信息移除掉或者再 redis[1] 里面直接加入管理员，用户注册 客服人员

#### 创建用户API接口 鉴权移除掉
![RUNOOB 图标](https://github.com/RobotJohns/Assets/blob/main/service_3.png?raw=true)
```
//鉴权移除掉
@Post('/register')
async register(@Body('accountName') accountName: string, @Body('nickName') nickName: string, @Body('password') password: string): Promise<ResponseBase> {
    if (accountName && password && nickName) {
        return this.serviceAccount.register(accountName, nickName, password);
    } else {
        return new ResponseError({ message: '参数有误', code: -1, content: null });
    }
}
```

#### 创建用户 Service 接口 用户类型改成 9 管理员 然后你就能创建 客服人员了
![RUNOOB 图标](https://github.com/RobotJohns/Assets/blob/main/service_4.png?raw=true)


## 应为测试用的 9个用户数据你服务器应该没有 而且头像什么都是本地服务器环境的；
    该系统所有的图片 聊天的 客服头像都是基于 minio,之所以把他剥离出来也是为了文件上传的安全性，
    你要么把 minio 搭建起来，给他接上，要么，先替换成其他的网络图片，而且用户用于刷新未读小的个数的接口 是需要鉴权的，过期时间一年；也就是到2024年 需要注意
```
fackUsers: [{
    userID: '100001',
    nickName: '王小二',
    avatar: 'http://172.61.10.9:9000/customerservice/common/avator_001.jpg',
    channel: 'pinchuang',
    authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJgg9dCXmjOkzGrpRjRZMcyyTfER6jyCwtKkPumOYejt9tJboUqPmBWWsYs7oqthCAE7ViS8tTFWKlLRfrDrU5gmR/qUBp+DXkpd8ND/z0LFMalW+iFxL5EqXAnz8VPbw2s=',
}, {
    userID: '100002',
    nickName: '海底月捞不起',
    avatar: 'http://172.61.10.9:9000/customerservice/common/avator_002.jpg',
    channel: 'pinchuang',
    authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJjtrNT4Er5WuPJcSbFggB9LYROEuEYMRO82vt6W7j7KAmZ2hK0dG1YUntuf/aU7K4rBufSj2FFWSRSmPHKf0gUv+UfAtOnCBA2c6nMkqYWiTxqAA5+t2iRG3Vz5eHIgse0Kxji/q+9QPnv3irFtHdmI'
}, {
    userID: '100003',
    nickName: '谒词笙歌拟墨画扇',
    avatar: 'http://172.61.10.9:9000/customerservice/common/avator_003.jpg',
    channel: 'pinchuang',
    authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJgZLKiIpfDdmZeuSu71iJcDKsd1QHMVdGtHpHE0HKUTz83/Ra5jcyBhAdmerzV5Xoo05rb1/YrAGwB7CPj2fihUKSv3lB/3dDCBobqoBwX0cC9zdNDas38GefL3C0m166/e0f5u5E+7KlFgqNSyOcvA'
}, {
    userID: '100004',
    nickName: '巷子小仙女',
    avatar: 'http://172.61.10.9:9000/customerservice/common/avator_004.jpg',
    channel: 'pinchuang',
    authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJjQufsU/7EfmKjMkYXa3WYqriyf7C2pkC9eCNWuNUBVJwk8RsUL/Rstj4m/ObQy+75Ss1LuedY7FGs/VaxC/PVhSG8UQUXj03/qR5+LslUTG80AxJp64VQGbDW0HaW01e0='
}, {
    userID: '100005',
    nickName: '乐曲',
    avatar: 'http://172.61.10.9:9000/customerservice/common/avator_005.jpg',
    channel: 'pinchuang',
    authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJhxxTZpYcG2PoXLxv+ofG2jPd+srE8JtjaJHsc0yndECSZesyiMzEgs7fRLEevH0eLbSrV6gImHul2XFA/3OlXlPaLfPky6z3GFOqyuvtS3kD02IyE6+7gGqQI7HWYlO5Y='
}, {
    userID: '100006',
    nickName: '水乳交融',
    avatar: 'http://172.61.10.9:9000/customerservice/common/avator_006.jpg',
    channel: 'pinchuang',
    authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJianmG+qM2mRbsCZH7zWnJZXMBIViJOINz3PPVdRnxkTP7px5YbJ7WA2H1vJok0j1SRVzlEtGZ4pfdyMCP+0hUuGbHTsTa5+8uCRiuqY5llVss24xo8ICe+pPda+GKsEeQ='
}, {
    userID: '100007',
    nickName: '敷诋',
    avatar: 'http://172.61.10.9:9000/customerservice/common/avator_007.jpg',
    channel: 'pinchuang',
    authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJhXdguGtm3ly6h/qlQmYfTXF6C51fW8NBzzhH53nONzfJSbr07loVyBC7bpj6JEoAaB48keCLgH7JuybG1qw1endIUR2Swtv535MEOj7+mdwap6f3fIVXi8xwoLDAbo4b4='
}, {
    userID: '100008',
    nickName: '十六鹤井',
    avatar: 'http://172.61.10.9:9000/customerservice/common/avator_008.jpg',
    channel: 'pinchuang',
    authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJhCuI3Rv7ZJiLwajSYnR9EWnqIHBCaOt5RQ6/wBo88GFvZi9iscV95kxpZusNrQFMI7d4UBxiR6KpqbNp1YM4K7IBmlm7r4oqImnY2HvffZLOy6pChJ7TkrgxY6yoWfkDs='
}, {
    userID: '100009',
    nickName: '梦清云凉泽',
    avatar: 'http://172.61.10.9:9000/customerservice/common/avator_009.jpg',
    channel: 'pinchuang',
    authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJiD5kBBQUOqC7reQAEGakNjWDlB2Ds8NdyIJ/1I/5Dvnw6Yk6sL8iC8jYiPpviUEPhCDw3Y1cqfrlVYPWsHuGrKwbKRw2d2osxyeAPi3Xn0GlJMFfhLcT2v6NzGoSYiPIY='
}]
```
## 视频类型消息有 用到FFmpeg 制作视频封面，运行时 需要配置环境变量

### 到这里 你跑起来应该问题不大了吧