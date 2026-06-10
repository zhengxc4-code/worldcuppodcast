const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const envPath = path.join(rootDir, ".env");

loadDotEnv(envPath);

const seedDataPath = path.join(rootDir, "data", "site-data.json");
const dataPath = resolveDataPath();

ensureDataFile();

const defaultNewsRssUrls = [
  "https://feeds.bbci.co.uk/sport/football/rss.xml",
  "https://www.theguardian.com/football/rss",
  "https://www.skysports.com/rss/12040"
];

const config = {
  host: process.env.HOST || "0.0.0.0",
  port: Number(process.env.PORT || 8765),
  adminToken: process.env.ADMIN_TOKEN || "",
  syncIntervalMs: Math.max(Number(process.env.SYNC_INTERVAL_MINUTES || 30), 1) * 60 * 1000,
  dailySyncHour: clampNumber(Number(process.env.DAILY_SYNC_HOUR || 7), 0, 23),
  siteDataSourceUrl: process.env.SITE_DATA_SOURCE_URL || "",
  fixturesSourceUrl: process.env.FIXTURES_SOURCE_URL || process.env.MATCHES_SOURCE_URL || "",
  standingsSourceUrl: process.env.STANDINGS_SOURCE_URL || "",
  squadsSourceUrl: process.env.SQUADS_SOURCE_URL || "",
  newsRssUrls: splitList(process.env.NEWS_RSS_URLS).length ? splitList(process.env.NEWS_RSS_URLS) : defaultNewsRssUrls,
  friendliesResultsUrl: process.env.FRIENDLIES_RESULTS_URL || "https://www.theguardian.com/football/friendlies/results",
  apiFootballKey: process.env.API_FOOTBALL_KEY || "",
  apiFootballFixturesUrl: process.env.API_FOOTBALL_FIXTURES_URL || "",
  sportmonksToken: process.env.SPORTMONKS_API_TOKEN || "",
  sportmonksFixturesUrl: process.env.SPORTMONKS_FIXTURES_URL || ""
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8"
};

let lastSyncRunning = false;

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (url.pathname === "/api/site-data" && req.method === "GET") {
      return sendJson(res, withRuntimeStatus(readSiteData()));
    }

    if (url.pathname === "/api/sync" && req.method === "POST") {
      if (!isAuthorized(req)) {
        return sendJson(res, { error: "unauthorized" }, 401);
      }
      const data = await syncAll("manual");
      return sendJson(res, { ok: true, data });
    }

    if (url.pathname === "/health" && req.method === "GET") {
      const data = readSiteData();
      return sendJson(res, {
        ok: true,
        updatedAt: data.updatedAt || null,
        sync: data.sync || null,
        manualSyncProtected: Boolean(config.adminToken)
      });
    }

    return serveStatic(url.pathname, res);
  } catch (error) {
    sendJson(res, { error: error.message }, 500);
  }
});

if (require.main === module) {
  startServer();
}

function startServer() {
  server.listen(config.port, config.host, () => {
    console.log(`World Cup forecast site running at http://${config.host}:${config.port}/`);
    console.log(`Data file: ${dataPath}`);
    console.log(`Auto sync every ${Math.round(config.syncIntervalMs / 60000)} minute(s).`);
    console.log(`Daily intelligence sync at ${String(config.dailySyncHour).padStart(2, "0")}:00 local time.`);
  });

  setTimeout(() => syncAll("startup").catch((error) => console.error("Startup sync failed:", error.message)), 500);
  setInterval(() => syncAll("scheduled").catch((error) => console.error("Scheduled sync failed:", error.message)), config.syncIntervalMs);
  scheduleDailySync();
}

function resolveDataPath() {
  if (process.env.DATA_FILE) return path.resolve(process.env.DATA_FILE);
  if (process.env.DATA_DIR) return path.join(path.resolve(process.env.DATA_DIR), "site-data.json");
  return seedDataPath;
}

