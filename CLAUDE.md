# Simple Notes 开发规范

## 项目描述
一个轻量级的MacOS菜单栏笔记应用，支持Markdown格式，数据同步到Github Gist。

## 技术栈
- Tauri 2.0 - 轻量级跨平台框架
- React + TypeScript - 前端框架
- shadcn/ui - UI组件库
- react-markdown - Markdown渲染
- Octokit - Github API客户端

## 开发规范
1. 使用分支进行开发，代码修改需要经过review后才能commit
2. Git Commit规范：使用中文，精简但符合最佳实践
3. 远程分支合并后需要删除
4. 如果开发一个很大的需求/todo时，可以使用多次提交小修改的开发方式，完成一个小的功能项后，就可以进行 git commit 提交，而不是全部完成全部修改后一次提交。

## 文档更新规范
更新文档时需要同时更新：
- README.md (英文)
- README_zh.md (中文)

## 产品需求记录
所有需求和进度更新需要在PRD.md文档中进行记录。

## 交互与产品需求评审
- 每次交互或讨论产品需求时，需要先进行逻辑和可行性评审
- 如果存在更合理的方案或设计，需要及时提出建议和替代方案

## API 查询
- 如果需要查询 API 文档的话，可以使用 use context7 调用外部 MCP 查询。

## 外部工具查询
- 如果要查询网页或者搜索引擎的话，可以 use playwright 。搜索引擎请使用 Google。