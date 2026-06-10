# 全自动数据源配置

本项目已经支持自动读取：

- 大名单：`SQUADS_SOURCE_URL`
- 赛程变化：`FIXTURES_SOURCE_URL` 或 `MATCHES_SOURCE_URL`
- 小组积分：`STANDINGS_SOURCE_URL`
- 整站数据：`SITE_DATA_SOURCE_URL`
- API-Football：`API_FOOTBALL_KEY` + `API_FOOTBALL_FIXTURES_URL`
- Sportmonks：`SPORTMONKS_API_TOKEN` + `SPORTMONKS_FIXTURES_URL`

把这些填到 GitHub 仓库：

```text
Settings -> Secrets and variables -> Actions -> New repository secret
```

## 推荐最简单格式

### 大名单

`SQUADS_SOURCE_URL` 返回：

```json
{
  "squads": {
    "英格兰": {
      "coach": "Thomas Tuchel",
      "source": "Official squad API",
      "url": "https://example.com/england-squad",
      "style": "主帅用人习惯说明",
      "players": ["Harry Kane", "Jude Bellingham"],
      "core": [
        {
          "name": "Harry Kane",
          "role": "中锋",
          "status": "已入选大名单",
          "influence": "进攻核心",
          "tacticalUse": "阵地战支点",
          "risk": "体能和出场时间需复核"
        }
      ],
      "omitted": ["Phil Foden"]
    }
  }
}
```

### 赛程变化

`FIXTURES_SOURCE_URL` 返回：

```json
{
  "fixtureUpdates": [
    {
      "matchNo": 67,
      "date": "2026-06-17",
      "time": "16:00 ET",
      "home": "英格兰",
      "away": "克罗地亚",
      "stadium": "Dallas Stadium",
      "status": "upcoming"
    }
  ]
}
```

可以只传变动字段。页面会按 `matchNo`、`id` 或双方球队自动匹配并覆盖本地赛程。

### 小组积分

`STANDINGS_SOURCE_URL` 返回：

```json
{
  "groupStandings": [
    {
      "group": "L",
      "teams": [
        { "name": "英格兰", "played": 1, "win": 1, "draw": 0, "loss": 0, "goalsFor": 2, "goalsAgainst": 0, "points": 3 }
      ]
    }
  ]
}
```

## 不填数据源会怎样

- 新闻和友谊赛：仍会自动同步默认 RSS/赛果源。
- 大名单：使用当前内置快照，不会全 48 队自动更新。
- 赛程变化：使用当前内置赛程，不会自动校正时间/场地/延期。

也就是说，要真正全自动，大名单和赛程至少要填：

```text
SQUADS_SOURCE_URL
FIXTURES_SOURCE_URL
```
