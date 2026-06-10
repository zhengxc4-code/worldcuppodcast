# 世界杯预测工作台

黑白极简风格的世界杯预测网站。当前版本按 Vercel 免费发布方案整理：页面静态托管，`/api/site-data` 读取数据快照，GitHub Actions 定时同步数据。

## 核心功能

- 72 场 2026 世界杯小组赛赛程与预测建议
- 比赛搜索、小组筛选、日期筛选
- 比赛场地、城市、草皮、场馆形态和环境影响
- 最终大名单校验：未入选球员不会进入核心变量
- 主帅用人习惯、球员赛季表现、对手差异化 tactical plan
- 伤病、舆情、传闻和潜在风险分层
- 历史交锋与近期友谊赛样本
- 中国体育彩票胜平负奖金视角
- 12 个小组积分榜
- 单场 Markdown 报告导出

## Vercel 发布

需要上传到 GitHub 的关键文件：

```text
index.html
styles.css
app.js
package.json
vercel.json
api/site-data.js
server.js
scripts/sync-data.js
.github/workflows/sync-site-data.yml
data/site-data.json
.gitignore
.vercelignore
README.md
VERCEL_FREE_DEPLOY.md
AUTO_UPDATE_SOURCES.md
```

发布步骤见：

```text
VERCEL_FREE_DEPLOY.md
```

## 自动同步

Vercel 免费方案不运行长期后台进程。自动更新由 GitHub Actions 完成：

```text
GitHub Actions 定时同步 -> 更新 data/site-data.json -> 提交到 main -> Vercel 自动重新部署
```

默认同步：

- BBC Football RSS
- Guardian Football RSS
- Sky Sports Football RSS
- Guardian 友谊赛结果

可在 GitHub Actions Secrets 中补充：

```text
FIXTURES_SOURCE_URL
MATCHES_SOURCE_URL
STANDINGS_SOURCE_URL
SQUADS_SOURCE_URL
SITE_DATA_SOURCE_URL
API_FOOTBALL_KEY
API_FOOTBALL_FIXTURES_URL
SPORTMONKS_API_TOKEN
SPORTMONKS_FIXTURES_URL
```

## 本地预览

```bash
node server.js
```

打开：

```text
http://127.0.0.1:8765/
```

## 文件说明

- `index.html`：页面结构
- `styles.css`：视觉样式
- `app.js`：前端预测逻辑和交互
- `api/site-data.js`：Vercel API，读取 `data/site-data.json`
- `server.js`：本地预览服务和同步逻辑
- `scripts/sync-data.js`：GitHub Actions 同步入口
- `data/site-data.json`：发布时使用的数据快照
- `vercel.json`：Vercel 配置
- `.github/workflows/sync-site-data.yml`：自动同步任务
- `AUTO_UPDATE_SOURCES.md`：全自动大名单/赛程/积分数据源格式
