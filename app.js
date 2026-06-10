const factorLabels = {
  teamRating: "整体实力 / Elo-like",
  keyPlayers: "核心球员影响",
  availability: "伤停与可用性",
  tactics: "战术对位",
  form: "近期状态",
  chemistry: "国家队磨合",
  fatigue: "赛程体能",
  venueFit: "场地适配",
  stability: "更衣室稳定"
};

const factorWeights = {
  teamRating: 0.16,
  keyPlayers: 0.2,
  availability: 0.16,
  tactics: 0.15,
  form: 0.12,
  chemistry: 0.09,
  fatigue: 0.04,
  venueFit: 0.03,
  stability: 0.05
};

const marketBlend = 0.18;
const primaryTimeZone = "Asia/Shanghai";
const venueReferenceTimeZone = "America/Los_Angeles";
const defaultAnalysisDate = formatDateForZone(new Date(), primaryTimeZone);
let activeAnalysisDate = defaultAnalysisDate;
let activeAnalysisLabel = `北京时间 ${defaultAnalysisDate} 赛前情报日`;
const groupLetters = "ABCDEFGHIJKL".split("");

const venueDetails = {
  "Mexico City Stadium": { city: "Mexico City", country: "墨西哥", roof: "开放式球场" },
  "Guadalajara Stadium": { city: "Guadalajara", country: "墨西哥", roof: "开放式球场" },
  "Monterrey Stadium": { city: "Monterrey", country: "墨西哥", roof: "开放式球场" },
  "Toronto Stadium": { city: "Toronto", country: "加拿大", roof: "开放式球场" },
  "Vancouver Stadium": { city: "Vancouver", country: "加拿大", roof: "可开合屋顶" },
  "Los Angeles Stadium": { city: "Los Angeles", country: "美国", roof: "半开放式场馆" },
  "San Francisco Bay Area Stadium": { city: "Santa Clara", country: "美国", roof: "开放式球场" },
  "Seattle Stadium": { city: "Seattle", country: "美国", roof: "开放式球场" },
  "Houston Stadium": { city: "Houston", country: "美国", roof: "可开合屋顶" },
  "Dallas Stadium": { city: "Dallas", country: "美国", roof: "可开合屋顶" },
  "Kansas City Stadium": { city: "Kansas City", country: "美国", roof: "开放式球场" },
  "Atlanta Stadium": { city: "Atlanta", country: "美国", roof: "可开合屋顶" },
  "Miami Stadium": { city: "Miami", country: "美国", roof: "开放式球场" },
  "Boston Stadium": { city: "Foxborough", country: "美国", roof: "开放式球场" },
  "New York New Jersey Stadium": { city: "East Rutherford", country: "美国", roof: "开放式球场" },
  "Philadelphia Stadium": { city: "Philadelphia", country: "美国", roof: "开放式球场" }
};

const officialFixtures = [
  fixture(1, "A", "2026-06-11", "15:00 ET", "墨西哥", "南非", "Mexico City Stadium"),
  fixture(2, "A", "2026-06-11", "22:00 ET", "韩国", "捷克", "Guadalajara Stadium"),
  fixture(7, "B", "2026-06-12", "15:00 ET", "加拿大", "波黑", "Toronto Stadium"),
  fixture(19, "D", "2026-06-12", "21:00 ET", "美国", "巴拉圭", "Los Angeles Stadium"),
  fixture(8, "B", "2026-06-13", "15:00 ET", "卡塔尔", "瑞士", "San Francisco Bay Area Stadium"),
  fixture(13, "C", "2026-06-13", "18:00 ET", "巴西", "摩洛哥", "New York New Jersey Stadium"),
  fixture(14, "C", "2026-06-13", "21:00 ET", "海地", "苏格兰", "Boston Stadium"),
  fixture(20, "D", "2026-06-14", "00:00 ET", "澳大利亚", "土耳其", "Vancouver Stadium"),
  fixture(25, "E", "2026-06-14", "13:00 ET", "德国", "库拉索", "Houston Stadium"),
  fixture(31, "F", "2026-06-14", "16:00 ET", "荷兰", "日本", "Dallas Stadium"),
  fixture(26, "E", "2026-06-14", "19:00 ET", "科特迪瓦", "厄瓜多尔", "Philadelphia Stadium"),
  fixture(32, "F", "2026-06-14", "22:00 ET", "瑞典", "突尼斯", "Monterrey Stadium"),
  fixture(43, "H", "2026-06-15", "12:00 ET", "西班牙", "佛得角", "Atlanta Stadium"),
  fixture(37, "G", "2026-06-15", "15:00 ET", "比利时", "埃及", "Seattle Stadium"),
  fixture(44, "H", "2026-06-15", "18:00 ET", "沙特阿拉伯", "乌拉圭", "Miami Stadium"),
  fixture(38, "G", "2026-06-15", "21:00 ET", "伊朗", "新西兰", "Los Angeles Stadium"),
  fixture(49, "I", "2026-06-16", "15:00 ET", "法国", "塞内加尔", "New York New Jersey Stadium"),
  fixture(50, "I", "2026-06-16", "18:00 ET", "伊拉克", "挪威", "Boston Stadium"),
  fixture(55, "J", "2026-06-16", "21:00 ET", "阿根廷", "阿尔及利亚", "Kansas City Stadium"),
  fixture(56, "J", "2026-06-17", "00:00 ET", "奥地利", "约旦", "San Francisco Bay Area Stadium"),
  fixture(61, "K", "2026-06-17", "13:00 ET", "葡萄牙", "刚果（金）", "Houston Stadium"),
  fixture(67, "L", "2026-06-17", "16:00 ET", "英格兰", "克罗地亚", "Dallas Stadium"),
  fixture(68, "L", "2026-06-17", "19:00 ET", "加纳", "巴拿马", "Toronto Stadium"),
  fixture(62, "K", "2026-06-17", "22:00 ET", "乌兹别克斯坦", "哥伦比亚", "Mexico City Stadium"),
  fixture(3, "A", "2026-06-18", "12:00 ET", "捷克", "南非", "Atlanta Stadium"),
  fixture(9, "B", "2026-06-18", "15:00 ET", "瑞士", "波黑", "Los Angeles Stadium"),
  fixture(10, "B", "2026-06-18", "18:00 ET", "加拿大", "卡塔尔", "Vancouver Stadium"),
  fixture(4, "A", "2026-06-18", "21:00 ET", "墨西哥", "韩国", "Guadalajara Stadium"),
  fixture(21, "D", "2026-06-19", "15:00 ET", "美国", "澳大利亚", "Seattle Stadium"),
  fixture(15, "C", "2026-06-19", "18:00 ET", "苏格兰", "摩洛哥", "Boston Stadium"),
  fixture(16, "C", "2026-06-19", "21:00 ET", "巴西", "海地", "Philadelphia Stadium"),
  fixture(22, "D", "2026-06-20", "00:00 ET", "土耳其", "巴拉圭", "San Francisco Bay Area Stadium"),
  fixture(33, "F", "2026-06-20", "13:00 ET", "荷兰", "瑞典", "Houston Stadium"),
  fixture(27, "E", "2026-06-20", "16:00 ET", "德国", "科特迪瓦", "Toronto Stadium"),
  fixture(28, "E", "2026-06-20", "20:00 ET", "厄瓜多尔", "库拉索", "Kansas City Stadium"),
  fixture(34, "F", "2026-06-21", "00:00 ET", "突尼斯", "日本", "Monterrey Stadium"),
  fixture(45, "H", "2026-06-21", "12:00 ET", "西班牙", "沙特阿拉伯", "Atlanta Stadium"),
  fixture(39, "G", "2026-06-21", "15:00 ET", "比利时", "伊朗", "Los Angeles Stadium"),
  fixture(46, "H", "2026-06-21", "18:00 ET", "乌拉圭", "佛得角", "Miami Stadium"),
  fixture(40, "G", "2026-06-21", "21:00 ET", "新西兰", "埃及", "Vancouver Stadium"),
  fixture(57, "J", "2026-06-22", "13:00 ET", "阿根廷", "奥地利", "Dallas Stadium"),
  fixture(51, "I", "2026-06-22", "17:00 ET", "法国", "伊拉克", "Philadelphia Stadium"),
  fixture(52, "I", "2026-06-22", "20:00 ET", "挪威", "塞内加尔", "New York New Jersey Stadium"),
  fixture(58, "J", "2026-06-23", "00:00 ET", "约旦", "阿尔及利亚", "San Francisco Bay Area Stadium"),
  fixture(63, "K", "2026-06-23", "13:00 ET", "葡萄牙", "乌兹别克斯坦", "Houston Stadium"),
  fixture(69, "L", "2026-06-23", "16:00 ET", "英格兰", "加纳", "Boston Stadium"),
  fixture(70, "L", "2026-06-23", "19:00 ET", "巴拿马", "克罗地亚", "Toronto Stadium"),
  fixture(64, "K", "2026-06-23", "22:00 ET", "哥伦比亚", "刚果（金）", "Guadalajara Stadium"),
  fixture(11, "B", "2026-06-24", "15:00 ET", "瑞士", "加拿大", "Vancouver Stadium"),
  fixture(12, "B", "2026-06-24", "15:00 ET", "波黑", "卡塔尔", "Seattle Stadium"),
  fixture(17, "C", "2026-06-24", "18:00 ET", "苏格兰", "巴西", "Miami Stadium"),
  fixture(18, "C", "2026-06-24", "18:00 ET", "摩洛哥", "海地", "Atlanta Stadium"),
  fixture(5, "A", "2026-06-24", "21:00 ET", "捷克", "墨西哥", "Mexico City Stadium"),
  fixture(6, "A", "2026-06-24", "21:00 ET", "南非", "韩国", "Monterrey Stadium"),
  fixture(29, "E", "2026-06-25", "16:00 ET", "库拉索", "科特迪瓦", "Philadelphia Stadium"),
  fixture(30, "E", "2026-06-25", "16:00 ET", "厄瓜多尔", "德国", "New York New Jersey Stadium"),
  fixture(35, "F", "2026-06-25", "19:00 ET", "日本", "瑞典", "Dallas Stadium"),
  fixture(36, "F", "2026-06-25", "19:00 ET", "突尼斯", "荷兰", "Kansas City Stadium"),
  fixture(23, "D", "2026-06-25", "22:00 ET", "土耳其", "美国", "Los Angeles Stadium"),
  fixture(24, "D", "2026-06-25", "22:00 ET", "巴拉圭", "澳大利亚", "San Francisco Bay Area Stadium"),
  fixture(53, "I", "2026-06-26", "15:00 ET", "挪威", "法国", "Boston Stadium"),
  fixture(54, "I", "2026-06-26", "15:00 ET", "塞内加尔", "伊拉克", "Toronto Stadium"),
  fixture(48, "H", "2026-06-26", "20:00 ET", "乌拉圭", "西班牙", "Guadalajara Stadium"),
  fixture(47, "H", "2026-06-26", "20:00 ET", "佛得角", "沙特阿拉伯", "Houston Stadium"),
  fixture(41, "G", "2026-06-27", "00:00 ET", "埃及", "伊朗", "Seattle Stadium"),
  fixture(42, "G", "2026-06-27", "00:00 ET", "新西兰", "比利时", "Vancouver Stadium"),
  fixture(71, "L", "2026-06-27", "17:00 ET", "巴拿马", "英格兰", "New York New Jersey Stadium"),
  fixture(72, "L", "2026-06-27", "17:00 ET", "克罗地亚", "加纳", "Philadelphia Stadium"),
  fixture(65, "K", "2026-06-27", "19:30 ET", "哥伦比亚", "葡萄牙", "Miami Stadium"),
  fixture(66, "K", "2026-06-27", "19:30 ET", "刚果（金）", "乌兹别克斯坦", "Atlanta Stadium"),
  fixture(59, "J", "2026-06-27", "22:00 ET", "阿尔及利亚", "奥地利", "Kansas City Stadium"),
  fixture(60, "J", "2026-06-27", "22:00 ET", "约旦", "阿根廷", "Dallas Stadium")
];

const knockoutSlots = [
  { id: "m73", date: "6/28", venue: "Los Angeles Stadium", left: "2A", right: "2B" },
  { id: "m74", date: "6/29", venue: "Boston Stadium", left: "1E", thirdCandidates: ["A", "B", "C", "D", "F"] },
  { id: "m75", date: "6/29", venue: "Monterrey Stadium", left: "1F", right: "2C" },
  { id: "m76", date: "6/29", venue: "Houston Stadium", left: "1C", right: "2F" },
  { id: "m77", date: "6/30", venue: "New York New Jersey Stadium", left: "1I", thirdCandidates: ["C", "D", "F", "G", "H"] },
  { id: "m78", date: "6/30", venue: "Dallas Stadium", left: "2E", right: "2I" },
  { id: "m79", date: "6/30", venue: "Mexico City Stadium", left: "1A", thirdCandidates: ["C", "E", "F", "H", "I"] },
  { id: "m80", date: "7/1", venue: "Atlanta Stadium", left: "1L", thirdCandidates: ["E", "H", "I", "J", "K"] },
  { id: "m81", date: "7/1", venue: "San Francisco Bay Area Stadium", left: "1D", thirdCandidates: ["B", "E", "F", "I", "J"] },
  { id: "m82", date: "7/1", venue: "Seattle Stadium", left: "1G", thirdCandidates: ["A", "E", "H", "I", "J"] },
  { id: "m83", date: "7/2", venue: "Toronto Stadium", left: "2K", right: "2L" },
  { id: "m84", date: "7/2", venue: "Los Angeles Stadium", left: "1H", right: "2J" },
  { id: "m85", date: "7/2", venue: "Vancouver Stadium", left: "1B", thirdCandidates: ["E", "F", "G", "I", "J"] },
  { id: "m86", date: "7/3", venue: "Miami Stadium", left: "1J", right: "2H" },
  { id: "m87", date: "7/3", venue: "Kansas City Stadium", left: "1K", thirdCandidates: ["D", "E", "I", "J", "L"] },
  { id: "m88", date: "7/3", venue: "Dallas Stadium", left: "2D", right: "2G" }
];

const baseGroupStandings = buildBaseGroupStandings();

const syncConfig = {
  urls: ["/api/site-data", "data/site-data.json"],
  intervalMs: 60000
};

const finalSquadReference = {
  source: "NBC Sports / FIFA confirmed squads",
  url: "https://www.nbcsports.com/soccer/news/2026-world-cup-squads-confirmed-rosters-for-all-48-teams",
  fifaUrl: "https://www.fifa.com/en/articles/fifa-world-cup-2026-squads-confirmed"
};

function squadPlayers(text) {
  return String(text)
    .split(",")
    .map((item) => item.replace(/\s*\([^)]*\)/g, "").replace(/[“”]/g, "").trim())
    .filter(Boolean);
}

