# ServiceSystem 客服系统
    客服系统可以实现用户和公司的高效沟通，市面上成熟的商用客服系统。 按坐席分 单个坐席动辄几千块。业务也比较冗余（功能多），前段时间公司需要一个客服系统。决定纯手鲁一个：

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
  * 消息类型：消息支持 系统消息 文字 图片 视频； 当然你也可以自定义
  

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

