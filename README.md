# 博思白板

> 仅仅是将[boardmix博思白板](https://boardmix.cn/)以tab页的形式在思源打开。
并没有做什么功能，你如果觉得还有什么其它功能，自行探索。

## 维护说明

本仓库是 [winter60/plugin-boardmix](https://github.com/winter60/plugin-boardmix) 的维护分支。
原仓库自 2024 年后未再更新，而 BoardMix 已将登录态从 cookie 迁移到 localStorage
（`BOSYUNCurrent`），导致原插件点击“我确认我已经登录了”时提示“未获取到 access_token”。
本分支已修复该问题，并保留对旧版 cookie 的兼容读取。

## 构建

```bash
npm install
npm run build   # 产物在 dist/ 与 package.zip
```

如果觉得该插件对你有所帮助，就请他喝一瓶娃哈哈吧。[发电链接](https://afdian.net/a/firework) 

# 更新日志
[CHANGELOG.md](./CHANGELOG.md)