function ensureDataFile() {
  const dir = path.dirname(dataPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(dataPath)) return;
  fs.copyFileSync(seedDataPath, dataPath);
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function splitList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function readSiteData() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function writeSiteData(data) {
  ensureDataFile();
  const payload = `${JSON.stringify(data, null, 2)}\n`;
  const tempPath = `${dataPath}.${process.pid}.tmp`;
  fs.writeFileSync(tempPath, payload);
  fs.renameSync(tempPath, dataPath);
}

function isAuthorized(req) {
  if (!config.adminToken) return true;
  return req.headers["x-admin-token"] === config.adminToken;
}

function sendJson(res, payload, statusCode = 200) {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(payload, null, 2));
}

function withRuntimeStatus(data) {
  const next = structuredCloneSafe(data);
  next.runtime = {
    manualSyncProtected: Boolean(config.adminToken),
    syncIntervalMinutes: Math.round(config.syncIntervalMs / 60000),
    dailySyncHour: config.dailySyncHour
  };
  next.sync = {
    ...(next.sync || {}),
    manualSyncProtected: Boolean(config.adminToken),
    syncIntervalMinutes: Math.round(config.syncIntervalMs / 60000),
    dailySyncHour: config.dailySyncHour
  };
  return next;
}

function serveStatic(urlPath, res) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = cleanPath === "/" ? "/index.html" : cleanPath;
  const fullPath = path.normalize(path.join(rootDir, requestedPath));

  if (!fullPath.startsWith(rootDir)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
    res.writeHead(404);
    return res.end("Not found");
  }

  const ext = path.extname(fullPath).toLowerCase();
  res.writeHead(200, {
    "content-type": mimeTypes[ext] || "application/octet-stream",
    "cache-control": ext === ".html" ? "no-store" : "public, max-age=300"
  });
  fs.createReadStream(fullPath).pipe(res);
}