let confirmedSquads = {
  阿根廷: {
    coach: "Lionel Scaloni",
    source: finalSquadReference.source,
    url: finalSquadReference.url,
    style:
      "Scaloni 的核心习惯是先保证中场距离和比赛管理，再让 Messi、Alvarez、Lautaro 等人根据场面切换控节奏或纵深冲击。",
    players: squadPlayers(
      "Emiliano Martinez, Geronimo Rulli, Juan Musso, Gonzalo Montiel, Nahuel Molina, Lisandro Martinez, Nicolas Otamendi, Leonardo Balerdi, Cristian Romero, Facundo Medina, Nicolas Tagliafico, Leandro Paredes, Rodrigo De Paul, Exequiel Palacios, Enzo Fernandez, Alexis Mac Allister, Giovani Lo Celso, Valentin Barco, Lionel Messi, Nicolas Paz, Thiago Almada, Nicolas Gonzalez, Giuliano Simeone, Lautaro Martínez, Jose Manuel Lopez, Julian Alvarez"
    ),
    core: [
      {
        name: "Lionel Messi",
        role: "自由前腰 / 定位球",
        status: "已入选大名单",
        influence: "仍是阿根廷阵地战最后一传、节奏变化和定位球的最高权重变量。",
        tacticalUse: "强强对话中更偏回撤控节奏；对弱队时靠近禁区前沿制造最后一传。",
        risk: "出场时间和冲刺负荷会影响阿根廷后段创造力。"
      },
      {
        name: "Alexis Mac Allister",
        role: "中场连接 / 反压迫",
        status: "已入选大名单",
        influence: "决定阿根廷能否把 Messi 的自由接球点和中前场跑动连接起来。",
        tacticalUse: "在对手压迫时承担第一脚转移和二点球保护。",
        risk: "若被迫过深，阿根廷禁区前人数会不足。"
      },
      {
        name: "Julian Alvarez",
        role: "前锋 / 前场压迫",
        status: "已入选大名单",
        influence: "提供纵深、无球压迫和第二前锋跑动，是 Scaloni 改变比赛节奏的重要选择。",
        tacticalUse: "可与 Lautaro 竞争首发，也可作为更高强度压迫方案。",
        risk: "若孤立在前场，阿根廷会进入低效长传。"
      }
    ]
  },
  法国: {
    coach: "Didier Deschamps",
    source: finalSquadReference.source,
    url: finalSquadReference.url,
    style:
      "Deschamps 通常先保证防守站位和转换保护，再让 Mbappe、Dembele、Olise 等个人能力放大空间；强队战更谨慎，弱队战可提高边路压迫。",
    players: squadPlayers(
      "Mike Maignan, Brice Samba, Robin Risser, Dayot Upamecano, William Saliba, Lucas Digne, Theo Hernandez, Lucas Hernandez, Ibrahima Konate, Jules Kounde, Malo Gusto, Maxence Lacroix, N'Golo Kante, Adrien Rabiot, Manu Kone, Aurelien Tchouameni, Warren Zaire-Emery, Maghnes Akliouche, Kylian Mbappe, Ousmane Dembele, Michael Olise, Desire Doue, Bradley Barcola, Rayan Cherki, Marcus Thuram, Jean-Philippe Mateta"
    ),
    core: [
      {
        name: "Kylian Mbappe",
        role: "左路核心 / 纵深终结",
        status: "已入选大名单",
        influence: "法国胜率最敏感的单点变量，能同时改变对方防线深度和边后卫站位。",
        tacticalUse: "强强对话中更强调转换；对低位队伍时需要和 Theo Hernandez/中场形成连续肋部配合。",
        risk: "若被迫频繁回撤，法国反击纵深会下降。"
      },
      {
        name: "Michael Olise",
        role: "右路内切 / 禁区前终结",
        status: "已入选大名单；热身赛帽子戏法",
        influence: "对北爱尔兰友谊赛帽子戏法提升了右路内切和远射权重。",
        tacticalUse: "与 Mbappe 形成双侧牵制，也可作为后手改变节奏。",
        risk: "友谊赛强度不能等同世界杯正赛，仍需首发确认。"
      },
      {
        name: "Aurelien Tchouameni",
        role: "后腰 / 转换保护",
        status: "已入选大名单",
        influence: "决定法国能否在前场天赋压上时守住中路二点。",
        tacticalUse: "面对强队时优先保护中卫身前；面对弱队时承担更高站位分球。",
        risk: "若被拉出中路，法国防线会暴露肋部。"
      },
      {
        name: "William Saliba",
        role: "中卫 / 防线推进",
        status: "已入选大名单",
        influence: "提升法国出球稳定性和一对一防守下限。",
        tacticalUse: "处理对手反击第一点，并在控球时吸引压迫。",
        risk: "若中卫组合临场变化，越位线和横移默契需要复核。"
      }
    ]
  },
  巴西: {
    coach: "Carlo Ancelotti",
    source: finalSquadReference.source,
    url: finalSquadReference.url,
    style:
      "Ancelotti 倾向先稳住中场和中卫保护，再释放 Vinicius、Raphinha、Neymar 等人的自由度；面对强队时会更看重攻守距离。",
    players: squadPlayers(
      "Alisson, Ederson, Weverton, Wesley, Douglas Santos, Alex Sandro, Gabriel Magalhaes, Marquinhos, Danilo, Bremer, Ibanez, Leo Pereira, Bruno Guimaraes, Casemiro, Danilo Santos, Fabinho, Lucas Paqueta, Raphinha, Neymar, Vinicius Junior, Luiz Henrique, Matheus Cunha, Gabriel Martinelli, Igor Thiago, Endrick, Rayan"
    ),
    core: [
      {
        name: "Vinicius Junior",
        role: "左路爆点 / 反击第一出口",
        status: "已入选大名单",
        influence: "巴西最重要的推进和造犯规球员。",
        tacticalUse: "强队战负责纵深和吸引包夹；弱队战需要更多禁区左肋配合。",
        risk: "若中路接应慢，巴西会变成低效边路单打。"
      },
      {
        name: "Bruno Guimaraes",
        role: "中场推进 / 反抢",
        status: "已入选大名单",
        influence: "决定巴西能否把边路突破转化成连续二次进攻。",
        tacticalUse: "在 Ancelotti 的平衡结构里承担出球和反抢双重任务。",
        risk: "若被对手后腰锁住，巴西会过早长传。"
      },
      {
        name: "Raphinha",
        role: "右路边锋 / 反压迫",
        status: "已入选大名单",
        influence: "提供右路速度、压迫和内切终结。",
        tacticalUse: "在 Vinicius 被包夹时成为弱侧出口。",
        risk: "若回防距离过长，进攻端爆发会下降。"
      }
    ],
    omitted: ["Rodrygo"]
  },
  英格兰: {
    coach: "Thomas Tuchel",
    source: "FourFourTwo / FIFA submitted squad",
    url: "https://www.fourfourtwo.com/features/england-world-cup-2026-squad-thomas-tuchel-roster-line-up-xi-final-uk",
    style:
      "Tuchel 倾向按场景切换：领先时用控球和定位球保护，追分时可用 Toney、Watkins 等禁区存在感；面对强队更重视中场保护和反压迫。",
    players: [
      "Jordan Pickford",
      "Dean Henderson",
      "James Trafford",
      "Ezri Konsa",
      "Nico O'Reilly",
      "John Stones",
      "Marc Guehi",
      "Tino Livramento",
      "Dan Burn",
      "Reece James",
      "Djed Spence",
      "Jarell Quansah",
      "Declan Rice",
      "Elliot Anderson",
      "Jude Bellingham",
      "Jordan Henderson",
      "Kobbie Mainoo",
      "Morgan Rogers",
      "Eberechi Eze",
      "Bukayo Saka",
      "Harry Kane",
      "Marcus Rashford",
      "Anthony Gordon",
      "Ollie Watkins",
      "Noni Madueke",
      "Ivan Toney"
    ],
    core: [
      {
        name: "Harry Kane",
        role: "中锋 / 阵地战支点",
        status: "已入选大名单",
        influence: "赛季进球和国家队资历决定他仍是英格兰第一终结点。",
        tacticalUse: "强强对话中回撤连接 Bellingham；对弱队时更多站禁区压中卫。",
        risk: "若对手低位密集，英格兰需要边路传中和二点球支持，否则 Kane 会被孤立。"
      },
      {
        name: "Jude Bellingham",
        role: "前腰 / 八号位切换",
        status: "已入选大名单",
        influence: "决定英格兰中路推进、禁区前二次进攻和反压迫质量。",
        tacticalUse: "对克罗地亚会更像中场压迫点；对加纳/巴拿马可更接近禁区。",
        risk: "若位置过高，Rice 身前空间会被反击利用。"
      },
      {
        name: "Declan Rice",
        role: "后腰 / 防线保护",
        status: "已入选大名单",
        influence: "Tuchel 面对强队时最依赖的中场平衡点。",
        tacticalUse: "限制 Modric/Kovacic 式中路连接，保护边后卫身后。",
        risk: "若被迫频繁横移，英格兰中路第二落点会变薄。"
      },
      {
        name: "Bukayo Saka",
        role: "右路边锋 / 一对一",
        status: "已入选大名单",
        influence: "提供边路突破和内切射门，是打弱队时拉开密集防守的关键。",
        tacticalUse: "对低位对手保持宽度；对强队更多参与反抢和边路保护。",
        risk: "若被双人夹击，需要 Reece James 或中场及时套上。"
      }
    ],
    omitted: ["Phil Foden", "Cole Palmer", "Trent Alexander-Arnold", "Luke Shaw", "Harry Maguire"]
  },
  克罗地亚: {
    coach: "Zlatko Dalic",
    source: "Croatian Football Federation",
    url: "https://hns.team/en/news/31252/head-coach-dalic-confirms-croatias-final-world-cup-squad/",
    style:
      "Dalic 仍以经验中轴、控节奏和比赛管理为底色；强强对话更保守，弱队场次会增加边路和二线插上。",
    players: [
      "Dominik Livakovic",
      "Josip Stanisic",
      "Marin Pongracic",
      "Josko Gvardiol",
      "Duje Caleta-Car",
      "Josip Sutalo",
      "Nikola Moro",
      "Mateo Kovacic",
      "Andrej Kramaric",
      "Luka Modric",
      "Ante Budimir",
      "Ivor Pandur",
      "Nikola Vlasic",
      "Ivan Perisic",
      "Mario Pasalic",
      "Martin Baturina",
      "Petar Sucic",
      "Kristijan Jakic",
      "Toni Fruk",
      "Igor Matanovic",
      "Luka Sucic",
      "Luka Vuskovic",
      "Dominik Kotarski",
      "Marco Pasalic",
      "Martin Erlic",
      "Petar Musa"
    ],
    core: [
      {
        name: "Luka Modric",
        role: "队长 / 节奏控制",
        status: "已入选大名单",
        influence: "仍是克罗地亚节奏和出球方向的最高权重球员。",
        tacticalUse: "对英格兰会降低节奏、吸引压迫后转移弱侧。",
        risk: "若被 Rice/Bellingham 联合压迫，克罗地亚推进会更依赖 Kovacic 带球。"
      },
      {
        name: "Mateo Kovacic",
        role: "中场推进 / 抗压",
        status: "已入选大名单",
        influence: "面对英格兰高压时负责把球带出第一线。",
        tacticalUse: "在 Modric 被盯时接管推进。",
        risk: "若推进失败，英格兰会直接获得禁区前转换机会。"
      },
      {
        name: "Josko Gvardiol",
        role: "中卫/左后卫摇摆",
        status: "已入选大名单",
        influence: "防守 Saka/James 一侧以及出球推进都很关键。",
        tacticalUse: "根据英格兰右路强度决定是否保守站位。",
        risk: "若被迫过早前压，身后空间会被 Kane 拉扯。"
      }
    ]
  },
  加纳: {
    coach: "Otto Addo",
    source: finalSquadReference.source,
    url: finalSquadReference.url,
    style:
      "Addo 面对强队更可能先压缩中路，依靠 Partey、Semenyo、Inaki Williams 的身体和速度打转换；面对同档对手会增加边路推进。",
    players: squadPlayers(
      "Benjamin Asare, Lawrence Ati-Zigi, Joseph Anang, Baba Abdul Rahman, Derrick Luckassen, Gideon Mensah, Marvin Senaya, Alidu Seidu, Abdul Mumin, Jerome Opoku, Jonas Adjetey, Kojo Oppong Peprah, Thomas Partey, Kamaldeen Sulemana, Kwasi Sibo, Augustine Boakye, Caleb Yirenkyi, Abdul Fatawu Issahaku, Elisha Owusu, Christopher Bonsu Baah, Ernest Nuamah, Antoine Semenyo, Brandon Thomas-Asante, Prince Kwabena Adu, Inaki Williams, Jordan Ayew"
    ),
    core: [
      {
        name: "Thomas Partey",
        role: "中场屏障 / 第一脚向前",
        status: "已入选大名单",
        influence: "决定加纳面对英格兰时能否稳住禁区前沿和第一脚反击。",
        tacticalUse: "强队战更偏防守保护；对巴拿马等同组对手可提高向前传球权重。",
        risk: "若被连续调动，加纳中路保护会变薄。"
      },
      {
        name: "Antoine Semenyo",
        role: "前场冲击 / 转换终结",
        status: "已入选大名单",
        influence: "提供加纳最直接的纵深和禁区冲击。",
        tacticalUse: "重点攻击英格兰边后卫压上后的身后空间。",
        risk: "若触球点过低，加纳反击会缺少禁区人数。"
      },
      {
        name: "Inaki Williams",
        role: "前锋 / 拉扯防线",
        status: "已入选大名单",
        influence: "用速度和跑动迫使对手中卫不敢整体前压。",
        tacticalUse: "可单箭头，也可和 Semenyo 形成双纵深。",
        risk: "需要中场第一脚传球质量支持。"
      }
    ]
  },
  巴拿马: {
    coach: "Thomas Christiansen",
    source: finalSquadReference.source,
    url: finalSquadReference.url,
    style:
      "Christiansen 更现实地依靠防守组织、定位球和 Carrasquilla 的中场出球；面对英格兰/克罗地亚会显著降低冒险传控。",
    players: squadPlayers(
      "Orlando Mosquera, Luis Mejia, Cesar Samudio, Cesar Blackman, Jorge Gutierrez, Amir Murillo, Fidel Escobar, Andres Andrade, Edgardo Farina, Jose Cordoba, Eric Davis, Jiovani Ramos, Roderick Miller, Anibal Godoy, Adalberto Carrasquilla, Carlos Harvey, Cristian Martinez, Jose Luis Rodriguez, Cesar Yanis, Yoel Barcenas, Alberto Quintero, Azarias Londono, Ismael Diaz, Cecilio Waterman, Jose Fajardo, Tomas Rodriguez"
    ),
    core: [
      {
        name: "Adalberto Carrasquilla",
        role: "中场出球 / 节奏转换",
        status: "已入选大名单",
        influence: "巴拿马少数能在压力下把球带出中路的球员。",
        tacticalUse: "对英格兰时更多承担第一脚转移；对加纳时可以更主动推进。",
        risk: "若被盯死，巴拿马只能依赖长传和定位球。"
      },
      {
        name: "Jose Cordoba",
        role: "中卫 / 禁区保护",
        status: "已入选大名单",
        influence: "决定巴拿马能否承受强队连续传中和禁区压迫。",
        tacticalUse: "面对 Kane/Budimir 类型中锋时负责第一落点。",
        risk: "若过早吃牌，低位防守强度会下降。"
      },
      {
        name: "Anibal Godoy",
        role: "后腰 / 防线屏障",
        status: "已入选大名单",
        influence: "保护中卫身前并组织低位防守距离。",
        tacticalUse: "强队战中承担禁区弧顶扫荡。",
        risk: "横移压力过大时会暴露弱侧。"
      }
    ]
  },
  西班牙: {
    coach: "Luis de la Fuente",
    source: finalSquadReference.source,
    url: finalSquadReference.url,
    style:
      "De la Fuente 依赖中场控节奏和边锋一对一，强队战会更重视 Rodri/Zubimendi 的保护，弱队战会提高边后卫与边锋叠加。",
    players: squadPlayers(
      "Unai Simon, David Raya, Joan Garcia, Marc Cucurella, Alejandro Grimaldo, Pau Cubarsi, Aymeric Laporte, Marc Pubill, Eric Garcia, Marcos Llorente, Pedro Porro, Pedri, Fabian Ruiz, Martin Zubimendi, Gavi, Rodri, Alex Baena, Mikel Merino, Mikel Oyarzabal, Dani Olmo, Nico Williams, Yeremy Pino, Ferran Torres, Borja Iglesias, Victor Munoz, Lamine Yamal"
    ),
    core: []
  },
  德国: {
    coach: "Julian Nagelsmann",
    source: finalSquadReference.source,
    url: finalSquadReference.url,
    style:
      "Nagelsmann 会按对手调整中前场站位：面对传控强队更需要 Kimmich/Rudiger 维持结构，面对弱队则释放 Wirtz/Musiala 的中路自由度。",
    players: squadPlayers(
      "Oliver Baumann, Manuel Neuer, Alexander Nubel, Waldemar Anton, Nathaniel Brown, Joshua Kimmich, David Raum, Antonio Rudiger, Nico Schlotterbeck, Jonathan Tah, Malick Thiaw, Nadiem Amiri, Leon Goretzka, Pascal Gross, Jamie Leweling, Lennart Karl, Jamal Musiala, Felix Nmecha, Alexander Pavlovic, Angelo Stiller, Florian Wirtz, Maximilian Beier, Kai Havertz, Leroy Sane, Denis Undav, Nick Woltemade"
    ),
    core: []
  },
  美国: {
    coach: "Mauricio Pochettino",
    source: "NBC Sports / FIFA submitted squad",
    url: "https://www.nbcsports.com/soccer/news/2026-world-cup-squads-confirmed-rosters-for-all-48-teams",
    style:
      "Pochettino 体系强调压迫、纵向推进和边路强度；首战主场会更主动，但面对反击型对手必须控制边后卫压上高度。",
    players: [
      "Chris Brady",
      "Matt Freese",
      "Matt Turner",
      "Max Arfsten",
      "Sergino Dest",
      "Alex Freeman",
      "Mark McKenzie",
      "Tim Ream",
      "Chris Richards",
      "Antonee Robinson",
      "Miles Robinson",
      "Joe Scally",
      "Auston Trusty",
      "Brenden Aaronson",
      "Tyler Adams",
      "Sebastian Berhalter",
      "Weston McKennie",
      "Christian Pulisic",
      "Gio Reyna",
      "Cristian Roldan",
      "Malik Tillman",
      "Tim Weah",
      "Alejandro Zendejas",
      "Folarin Balogun",
      "Ricardo Pepi",
      "Haji Wright"
    ],
    core: []
  },
  巴拉圭: {
    coach: "Gustavo Alfaro",
    source: "NBC Sports / FIFA submitted squad",
    url: "https://www.nbcsports.com/soccer/news/2026-world-cup-squads-confirmed-rosters-for-all-48-teams",
    style:
      "Alfaro 更重视防守结构、身体对抗和转换效率；面对东道主美国大概率先稳住中路，再用 Almiron/Enciso 打反击。",
    players: [
      "Gatito Fernandez",
      "Orlando Gill",
      "Gaston Olveira",
      "Gustavo Gomez",
      "Junior Alonso",
      "Fabian Balbuena",
      "Omar Alderete",
      "Juan Jose Caceres",
      "Gustavo Velazquez",
      "Jose Canale",
      "Alexandro Maidana",
      "Miguel Almiron",
      "Kaku",
      "Andres Cubas",
      "Ramon Sosa",
      "Diego Gomez",
      "Damian Bobadilla",
      "Braian Ojeda",
      "Matias Galarza",
      "Mauricio",
      "Antonio Sanabria",
      "Julio Enciso",
      "Gabriel Avalos",
      "Alex Arce",
      "Isidro Pitta",
      "Gustavo Caballero"
    ],
    core: []
  }
};

