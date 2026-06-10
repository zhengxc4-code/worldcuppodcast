# Vercel 免费发布方案

## 结论

可以用 Vercel 免费发布，但不要把它当成长期运行的 Node 服务器。这个项目在 Vercel 上推荐这样跑：

- Vercel：托管静态网站。
- GitHub Actions：每 30 分钟同步一次新闻、友谊赛和外部数据源。
- `data/site-data.json`：作为前端读取的数据快照。
- Vercel Git 集成：GitHub Actions 提交新数据后，Vercel 自动重新部署。

这样不需要服务器磁盘、数据库或付费 persistent disk。

## 已配置文件

- `api/site-data.js`：Vercel API，读取 `data/site-data.json`。
- `vercel.json`：静态资源缓存配置。
- `.vercelignore`：排除本地环境文件和运行缓存。
- `.github/workflows/sync-site-data.yml`：定时同步并提交 `data/site-data.json`。
- `scripts/sync-data.js`：复用后端同步逻辑，只更新数据文件，不启动服务。
- `AUTO_UPDATE_SOURCES.md`：大名单、赛程变化、积分榜的数据源格式。

## 发布步骤

1. 把项目上传到 GitHub。
2. 打开 Vercel，选择 `Add New` -> `Project`。
3. 选择这个 GitHub 仓库。
4. Framework Preset 选 `Other` 或保持 Vercel 自动识别。
5. Build Command 留空。
6. Output Directory 留空。
7. 部署完成后，Vercel 会给一个 `https://xxx.vercel.app/` 网址。
8. 到 GitHub 仓库的 `Actions` 页面，启用 workflows。
9. 第一次可以手动运行 `Sync site data`，之后会每 30 分钟自动跑一次。

## 数据源配置

在 GitHub 仓库的 `Settings` -> `Secrets and variables` -> `Actions` 中添加：

- `SQUADS_SOURCE_URL`：最终大名单 JSON。
- `FIXTURES_SOURCE_URL`：赛程变化 JSON。
- `MATCHES_SOURCE_URL`：赛程变化 JSON，和 `FIXTURES_SOURCE_URL` 二选一。
- `STANDINGS_SOURCE_URL`：小组积分榜 JSON。
- `SITE_DATA_SOURCE_URL`：你自己的统一数据 API。
- `API_FOOTBALL_KEY` / `API_FOOTBALL_FIXTURES_URL`：API-Football 数据。
- `SPORTMONKS_API_TOKEN` / `SPORTMONKS_FIXTURES_URL`：Sportmonks 数据。

这些都是可选项。没填时，默认同步 BBC / Guardian / Sky Sports RSS 和 Guardian 友谊赛结果。

## 重要限制

- Vercel 免费方案不负责长期后台进程，所以自动更新交给 GitHub Actions。
- GitHub Actions 定时任务可能延迟，官方也提示高峰期可能排队；本项目把时间设在每小时 17 分和 47 分，避开整点。
- GitHub Actions 只会在默认分支运行定时任务。
- 免费方案适合公开展示和轻量同步；如果要分钟级更新、实时赔率、登录后台、人工审核系统，需要另行增加数据库和后台服务。
