# 博思白板（维护版）

> 将 [BoardMix 博思白板](https://boardmix.cn/) 以页签形式集成到思源笔记中。

本插件是 [winter60/plugin-boardmix](https://github.com/winter60/plugin-boardmix) 的社区维护分支
（[Gt841/plugin-boardmix-maintained](https://github.com/Gt841/plugin-boardmix-maintained)）。

原仓库自 2024 年后未再更新，而 BoardMix 已将登录态从 cookie 迁移到 localStorage
（`BOSYUNCurrent`），导致原插件点击“我确认我已经登录了”时提示“未获取到 access_token”。
本分支修复了该问题，并在此基础上优化了日常使用体验。

## 与原版的区别

- 修复登录态读取：优先读取 localStorage，保留旧版 cookie 兼容。
- 目录树交互：单击文件夹/项目/团队名称展开或收起；单击文件名称直接在页签中打开。
- 页签去重：同一个白板只保留一个页签，重复点击时切换到已存在的页签。
- 页签使用博思图标，便于和思源文档页签区分。
- 侧栏头部提供刷新、登录/登出按钮，始终显示并与标题对齐。

## 安装

在思源「集市 → 插件」中搜索「博思白板（维护版）」安装，或在 Release 中下载
`package.zip` 手动解压到 `工作空间/data/plugins/plugin-boardmix-maintained/`。

> 由于插件包名与原版不同（`plugin-boardmix-maintained`），本插件与原版可以共存；
> 但插件配置按包名隔离，从原版切换过来后需要重新登录一次 BoardMix。

## 使用

1. 打开左侧/右侧的「博思白板」侧栏（dock）。
2. 未登录时点击登录图标，在页签中完成 BoardMix 登录后点击「我确认我已经登录了」。
3. 单击文件名称即可在页签中打开白板；单击文件夹名称展开或收起目录。

## 构建

```bash
npm install
npm run build   # 产物在 dist/ 与 package.zip
```

如果觉得该插件对你有所帮助，可以请原作者喝一瓶娃哈哈。[发电链接](https://afdian.net/a/firework)

# 更新日志

[CHANGELOG.md](./CHANGELOG.md)