function fixture(matchNo, group, date, time, home, away, stadium) {
  const venue = venueDetails[stadium] || { city: "待定", country: "待定", roof: "场馆信息待同步" };
  return {
    matchNo,
    id: `m${String(matchNo).padStart(2, "0")}`,
    group,
    date,
    time,
    home,
    away,
    stadium,
    venue,
    kickoff: `${date} ${time}`
  };
}

function buildBaseGroupStandings() {
  return groupLetters.map((group) => {
    const names = [];
    officialFixtures
      .filter((item) => item.group === group)
      .forEach((item) => {
        [item.home, item.away].forEach((team) => {
          if (!names.includes(team)) names.push(team);
        });
      });
    return {
      group,
      teams: names.slice(0, 4).map((name) => ({
        name,
        played: 0,
        win: 0,
        draw: 0,
        loss: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      }))
    };
  });
}

function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

const baseMatches = [
  {
    id: "arg-fra",
    group: "淘汰赛级别对话 · 示例情报",
    kickoff: "2026-06-30 20:00",
    home: "阿根廷",
    away: "法国",
    context:
      "示例模型认为两队胜率接近。阿根廷的优势来自中场连接和比赛管理，法国的优势来自姆巴佩牵引的纵深冲击和替补强度。",
    venue: {
      stadium: "New York New Jersey Stadium",
      city: "East Rutherford",
      country: "美国",
      surface: "天然草",
      roof: "开放式球场",
      climate: "夏季夜场，湿度和草皮速度需要赛前核实",
      tacticalImpact:
        "宽阔场地利好法国边路冲刺；若草皮偏慢，阿根廷中场控节奏的收益会更高。"
    },
    teams: {
      home: {
        teamRating: 82,
        keyPlayers: 84,
        availability: 79,
        tactics: 82,
        form: 80,
        chemistry: 85,
        fatigue: 73,
        venueFit: 72,
        stability: 78,
        notes: {
          teamRating: "大赛经验和门将稳定性拉高下限，整体 rating 略低于法国锋线天赋，但淘汰赛管理能力强。",
          keyPlayers: "梅西、阿尔瓦雷斯、麦卡利斯特和恩佐决定阵地战质量；德保罗的覆盖会影响右路保护。",
          availability: "示例中没有写入确认伤停；梅西、迪马利亚式角色若出场时间受限，需要把核心球员影响下调。",
          tactics: "阿根廷更依赖中路三角站位和右半空间串联，关键是让梅西在两线之间接球而不是被迫背身。",
          form: "近年大赛强强对话经验充足，领先后通过控球和犯规节奏管理比赛的能力较强。",
          chemistry: "主力框架延续性好，门将、中卫、中场和前场支点关系清晰。",
          fatigue: "若前一轮消耗过大，边路回追和中场二点球覆盖会先受影响。",
          venueFit: "中立场影响有限；草皮越慢越利于控节奏，越快越容易被法国纵深打穿。",
          stability: "更衣室风险按低到中处理；如赛前出现核心出场顺序争议，稳定性应下调。"
        },
        core: [
          {
            name: "Lionel Messi",
            role: "自由前腰 / 右半空间组织",
            status: "出场时间需赛前核实",
            influence: "决定最后一传、定位球和低节奏阵地战质量。",
            tacticalUse: "吸引后腰后释放阿尔瓦雷斯前插，或把球转给弱侧边锋。",
            risk: "如果体能只能支撑 60 分钟，阿根廷后段创造力会明显下降。"
          },
          {
            name: "Julián Álvarez",
            role: "前锋 / 前场压迫触发点",
            status: "预计可用",
            influence: "负责冲击法国中卫身后，也决定阿根廷能否把法国出球压到边路。",
            tacticalUse: "在梅西回撤时拉开纵深，逼迫法国防线不敢整体前压。",
            risk: "若被孤立，阿根廷会变成外围控球但禁区触球不足。"
          },
          {
            name: "Emiliano Martínez",
            role: "门将 / 点球与心理战",
            status: "预计可用",
            influence: "扑救和出球稳定性提升阿根廷下限。",
            tacticalUse: "在法国高压时通过长传找前场第二落点。",
            risk: "若过度长传，阿根廷中场控场优势会被削弱。"
          }
        ],
        injuries: [
          {
            player: "Lionel Messi",
            status: "赛前监控",
            impact: "不是确认伤病；模型只记录年龄、体能和出场时间带来的不确定性。"
          },
          {
            player: "Cristian Romero",
            status: "对抗负荷监控",
            impact: "若中卫无法高强度对抗姆巴佩或穆阿尼式纵深点，防线需整体回收。"
          }
        ],
        risks: [
          {
            type: "更衣室/舆情",
            level: "低",
            detail: "未写入确认内讧；只把核心出场时间、老将角色和舆论压力作为监控项。"
          },
          {
            type: "战术风险",
            level: "中",
            detail: "若右路回追不足，法国会持续攻击阿根廷右中卫与边后卫之间的通道。"
          }
        ]
      },
      away: {
        teamRating: 85,
        keyPlayers: 87,
        availability: 81,
        tactics: 80,
        form: 82,
        chemistry: 78,
        fatigue: 75,
        venueFit: 77,
        stability: 76,
        notes: {
          teamRating: "法国阵容深度更厚，锋线速度和替补爆点让模型给出更高整体 rating。",
          keyPlayers: "姆巴佩是最大权重球员，格列兹曼、楚阿梅尼和萨利巴决定攻防转换的质量。",
          availability: "示例中不写确认伤停；姆巴佩、登贝莱和中卫组合的赛前健康度要重点复核。",
          tactics: "法国更依赖左路纵深和中场抢断后的第一脚向前传，阵地战要看格列兹曼或中场组织者能否接管。",
          form: "强队交锋经验丰富，领先后可用速度型替补继续拉开空间。",
          chemistry: "阵容更替使部分组合默契略低，但个人能力能覆盖不少结构问题。",
          fatigue: "轮换资源充足，连续作战压力相对可控。",
          venueFit: "快草和大场地利好法国纵深冲刺，湿热天气会增加高强度往返的体能成本。",
          stability: "整体稳定；若外界围绕核心位置选择产生舆论压力，临场心态需观察。"
        },
        core: [
          {
            name: "Kylian Mbappé",
            role: "左路核心 / 纵深终结",
            status: "预计可用",
            influence: "牵制阿根廷防线站位，是法国胜率最关键的单点变量。",
            tacticalUse: "站在边后卫身后迫使阿根廷中卫横移，给中路插上创造空间。",
            risk: "若被迫回撤拿球，法国反击威胁会被稀释。"
          },
          {
            name: "Antoine Griezmann",
            role: "中前场连接 / 定位球",
            status: "角色与体能需核实",
            influence: "决定法国阵地战能否把速度优势转化成高质量射门。",
            tacticalUse: "在肋部接应后快速找姆巴佩或弱侧边锋。",
            risk: "若被阿根廷后腰贴身限制，法国会更依赖个人突破。"
          },
          {
            name: "William Saliba",
            role: "中卫 / 防线推进",
            status: "预计可用",
            influence: "负责限制阿尔瓦雷斯前插并处理阿根廷第一波压迫。",
            tacticalUse: "出球时吸引压迫，给楚阿梅尼或边后卫创造接球角度。",
            risk: "若过早吃牌，法国防线会被迫降低对抗强度。"
          }
        ],
        injuries: [
          {
            player: "Kylian Mbappé",
            status: "冲刺负荷监控",
            impact: "不是确认伤病；只记录高冲刺负荷对爆发力的赛前风险。"
          },
          {
            player: "中卫组合",
            status: "默契监控",
            impact: "若临场更换中卫搭档，法国防线横移和越位线会有短时风险。"
          }
        ],
        risks: [
          {
            type: "战术风险",
            level: "中",
            detail: "阵地战如果缺少中路连接，法国会进入单点突破模式，射门质量可能下降。"
          },
          {
            type: "舆情/角色",
            level: "低",
            detail: "未写入确认内讧；只监控核心球员角色变化对替补席心态的影响。"
          }
        ]
      }
    },
    odds: {
      home: 2.35,
      draw: 3.15,
      away: 2.72,
      support: { home: 39, draw: 27, away: 34 }
    }
  },
  {
    id: "bra-eng",
    group: "小组焦点战 · 示例情报",
    kickoff: "2026-06-18 18:00",
    home: "巴西",
    away: "英格兰",
    context:
      "巴西依赖维尼修斯与罗德里戈的边路爆点，英格兰依赖贝林厄姆、凯恩和赖斯形成的中轴控制。胜负关键在巴西能否打穿英格兰低位保护。",
    venue: {
      stadium: "SoFi Stadium",
      city: "Los Angeles",
      country: "美国",
      surface: "天然草临时铺设需赛前核实",
      roof: "半开放式场馆",
      climate: "室内外温差和草皮弹性可能影响传控节奏",
      tacticalImpact:
        "如果草皮速度偏慢，英格兰低位防守和定位球收益提升；若空间打开，巴西边锋优势更明显。"
    },
    teams: {
      home: {
        teamRating: 83,
        keyPlayers: 86,
        availability: 77,
        tactics: 78,
        form: 79,
        chemistry: 75,
        fatigue: 74,
        venueFit: 76,
        stability: 74,
        notes: {
          teamRating: "个人能力强，但模型会扣除后防稳定性和中场控制连续性的不确定。",
          keyPlayers: "维尼修斯和罗德里戈决定进攻上限，马尔基尼奥斯和门将决定防守下限。",
          availability: "边锋和边后卫健康度是最高敏感项；若少一个爆点，胜率会下滑。",
          tactics: "巴西需要用边路一对一制造弱侧空当，不能只依赖个人强突。",
          form: "面对开放型对手优势明显，遇到英格兰式紧凑低位时效率会波动。",
          chemistry: "攻击线天赋足，固定套路和无球跑位仍需临场验证。",
          fatigue: "边路高强度往返消耗大，70 分钟后替补质量会很重要。",
          venueFit: "快场地利于边锋起速；临时草皮若偏软会降低爆发第一步。",
          stability: "舆情压力通常集中在主帅选择和核心是否回防，赛前需监控。"
        },
        core: [
          {
            name: "Vinícius Júnior",
            role: "左路爆点 / 反击第一出口",
            status: "预计可用",
            influence: "巴西最重要的推进和造犯规球员。",
            tacticalUse: "吸引沃克或英格兰右中卫横移，给禁区弧顶创造二次进攻。",
            risk: "若被双人包夹且中路接应慢，巴西会陷入低效横传。"
          },
          {
            name: "Rodrygo",
            role: "右路/中路游走",
            status: "预计可用",
            influence: "负责弱侧内切和禁区内最后一脚。",
            tacticalUse: "在维尼修斯吸引防守后进入中路空当。",
            risk: "如果站位过深，巴西前场会缺少禁区人数。"
          },
          {
            name: "Bruno Guimarães",
            role: "中场推进 / 反抢",
            status: "预计可用",
            influence: "决定巴西能否把边路突破和中路二点球连接起来。",
            tacticalUse: "在英格兰回收时负责禁区前沿分球和反抢。",
            risk: "若被赖斯压制，巴西会被迫过早长传。"
          }
        ],
        injuries: [
          {
            player: "边锋群",
            status: "肌肉负荷监控",
            impact: "高频冲刺位置，赛前训练负荷和首发名单对模型影响大。"
          },
          {
            player: "边后卫",
            status: "回追能力监控",
            impact: "若边后卫状态不足，英格兰会攻击巴西边锋身后的空间。"
          }
        ],
        risks: [
          {
            type: "主帅舆情",
            level: "中",
            detail: "若阵型选择受到舆论质疑，球员执行会变得更保守。"
          },
          {
            type: "攻守断层",
            level: "中",
            detail: "前场自由度高，但丢球后若第一时间反抢失败，后腰身后空间会暴露。"
          }
        ]
      },
      away: {
        teamRating: 82,
        keyPlayers: 84,
        availability: 82,
        tactics: 84,
        form: 80,
        chemistry: 81,
        fatigue: 77,
        venueFit: 73,
        stability: 79,
        notes: {
          teamRating: "英格兰中轴线均衡，防守下限高，模型给出略高的战术执行评分。",
          keyPlayers: "凯恩、贝林厄姆、萨卡和赖斯是进攻、防守和转换的核心支点。",
          availability: "示例默认主力可用；若凯恩或萨卡出场受限，英格兰进攻会少一层变化。",
          tactics: "英格兰可用低位 4-4-2/4-2-3-1 限制边路内切，再依靠凯恩回撤接应。",
          form: "大赛硬仗防守稳定，但进攻端有时偏保守。",
          chemistry: "中后场结构稳定，贝林厄姆与凯恩的纵向关系是关键。",
          fatigue: "阵容深度不错，中场强度可持续。",
          venueFit: "中立场影响小，但临时草皮可能影响快速地面推进。",
          stability: "整体稳定；风险更多来自舆论对主帅保守选择的压力。"
        },
        core: [
          {
            name: "Jude Bellingham",
            role: "前腰/八号位混合核心",
            status: "预计可用",
            influence: "负责把防守转换成纵向推进，是英格兰最重要的空间攻击点。",
            tacticalUse: "在凯恩回撤时前插攻击中卫身后。",
            risk: "若被迫长期回撤防守，英格兰前场人数会不足。"
          },
          {
            name: "Harry Kane",
            role: "中锋 / 回撤支点",
            status: "预计可用",
            influence: "英格兰阵地战和定位球进攻的核心。",
            tacticalUse: "回撤牵出中卫后给萨卡、福登或贝林厄姆创造身后空间。",
            risk: "如果身体状态影响转身速度，英格兰反击会慢半拍。"
          },
          {
            name: "Declan Rice",
            role: "后腰 / 防线保护",
            status: "预计可用",
            influence: "限制维尼修斯内切后的二次进攻。",
            tacticalUse: "保护右中卫和边后卫之间的通道。",
            risk: "若被巴西连续调动，英格兰禁区前沿会出现远射空间。"
          }
        ],
        injuries: [
          {
            player: "Bukayo Saka",
            status: "高强度冲刺监控",
            impact: "不是确认伤病；如首发受限，右路牵制力会下降。"
          },
          {
            player: "John Stones",
            status: "出球中卫状态监控",
            impact: "若无法首发，英格兰由守转攻质量会下降。"
          }
        ],
        risks: [
          {
            type: "战术保守",
            level: "中",
            detail: "若过早回收，巴西会获得持续边路一对一机会。"
          },
          {
            type: "舆论压力",
            level: "低",
            detail: "未写入确认内讧；主要监控外界对首发进攻组合的压力。"
          }
        ]
      }
    },
    odds: {
      home: 2.48,
      draw: 3.05,
      away: 2.55,
      support: { home: 36, draw: 28, away: 36 }
    }
  },
  {
    id: "esp-ger",
    group: "淘汰赛假想盘 · 示例情报",
    kickoff: "2026-06-22 21:00",
    home: "西班牙",
    away: "德国",
    context:
      "西班牙在传控和压迫连贯性上更强，德国在身体对抗、定位球和中路直接提速上更有威胁。模型给出高平局倾向。",
    venue: {
      stadium: "Mercedes-Benz Stadium",
      city: "Atlanta",
      country: "美国",
      surface: "天然草临时铺设需赛前核实",
      roof: "可开合屋顶",
      climate: "室内环境更可控，草皮状态是主要变量",
      tacticalImpact:
        "稳定环境利好西班牙连续传控；如果草皮偏硬，德国中路直塞和定位球二点更有威胁。"
    },
    teams: {
      home: {
        teamRating: 80,
        keyPlayers: 83,
        availability: 78,
        tactics: 86,
        form: 81,
        chemistry: 84,
        fatigue: 76,
        venueFit: 79,
        stability: 80,
        notes: {
          teamRating: "整体质量稳定，模型更看重西班牙的战术结构而非单点爆发。",
          keyPlayers: "罗德里、佩德里、亚马尔和尼科威廉斯决定控球质量与边路穿透。",
          availability: "中场核心健康度最敏感；若罗德里或佩德里受限，西班牙控场会下降。",
          tactics: "高位压迫、短传推进和边中结合成熟，能持续制造控球优势。",
          form: "近况稳定，领先后通过控球消耗对手的能力强。",
          chemistry: "中前场关系清晰，边锋和中场之间的接应距离控制较好。",
          fatigue: "高压打法对体能要求高，若连续作战需要谨慎轮换。",
          venueFit: "可控环境利好传控；草皮临时铺设质量需赛前核实。",
          stability: "更衣室风险较低，主要监控年轻球员大赛压力。"
        },
        core: [
          {
            name: "Rodri",
            role: "后腰 / 控场轴心",
            status: "健康度需赛前核实",
            influence: "决定西班牙能否压住德国反击第一脚。",
            tacticalUse: "在中路吸收压力后转移到边锋脚下。",
            risk: "若状态不满，西班牙被德国直接打身后的概率会上升。"
          },
          {
            name: "Pedri",
            role: "中场连接 / 肋部传球",
            status: "出场节奏需核实",
            influence: "负责把控球转化为禁区前沿机会。",
            tacticalUse: "在左肋部与边锋形成三角，撕开德国中场线。",
            risk: "如果被德国强对抗限制，西班牙会出现无效控球。"
          },
          {
            name: "Lamine Yamal",
            role: "右路边锋 / 破密防",
            status: "预计可用",
            influence: "年轻边锋的一对一能力提升西班牙进攻上限。",
            tacticalUse: "在弱侧接球后内切找远角或倒三角。",
            risk: "若被德国边后卫限制在边线，西班牙右路威胁会下降。"
          }
        ],
        injuries: [
          {
            player: "Rodri",
            status: "负荷监控",
            impact: "模型不写确认伤病；后腰健康度对西班牙胜率权重很高。"
          },
          {
            player: "Pedri",
            status: "出场节奏监控",
            impact: "若无法打满，西班牙中场创造力会更依赖边锋个人能力。"
          }
        ],
        risks: [
          {
            type: "年轻球员压力",
            level: "低",
            detail: "亚马尔等年轻球员上限高，但淘汰赛高压下失误成本更高。"
          },
          {
            type: "战术风险",
            level: "中",
            detail: "高位压迫被德国一脚打穿时，身后空间会很大。"
          }
        ]
      },
      away: {
        teamRating: 81,
        keyPlayers: 82,
        availability: 80,
        tactics: 80,
        form: 78,
        chemistry: 79,
        fatigue: 74,
        venueFit: 77,
        stability: 77,
        notes: {
          teamRating: "德国中轴线硬度强，身体对抗和定位球增加了下限。",
          keyPlayers: "维尔茨、穆西亚拉、基米希和吕迪格决定进攻创造与防守强度。",
          availability: "中卫和中场核心健康度是主要变量；临场换人会影响阵型平衡。",
          tactics: "德国能在中场直接提速，定位球和反抢后的二次进攻很有威胁。",
          form: "强强对话波动较大，逆风球处理是风险点。",
          chemistry: "年轻球员和老将之间的节奏统一仍需观察。",
          fatigue: "高强度对抗消耗不低，后 20 分钟换人质量关键。",
          venueFit: "身体对抗型打法适应性好，草皮偏硬会增加直塞和远射收益。",
          stability: "稳定性中等偏高；主要风险来自舆论对阵容更替的讨论。"
        },
        core: [
          {
            name: "Florian Wirtz",
            role: "前腰 / 直塞创造",
            status: "预计可用",
            influence: "决定德国能否把抢断转化成高质量机会。",
            tacticalUse: "在西班牙后腰身后接球，第一时间找穆西亚拉或哈弗茨。",
            risk: "若拿球被压迫，德国反击会转为低效横传。"
          },
          {
            name: "Jamal Musiala",
            role: "盘带核心 / 中路爆点",
            status: "预计可用",
            influence: "德国破西班牙中场压迫的关键个人能力。",
            tacticalUse: "通过带球吸引多人，释放弱侧边后卫或前锋。",
            risk: "若盘带失误，西班牙会在中路直接反抢。"
          },
          {
            name: "Antonio Rüdiger",
            role: "中卫 / 对抗和防线领导",
            status: "预计可用",
            influence: "限制西班牙禁区前沿渗透并提高定位球威胁。",
            tacticalUse: "通过身体对抗干扰西班牙中锋和插上球员。",
            risk: "如果前压过度，身后会被亚马尔或尼科攻击。"
          }
        ],
        injuries: [
          {
            player: "中卫组合",
            status: "对抗负荷监控",
            impact: "若中卫有轻伤或早早吃牌，德国防线会降低压迫高度。"
          },
          {
            player: "前场双核",
            status: "疲劳监控",
            impact: "维尔茨和穆西亚拉若被迫连续冲刺回防，德国最后三十米创造力会下降。"
          }
        ],
        risks: [
          {
            type: "阵容平衡",
            level: "中",
            detail: "如果同时堆叠攻击手，中场保护可能不足。"
          },
          {
            type: "舆论压力",
            level: "低",
            detail: "未写入确认内讧；只监控围绕首发中锋和中场组合的争议。"
          }
        ]
      }
    },
    odds: {
      home: 2.62,
      draw: 2.95,
      away: 2.66,
      support: { home: 34, draw: 32, away: 34 }
    }
  }
];