async function syncAll(mode) {
  if (lastSyncRunning) return readSiteData();
  lastSyncRunning = true;
  const current = readSiteData();
  const next = structuredCloneSafe(current);
  const errors = [];
  const providers = [];

  try {
    if (config.siteDataSourceUrl) {
      providers.push("site-data-source");
      try {
        const external = await fetchJson(config.siteDataSourceUrl);
        mergeSiteData(next, external);
      } catch (error) {
        errors.push(`site-data-source: ${error.message}`);
      }
    }

    if (config.fixturesSourceUrl) {
      providers.push("fixtures-source");
      try {
        const fixturesPayload = await fetchJson(config.fixturesSourceUrl);
        mergeSiteData(next, normalizeFixturePayload(fixturesPayload));
      } catch (error) {
        errors.push(`fixtures-source: ${error.message}`);
      }
    }

    if (config.standingsSourceUrl) {
      providers.push("standings-source");
      try {
        const standingsPayload = await fetchJson(config.standingsSourceUrl);
        mergeSiteData(next, normalizeStandingsPayload(standingsPayload));
      } catch (error) {
        errors.push(`standings-source: ${error.message}`);
      }
    }

    if (config.squadsSourceUrl) {
      providers.push("squads-source");
      try {
        const squadsPayload = await fetchJson(config.squadsSourceUrl);
        mergeSiteData(next, { squads: squadsPayload.squads || squadsPayload });
      } catch (error) {
        errors.push(`squads-source: ${error.message}`);
      }
    }

    if (config.newsRssUrls.length) {
      providers.push("rss-news");
      try {
        const rssNews = await fetchRssNews(config.newsRssUrls);
        next.news = mergeNews(next.news || [], rssNews);
      } catch (error) {
        errors.push(`rss-news: ${error.message}`);
      }
    }

    if (config.friendliesResultsUrl) {
      providers.push("friendlies-results");
      try {
        const friendlies = await fetchFriendlies(config.friendliesResultsUrl);
        next.friendlies = mergeFriendlies(next.friendlies || [], friendlies);
        next.news = mergeNews(next.news || [], friendliesToNews(friendlies));
      } catch (error) {
        errors.push(`friendlies-results: ${error.message}`);
      }
    }

    if (config.apiFootballKey && config.apiFootballFixturesUrl) {
      providers.push("api-football");
      try {
        const apiFootballPayload = await fetchJson(config.apiFootballFixturesUrl, {
          "x-apisports-key": config.apiFootballKey
        });
        next.external = next.external || {};
        next.external.apiFootball = apiFootballPayload;
        mergeSiteData(next, normalizeApiFootballPayload(apiFootballPayload));
      } catch (error) {
        errors.push(`api-football: ${error.message}`);
      }
    }

    if (config.sportmonksToken && config.sportmonksFixturesUrl) {
      providers.push("sportmonks");
      try {
        const url = withQueryParam(config.sportmonksFixturesUrl, "api_token", config.sportmonksToken);
        const sportmonksPayload = await fetchJson(url);
        next.external = next.external || {};
        next.external.sportmonks = sportmonksPayload;
        mergeSiteData(next, normalizeSportmonksPayload(sportmonksPayload));
      } catch (error) {
        errors.push(`sportmonks: ${error.message}`);
      }
    }

    const now = new Date().toISOString();
    const analysisDate = formatDateForZone(now, "Asia/Shanghai");
    next.analysisDate = analysisDate;
    next.analysisLabel = `北京时间 ${analysisDate} 赛前情报日`;
    next.updatedAt = now;
    next.sync = {
      mode,
      updatedAt: now,
      providers: providers.length ? providers : ["local-demo"],
      errors,
      manualSyncProtected: Boolean(config.adminToken),
      syncIntervalMinutes: Math.round(config.syncIntervalMs / 60000),
      dailySyncHour: config.dailySyncHour,
      nextDailySyncAt: nextDailySyncIso(config.dailySyncHour)
    };
    writeSiteData(next);
    return next;
  } finally {
    lastSyncRunning = false;
  }
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function fetchRssNews(urls) {
  const batches = await Promise.all(
    urls.map(async (url) => {
      const xml = await fetchText(url);
      return parseRss(xml, url);
    })
  );
  return batches.flat();
}

async function fetchFriendlies(url) {
  const html = await fetchText(url);
  return parseFriendlies(html, url);
}

function parseFriendlies(html, sourceUrl) {
  const text = cleanXml(html)
    .replace(/\s+/g, " ")
    .replace(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),/g, "|$1,");
  const dayBlocks = text
    .split("|")
    .map((item) => item.trim())
    .filter((item) => /^\w+,\s+\d+\s+\w+\s+2026/.test(item));
  const results = [];

  for (const block of dayBlocks) {
    const dayMatch = block.match(/^(\w+,\s+\d+\s+\w+\s+2026)/);
    if (!dayMatch) continue;
    const date = normalizeGuardianDate(dayMatch[1]);
    const regex = /FT\s+([A-Za-zÀ-ÿ'’.\- ]+?)\s+(\d+)\s+(\d+)\s+([A-Za-zÀ-ÿ'’.\- ]+?)(?=\s+FT\s+|\s+##|\s+\*|\s*$)/g;
    let match;
    while ((match = regex.exec(block))) {
      const home = match[1].trim();
      const homeScore = Number(match[2]);
      const awayScore = Number(match[3]);
      const away = match[4].trim();
      if (!home || !away || !Number.isFinite(homeScore) || !Number.isFinite(awayScore)) continue;
      results.push({
        id: `friendly-${hash(`${date}-${home}-${away}-${homeScore}-${awayScore}`)}`,
        date,
        competition: "International friendly",
        home,
        away,
        homeScore,
        awayScore,
        result: `${home} ${homeScore}-${awayScore} ${away}`,
        source: "The Guardian results",
        url: sourceUrl,
        teams: inferTeams(`${home} ${away}`)
      });
    }
  }

  return results.slice(0, 80);
}

function normalizeGuardianDate(label) {
  const parsed = new Date(`${label} 12:00:00 UTC`);
  return Number.isNaN(parsed.getTime()) ? label : parsed.toISOString().slice(0, 10);
}

function friendliesToNews(friendlies) {
  return friendlies.slice(0, 30).map((item) => ({
    id: `friendly-news-${item.id}`,
    title: `赛前友谊赛：${item.result}`,
    summary: `${item.date} 国际友谊赛结果，已作为相关球队的近期状态信号。友谊赛权重低于世界杯正赛，但会影响 form、轮换和伤病风险判断。`,
    source: item.source,
    url: item.url,
    publishedAt: `${item.date}T12:00:00.000Z`,
    teams: item.teams,
    confidence: "赛果页自动抓取",
    category: "friendly-result"
  }));
}

function parseRss(xml, feedUrl) {
  const itemBlocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
  const entries = itemBlocks.length ? itemBlocks : [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((match) => match[0]);
  return entries.slice(0, 20).map((entry, index) => {
    const title = cleanXml(getXmlValue(entry, "title")) || "未命名情报";
    const link = cleanXml(getXmlValue(entry, "link")) || getXmlAttr(entry, "link", "href") || feedUrl;
    const publishedAt =
      cleanXml(getXmlValue(entry, "pubDate")) ||
      cleanXml(getXmlValue(entry, "published")) ||
      cleanXml(getXmlValue(entry, "updated")) ||
      new Date().toISOString();
    const summary = cleanXml(getXmlValue(entry, "description") || getXmlValue(entry, "summary") || getXmlValue(entry, "content"));
    return {
      id: `rss-${hash(`${feedUrl}-${title}-${index}`)}`,
      title,
      summary: summary.slice(0, 260),
      source: new URL(feedUrl).hostname,
      url: link,
      publishedAt,
      teams: inferTeams(`${title} ${summary}`),
      confidence: classifyNewsConfidence(`${title} ${summary}`, feedUrl),
      category: classifyNewsCategory(`${title} ${summary}`)
    };
  });
}

function getXmlValue(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1] : "";
}

function getXmlAttr(xml, tag, attr) {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["'][^>]*>`, "i"));
  return match ? match[1] : "";
}

function cleanXml(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function mergeSiteData(target, source) {
  if (!source || typeof source !== "object") return;
  if (Array.isArray(source.matches)) target.matches = source.matches;
  if (Array.isArray(source.fixtureUpdates)) target.fixtureUpdates = mergeFixtureUpdates(target.fixtureUpdates || [], source.fixtureUpdates);
  if (Array.isArray(source.fixtures)) target.fixtureUpdates = mergeFixtureUpdates(target.fixtureUpdates || [], source.fixtures);
  if (Array.isArray(source.groupStandings)) target.groupStandings = source.groupStandings;
  if (Array.isArray(source.news)) target.news = mergeNews(target.news || [], source.news);
  if (Array.isArray(source.friendlies)) target.friendlies = mergeFriendlies(target.friendlies || [], source.friendlies);
  if (source.squads && typeof source.squads === "object") target.squads = { ...(target.squads || {}), ...source.squads };
}

function normalizeFixturePayload(payload) {
  if (!payload || typeof payload !== "object") return {};
  const rows = payload.fixtureUpdates || payload.fixtures || payload.matches || payload.response || payload.data || [];
  return {
    fixtureUpdates: Array.isArray(rows) ? rows.map(normalizeGenericFixture).filter(Boolean) : []
  };
}

function normalizeStandingsPayload(payload) {
  if (!payload || typeof payload !== "object") return {};
  const groupStandings = payload.groupStandings || payload.standings || payload.tables || payload.data || [];
  return Array.isArray(groupStandings) ? { groupStandings } : {};
}

function normalizeGenericFixture(item) {
  if (!item || typeof item !== "object") return null;
  const fixture = item.fixture || item;
  const teams = item.teams || {};
  const home = item.home || teams.home?.name || teams.home?.team?.name || item.homeTeam || item.home_team;
  const away = item.away || teams.away?.name || teams.away?.team?.name || item.awayTeam || item.away_team;
  const dateTime = item.kickoff || fixture.date || item.dateTime || item.datetime || item.utcDate;
  const venue = item.venue || fixture.venue || {};
  const matchNo = Number(item.matchNo || item.match_no || item.matchNumber || item.match_number || parseMatchNo(item.id));
  const update = {
    id: item.id || (matchNo ? `m${String(matchNo).padStart(2, "0")}` : undefined),
    matchNo: Number.isFinite(matchNo) && matchNo > 0 ? matchNo : undefined,
    sourceFixtureId: item.sourceFixtureId || fixture.id || item.fixtureId || item.fixture_id,
    group: item.group || item.groupName || parseGroupLabel(item.round || item.stage || item.league?.round),
    date: item.date || dateFromDateTime(dateTime),
    time: item.time || timeFromDateTime(dateTime),
    kickoff: dateTime || item.kickoff,
    home: canonicalTeamName(home),
    away: canonicalTeamName(away),
    stadium: item.stadium || venue.name || venue.stadium,
    venue: typeof venue === "string" ? { name: venue } : venue,
    status: normalizeFixtureStatus(item.status || fixture.status?.short || fixture.status?.long)
  };
  Object.keys(update).forEach((key) => {
    if (update[key] === undefined || update[key] === "" || Number.isNaN(update[key])) delete update[key];
  });
  return update.home || update.away || update.matchNo || update.id ? update : null;
}

function normalizeApiFootballPayload(payload) {
  const rows = Array.isArray(payload?.response) ? payload.response : [];
  return {
    fixtureUpdates: rows.map((row) =>
      normalizeGenericFixture({
        sourceFixtureId: row.fixture?.id,
        date: dateFromDateTime(row.fixture?.date),
        time: timeFromDateTime(row.fixture?.date),
        kickoff: row.fixture?.date,
        home: row.teams?.home?.name,
        away: row.teams?.away?.name,
        stadium: row.fixture?.venue?.name,
        venue: row.fixture?.venue,
        group: parseGroupLabel(row.league?.round),
        status: row.fixture?.status?.short || row.fixture?.status?.long
      })
    ).filter(Boolean)
  };
}

function normalizeSportmonksPayload(payload) {
  const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  return {
    fixtureUpdates: rows.map((row) => {
      const participants = row.participants || row.teams || [];
      const home = participants.find((team) => team.meta?.location === "home" || team.location === "home") || row.home || row.localteam;
      const away = participants.find((team) => team.meta?.location === "away" || team.location === "away") || row.away || row.visitorteam;
      return normalizeGenericFixture({
        sourceFixtureId: row.id,
        date: dateFromDateTime(row.starting_at || row.startingAt || row.date),
        time: timeFromDateTime(row.starting_at || row.startingAt || row.date),
        kickoff: row.starting_at || row.startingAt || row.date,
        home: home?.name,
        away: away?.name,
        stadium: row.venue?.name,
        venue: row.venue,
        group: parseGroupLabel(row.round?.name || row.stage?.name || row.group?.name),
        status: row.state?.short_name || row.state?.name || row.status
      });
    }).filter(Boolean)
  };
}

function mergeFixtureUpdates(existing, incoming) {
  const map = new Map();
  [...existing, ...incoming].filter(Boolean).forEach((item) => {
    const normalized = normalizeGenericFixture(item);
    if (!normalized) return;
    const key = fixtureUpdateKey(normalized);
    if (key) map.set(key, { ...(map.get(key) || {}), ...normalized });
  });
  return [...map.values()].slice(0, 160);
}

function mergeNews(existing, incoming) {
  const map = new Map();
  [...incoming, ...existing].forEach((item) => {
    const key = item.id || item.url || item.title;
    if (key && !map.has(key)) map.set(key, item);
  });
  return [...map.values()]
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, 60);
}

function mergeFriendlies(existing, incoming) {
  const map = new Map();
  [...incoming, ...existing].forEach((item) => {
    const key = item.id || `${item.date}-${item.home}-${item.away}-${item.homeScore}-${item.awayScore}`;
    if (key && !map.has(key)) map.set(key, item);
  });
  return [...map.values()]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 120);
}

function fixtureUpdateKey(item) {
  if (item.matchNo) return `matchNo:${item.matchNo}`;
  if (item.id) return `id:${item.id}`;
  if (item.home && item.away) return `teams:${item.home}-${item.away}`;
  if (item.sourceFixtureId) return `source:${item.sourceFixtureId}`;
  return "";
}

function parseMatchNo(value) {
  const match = String(value || "").match(/^m?(\d{1,3})$/i);
  return match ? Number(match[1]) : undefined;
}

function parseGroupLabel(value) {
  const text = String(value || "");
  const letter = text.match(/\bGroup\s+([A-L])\b/i)?.[1] || text.match(/\b([A-L])组\b/i)?.[1];
  return letter ? letter.toUpperCase() : undefined;
}

function dateFromDateTime(value) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const match = String(value).match(/\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : undefined;
  }
  return date.toISOString().slice(0, 10);
}

