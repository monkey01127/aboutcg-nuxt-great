# about-cg-nuxt-great

> My awesome Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

# 接入指南
### 1.中间件

在`middleware`目录下拷贝page-cache.js，里面有三个参数需要注意一下，根据实际情况修改
> 1.`TOKEN_KEY`

    cookie中的校验是否登录的字段，根据实际情况，有可能校验登录需要根据此key对应的cookie值去后端请求接口
    
> 2.`filterUrlPrefix`

    不需要进行缓存处理的url前缀。一种case，比如页面的接口请求
    
> 3.`maxAge`
    
    缓存时间，单位ms

以上配置完成后，需要在`nuxt.config.js`中加上配置
```js
export default {
    serverMiddleware: [
        '~/middleware/page-cache.js'
    ]
}
```        
### 2.初始化数据获取

由于在ssr的时候，页面初始化数据获取依赖asyncData，需要做以下修改
> 1.在`services`目录下新建`initial`文件夹，把基类`base.js`拷贝进去

> 2.对每一个需要进行渲染分离（登录走缓存ssr，匿名走缓存单页+前端渲染）的页面，在`initial`目录中新建`${页面名}.js`，代码逻辑如下,注意一定要继承`Base`
```js
import { getMultiUser } from '@/services';
import Base from '@/services/initial/base';
class Index extends Base {
    async handler() {
        const initData = await getMultiUser({
            uid: '',
            token: '',
            src: 'web',
            ids: '578ea8371532bc0061ff748e',
            cols: 'viewedEntriesCount|role|totalCollectionsCount|allowNotification|subscribedTagsCount|appliedEditorAt|email|followersCount|postedEntriesCount|latestCollectionUserNotification|commentedEntriesCount|weeklyEmail|collectedEntriesCount|postedPostsCount|username|latestLoginedInAt|totalHotIndex|blogAddress|selfDescription|latestCheckedNotificationAt|emailVerified|totalCommentsCount|installation|blacklist|weiboId|mobilePhoneNumber|apply|followeesCount|deviceType|editorType|jobTitle|company|latestVoteLikeUserNotification|authData|avatarLarge|mobilePhoneVerified|objectId|createdAt|updatedAt'
        });
        await getMultiUser({
            uid: '',
            token: '',
            src: 'web',
            ids: '578ea8371532bc0061ff748e',
            cols: 'viewedEntriesCount|role|totalCollectionsCount|allowNotification|subscribedTagsCount|appliedEditorAt|email|followersCount|postedEntriesCount|latestCollectionUserNotification|commentedEntriesCount|weeklyEmail|collectedEntriesCount|postedPostsCount|username|latestLoginedInAt|totalHotIndex|blogAddress|selfDescription|latestCheckedNotificationAt|emailVerified|totalCommentsCount|installation|blacklist|weiboId|mobilePhoneNumber|apply|followeesCount|deviceType|editorType|jobTitle|company|latestVoteLikeUserNotification|authData|avatarLarge|mobilePhoneVerified|objectId|createdAt|updatedAt'
        });
        return await this.processInitData(initData.data);
    }
}
export default Index;

```
只需要在handler中写需要获取的初始化数据即可

> 3.修改页面中`asyncData`的处理逻辑

  - 页面中引入获取初始化数据的类
  ```js
    import IndexService from '@/services/initial';
  ```
  - 在data中置入对象
  
  ```
    beforeCreate: {
        initData: null, // 初始化业务数据
        initialized: false, // 公共状态，表示是否有获取过初始化数据
        hasLogin: false // 公共参数，表示是否已登录，根据自身情况，这个不是必须
    }
  ```
  - 修改asyncData
  ```
    async asyncData({ app }) {
            return await new IndexService(app).asyncData();
    }
  ```
  - 在`methods`中新增初始化方法，如
  ```
    async initPageData() {
        const data = await new IndexService(this).asyncData();
        this.beforeCreate = data.beforeCreate;
    }
  ```

   然后在`mounted`中调用就行，`this.initPageData()`。

### 3.当前demo工程运行
> npm run dev

页面上有一个按钮：登录/退出登录

> 1.点击登录，当前状态是已登录，html文档加载时间大概在20ms左右；刷新页面，html文档树加载时间基本上在10ms以下

> 2.点击退出登录，html文档加载时间大概在450ms左右；刷新页面，html文档树加载时间基本上在10ms左右