const sharedSources = [
  {
    tier: "官方赛程",
    name: "FIFA 2026 match schedule",
    url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums",
    reliability: "高",
    note: "赛程、比赛编号、场地和晋级槽位优先以 FIFA 官方页面为准。"
  },
  {
    tier: "官方赔率",
    name: "中国体育彩票竞彩足球胜平负",
    url: "https://www.sporttery.cn/jc/jsq/zqspf/",
    reliability: "高",
    note: "页面内奖金为示例录入；正式使用应由官方页面或授权接口核对。"
  },
  {
    tier: "最终大名单",
    name: "FIFA confirmed squads / NBC roster tracker",
    url: finalSquadReference.url,
    reliability: "高",
    note: "核心球员必须先通过最终 26 人名单校验；未接入名单的队伍不显示具体核心球员。"
  }
];

const matchEvidence = {
  "arg-fra": {
    history: [
      {
        date: "2022-12-18",
        competition: "FIFA World Cup Final",
        result: "阿根廷 3-3 法国，点球 4-2",
        type: "国际大赛",
        source: "FIFA",
        url: "https://www.fifa.com/en/articles/world-cup-finals-that-made-history",
        note: "极端高压样本：姆巴佩爆发仍被阿根廷拖入点球，说明两队差距更多来自临场效率。"
      },
      {
        date: "2018-06-30",
        competition: "FIFA World Cup Round of 16",
        result: "法国 4-3 阿根廷",
        type: "国际大赛",
        source: "FIFA",
        url: "https://www.fifa.com/en/tournaments/mens/worldcup/articles/france-argentina-fifa-world-cup-2018",
        note: "法国纵深速度击穿阿根廷防线，是本场继续重点监控的战术样本。"
      },
      {
        date: "2009-02-11",
        competition: "International Friendly",
        result: "法国 0-2 阿根廷",
        type: "友谊赛",
        source: "历史赛果库",
        url: "",
        note: "友谊赛权重低，只用于观察风格适配，不直接拉高预测权重。"
      }
    ],
    sources: [
      ...sharedSources,
      {
        tier: "历史赛果",
        name: "FIFA 2018 classic report",
        url: "https://www.fifa.com/en/tournaments/mens/worldcup/articles/france-argentina-fifa-world-cup-2018",
        reliability: "高",
        note: "用于校准法国速度冲击和阿根廷淘汰赛管理能力。"
      },
      {
        tier: "球队/媒体新闻",
        name: "官方球队发布会与主流媒体 RSS",
        url: "",
        reliability: "中-高",
        note: "同步后进入新闻流；伤病和首发需二次确认。"
      }
    ],
    rumors: [
      {
        topic: "核心老将出场时间",
        teams: ["阿根廷"],
        confidence: "中",
        status: "待赛前发布会确认",
        impact: "若梅西只能有限时间出场，阿根廷创造力和定位球威胁需要下调。"
      },
      {
        topic: "法国前场角色分配",
        teams: ["法国"],
        confidence: "低",
        status: "只作舆情监控",
        impact: "若围绕首发边锋/前腰选择出现明显争议，稳定性评分可小幅下调。"
      }
    ]
  },
  "bra-eng": {
    history: [
      {
        date: "2024-03-23",
        competition: "Men's International",
        result: "英格兰 0-1 巴西",
        type: "友谊赛",
        source: "England Football",
        url: "https://www.englandfootball.com/england/mens-senior-team/fixtures-results/2023-24/england-v-brazil-international-match-saturday-23-march-2024-match-centre",
        note: "近期友谊赛样本，巴西反击和替补爆点仍具杀伤。"
      },
      {
        date: "2017-11-14",
        competition: "Bobby Moore Fund International",
        result: "英格兰 0-0 巴西",
        type: "友谊赛",
        source: "The FA",
        url: "https://www.thefa.com/news/2017/nov/14/england-brazil-wembley-report-141117",
        note: "英格兰能用紧凑防守压低巴西机会质量。"
      },
      {
        date: "2013-06-02",
        competition: "Men's International",
        result: "巴西 2-2 英格兰",
        type: "友谊赛",
        source: "England Football",
        url: "https://www.englandfootball.com/england/mens-senior-team/fixtures-results/2023-24/england-v-brazil-international-match-saturday-23-march-2024-match-centre",
        note: "开放比赛里双方都有进球能力，但参考权重低于大赛淘汰赛。"
      },
      {
        date: "2002-06-21",
        competition: "FIFA World Cup Quarter-final",
        result: "英格兰 1-2 巴西",
        type: "国际大赛",
        source: "FIFA",
        url: "https://www.fifa.com/en/articles/england-world-cup-quarter-finals-garrincha-maradona-beckenbauer-cristiano-rooney-lineker",
        note: "大赛样本显示巴西在落后情况下仍能通过个人能力改变比赛。"
      }
    ],
    sources: [
      ...sharedSources,
      {
        tier: "官方协会",
        name: "The FA / England Football match centre",
        url: "https://www.englandfootball.com/england/mens-senior-team/fixtures-results/2023-24/england-v-brazil-international-match-saturday-23-march-2024-match-centre",
        reliability: "高",
        note: "用于历史友谊赛与英格兰阵容新闻核对。"
      },
      {
        tier: "历史赛果",
        name: "FIFA World Cup archive",
        url: "https://www.fifa.com/en/articles/100-great-world-cup-moments-qatar-2022-65-ronaldinho-free-kick-england-2002",
        reliability: "高",
        note: "用于国际大赛样本核对。"
      }
    ],
    rumors: [
      {
        topic: "巴西边锋肌肉负荷",
        teams: ["巴西"],
        confidence: "中",
        status: "待训练公开信息确认",
        impact: "维尼修斯/罗德里戈若临场减量，巴西边路爆破评分下调。"
      },
      {
        topic: "英格兰首发组合争议",
        teams: ["英格兰"],
        confidence: "低",
        status: "舆情监控",
        impact: "不当成内讧事实，只观察是否影响主帅选择和进攻冒险程度。"
      }
    ]
  },
  "esp-ger": {
    history: [
      {
        date: "2024-07-05",
        competition: "UEFA EURO Quarter-final",
        result: "西班牙 2-1 德国，加时",
        type: "国际大赛",
        source: "UEFA",
        url: "https://www.uefa.com/uefaeuro/history/news/028f-1b4c0eace715-d70920033715-1000--spain-2-1-germany-after-extra-time-late-merino-header-sends-/",
        note: "高强度淘汰赛样本，西班牙边中结合和德国后段冲击都有效。"
      },
      {
        date: "2022-11-27",
        competition: "FIFA World Cup Group E",
        result: "西班牙 1-1 德国",
        type: "国际大赛",
        source: "FIFA",
        url: "https://www.fifa.com/en/articles/world-cup-qatar-2022-neuer-the-main-thing-is-were-still-alive-germany-draw-with-spain-goalkeeper",
        note: "西班牙控球领先，德国替补和直接冲击带来扳平。"
      },
      {
        date: "2020-11-17",
        competition: "UEFA Nations League",
        result: "西班牙 6-0 德国",
        type: "国际大赛",
        source: "UEFA",
        url: "https://www.uefa.com/uefanationsleague/",
        note: "样本较旧但说明德国在压迫失序时会被连续打穿。"
      },
      {
        date: "2010-07-07",
        competition: "FIFA World Cup Semi-final",
        result: "德国 0-1 西班牙",
        type: "国际大赛",
        source: "FIFA",
        url: "https://www.fifa.com/en/tournaments/mens/worldcup",
        note: "旧样本权重低，用于展示两队在大赛中长期存在的控球/转换对抗。"
      }
    ],
    sources: [
      ...sharedSources,
      {
        tier: "历史赛果",
        name: "UEFA EURO 2024 match report",
        url: "https://www.uefa.com/uefaeuro/history/news/028f-1b4c0eace715-d70920033715-1000--spain-2-1-germany-after-extra-time-late-merino-header-sends-/",
        reliability: "高",
        note: "用于西班牙与德国最新国际大赛交锋核对。"
      },
      {
        tier: "历史赛果",
        name: "FIFA Qatar 2022 report",
        url: "https://www.fifa.com/en/articles/world-cup-qatar-2022-neuer-the-main-thing-is-were-still-alive-germany-draw-with-spain-goalkeeper",
        reliability: "高",
        note: "用于 2022 世界杯西德 1-1 样本核对。"
      }
    ],
    rumors: [
      {
        topic: "西班牙中场核心负荷",
        teams: ["西班牙"],
        confidence: "中",
        status: "待赛前名单确认",
        impact: "罗德里/佩德里若出场节奏受限，西班牙控场评分下降。"
      },
      {
        topic: "德国中锋与攻击手选择",
        teams: ["德国"],
        confidence: "低",
        status: "媒体讨论，不视作事实",
        impact: "如果临场堆叠攻击手，德国阵容平衡风险升高。"
      }
    ]
  },
  m19: {
    history: [
      {
        date: "1930-07-17",
        competition: "FIFA World Cup Group Stage",
        result: "美国 3-0 巴拉圭",
        type: "国际大赛",
        source: "FIFA / ESPN",
        url: "https://www.fifa.com/de/tournaments/mens/worldcup/articles/wm-1930-usa-debuet-halbfinale",
        note: "美国队世界杯早期经典样本，但年代太久，只作为历史背景，不直接增加当场胜率。"
      },
      {
        date: "2018-03-27",
        competition: "International Friendly",
        result: "美国 1-0 巴拉圭",
        type: "友谊赛",
        source: "U.S. Soccer",
        url: "https://www.ussoccer.com/stories/2018/03/bobby-wood-penalty-kick-lifts-mnt-to-spirited-10-win-vs-paraguay",
        note: "近代友谊赛样本显示美国能通过中场压迫和点球机会赢下低比分比赛。"
      }
    ],
    sources: [
      ...sharedSources,
      {
        tier: "官方赛程",
        name: "FIFA USA fixtures page",
        url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/usa-world-cup-2026-fixtures-stadiums-matches",
        reliability: "高",
        note: "美国首战对巴拉圭、比赛日期和洛杉矶球场信息以 FIFA 页面为准。"
      },
      {
        tier: "赛前预览",
        name: "FIFA USA v Paraguay preview",
        url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/usa-paraguay-preview-live-stream-team-news-tickets",
        reliability: "高",
        note: "用于核对美国 vs 巴拉圭赛前基本信息和历史背景。"
      },
      {
        tier: "历史赛果",
        name: "U.S. Soccer 2018 friendly report",
        url: "https://www.ussoccer.com/stories/2018/03/bobby-wood-penalty-kick-lifts-mnt-to-spirited-10-win-vs-paraguay",
        reliability: "高",
        note: "用于核对美国 1-0 巴拉圭友谊赛样本。"
      }
    ],
    rumors: [
      {
        topic: "美国中轴健康度",
        teams: ["美国"],
        confidence: "中",
        status: "待赛前名单和训练信息确认",
        impact: "普利西奇、亚当斯、麦肯尼若有一人出场受限，美国中前场压迫和转换评分应下调。"
      },
      {
        topic: "巴拉圭反击配置",
        teams: ["巴拉圭"],
        confidence: "低",
        status: "媒体阵容讨论",
        impact: "若恩西索或阿尔米隆不首发，巴拉圭反击纵深和禁区前创造力会下降。"
      }
    ]
  },
  m49: {
    sources: [
      ...sharedSources,
      {
        tier: "赛前新闻",
        name: "Cadena SER - Olise hat-trick",
        url: "https://cadenaser.com/nacional/2026/06/08/olise-avisa-antes-del-mundial-hat-trick-en-el-ultimo-partido-de-preparacion-de-la-seleccion-francesa-cadena-ser/",
        reliability: "中",
        note: "法国 3-1 北爱尔兰友谊赛、奥利塞帽子戏法；属于媒体新闻，非官方伤病公告。"
      },
      {
        tier: "赛前新闻",
        name: "Yahoo Sports - France v Northern Ireland",
        url: "https://uk.sports.yahoo.com/news/michael-olise-treble-inspires-france-210621033.html",
        reliability: "中",
        note: "用于交叉确认奥利塞帽子戏法和法国最后一场热身赛状态。"
      }
    ],
    rumors: [
      {
        topic: "奥利塞首发权重上升",
        teams: ["法国"],
        confidence: "中",
        status: "赛前强信号，但仍需首发名单确认",
        impact: "若奥利塞首发，法国右路内切和禁区前远射权重上调；若替补，更多体现为后手爆点。"
      }
    ]
  }
};

