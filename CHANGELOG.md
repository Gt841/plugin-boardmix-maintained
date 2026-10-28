# Changelog

## 0.0.4
1. 修复 BoardMix 登录态改为存储在 localStorage（BOSYUNCurrent）后，插件读取 cookie 失败并提示“未获取到 access_token”的问题。
2. 取 token 时优先读取 localStorage，其次回退旧版 cookie。

## 0.0.1 
1. 支持boardmix目录树
2. 支持复制块引用链接和块web链接
3. 支持插件通过插件打开