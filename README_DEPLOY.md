# 私人英语教练发布说明

这是一个纯静态网页应用，发布时只需要上传本文件夹里的文件。

## 最简单：Netlify 拖拽发布

1. 打开 https://app.netlify.com/drop
2. 登录或注册 Netlify
3. 把 `english-coach-popup-deploy.zip` 拖进去
4. 等待部署完成，Netlify 会给你一个网址
5. 打开网站后，在右侧「小伙伴链接」输入朋友名字，生成专属链接发给对方

## 朋友链接怎么用

发布后的网址大概像这样：

`https://your-site.netlify.app/`

朋友专属链接会像这样：

`https://your-site.netlify.app/#profile=amanda&name=Amanda`

每个 profile 在同一台设备的浏览器里会有独立数据。数据保存在使用者自己的浏览器本地，不会自动同步到你的电脑。

## 注意

- 现在没有后端数据库，所以朋友的数据只存在朋友自己的浏览器里。
- 如果换设备、清浏览器缓存，数据可能丢失；可以用页面里的「导出数据」先备份。
- 如果以后想做成多人云端同步版，需要再加登录和数据库。