const templateProfiles = {
  阿根廷: baseMatches[0].teams.home,
  法国: withFranceOliseUpdate(baseMatches[0].teams.away),
  巴西: baseMatches[1].teams.home,
  英格兰: baseMatches[1].teams.away,
  西班牙: baseMatches[2].teams.home,
  德国: baseMatches[2].teams.away,
  美国: {
    teamRating: 77,
    keyPlayers: 80,
    availability: 76,
    tactics: 77,
    form: 75,
    chemistry: 78,
    fatigue: 79,
    venueFit: 84,
    stability: 78,
    notes: {
      teamRating: "东道主加成和主场熟悉度明显，但面对南美球队时需要把身体对抗和反击防守纳入额外风险。",
      keyPlayers: "普利西奇、麦肯尼、泰勒亚当斯和安东尼罗宾逊构成美国攻守转换的主要轴线。",
      availability: "赛前必须核实普利西奇和亚当斯健康度；两人任何一个受限，模型都应下调美国中前场强度。",
      tactics: "美国更适合高位压迫后快速打纵向，关键是让普利西奇在左肋部拿到面向球门的球。",
      form: "作为东道主首战，情绪和节奏管理权重较高；若开局过急，反而会给巴拉圭反击空间。",
      chemistry: "核心框架相对熟悉，中场覆盖和边路推进之间的距离需要控制。",
      fatigue: "首战体能不是主要问题，但压力会影响压迫选择。",
      venueFit: "洛杉矶主场环境利好美国，旅行与观众因素都偏正面。",
      stability: "更衣室按稳定处理；风险主要来自首战舆论压力和临场用人争议。"
    },
    core: [
      {
        name: "Christian Pulisic",
        role: "左路/前腰核心",
        status: "需赛前名单核实",
        influence: "美国最重要的一对一、定位球和最后一传来源。",
        tacticalUse: "在左肋部接球后内切，带动边后卫套上或找到中路插上的麦肯尼。",
        risk: "如果被巴拉圭双人包夹且中路接应慢，美国会陷入边路低效传中。"
      },
      {
        name: "Weston McKennie",
        role: "中场冲击 / 二点球",
        status: "需赛前名单核实",
        influence: "决定美国能否把压迫后的二点球转化成禁区威胁。",
        tacticalUse: "在普利西奇吸引防守后前插攻击禁区弱侧。",
        risk: "若位置过高，美国后腰身后会被巴拉圭反击打穿。"
      },
      {
        name: "Tyler Adams",
        role: "后腰 / 压迫保护",
        status: "健康度重点监控",
        influence: "美国防反击的第一保险，影响整队压迫高度。",
        tacticalUse: "在丢球后压住巴拉圭第一脚向前传。",
        risk: "若出场时间受限，美国中场保护会明显下降。"
      }
    ],
    injuries: [
      {
        player: "Tyler Adams",
        status: "赛前健康度监控",
        impact: "不是确认伤病；因为其角色对美国防守转换权重很高，需等赛前名单核实。"
      },
      {
        player: "Christian Pulisic",
        status: "负荷监控",
        impact: "首战若被限制出场时间，美国定位球和最后一传质量会下降。"
      }
    ],
    risks: [
      {
        type: "首战压力",
        level: "中",
        detail: "东道主首战容易前 20 分钟节奏过快，若没进球会放大焦虑。"
      },
      {
        type: "反击防守",
        level: "中",
        detail: "边后卫压上后，巴拉圭会攻击美国边中卫之间的通道。"
      }
    ]
  },
  巴拉圭: {
    teamRating: 74,
    keyPlayers: 76,
    availability: 75,
    tactics: 76,
    form: 73,
    chemistry: 77,
    fatigue: 78,
    venueFit: 70,
    stability: 76,
    notes: {
      teamRating: "巴拉圭整体天赋略低于美国，但南美球队的对抗、节奏破坏和反击效率会抬高下限。",
      keyPlayers: "阿尔米隆、恩西索和古斯塔沃戈麦斯是攻防两端最重要的个人变量。",
      availability: "恩西索、阿尔米隆的首发和身体状态需要赛前核实；如果缺少一个爆点，反击质量会下降。",
      tactics: "更可能压缩中路、让美国在边路处理球，再通过阿尔米隆或恩西索打快速转换。",
      form: "如果能把比赛拖入低比分和高对抗，巴拉圭的爆冷概率会上升。",
      chemistry: "防线与中场距离通常较紧，适合打破坏节奏的比赛。",
      fatigue: "首战体能压力不高，重点是适应洛杉矶场地和比赛节奏。",
      venueFit: "客场环境偏不利，但低位防守对场地依赖相对小。",
      stability: "稳定性按中等偏高处理，主要关注临场首发是否足够平衡。"
    },
    core: [
      {
        name: "Miguel Almirón",
        role: "反击推进 / 右路纵深",
        status: "需赛前名单核实",
        influence: "巴拉圭反击推进速度和第一脚向前的关键。",
        tacticalUse: "在美国边后卫压上后攻击身后空间。",
        risk: "若被迫长期低位防守，他的冲刺次数会被压低。"
      },
      {
        name: "Julio Enciso",
        role: "前场创造 / 远射",
        status: "需赛前名单核实",
        influence: "提供巴拉圭禁区前个人处理球能力。",
        tacticalUse: "接阿尔米隆横传后在弧顶制造远射和直塞。",
        risk: "若身体对抗中拿不住球，巴拉圭会很难形成连续进攻。"
      },
      {
        name: "Gustavo Gómez",
        role: "中卫 / 防线领导",
        status: "预计可用",
        influence: "决定巴拉圭能否承受美国开场压迫和定位球冲击。",
        tacticalUse: "通过强对抗限制美国禁区内抢点。",
        risk: "若过早吃牌，巴拉圭低位防守强度会被迫下降。"
      }
    ],
    injuries: [
      {
        player: "Julio Enciso",
        status: "出场节奏监控",
        impact: "不是确认伤病；只记录爆点球员对反击质量的敏感性。"
      }
    ],
    risks: [
      {
        type: "客场压力",
        level: "中",
        detail: "洛杉矶首战美国主场声量大，巴拉圭需要避免开局被压得过深。"
      },
      {
        type: "进攻人数不足",
        level: "中",
        detail: "如果退守过深，反击时禁区内接应点可能不足。"
      }
    ]
  },
  塞内加尔: {
    teamRating: 78,
    keyPlayers: 79,
    availability: 77,
    tactics: 78,
    form: 76,
    chemistry: 78,
    fatigue: 76,
    venueFit: 73,
    stability: 77,
    notes: genericNotes("塞内加尔", "身体对抗、边路速度和转换冲击"),
    core: [
      {
        name: "Sadio Mané",
        role: "前场领袖 / 左路或中路冲击",
        status: "需赛前名单核实",
        influence: "决定塞内加尔反击的第一威胁和心理层面的稳定。",
        tacticalUse: "在法国边后卫身后寻找转换空间。",
        risk: "若状态不满，塞内加尔前场会缺少稳定终结点。"
      },
      {
        name: "Nicolas Jackson",
        role: "前锋 / 纵深牵制",
        status: "需赛前名单核实",
        influence: "通过跑动拉开法国中卫，为二线插上制造空间。",
        tacticalUse: "压住法国中卫，逼迫法国防线不敢过度前提。",
        risk: "若越位和第一脚处理不稳，反击效率会下降。"
      },
      {
        name: "Kalidou Koulibaly",
        role: "中卫 / 防线组织",
        status: "需赛前名单核实",
        influence: "负责组织低位防线并处理法国边路传中。",
        tacticalUse: "压缩禁区中路，迫使法国更多走外线。",
        risk: "面对奥利塞、姆巴佩连续冲击时横移压力很大。"
      }
    ],
    injuries: [
      {
        player: "前场核心",
        status: "赛前名单核实",
        impact: "塞内加尔反击依赖核心爆点，首发变化会明显影响进攻评分。"
      }
    ],
    risks: [
      {
        type: "边路防守",
        level: "中",
        detail: "法国若同时使用姆巴佩和奥利塞，塞内加尔边后卫会承受持续一对一压力。"
      }
    ]
  }
};

const teamRatingSeeds = {
  法国: 86,
  阿根廷: 84,
  巴西: 84,
  西班牙: 83,
  英格兰: 83,
  德国: 82,
  葡萄牙: 82,
  荷兰: 81,
  比利时: 80,
  乌拉圭: 80,
  克罗地亚: 79,
  哥伦比亚: 79,
  塞内加尔: 78,
  美国: 77,
  日本: 77,
  摩洛哥: 77,
  瑞士: 76,
  厄瓜多尔: 76,
  巴拉圭: 74,
  澳大利亚: 73,
  土耳其: 75
};

function withFranceOliseUpdate(team) {
  const next = structuredClone(team);
  next.keyPlayers = Math.max(next.keyPlayers, 89);
  next.form = Math.max(next.form, 84);
  next.notes = {
    ...next.notes,
    keyPlayers:
      "姆巴佩仍是最大权重球员；奥利塞在 2026-06-08 对北爱尔兰友谊赛上演帽子戏法后，右路内切和禁区前远射权重需要上调。",
    form:
      "法国最后一场热身赛 3-1 击败北爱尔兰，奥利塞帽子戏法是强烈正面信号，但仍需分清友谊赛和世界杯正赛强度。"
  };
  next.core = [
    {
      name: "Michael Olise",
      role: "右路内切 / 禁区前终结",
      status: "热身赛帽子戏法，首发仍需确认",
      influence: "给法国增加右路一对一、远射和二次进攻终结点。",
      tacticalUse: "从右侧内切到弧顶，和姆巴佩形成双侧牵制。",
      risk: "友谊赛表现不能直接等同世界杯强度；若被重点盯防，法国仍需要中路连接。"
    },
    ...next.core.slice(0, 2)
  ];
  next.risks = [
    {
      type: "热身赛信号校准",
      level: "中",
      detail: "奥利塞状态火热，但模型只把它作为 form/key players 上调，不把友谊赛帽子戏法当成必胜证据。"
    },
    ...next.risks
  ];
  return next;
}

function genericNotes(teamName, style = "整体纪律、转换效率和定位球") {
  return {
    teamRating: `${teamName}的整体实力评分来自赛程库默认值；正式上线后应由 Elo/FIFA ranking/球员 rating 自动覆盖。`,
    keyPlayers: `${teamName}的核心球员名单需要由赛前名单、预计首发和俱乐部表现数据同步。`,
    availability: "当前没有写入确认伤停；伤病、停赛和出场概率必须以官方名单和可靠媒体复核。",
    tactics: `${teamName}现阶段按${style}建模；主帅具体阵型和压迫强度需要赛前发布会与近期比赛校准。`,
    form: "近期状态暂按中性处理；友谊赛、预选赛和洲际比赛结果接入后会自动更新。",
    chemistry: "国家队磨合默认中性，正式数据应纳入近 5-10 场首发稳定性。",
    fatigue: "首轮小组赛体能压力较低，后续会随赛程间隔自动变化。",
    venueFit: "场地适配先按中性处理，气候、草皮和旅行距离接入后再调整。",
    stability: "没有确认内讧；舆情只作为低权重风险信号。"
  };
}

function genericTeamProfile(teamName) {
  const rating = teamRatingSeeds[teamName] || 70;
  const squad = confirmedSquads[teamName];
  return {
    teamRating: rating,
    keyPlayers: clamp(rating + 1, 55, 90),
    availability: 74,
    tactics: clamp(rating, 55, 88),
    form: 72,
    chemistry: 73,
    fatigue: 78,
    venueFit: 72,
    stability: 75,
    notes: genericNotes(teamName),
    core: squad?.core?.length ? structuredClone(squad.core) : [],
    injuries: [
      {
        player: "全队伤停",
        status: squad ? "待赛前伤停更新" : "待官方名单同步",
        impact: squad ? "已有大名单；仍需赛前 24 小时确认伤病、替换和出场概率。" : "当前没有该队完整大名单；不会生成具体核心球员判断。"
      }
    ],
    risks: [
      {
        type: squad ? "临场选择" : "信息缺口",
        level: "中",
        detail: squad ? "核心判断基于已入选大名单，但首发还要结合主帅用人和对手强弱实时调整。" : "该队尚未接入完整大名单，页面不会把未知球员写成核心。"
      }
    ]
  };
}

function profileForTeam(teamName) {
  const profile = structuredClone(templateProfiles[teamName] || genericTeamProfile(teamName));
  return applySquadRules(teamName, profile);
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .toLowerCase()
    .trim();
}

function hasPlayerInSquad(teamName, playerName) {
  const squad = confirmedSquads[teamName];
  if (!squad) return false;
  const target = normalizeName(playerName);
  return squad.players.some((name) => normalizeName(name) === target);
}

function applySquadRules(teamName, profile) {
  const squad = confirmedSquads[teamName];
  if (!squad) {
    profile.core = [];
    profile.squadStatus = "大名单待同步";
    profile.squadSource = "等待 FIFA/授权 API";
    profile.squadUrl = finalSquadReference.fifaUrl;
    profile.coach = "主帅信息待同步";
    profile.coachStyle = "大名单未接入前，不生成具体球员核心判断。";
    profile.notes.keyPlayers = `${teamName}大名单待同步；当前只保留球队级评分，不显示具体核心球员。`;
    return profile;
  }

  const templateCore = profile.core || [];
  const validCore = templateCore.filter((player) => hasPlayerInSquad(teamName, player.name));
  const squadCore = structuredClone(squad.core || []).filter((player) => hasPlayerInSquad(teamName, player.name));
  profile.core = squadCore.length ? squadCore : validCore;
  profile.squadStatus = `已接入 ${squad.players.length} 人大名单`;
  profile.squadSource = squad.source;
  profile.squadUrl = squad.url;
  profile.coach = squad.coach;
  profile.coachStyle = squad.style;
  profile.omitted = squad.omitted || [];
  profile.notes.keyPlayers = `${teamName}核心判断只从已入选世界杯大名单中选择；结合主帅用人习惯、赛季表现和对手类型动态调整。`;
  profile.notes.availability = `${teamName}已按最终大名单过滤具体球员；伤病、停赛、替换和首发仍以赛前 24 小时官方/可靠媒体更新为准。`;
  profile.notes.tactics = `${squad.coach}用人习惯：${squad.style} 本场具体方案由对手强弱、压迫高度和首发可用性动态调整。`;
  return profile;
}

function buildScheduledMatch(item) {
  const homeProfile = profileForTeam(item.home);
  const awayProfile = profileForTeam(item.away);
  const hasFrance = item.home === "法国" || item.away === "法国";
  const special = matchEvidence[item.id] || {};
  return {
    id: item.id,
    matchNo: item.matchNo,
    status: item.status || "upcoming",
    asOf: activeAnalysisDate,
    group: `${item.group}组 · 第 ${item.matchNo} 场`,
    kickoff: item.kickoff,
    date: item.date,
    home: item.home,
    away: item.away,
    context: contextForFixture(item, hasFrance),
    tacticalPlan: tacticalPlanForFixture(item, homeProfile, awayProfile),
    venue: {
      stadium: item.stadium,
      city: item.venue.city,
      country: item.venue.country,
      surface: "天然草 / 赛前复核",
      roof: item.venue.roof,
      climate: `${item.venue.city} 比赛环境需在赛前 24 小时同步天气、草皮和训练反馈`,
      tacticalImpact: `${item.stadium} 的场地与旅行因素已纳入场地适配项；正式使用时应由 FIFA 场地和天气数据自动覆盖。`
    },
    teams: {
      home: homeProfile,
      away: awayProfile
    },
    odds: buildOpeningOdds(homeProfile, awayProfile),
    history: special.history || [],
    sources: special.sources || sharedSources,
    rumors: hasFrance
      ? [
          ...(special.rumors || []),
          {
            topic: "法国热身赛状态",
            teams: ["法国"],
            confidence: "中",
            status: "2026-06-08 媒体报道，需赛前首发确认",
            impact: "奥利塞对北爱尔兰帽子戏法上调法国近期状态，但不替代正式伤停和首发信息。"
          }
        ]
      : special.rumors || []
  };
}

function contextForFixture(item, hasFrance) {
  if (item.id === "m19") {
    return "美国作为东道主在洛杉矶迎战巴拉圭。美国优势来自主场、普利西奇的左肋部创造和中场压迫；巴拉圭优势来自南美对抗、低位防守和阿尔米隆/恩西索的转换冲击。";
  }
  if (item.id === "m67") {
    return "英格兰 vs 克罗地亚不是单纯强弱盘。Tuchel 会更重视 Rice 对 Modric/Kovacic 线路的保护，英格兰不能像打低位弱队那样持续压满边后卫。";
  }
  if (item.home === "英格兰" || item.away === "英格兰") {
    return `${item.home} vs ${item.away} 的战术会按对手强度变化：若面对克罗地亚这种控节奏球队，英格兰更重视中场保护；面对加纳/巴拿马则会更主动拉宽边路并增加禁区人数。`;
  }
  if (hasFrance) {
    return `${item.home} vs ${item.away} 是法国小组赛赛前重点。奥利塞在 2026-06-08 对北爱尔兰友谊赛完成帽子戏法，法国近期状态上调，但仍需等首发名单确认他是首发还是后手。`;
  }
  return `${item.home} vs ${item.away} 为 2026 世界杯${item.group}组第 ${item.matchNo} 场。当前使用赛程库和保守球队模板生成赛前预测；接入阵容、伤病、新闻和体彩赔率后会自动替换为更具体情报。`;
}