function timeFromDateTime(value) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return `${date.toISOString().slice(11, 16)} UTC`;
}

function normalizeFixtureStatus(value) {
  const text = String(value || "").toLowerCase();
  if (!text) return undefined;
  if (/(ft|aet|pen|match finished|finished|full time|played)/i.test(text)) return "historical";
  if (/(pst|postponed|cancel|susp|delay)/i.test(text)) return "postponed";
  if (/(live|1h|2h|ht|in play)/i.test(text)) return "live";
  return "upcoming";
}

function canonicalTeamName(value) {
  const text = String(value || "").trim();
  if (!text) return undefined;
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const aliases = {
    "united states": "美国",
    "usa": "美国",
    "usmnt": "美国",
    "paraguay": "巴拉圭",
    "england": "英格兰",
    "croatia": "克罗地亚",
    "ghana": "加纳",
    "panama": "巴拿马",
    "france": "法国",
    "senegal": "塞内加尔",
    "brazil": "巴西",
    "spain": "西班牙",
    "germany": "德国",
    "argentina": "阿根廷",
    "portugal": "葡萄牙",
    "netherlands": "荷兰",
    "japan": "日本",
    "morocco": "摩洛哥",
    "mexico": "墨西哥",
    "canada": "加拿大",
    "uruguay": "乌拉圭",
    "australia": "澳大利亚",
    "turkey": "土耳其",
    "turkiye": "土耳其",
    "norway": "挪威",
    "scotland": "苏格兰",
    "switzerland": "瑞士",
    "egypt": "埃及",
    "tunisia": "突尼斯",
    "new zealand": "新西兰",
    "south korea": "韩国",
    "korea republic": "韩国",
    "czech republic": "捷克",
    "czechia": "捷克",
    "south africa": "南非",
    "qatar": "卡塔尔",
    "bosnia and herzegovina": "波黑",
    "haiti": "海地",
    "curacao": "库拉索",
    "ivory coast": "科特迪瓦",
    "cote divoire": "科特迪瓦",
    "ecuador": "厄瓜多尔",
    "sweden": "瑞典",
    "cape verde": "佛得角",
    "saudi arabia": "沙特阿拉伯",
    "iran": "伊朗",
    "iraq": "伊拉克",
    "algeria": "阿尔及利亚",
    "austria": "奥地利",
    "jordan": "约旦",
    "uzbekistan": "乌兹别克斯坦",
    "colombia": "哥伦比亚",
    "dr congo": "刚果（金）",
    "congo dr": "刚果（金）"
  };
  return aliases[normalized] || text;
}