function tacticalPlanForFixture(item, homeProfile, awayProfile) {
  const home = item.home;
  const away = item.away;
  const isEngland = home === "英格兰" || away === "英格兰";
  const opponent = home === "英格兰" ? away : away === "英格兰" ? home : null;
  if (isEngland && opponent === "克罗地亚") {
    return {
      label: "英格兰强强对话计划",
      summary:
        "对克罗地亚，英格兰应降低无谓压上，Rice 保护中路，Bellingham 负责压迫 Modric/Kovacic 的接球方向；Saka 的任务不只是突破，还要限制 Gvardiol 侧推进。",
      home: home === "英格兰" ? "英格兰需要控制转换风险，Kane 回撤连接，定位球和二点球是主要增益。" : "克罗地亚会尝试拖慢节奏，用 Modric/Kovacic 把英格兰压迫拆开。",
      away: away === "英格兰" ? "英格兰需要控制转换风险，Kane 回撤连接，定位球和二点球是主要增益。" : "克罗地亚会尝试拖慢节奏，用 Modric/Kovacic 把英格兰压迫拆开。"
    };
  }
  if (isEngland && ["加纳", "巴拿马"].includes(opponent)) {
    return {
      label: "英格兰主动进攻计划",
      summary:
        "对小组内相对弱势对手，英格兰可以提高边后卫站位，Saka/Rashford/Gordon 拉宽，Kane 固定中路，Toney 或 Watkins 作为追分和禁区压制方案。",
      home: home === "英格兰" ? "英格兰应更多使用宽度和禁区人数制造连续压制。" : "对手会优先压缩禁区，等待英格兰边后卫身后空间。",
      away: away === "英格兰" ? "英格兰应更多使用宽度和禁区人数制造连续压制。" : "对手会优先压缩禁区，等待英格兰边后卫身后空间。"
    };
  }

  const gap = weightedScore(homeProfile) - weightedScore(awayProfile);
  if (Math.abs(gap) >= 7) {
    const favorite = gap > 0 ? home : away;
    const underdog = gap > 0 ? away : home;
    return {
      label: "强弱对位计划",
      summary: `${favorite}更可能主动控球和压迫，${underdog}更需要低位防守、反击出口和定位球。模型会降低弱队控球权重，提高转换效率和门将表现权重。`,
      home: gap > 0 ? `${home}应避免压上后被反击，重点看边路宽度和禁区人数。` : `${home}应先控制防线距离，减少中路被打穿。`,
      away: gap < 0 ? `${away}应避免压上后被反击，重点看边路宽度和禁区人数。` : `${away}应先控制防线距离，减少中路被打穿。`
    };
  }

  return {
    label: "均势对位计划",
    summary: "两队差距不大时，模型更看重主帅临场选择、首发名单、定位球、替补质量和赛前伤病更新。",
    home: `${home}需要根据对手压迫高度决定是控球推进还是直接打身后。`,
    away: `${away}需要根据对手压迫高度决定是控球推进还是直接打身后。`
  };
}

function buildOpeningOdds(homeProfile, awayProfile) {
  const gap = weightedScore(homeProfile) - weightedScore(awayProfile);
  const home = clamp(2.65 - gap * 0.035, 1.45, 5.8);
  const away = clamp(2.65 + gap * 0.035, 1.45, 5.8);
  const draw = clamp(3.05 + Math.abs(gap) * 0.012, 2.75, 4.1);
  const supportHome = clamp(Math.round(34 + gap * 0.8), 18, 62);
  const supportAway = clamp(Math.round(34 - gap * 0.8), 18, 62);
  return {
    home: Number(home.toFixed(2)),
    draw: Number(draw.toFixed(2)),
    away: Number(away.toFixed(2)),
    support: {
      home: supportHome,
      draw: clamp(100 - supportHome - supportAway, 18, 38),
      away: supportAway
    }
  };
}

function enrichMatch(match) {
  const evidence = matchEvidence[match.id] || {};
  return {
    ...match,
    status: match.status || "upcoming",
    asOf: match.asOf || activeAnalysisDate,
    history: Array.isArray(match.history) ? match.history : evidence.history || [],
    sources: Array.isArray(match.sources) ? match.sources : evidence.sources || sharedSources,
    rumors: Array.isArray(match.rumors) ? match.rumors : evidence.rumors || []
  };
}

function rebuildScheduledMatches() {
  return officialFixtures.map((item) => enrichMatch(buildScheduledMatch(applyFixtureUpdate(item))));
}

function applyFixtureUpdate(item) {
  const update = findFixtureUpdate(item);
  if (!update) return item;
  const next = {
    ...item,
    ...cleanFixtureUpdate(update)
  };
  if (update.venue && typeof update.venue === "object") {
    next.venue = {
      ...item.venue,
      city: update.venue.city || update.venue.location || item.venue.city,
      country: update.venue.country || item.venue.country,
      roof: update.venue.roof || item.venue.roof
    };
  }
  if (update.stadium) {
    next.stadium = update.stadium;
    next.venue = venueDetails[update.stadium] || next.venue || item.venue;
  }
  next.kickoff = update.kickoff || `${next.date} ${next.time}`;
  return next;
}

function findFixtureUpdate(item) {
  return syncedFixtureUpdates.find((update) => {
    if (update.matchNo && Number(update.matchNo) === Number(item.matchNo)) return true;
    if (update.id && String(update.id) === String(item.id)) return true;
    const sameDirection = update.home === item.home && update.away === item.away;
    const reverseDirection = update.home === item.away && update.away === item.home;
    return sameDirection || reverseDirection;
  });
}

function cleanFixtureUpdate(update) {
  const allowed = ["id", "matchNo", "group", "date", "time", "kickoff", "home", "away", "stadium", "status"];
  return allowed.reduce((memo, key) => {
    if (update[key] !== undefined && update[key] !== "") memo[key] = update[key];
    return memo;
  }, {});
}

const enrichedBaseMatches = officialFixtures.map((item) => enrichMatch(buildScheduledMatch(item)));

let matches = structuredClone(enrichedBaseMatches);
let syncedFixtureUpdates = [];
let groupStandings = structuredClone(baseGroupStandings);
let newsItems = [];
let friendlyResults = [];
let selectedId = "m19";
let editingTeam = "home";
let lastDataUpdate = null;
let matchFilter = "upcoming";
let fixtureSearch = "";
let fixtureGroup = "all";
let fixtureDate = "all";
let manualSyncProtected = false;

const teamAliases = {
  美国: ["USA", "United States", "USMNT"],
  巴拉圭: ["Paraguay"],
  法国: ["France"],
  北爱尔兰: ["Northern Ireland"],
  英格兰: ["England"],
  巴西: ["Brazil"],
  阿根廷: ["Argentina"],
  西班牙: ["Spain"],
  德国: ["Germany"],
  日本: ["Japan"],
  韩国: ["South Korea", "Korea"],
  墨西哥: ["Mexico"],
  加拿大: ["Canada"],
  葡萄牙: ["Portugal"],
  荷兰: ["Netherlands"],
  乌拉圭: ["Uruguay"],
  克罗地亚: ["Croatia"]
};

const matchCards = document.querySelector("#matchCards");
const matchMeta = document.querySelector("#matchMeta");
const matchTitle = document.querySelector("#matchTitle");
const matchContext = document.querySelector("#matchContext");
const recommendationText = document.querySelector("#recommendationText");
const venueStrip = document.querySelector("#venueStrip");
const probabilityGrid = document.querySelector("#probabilityGrid");
const reasonList = document.querySelector("#reasonList");
const playerIntel = document.querySelector("#playerIntel");
const riskList = document.querySelector("#riskList");
const historyList = document.querySelector("#historyList");
const sourceList = document.querySelector("#sourceList");
const oddsTable = document.querySelector("#oddsTable");
const marketRead = document.querySelector("#marketRead");
const modelBasis = document.querySelector("#modelBasis");
const factorEditor = document.querySelector("#factorEditor");
const dataStatus = document.querySelector("#dataStatus");
const newsFeed = document.querySelector("#newsFeed");
const syncNowBtn = document.querySelector("#syncNowBtn");
const todayStrip = document.querySelector("#todayStrip");
const filterButtons = document.querySelectorAll(".filter-button");
const matchSearch = document.querySelector("#matchSearch");
const groupFilter = document.querySelector("#groupFilter");
const dateFilter = document.querySelector("#dateFilter");
const matchCount = document.querySelector("#matchCount");

const oddsInputs = {
  home: document.querySelector("#oddsHome"),
  draw: document.querySelector("#oddsDraw"),
  away: document.querySelector("#oddsAway"),
  supportHome: document.querySelector("#supportHome"),
  supportDraw: document.querySelector("#supportDraw"),
  supportAway: document.querySelector("#supportAway")
};

const pathGroup = document.querySelector("#pathGroup");
const pathFinish = document.querySelector("#pathFinish");
const pathResult = document.querySelector("#pathResult");
const thirdSlotSelect = document.querySelector("#thirdSlotSelect");
const groupStandingsPanel = document.querySelector("#groupStandings");
const bracketGraphic = document.querySelector("#bracketGraphic");

function getSelectedMatch() {
  return matches.find((match) => match.id === selectedId) || matches[0];
}

function getVisibleMatches() {
  const query = fixtureSearch.trim().toLowerCase();
  if (matchFilter === "history") {
    return applyFixtureControls(matches.filter((match) => match.history?.length), query);
  }
  const scoped = matchFilter === "all" ? matches : matches.filter((match) => match.status !== "historical");
  return applyFixtureControls(scoped, query);
}

function applyFixtureControls(items, query) {
  return items.filter((match) => {
    const groupOk = fixtureGroup === "all" || match.group?.startsWith(`${fixtureGroup}组`);
    const dateOk = fixtureDate === "all" || match.date === fixtureDate;
    const queryOk = !query || searchableMatchText(match).includes(query);
    return groupOk && dateOk && queryOk;
  });
}

function searchableMatchText(match) {
  const aliasText = [match.home, match.away]
    .flatMap((team) => [team, ...(teamAliases[team] || [])])
    .join(" ");
  return `${match.home} ${match.away} ${aliasText} ${match.group} ${match.kickoff} ${match.venue?.stadium || ""}`.toLowerCase();
}

function populateFixtureFilters() {
  if (groupFilter) {
    groupFilter.innerHTML = [
      `<option value="all">全部小组</option>`,
      ...groupLetters.map((group) => `<option value="${group}">${group}组</option>`)
    ].join("");
    groupFilter.value = fixtureGroup;
  }
  if (dateFilter) {
    const dates = [...new Set(matches.map((match) => match.date).filter(Boolean))].sort();
    dateFilter.innerHTML = [
      `<option value="all">全部日期</option>`,
      ...dates.map((date) => `<option value="${date}">${date}</option>`)
    ].join("");
    dateFilter.value = fixtureDate;
  }
}

function updateMatchCount(visibleMatches, displayedCount = visibleMatches.length) {
  if (!matchCount) return;
  const filters = [];
  if (fixtureSearch.trim()) filters.push(`搜索「${fixtureSearch.trim()}」`);
  if (fixtureGroup !== "all") filters.push(`${fixtureGroup}组`);
  if (fixtureDate !== "all") filters.push(fixtureDate);
  const displayText = displayedCount < visibleMatches.length ? `显示 ${displayedCount} 场，筛选命中 ${visibleMatches.length} 场` : `显示 ${visibleMatches.length} 场`;
  matchCount.textContent = `${displayText} / 共 ${matches.length} 场${filters.length ? ` · ${filters.join(" · ")}` : " · 可搜索选择"}`;
}

function syncFixtureControlValues() {
  if (matchSearch && matchSearch.value !== fixtureSearch) matchSearch.value = fixtureSearch;
  if (groupFilter && groupFilter.value !== fixtureGroup) groupFilter.value = fixtureGroup;
  if (dateFilter && dateFilter.value !== fixtureDate) dateFilter.value = fixtureDate;
}

function selectFixtureFilters({ search = fixtureSearch, group = fixtureGroup, date = fixtureDate } = {}) {
  fixtureSearch = search;
  fixtureGroup = group;
  fixtureDate = date;
  syncFixtureControlValues();
  render();
}

function clearFixtureFilters() {
  fixtureSearch = "";
  fixtureGroup = "all";
  fixtureDate = "all";
  syncFixtureControlValues();
}

function hasActiveFixtureControls() {
  return fixtureSearch.trim() || fixtureGroup !== "all" || fixtureDate !== "all";
}

function upcomingMatchCount() {
  return matches.filter((match) => match.status !== "historical").length;
}

function groupMatchCount() {
  return matches.filter((match) => /^[A-L]组/.test(match.group || "")).length;
}

function currentFixtureLabel(match) {
  if (!match) return "比赛待选";
  return match.group || `第 ${match.matchNo || "?"} 场`;
}

function isRealFixture(match) {
  return Boolean(match?.matchNo);
}

function fixtureModeLabel() {
  if (matchFilter === "history") return "历史样本筛选";
  if (matchFilter === "all") {
    return "全部赛程";
  }
  return "赛前赛程";
}

function ensureSelectedVisible() {
  const visible = getVisibleMatches();
  if (!visible.length) return;
  if (!visible.some((match) => match.id === selectedId)) {
    selectedId = visible[0].id;
  }
}

function formatDateTime(value) {
  if (!value) return "时间待定";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return `北京时间 ${formatDateTimeForZone(date, primaryTimeZone)} / 洛杉矶 ${formatDateTimeForZone(date, venueReferenceTimeZone)}`;
}

function formatDateForZone(value, timeZone) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function formatDateTimeForZone(value, timeZone) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

function teamMatches(sourceTeam, targetTeam) {
  const source = String(sourceTeam || "").toLowerCase();
  const target = String(targetTeam || "").toLowerCase();
  const aliases = [targetTeam, ...(teamAliases[targetTeam] || [])].map((item) => String(item).toLowerCase());
  return aliases.some((alias) => alias && source.includes(alias)) || source.includes(target);
}

function relatedFriendlies(match) {
  return friendlyResults
    .filter((item) => {
      const teams = item.teams || [];
      return (
        teams.includes(match.home) ||
        teams.includes(match.away) ||
        teamMatches(item.home, match.home) ||
        teamMatches(item.away, match.home) ||
        teamMatches(item.home, match.away) ||
        teamMatches(item.away, match.away)
      );
    })
    .slice(0, 8);
}

function friendlyToHistoryItem(item, match) {
  const hasHome = (item.teams || []).includes(match.home) || teamMatches(item.home, match.home) || teamMatches(item.away, match.home);
  const hasAway = (item.teams || []).includes(match.away) || teamMatches(item.home, match.away) || teamMatches(item.away, match.away);
  const subject = hasHome && hasAway ? "双方相关" : hasHome ? match.home : hasAway ? match.away : "相关球队";
  return {
    date: item.date || "日期待定",
    competition: item.competition || "International friendly",
    result: item.result || `${item.home} ${item.homeScore}-${item.awayScore} ${item.away}`,
    type: "赛前友谊赛",
    source: item.source || "自动赛果源",
    url: item.url || "",
    note: `${subject}近期状态样本。友谊赛权重低于世界杯正赛，但会影响 form、轮换和伤病风险判断。`
  };
}

function renderTodayStrip() {
  if (!todayStrip) return;
  const totalHistory = matches.reduce((sum, match) => sum + (match.history?.length || 0), 0);
  const now = new Date();
  const beijingToday = formatDateForZone(now, primaryTimeZone);
  const losAngelesToday = formatDateForZone(now, venueReferenceTimeZone);
  todayStrip.innerHTML = `
    <div>
      <span>今天 / 情报日</span>
      <strong>北京时间 ${beijingToday} · 洛杉矶 ${losAngelesToday}</strong>
    </div>
    <div>
      <span>模式</span>
      <strong>${fixtureModeLabel()} · ${upcomingMatchCount()} 场小组赛可选</strong>
    </div>
    <div>
      <span>赛程库</span>
      <strong>${groupMatchCount()} 场官方赛程快照 · ${friendlyResults.length} 场近期友谊赛</strong>
    </div>
    <div>
      <span>自动更新</span>
      <strong>${lastDataUpdate ? `最近 ${formatDateTime(lastDataUpdate)}` : "每 60 秒读取数据源"}</strong>
    </div>
  `;
}

function weightedScore(team) {
  return Object.entries(factorWeights).reduce((sum, [key, weight]) => {
    return sum + team[key] * weight;
  }, 0);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeProbs(probs) {
  const total = probs.home + probs.draw + probs.away;
  return {
    home: (probs.home / total) * 100,
    draw: (probs.draw / total) * 100,
    away: (probs.away / total) * 100
  };
}

function calculateMarket(odds) {
  const raw = {
    home: 1 / odds.home,
    draw: 1 / odds.draw,
    away: 1 / odds.away
  };
  return normalizeProbs(raw);
}

function calculateRiskVolatility(match) {
  const injuryItems = match.teams.home.injuries.length + match.teams.away.injuries.length;
  const stabilityDrag = (200 - match.teams.home.stability - match.teams.away.stability) / 8;
  return clamp(injuryItems * 1.2 + stabilityDrag, 3, 18);
}

function calculatePrediction(match) {
  const homeScore = weightedScore(match.teams.home);
  const awayScore = weightedScore(match.teams.away);
  const gap = homeScore - awayScore;
  const volatility = calculateRiskVolatility(match);
  const internalDraw = clamp(31 - Math.abs(gap) * 1.2 + volatility * 0.25, 19, 36);
  const remaining = 100 - internalDraw;
  const homeShare = clamp(0.5 + gap / 58, 0.2, 0.8);
  const internal = {
    home: remaining * homeShare,
    draw: internalDraw,
    away: remaining * (1 - homeShare)
  };
  const market = calculateMarket(match.odds);
  const probs = normalizeProbs({
    home: internal.home * (1 - marketBlend) + market.home * marketBlend,
    draw: internal.draw * (1 - marketBlend) + market.draw * marketBlend,
    away: internal.away * (1 - marketBlend) + market.away * marketBlend
  });
  const best = Object.entries(probs).sort((a, b) => b[1] - a[1])[0][0];
  const sorted = Object.values(probs).sort((a, b) => b - a);
  const confidence = clamp(sorted[0] - sorted[1] + 44 - volatility * 0.35, 34, 86);
  return { homeScore, awayScore, internal, market, probs, best, confidence, volatility };
}

function formatPct(value) {
  return `${Math.round(value)}%`;
}

function outcomeLabel(key, match) {
  return {
    home: `${match.home}胜`,
    draw: "平局",
    away: `${match.away}胜`
  }[key];
}

function finishTokenLabel(token) {
  const rank = token.slice(0, 1);
  const group = token.slice(1);
  const names = { 1: "第一", 2: "第二", 3: "第三" };
  return `${group}组${names[rank]}`;
}

function slotRightLabel(slot) {
  if (slot.thirdCandidates) {
    return `成绩较好第三名（${slot.thirdCandidates.join("/")}组）`;
  }
  return finishTokenLabel(slot.right);
}

function slotText(slot) {
  return `${finishTokenLabel(slot.left)} vs ${slotRightLabel(slot)}`;
}

function groupRankLabel(index) {
  return ["第一", "第二", "第三", "第四"][index] || `${index + 1}`;
}

function teamRecordText(team) {
  const goalDiff = team.goalsFor - team.goalsAgainst;
  const signedGoalDiff = goalDiff > 0 ? `+${goalDiff}` : `${goalDiff}`;
  return `${team.played}赛 ${team.win}-${team.draw}-${team.loss} / ${team.goalsFor}:${team.goalsAgainst} / ${signedGoalDiff} / ${team.points}分`;
}

function getGroupTeam(group, finish) {
  const table = groupStandings.find((item) => item.group === group);
  return table?.teams?.[Number(finish) - 1]?.name || `${group}${finish} 待定`;
}

function tokenTeamLabel(token) {
  if (!token) return "待定";
  const finish = token.slice(0, 1);
  const group = token.slice(1);
  return getGroupTeam(group, finish);
}

function slotOpponentLabel(slot, token) {
  if (slot.thirdCandidates) {
    return `成绩较好第三名（${slot.thirdCandidates.join("/")}组）`;
  }
  return slot.left === token ? tokenTeamLabel(slot.right) : tokenTeamLabel(slot.left);
}

function candidateLabel(slot) {
  return slot.thirdCandidates ? `3${slot.thirdCandidates.join("/")}` : slot.right;
}

function selectedPathToken() {
  return `${pathFinish.value || "1"}${pathGroup.value || "A"}`;
}

function renderMatchCards() {
  ensureSelectedVisible();
  const visibleMatches = getVisibleMatches();
  const shouldLimit = !hasActiveFixtureControls() && matchFilter === "upcoming";
  const displayedMatches = shouldLimit ? visibleMatches.slice(0, 18) : visibleMatches;
  updateMatchCount(visibleMatches, displayedMatches.length);
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === matchFilter);
  });
  matchCards.innerHTML = "";
  if (!displayedMatches.length) {
    matchCards.innerHTML = `
      <article class="match-empty">
        <strong>暂无比赛</strong>
        <span>当前筛选下没有可展示的数据。可以清空搜索或改选小组/日期。</span>
      </article>
    `;
    return;
  }
  displayedMatches.forEach((match) => {
    const result = calculatePrediction(match);
    const card = document.createElement("button");
    card.type = "button";
    card.className = `match-card${match.id === selectedId ? " is-active" : ""}`;
    card.setAttribute("aria-pressed", String(match.id === selectedId));
    const modeLine =
      matchFilter === "history"
        ? `历史样本 ${match.history?.length || 0} 场 · 点击查看交锋细节`
        : `${currentFixtureLabel(match)} · ${match.kickoff}`;
    card.innerHTML = `
      <strong>${match.home} vs ${match.away}</strong>
      <span>${modeLine}</span>
      <span>${match.venue.stadium} · ${outcomeLabel(result.best, match)} ${formatPct(result.probs[result.best])}</span>
    `;
    card.addEventListener("click", () => {
      selectedId = match.id;
      render();
    });
    matchCards.appendChild(card);
  });
  if (shouldLimit && visibleMatches.length > displayedMatches.length) {
    const hint = document.createElement("article");
    hint.className = "match-empty";
    hint.innerHTML = `
      <strong>还有 ${visibleMatches.length - displayedMatches.length} 场</strong>
      <span>输入球队名，或用小组/日期筛选来选择后面的比赛。</span>
    `;
    matchCards.appendChild(hint);
  }
}

function renderVenue(match) {
  venueStrip.innerHTML = `
    <div>
      <span>比赛场地</span>
      <strong>${match.venue.stadium}</strong>
    </div>
    <div>
      <span>城市</span>
      <strong>${match.venue.city} · ${match.venue.country}</strong>
    </div>
    <div>
      <span>草皮 / 场馆</span>
      <strong>${match.venue.surface} · ${match.venue.roof}</strong>
    </div>
    <p>${match.venue.climate}。${match.venue.tacticalImpact}</p>
  `;
}

function renderProbability(match, prediction) {
  probabilityGrid.innerHTML = "";
  [
    ["home", outcomeLabel("home", match)],
    ["draw", "平局"],
    ["away", outcomeLabel("away", match)]
  ].forEach(([key, label], index) => {
    const value = prediction.probs[key];
    const card = document.createElement("div");
    card.className = `probability-card${key === prediction.best ? " is-best" : ""}`;
    card.innerHTML = `
      <span>0${index + 1} / ${label}</span>
      <strong>${formatPct(value)}</strong>
      <div class="bar" aria-hidden="true"><i style="width:${value}%"></i></div>
      <small>内部模型 ${formatPct(prediction.internal[key])} · 市场先验 ${formatPct(prediction.market[key])}</small>
    `;
    probabilityGrid.appendChild(card);
  });
}

function renderReasons(match, prediction) {
  reasonList.innerHTML = "";
  Object.keys(factorLabels).forEach((key, index) => {
    const homeValue = match.teams.home[key];
    const awayValue = match.teams.away[key];
    const diff = homeValue - awayValue;
    const leader = Math.abs(diff) < 3 ? "接近均势" : diff > 0 ? `${match.home}占优` : `${match.away}占优`;
    const contribution = Math.abs(diff * factorWeights[key]).toFixed(1);
    const item = document.createElement("article");
    item.className = "reason-item";
    item.innerHTML = `
      <strong>${String(index + 1).padStart(2, "0")}<br>${factorLabels[key]}</strong>
      <div>
        <p><b>${leader}</b>。${match.home}：${match.teams.home.notes[key]}</p>
        <p>${match.away}：${match.teams.away.notes[key]}</p>
        <small>评分 ${match.home} ${homeValue} / ${match.away} ${awayValue}，权重 ${Math.round(factorWeights[key] * 100)}%，本项差值贡献约 ${contribution} 分。</small>
      </div>
    `;
    reasonList.appendChild(item);
  });

  const summary = document.createElement("article");
  summary.className = "reason-item";
  summary.innerHTML = `
    <strong>10<br>综合结论</strong>
    <div>
      <p>模型先用球队与球员评分、首发可用性、战术对位和近期状态生成内部概率，再用体彩奖金隐含概率作为 ${Math.round(marketBlend * 100)}% 的市场先验校准。风险波动值为 ${prediction.volatility.toFixed(1)}，因此信心分控制在 ${Math.round(prediction.confidence)}。</p>
      <p><b>${match.tacticalPlan?.label || "本场战术计划"}：</b>${match.tacticalPlan?.summary || "等待战术数据同步。"}</p>
      <small>综合评分：${match.home} ${prediction.homeScore.toFixed(1)}，${match.away} ${prediction.awayScore.toFixed(1)}。临场首发、伤病确认、赔率大幅变动时应重新计算。</small>
    </div>
  `;
  reasonList.appendChild(summary);
}

function renderPlayerIntel(match) {
  playerIntel.innerHTML = "";
  [
    ["home", match.home],
    ["away", match.away]
  ].forEach(([side, name]) => {
    const team = match.teams[side];
    const planText = match.tacticalPlan?.[side] || team.coachStyle || "等待本场战术计划同步。";
    const omittedText = team.omitted?.length ? `<p class="squad-omissions"><b>未入选提醒：</b>${team.omitted.join("、")} 不再作为核心变量。</p>` : "";
    const coreMarkup = team.core?.length
      ? team.core
          .map(
            (player) => `
              <div class="player-card">
                <div>
                  <strong>${player.name}</strong>
                  <span>${player.role} · ${player.status}</span>
                </div>
                <p>${player.influence}</p>
                <p><b>战术仰仗：</b>${player.tacticalUse}</p>
                <small>${player.risk}</small>
              </div>
            `
          )
          .join("")
      : `
        <div class="player-card">
          <div>
            <strong>大名单待同步</strong>
            <span>不生成具体核心球员</span>
          </div>
          <p>该队尚未接入确认大名单；页面只做球队级判断，避免把未入选或未知球员写成核心。</p>
          <small>接入 FIFA 官方名单或授权 API 后自动刷新。</small>
        </div>
      `;
    const section = document.createElement("article");
    section.className = "intel-team";
    section.innerHTML = `
      <h4>${name}</h4>
      <div class="squad-card">
        <span>${team.squadStatus || "大名单状态待同步"}</span>
        <strong>${team.coach || "主帅待同步"}</strong>
        <p>${team.coachStyle || "主帅用人习惯待同步。"}</p>
        <p><b>本场计划：</b>${planText}</p>
        ${team.squadUrl ? `<a href="${team.squadUrl}" target="_blank" rel="noreferrer">${team.squadSource || "查看大名单来源"}</a>` : ""}
        ${omittedText}
      </div>
      ${coreMarkup}
    `;
    playerIntel.appendChild(section);
  });
}

function renderRisks(match) {
  riskList.innerHTML = "";
  [
    ["home", match.home],
    ["away", match.away]
  ].forEach(([side, name]) => {
    const team = match.teams[side];
    const section = document.createElement("article");
    section.className = "risk-team";
    section.innerHTML = `
      <h4>${name}</h4>
      <div class="risk-block">
        <strong>伤病 / 出场状态</strong>
        ${team.injuries
          .map(
            (item) => `
              <p><b>${item.player}</b> · ${item.status}<br><span>${item.impact}</span></p>
            `
          )
          .join("")}
      </div>
      <div class="risk-block">
        <strong>潜在风险</strong>
        ${team.risks
          .map(
            (item) => `
              <p><b>${item.type}</b> · ${item.level}<br><span>${item.detail}</span></p>
            `
          )
          .join("")}
      </div>
    `;
    riskList.appendChild(section);
  });
}

function renderHistory(match) {
  if (!historyList) return;
  const history = [...relatedFriendlies(match).map((item) => friendlyToHistoryItem(item, match)), ...(match.history || [])];
  if (!history.length) {
    historyList.innerHTML = `
      <article class="history-empty">
        <strong>暂无历史样本</strong>
        <p>接入历史赛果 API 后，这里会显示友谊赛、世界杯、洲际杯赛和 Nations League 等过往比赛。</p>
      </article>
    `;
    return;
  }
  historyList.innerHTML = history
    .map(
      (item) => `
        <article class="history-item">
          <div>
            <span>${item.date}</span>
            <b>${item.type}</b>
          </div>
          <strong>${item.result}</strong>
          <p>${item.competition} · ${item.note}</p>
          <small>${item.source || "来源待补"}${item.url ? ` · <a href="${item.url}" target="_blank" rel="noreferrer">查看来源</a>` : " · 待人工核对来源链接"}</small>
        </article>
      `
    )
    .join("");
}

function renderSources(match) {
  if (!sourceList) return;
  const sourceRows = match.sources || [];
  const rumorRows = match.rumors || [];
  const sourceMarkup = sourceRows.length
    ? sourceRows
        .map(
          (item) => `
            <article class="source-item">
              <div>
                <span>${item.tier}</span>
                <b>可信度 ${item.reliability}</b>
              </div>
              <strong>${item.name}</strong>
              <p>${item.note}</p>
              ${item.url ? `<a href="${item.url}" target="_blank" rel="noreferrer">打开来源</a>` : "<small>来源由自动同步或人工审核后台补充</small>"}
            </article>
          `
        )
        .join("")
    : `
      <article class="source-item">
        <strong>等待来源</strong>
        <p>正式接入后会显示官方赛程、球队新闻、数据 API、伤病源和赔率源。</p>
      </article>
    `;

  const rumorMarkup = rumorRows.length
    ? rumorRows
        .map(
          (item) => `
            <article class="rumor-item">
              <div>
                <span>传闻监控</span>
                <b>可信度 ${item.confidence}</b>
              </div>
              <strong>${item.topic}</strong>
              <p>${(item.teams || []).join("、") || "关联球队待识别"} · ${item.status}</p>
              <small>${item.impact}</small>
            </article>
          `
        )
        .join("")
    : `
      <article class="rumor-item">
        <strong>暂无传闻信号</strong>
        <p>传闻不会被当成事实，只用于提示需要复核的风险。</p>
      </article>
    `;

  sourceList.innerHTML = `
    <div class="source-group">
      <h4>可靠来源</h4>
      ${sourceMarkup}
    </div>
    <div class="source-group">
      <h4>传闻与风险信号</h4>
      ${rumorMarkup}
    </div>
  `;
}

function renderOdds(match, prediction) {
  oddsTable.innerHTML = "";
  [
    ["home", outcomeLabel("home", match), match.odds.home, match.odds.support.home],
    ["draw", "平局", match.odds.draw, match.odds.support.draw],
    ["away", outcomeLabel("away", match), match.odds.away, match.odds.support.away]
  ].forEach(([key, label, odds, support], index) => {
    const row = document.createElement("div");
    row.className = "odds-row";
    row.innerHTML = `
      <strong>${String(index + 1).padStart(2, "0")}</strong>
      <span>${label}<br>奖金 ${Number(odds).toFixed(2)} · 隐含概率 ${formatPct(prediction.market[key])}</span>
      <small>支持率 ${support}% · 模型 ${formatPct(prediction.probs[key])}</small>
    `;
    oddsTable.appendChild(row);
  });

  const bestMarket = Object.entries(prediction.market).sort((a, b) => b[1] - a[1])[0][0];
  const modelEdge = prediction.probs[prediction.best] - prediction.market[prediction.best];
  const crowd = Object.entries(match.odds.support).sort((a, b) => b[1] - a[1])[0][0];
  marketRead.innerHTML = `
    <strong>市场解读：</strong>
    体彩奖金隐含概率更偏向「${outcomeLabel(bestMarket, match)}」，支持率最高的是「${outcomeLabel(crowd, match)}」。
    模型建议「${outcomeLabel(prediction.best, match)}」，与市场先验差值约 ${modelEdge.toFixed(1)} 个百分点。
    ${Math.abs(modelEdge) >= 5 ? "模型与市场存在明显分歧，应重点复核首发、伤停和临场战术。" : "模型与市场差异不大，判断应更重视临场首发和风险项。"}
  `;
}

function renderModelBasis() {
  modelBasis.innerHTML = `
    <p>权重参考了足球预测研究里反复出现的三个方向：球队 rating 与球员 rating、特征工程 / 多模型预测、以及工作负荷和伤病风险。页面没有把论文当成“必中公式”，而是把它们转成可手动调节的输入项。</p>
    <div class="weight-list">
      ${Object.entries(factorWeights)
        .map(
          ([key, value]) => `
            <span>${factorLabels[key]} ${Math.round(value * 100)}%</span>
          `
        )
        .join("")}
    </div>
    <p class="notice">赔率只作为市场先验，不直接覆盖模型判断；伤病和内讧类信息必须赛前人工核实，避免把传闻误写成确定事实。</p>
  `;
}

function renderNewsFeed() {
  if (!newsFeed) return;
  const friendlyItems = friendlyResults.slice(0, 12).map((item) => ({
    id: `friendly-feed-${item.id}`,
    title: `赛前友谊赛：${item.result || `${item.home} ${item.homeScore}-${item.awayScore} ${item.away}`}`,
    summary: `${item.date || "日期待定"} ${item.competition || "International friendly"}。该结果会进入相关球队近期状态参考，友谊赛不直接等同世界杯正赛强度。`,
    source: item.source || "自动赛果源",
    url: item.url || "",
    publishedAt: `${item.date || activeAnalysisDate}T12:00:00.000Z`,
    teams: item.teams || [],
    confidence: "赛果自动同步"
  }));
  const items = [...newsItems, ...friendlyItems]
    .slice()
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, 8);

  if (!items.length) {
    newsFeed.innerHTML = `
      <article class="news-empty">
        <strong>等待自动情报</strong>
        <p>配置新闻 RSS、体育数据 API 或后台审核流后，这里会自动显示球员状态、伤病、首发、主帅发布会和球队新闻。</p>
      </article>
    `;
    return;
  }

  newsFeed.innerHTML = items
    .map(
      (item) => `
        <article class="news-item">
          <div>
            <strong>${item.title || "未命名情报"}</strong>
            <span>${item.source || "Unknown"} · ${item.publishedAt || "时间待定"}</span>
          </div>
          <p>${item.summary || ""}</p>
          <small>${item.teams?.length ? `关联球队：${item.teams.join("、")}` : "关联球队待识别"} · 可信度 ${item.confidence || "待评估"}</small>
          ${item.url ? `<a href="${item.url}" target="_blank" rel="noreferrer">查看来源</a>` : ""}
        </article>
      `
    )
    .join("");
}