function classifyNewsCategory(text) {
  const normalized = String(text || "").toLowerCase();
  if (/(injury|injured|fitness|hamstring|ankle|calf|伤|伤病|受伤|恢复)/i.test(normalized)) return "injury";
  if (/(squad|lineup|roster|starting|call-up|名单|首发|阵容)/i.test(normalized)) return "squad";
  if (/(friendly|warm-up|warm up|友谊赛|热身)/i.test(normalized)) return "friendly";
  if (/(rumour|rumor|reportedly|linked|transfer|bid|offer|传闻|绯闻|报价)/i.test(normalized)) return "rumor";
  return "news";
}

function classifyNewsConfidence(text, feedUrl) {
  const category = classifyNewsCategory(text);
  if (category === "rumor") return "传闻监控";
  if (/fifa\.com|uefa\.com|ussoccer\.com|thefa\.com/i.test(feedUrl)) return "官方/协会来源";
  if (category === "injury" || category === "squad") return "媒体来源，需赛前复核";
  return "媒体来源自动抓取";
}

function inferTeams(text) {
  const teams = {
    "阿根廷": ["Argentina", "阿根廷"],
    "法国": ["France", "法国"],
    "巴西": ["Brazil", "巴西"],
    "英格兰": ["England", "英格兰"],
    "西班牙": ["Spain", "西班牙"],
    "德国": ["Germany", "德国"],
    "美国": ["USA", "United States", "USMNT", "美国"],
    "巴拉圭": ["Paraguay", "巴拉圭"],
    "塞内加尔": ["Senegal", "塞内加尔"],
    "荷兰": ["Netherlands", "荷兰"],
    "日本": ["Japan", "日本"],
    "葡萄牙": ["Portugal", "葡萄牙"],
    "比利时": ["Belgium", "比利时"],
    "加拿大": ["Canada", "加拿大"],
    "墨西哥": ["Mexico", "墨西哥"],
    "摩洛哥": ["Morocco", "摩洛哥"],
    "挪威": ["Norway", "挪威"],
    "土耳其": ["Turkey", "Türkiye", "Turkiye", "土耳其"],
    "苏格兰": ["Scotland", "苏格兰"],
    "澳大利亚": ["Australia", "澳大利亚"],
    "乌拉圭": ["Uruguay", "乌拉圭"],
    "克罗地亚": ["Croatia", "克罗地亚"],
    "加纳": ["Ghana", "加纳"],
    "埃及": ["Egypt", "埃及"],
    "突尼斯": ["Tunisia", "突尼斯"],
    "北爱尔兰": ["Northern Ireland", "北爱尔兰"]
  };
  const found = [];
  const haystack = String(text || "").toLowerCase();
  Object.entries(teams).forEach(([canonical, aliases]) => {
    if (aliases.some((alias) => haystack.includes(alias.toLowerCase()))) found.push(canonical);
  });
  return found.slice(0, 4);
}

function withQueryParam(rawUrl, key, value) {
  const url = new URL(rawUrl);
  if (!url.searchParams.has(key)) url.searchParams.set(key, value);
  return url.toString();
}

function scheduleDailySync() {
  const delay = msUntilNextDailySync(config.dailySyncHour);
  setTimeout(async () => {
    try {
      await syncAll("daily");
    } catch (error) {
      console.error("Daily sync failed:", error.message);
    } finally {
      scheduleDailySync();
    }
  }, delay);
}

function msUntilNextDailySync(hour) {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}

function nextDailySyncIso(hour) {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.toISOString();
}

function formatDateForZone(value, timeZone) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function hash(value) {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) {
    result = (result * 31 + value.charCodeAt(i)) >>> 0;
  }
  return result.toString(16);
}

module.exports = {
  config,
  dataPath,
  readSiteData,
  syncAll,
  writeSiteData
};