function renderEditor(match) {
  factorEditor.innerHTML = "";
  const template = document.querySelector("#factorTemplate");
  Object.keys(factorLabels).forEach((key) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const label = node.querySelector("span");
    const input = node.querySelector("input");
    const output = node.querySelector("output");
    label.textContent = factorLabels[key];
    input.value = match.teams[editingTeam][key];
    output.value = input.value;
    input.addEventListener("input", () => {
      match.teams[editingTeam][key] = Number(input.value);
      output.value = input.value;
      render(false);
    });
    factorEditor.appendChild(node);
  });

  oddsInputs.home.value = match.odds.home;
  oddsInputs.draw.value = match.odds.draw;
  oddsInputs.away.value = match.odds.away;
  oddsInputs.supportHome.value = match.odds.support.home;
  oddsInputs.supportDraw.value = match.odds.support.draw;
  oddsInputs.supportAway.value = match.odds.support.away;
}

function applyOdds() {
  const match = getSelectedMatch();
  match.odds.home = Number(oddsInputs.home.value) || match.odds.home;
  match.odds.draw = Number(oddsInputs.draw.value) || match.odds.draw;
  match.odds.away = Number(oddsInputs.away.value) || match.odds.away;
  match.odds.support.home = clamp(Number(oddsInputs.supportHome.value) || 0, 0, 100);
  match.odds.support.draw = clamp(Number(oddsInputs.supportDraw.value) || 0, 0, 100);
  match.odds.support.away = clamp(Number(oddsInputs.supportAway.value) || 0, 0, 100);
  render();
}

function exportReport() {
  const match = getSelectedMatch();
  const prediction = calculatePrediction(match);
  const lines = [
    `# ${match.home} vs ${match.away}`,
    "",
    `比赛：${match.group}，${match.kickoff}`,
    `场地：${match.venue.stadium}，${match.venue.city}，${match.venue.country}`,
    `建议：${outcomeLabel(prediction.best, match)}，模型概率 ${formatPct(prediction.probs[prediction.best])}，信心 ${Math.round(prediction.confidence)}分`,
    "",
    "## 模型概率",
    `${match.home}胜 ${formatPct(prediction.probs.home)}；平局 ${formatPct(prediction.probs.draw)}；${match.away}胜 ${formatPct(prediction.probs.away)}`,
    "",
    "## 体彩赔率视角",
    `主胜 ${match.odds.home.toFixed(2)} / 平 ${match.odds.draw.toFixed(2)} / 客胜 ${match.odds.away.toFixed(2)}`,
    `隐含概率：主胜 ${formatPct(prediction.market.home)}；平 ${formatPct(prediction.market.draw)}；客胜 ${formatPct(prediction.market.away)}`,
    "",
    "## 详细理由"
  ];

  Object.keys(factorLabels).forEach((key) => {
    lines.push(`- ${factorLabels[key]}：${match.home} ${match.teams.home[key]}，${match.away} ${match.teams.away[key]}。${match.teams.home.notes[key]} ${match.teams.away.notes[key]}`);
  });

  lines.push("", "## 核心球员与风险");
  ["home", "away"].forEach((side) => {
    const teamName = side === "home" ? match.home : match.away;
    lines.push(`### ${teamName}`);
    match.teams[side].core.forEach((player) => {
      lines.push(`- ${player.name}：${player.role}。${player.influence} 战术仰仗：${player.tacticalUse} 风险：${player.risk}`);
    });
    match.teams[side].injuries.forEach((item) => {
      lines.push(`- 伤病/状态：${item.player}，${item.status}，${item.impact}`);
    });
    match.teams[side].risks.forEach((item) => {
      lines.push(`- 风险：${item.type}，${item.level}，${item.detail}`);
    });
  });

  lines.push("", "## 历史交锋");
  (match.history || []).forEach((item) => {
    lines.push(`- ${item.date}，${item.competition}，${item.result}。${item.type}。${item.note}${item.url ? ` 来源：${item.url}` : ""}`);
  });

  lines.push("", "## 来源与传闻");
  (match.sources || []).forEach((item) => {
    lines.push(`- 来源：${item.tier} / ${item.name}，可信度 ${item.reliability}。${item.note}${item.url ? ` ${item.url}` : ""}`);
  });
  (match.rumors || []).forEach((item) => {
    lines.push(`- 传闻监控：${item.topic}，可信度 ${item.confidence}，状态：${item.status}。影响：${item.impact}`);
  });

  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${match.home}-vs-${match.away}-预测报告.md`;
  link.click();
  URL.revokeObjectURL(url);
}

function render(updateEditor = true) {
  ensureSelectedVisible();
  const match = getSelectedMatch();
  const prediction = calculatePrediction(match);
  renderTodayStrip();
  matchMeta.textContent = `${match.group} · ${activeAnalysisLabel} · 开赛 ${match.kickoff}`;
  matchTitle.textContent = `${match.home} vs ${match.away}`;
  matchContext.textContent = match.context;
  recommendationText.textContent = outcomeLabel(prediction.best, match);
  renderMatchCards();
  renderVenue(match);
  renderProbability(match, prediction);
  renderReasons(match, prediction);
  renderPlayerIntel(match);
  renderRisks(match);
  renderHistory(match);
  renderSources(match);
  renderOdds(match, prediction);
  renderModelBasis();
  if (updateEditor) {
    renderEditor(match);
  }
}

function populateSimulatorControls() {
  if (!pathGroup || !thirdSlotSelect) return;
  pathGroup.innerHTML = groupLetters.map((group) => `<option value="${group}">${group}组</option>`).join("");
  thirdSlotSelect.innerHTML = knockoutSlots
    .filter((slot) => slot.thirdCandidates)
    .map((slot) => `<option value="${slot.id}">${slot.left} vs 3${slot.thirdCandidates.join("/")}</option>`)
    .join("");
}

function renderPathSimulator() {
  if (!pathGroup || !pathFinish || !pathResult || !thirdSlotSelect) return;
  const group = pathGroup.value || "A";
  const finish = pathFinish.value || "1";
  const token = `${finish}${group}`;
  const selectedThirdSlot = knockoutSlots.find((item) => item.id === thirdSlotSelect.value) || knockoutSlots.find((item) => item.thirdCandidates);
  let slots = [];

  if (finish === "3") {
    slots = knockoutSlots.filter((slot) => slot.thirdCandidates?.includes(group));
  } else {
    slots = knockoutSlots.filter((slot) => slot.left === token || slot.right === token);
  }

  const activeSlot = finish === "3" && selectedThirdSlot?.thirdCandidates.includes(group) ? selectedThirdSlot : slots[0];
  const opponent = activeSlot
    ? finish === "3"
      ? tokenTeamLabel(activeSlot.left)
      : slotOpponentLabel(activeSlot, token)
    : "待定";

  pathResult.innerHTML = `
    <strong>${group}组${finish === "1" ? "第一" : finish === "2" ? "第二" : "第三"}：${getGroupTeam(group, finish)}</strong>
    <p>${finish === "3" ? `该队若成为 8 个最佳第三名之一，可被放入 ${slots.map((slot) => slot.id.toUpperCase()).join(" / ")} 等候选槽位。当前手动槽位：${selectedThirdSlot.id.toUpperCase()}。` : "小组第一/第二使用固定槽位，路径会直接在 32 强图中高亮。"}</p>
    <div class="path-summary">
      <span>当前对手</span>
      <b>${opponent}</b>
      <small>${activeSlot ? `${activeSlot.id.toUpperCase()} · ${finish === "3" ? `${finishTokenLabel(activeSlot.left)} vs ${group}组第三` : slotText(activeSlot)}` : "暂无可用槽位"}</small>
    </div>
  `;
  renderBracketGraphic();
}

function renderGroupStandings() {
  if (!groupStandingsPanel) return;
  groupStandingsPanel.innerHTML = groupStandings
    .map(
      (table) => `
        <article class="group-table">
          <div class="group-table__head">
            <strong>${table.group}组</strong>
            <span>Pts</span>
          </div>
          ${table.teams
            .map(
              (team, index) => `
                <div class="standing-row${index < 2 ? " is-direct" : index === 2 ? " is-third" : ""}" data-group="${table.group}" data-finish="${index + 1}">
                  <span>${index + 1}</span>
                  <b>${team.name}</b>
                  <small>${teamRecordText(team)}</small>
                </div>
              `
            )
            .join("")}
        </article>
      `
    )
    .join("");
}

function renderBracketGraphic() {
  if (!bracketGraphic || !pathGroup || !pathFinish || !thirdSlotSelect) return;
  const token = selectedPathToken();
  const selectedThirdSlot = knockoutSlots.find((item) => item.id === thirdSlotSelect.value);
  const selectedGroup = pathGroup.value || "A";
  const selectedFinish = pathFinish.value || "1";

  const renderSlot = (slot) => {
    const isThirdPath = selectedFinish === "3" && slot.id === selectedThirdSlot?.id && slot.thirdCandidates?.includes(selectedGroup);
    const isRegularPath = selectedFinish !== "3" && (slot.left === token || slot.right === token);
    const rightLabel = slot.thirdCandidates
      ? isThirdPath
        ? `${selectedGroup}组第三`
        : `3${slot.thirdCandidates.join("/")}`
      : tokenTeamLabel(slot.right);
    const leftLabel = tokenTeamLabel(slot.left);
    return `
      <div class="bracket-pair${isThirdPath || isRegularPath ? " is-active" : ""}">
        <span>${slot.left}</span>
        <strong>${leftLabel}</strong>
        <i></i>
        <span>${slot.thirdCandidates ? candidateLabel(slot) : slot.right}</span>
        <strong>${rightLabel}</strong>
      </div>
    `;
  };

  const leftSlots = knockoutSlots.slice(0, 8);
  const rightSlots = knockoutSlots.slice(8);
  bracketGraphic.innerHTML = `
    <div class="bracket-side">
      <h4>Left Half</h4>
      <div class="bracket-round">${leftSlots.map(renderSlot).join("")}</div>
    </div>
    <div class="bracket-center">
      <span>Round of 32</span>
      <strong>16 → 8 → 4 → 2 → Champion</strong>
      <p>点击小组排名或调整上方选项，相关 32 强入口会高亮。</p>
    </div>
    <div class="bracket-side">
      <h4>Right Half</h4>
      <div class="bracket-round">${rightSlots.map(renderSlot).join("")}</div>
    </div>
  `;
}

function normalizeIncomingData(payload) {
  if (!payload || typeof payload !== "object") return null;
  return {
    matches: Array.isArray(payload.matches) ? payload.matches : null,
    fixtureUpdates: Array.isArray(payload.fixtureUpdates)
      ? payload.fixtureUpdates
      : Array.isArray(payload.fixtures)
        ? payload.fixtures
        : null,
    groupStandings: Array.isArray(payload.groupStandings) ? payload.groupStandings : null,
    news: Array.isArray(payload.news) ? payload.news : null,
    friendlies: Array.isArray(payload.friendlies) ? payload.friendlies : null,
    squads: payload.squads && typeof payload.squads === "object" ? payload.squads : null,
    sync: payload.sync && typeof payload.sync === "object" ? payload.sync : null,
    runtime: payload.runtime && typeof payload.runtime === "object" ? payload.runtime : null,
    analysisDate: payload.analysisDate || payload.asOf || null,
    analysisLabel: payload.analysisLabel || null,
    updatedAt: payload.updatedAt || payload.sync?.updatedAt || null
  };
}

function applyIncomingData(payload) {
  const data = normalizeIncomingData(payload);
  if (!data) return false;
  if (data.analysisDate) {
    activeAnalysisDate = data.analysisDate;
    activeAnalysisLabel = data.analysisLabel || `北京时间 ${data.analysisDate} 赛前情报日`;
  }
  if (data.fixtureUpdates?.length) {
    syncedFixtureUpdates = data.fixtureUpdates;
  }
  if (data.squads || data.fixtureUpdates?.length) {
    confirmedSquads = { ...confirmedSquads, ...data.squads };
    matches = rebuildScheduledMatches();
  }
  if (data.matches?.length) {
    matches = data.matches.map(enrichMatch);
    if (!matches.some((match) => match.id === selectedId)) {
      selectedId = matches[0].id;
    }
  }
  if (data.groupStandings?.length && hasResolvedStandings(data.groupStandings)) {
    groupStandings = data.groupStandings;
  }
  populateFixtureFilters();
  if (data.news) {
    newsItems = data.news;
  }
  if (data.friendlies) {
    friendlyResults = data.friendlies;
  }
  manualSyncProtected = Boolean(data.runtime?.manualSyncProtected || data.sync?.manualSyncProtected);
  lastDataUpdate = data.updatedAt || new Date().toISOString();
  render();
  renderGroupStandings();
  renderPathSimulator();
  renderNewsFeed();
  updateDataStatus(data.sync?.mode ? `已同步 ${data.sync.mode}` : "已同步", lastDataUpdate, data.sync);
  updateSyncButton();
  return true;
}

function hasResolvedStandings(tables) {
  return tables.some((table) => table.teams?.some((team) => team.name && !team.name.includes("待定")));
}

function updateDataStatus(state, timestamp, sync = null) {
  if (!dataStatus) return;
  const timeText = timestamp
    ? String(timestamp).replace("T", " ").replace(".000Z", " UTC")
    : "使用本地示例数据";
  const errorText = sync?.errors?.length ? ` · ${sync.errors.length} 个源需复核` : "";
  dataStatus.textContent = `${state} · ${timeText}${errorText}`;
}

function updateSyncButton() {
  if (!syncNowBtn) return;
  if (manualSyncProtected) {
    syncNowBtn.disabled = true;
    syncNowBtn.textContent = "自动同步中";
    syncNowBtn.title = "公网环境已保护手动同步接口；后台仍会定时自动同步。";
    return;
  }
  syncNowBtn.disabled = false;
  syncNowBtn.textContent = "立即同步";
  syncNowBtn.title = "立即从后端数据源同步一次";
}

async function refreshRemoteData() {
  for (const url of syncConfig.urls) {
    try {
      const response = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (applyIncomingData(payload)) return;
    } catch (error) {
      // Try the next data source.
    }
  }
  updateDataStatus("本地示例数据", lastDataUpdate);
}

async function triggerSyncNow() {
  if (!syncNowBtn || manualSyncProtected) return;
  syncNowBtn.disabled = true;
  syncNowBtn.textContent = "同步中";
  try {
    const response = await fetch("/api/sync", { method: "POST" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    applyIncomingData(payload.data || payload);
  } catch (error) {
    updateDataStatus("后端未启用", lastDataUpdate);
  } finally {
    updateSyncButton();
  }
}

function renderBracketList() {
  if (!bracketGraphic) return;
  bracketGraphic.innerHTML = knockoutSlots
    .map(
      (slot) => `
        <div>
          <span>${slot.id.toUpperCase()} · ${slot.date}</span>
          <strong>${slotText(slot)}</strong>
          <small>${slot.venue}</small>
        </div>
      `
    )
    .join("");
}

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    editingTeam = button.dataset.team;
    document.querySelectorAll(".segment").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderEditor(getSelectedMatch());
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    matchFilter = button.dataset.filter || "upcoming";
    render();
  });
});

matchSearch?.addEventListener("input", () => {
  fixtureSearch = matchSearch.value;
  render();
});

groupFilter?.addEventListener("change", () => {
  fixtureGroup = groupFilter.value || "all";
  render();
});

dateFilter?.addEventListener("change", () => {
  fixtureDate = dateFilter.value || "all";
  render();
});

document.querySelector("#applyOddsBtn").addEventListener("click", applyOdds);
document.querySelector("#exportBtn").addEventListener("click", exportReport);
document.querySelector("#resetBtn").addEventListener("click", () => {
  matches = structuredClone(enrichedBaseMatches);
  groupStandings = structuredClone(baseGroupStandings);
  selectedId = "m19";
  editingTeam = "home";
  matchFilter = "upcoming";
  clearFixtureFilters();
  activeAnalysisDate = defaultAnalysisDate;
  activeAnalysisLabel = `北京时间 ${defaultAnalysisDate} 赛前情报日`;
  populateFixtureFilters();
  document.querySelectorAll(".segment").forEach((item) => item.classList.remove("is-active"));
  document.querySelector("#homeSegment").classList.add("is-active");
  render();
  renderGroupStandings();
  renderPathSimulator();
  renderNewsFeed();
  updateDataStatus("已恢复示例数据", null);
});

[pathGroup, pathFinish].filter(Boolean).forEach((control) => control.addEventListener("change", renderPathSimulator));
thirdSlotSelect?.addEventListener("change", renderPathSimulator);
syncNowBtn?.addEventListener("click", triggerSyncNow);

populateFixtureFilters();
populateSimulatorControls();
renderGroupStandings();
renderPathSimulator();
renderNewsFeed();
updateDataStatus("本地示例数据", null);
updateSyncButton();
render();
refreshRemoteData();
setInterval(refreshRemoteData, syncConfig.intervalMs);
