const BASE_STORAGE_KEY = "private-english-coach-v1";
const REVIEW_DAYS = [0, 1, 3, 7, 14, 30];
const PROFILE_ID = getProfileId();
const STORAGE_KEY = `${BASE_STORAGE_KEY}:${PROFILE_ID}`;

const els = {
  profileLabel: document.querySelector("#profileLabel"),
  todayLabel: document.querySelector("#todayLabel"),
  dueCount: document.querySelector("#dueCount"),
  streakCount: document.querySelector("#streakCount"),
  dailyQuote: document.querySelector("#dailyQuote"),
  newQuote: document.querySelector("#newQuote"),
  toast: document.querySelector("#toast"),
  dueBanner: document.querySelector("#dueBanner"),
  dueBannerTitle: document.querySelector("#dueBannerTitle"),
  dueBannerText: document.querySelector("#dueBannerText"),
  reviewHint: document.querySelector("#reviewHint"),
  wordForm: document.querySelector("#wordForm"),
  bulkInput: document.querySelector("#bulkInput"),
  bulkAdd: document.querySelector("#bulkAdd"),
  termInput: document.querySelector("#termInput"),
  meaningInput: document.querySelector("#meaningInput"),
  contextInput: document.querySelector("#contextInput"),
  synonymsInput: document.querySelector("#synonymsInput"),
  levelInput: document.querySelector("#levelInput"),
  wordList: document.querySelector("#wordList"),
  startQuiz: document.querySelector("#startQuiz"),
  openDueQuiz: document.querySelector("#openDueQuiz"),
  bannerQuiz: document.querySelector("#bannerQuiz"),
  taskList: document.querySelector("#taskList"),
  taskProgress: document.querySelector("#taskProgress"),
  writingInput: document.querySelector("#writingInput"),
  speechInput: document.querySelector("#speechInput"),
  analyzeWriting: document.querySelector("#analyzeWriting"),
  analyzeSpeech: document.querySelector("#analyzeSpeech"),
  micButton: document.querySelector("#micButton"),
  feedbackBox: document.querySelector("#feedbackBox"),
  saveCorrection: document.querySelector("#saveCorrection"),
  mistakeList: document.querySelector("#mistakeList"),
  clearMistakes: document.querySelector("#clearMistakes"),
  quizDialog: document.querySelector("#quizDialog"),
  quizTitle: document.querySelector("#quizTitle"),
  quizBody: document.querySelector("#quizBody"),
  showAnswer: document.querySelector("#showAnswer"),
  markHard: document.querySelector("#markHard"),
  markKnown: document.querySelector("#markKnown"),
  importSample: document.querySelector("#importSample"),
  exportData: document.querySelector("#exportData"),
  importData: document.querySelector("#importData"),
  backupFile: document.querySelector("#backupFile"),
  clearDone: document.querySelector("#clearDone"),
  saveStatus: document.querySelector("#saveStatus"),
  friendNameInput: document.querySelector("#friendNameInput"),
  generateFriendLink: document.querySelector("#generateFriendLink"),
  friendLinkOutput: document.querySelector("#friendLinkOutput"),
  filters: document.querySelectorAll(".filter"),
};

let state = loadState();
let activeFilter = "all";
let quizQueue = [];
let currentQuiz = null;
let hideMastered = false;
let lastFeedback = "";

const ENCOURAGEMENTS = [
  "Small steps still count.",
  "You are building fluency one sentence at a time.",
  "Accuracy first, elegance next.",
  "Your future self will thank you for today's review.",
  "A sharp mind is made by repeated returns.",
  "Speak before you feel ready. That is how readiness grows.",
  "One useful sentence is better than ten passive words.",
  "Every mistake is a receipt for progress.",
  "Keep going. Your English is getting more precise.",
  "Today's effort becomes tomorrow's instinct.",
  "You do not need perfect English. You need usable English.",
  "The goal is not to remember once. The goal is to retrieve often.",
];

const EASTER_EGGS = {
  "keep going": "Keep going. Quiet consistency is a serious superpower.",
  "level up": "Level up unlocked: use one new word in a real sentence today.",
  "sharp mind": "Sharp mind mode: explain one idea with fewer, stronger words.",
  "i can do this": "Yes, you can. Now prove it with one clean sentence.",
};

function getProfileId() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return slugify(params.get("profile") || "me");
}

function getProfileName() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return params.get("name") || (PROFILE_ID === "me" ? "我的英语训练" : PROFILE_ID);
}

function slugify(value) {
  return String(value || "me")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "me";
}

const LEXICON = {
  forge: {
    meaning: "建立、打造、形成",
    synonyms: ["build", "establish", "form", "create"],
    pos: "verb",
    family: "forged / forging / forges",
    context: "The company is trying to forge a closer partnership with regulators before launching its new AI product.",
  },
  splintered: {
    meaning: "分裂的、碎裂的",
    synonyms: ["fragmented", "divided", "fractured"],
    pos: "adjective / past participle",
    family: "splinter / splinters / splintering",
    context: "The debate over AI safety has become increasingly splintered, with researchers, companies, and governments pushing different priorities.",
  },
  initiative: {
    meaning: "倡议、主动性、计划",
    synonyms: ["proposal", "campaign", "program", "drive"],
    pos: "noun",
    family: "initiatives / initiate / initial",
    context: "The new initiative aims to make advanced AI tools more accessible to small businesses.",
  },
  "co-chair": {
    meaning: "联合主席、共同主持",
    synonyms: ["joint chair", "co-lead"],
    pos: "noun / verb",
    family: "co-chaired / co-chairing",
    context: "She will co-chair the committee responsible for reviewing the company's AI governance practices.",
  },
  profound: {
    meaning: "深远的、深刻的",
    synonyms: ["deep", "far-reaching", "significant"],
    pos: "adjective",
    family: "profoundly / profundity",
    context: "Generative AI could have a profound impact on how people search for information online.",
  },
  inaugural: {
    meaning: "首次的、就职的、开幕的",
    synonyms: ["first", "opening", "initial"],
    pos: "adjective",
    family: "inaugurate / inauguration",
    context: "The company used its inaugural developer conference to announce a new suite of AI tools.",
  },
  democratic: {
    meaning: "民主的",
    synonyms: ["representative", "participatory"],
    pos: "adjective",
    family: "democracy / democratically",
    context: "The platform says its goal is to make access to AI more democratic, though critics question whether that promise is realistic.",
  },
  govern: {
    meaning: "治理、管理、支配",
    synonyms: ["regulate", "rule", "manage", "oversee"],
    pos: "verb",
    family: "governs / governed / governing / governance",
    context: "Governments are still trying to decide how to govern powerful AI systems without slowing down innovation.",
  },
  "miles apart": {
    meaning: "相差很远、分歧很大",
    synonyms: ["far apart", "deeply divided", "worlds apart"],
    pos: "idiom",
    family: "be miles apart on something",
    context: "The two companies remain miles apart on data-sharing rules, making a quick agreement unlikely.",
  },
  transcend: {
    meaning: "超越、突破限制",
    synonyms: ["go beyond", "surpass", "rise above"],
    pos: "verb",
    family: "transcends / transcended / transcending / transcendence",
    context: "The product's appeal may transcend the tech industry if it solves a problem ordinary users actually face.",
  },
  sovereignty: {
    meaning: "主权、自主权",
    synonyms: ["autonomy", "self-rule", "independence"],
    pos: "noun",
    family: "sovereign / sovereignly",
    context: "Data sovereignty has become a central concern as countries debate where sensitive AI training data should be stored.",
  },
};

const FALLBACK_SYNONYMS = {
  noun: ["concept", "factor", "practice", "issue"],
  adjective: ["notable", "significant", "marked", "distinct"],
  adverb: ["notably", "markedly", "substantially"],
  verb: ["shape", "drive", "influence", "support"],
  phrase: ["related expression", "near equivalent", "context-specific synonym"],
  word: ["near synonym待精修", "formal alternative待精修"],
};

function todayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseISO(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(iso, days) {
  const date = parseISO(iso);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function daysBetween(a, b) {
  return Math.round((parseISO(b) - parseISO(a)) / 86400000);
}

function loadState() {
  const fallback = { words: [], tasks: {}, mistakes: [], streak: { count: 0, lastActive: "" }, unlockedEggs: [], updatedAt: "" };
  try {
    const profileState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (profileState) return { ...fallback, ...profileState };
    if (PROFILE_ID === "me") return { ...fallback, ...(JSON.parse(localStorage.getItem(BASE_STORAGE_KEY)) || {}) };
    return fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderSaveStatus();
}

function renderSaveStatus() {
  if (!els.saveStatus) return;
  if (!state.updatedAt) {
    els.saveStatus.textContent = "已启用本机自动保存";
    return;
  }
  const savedAt = new Date(state.updatedAt);
  els.saveStatus.textContent = `已保存到本机：${savedAt.toLocaleString("zh-CN", { hour12: false })}`;
}

function dueStage(word) {
  const age = daysBetween(word.createdAt, todayISO());
  const stage = REVIEW_DAYS.find((day) => day === age);
  if (stage !== undefined && !word.reviews?.includes(stage)) return `D${stage}`;
  if (word.nextDue && word.nextDue <= todayISO()) return "Due";
  return null;
}

function nextDueDate(word, known) {
  const reviewed = new Set(word.reviews || []);
  if (known) {
    const currentAge = daysBetween(word.createdAt, todayISO());
    reviewed.add(currentAge);
  }
  const next = REVIEW_DAYS.find((day) => !reviewed.has(day) && addDays(word.createdAt, day) > todayISO());
  return next === undefined ? null : addDays(word.createdAt, next);
}

function render() {
  const today = todayISO();
  els.todayLabel.textContent = today;
  els.profileLabel.textContent = `当前空间：${getProfileName()}`;
  els.streakCount.textContent = String(state.streak?.count || 0);
  renderDailyQuote();
  renderSaveStatus();

  const visibleWords = state.words.filter((word) => {
    if (hideMastered && word.mastered) return false;
    if (activeFilter === "due") return Boolean(dueStage(word));
    if (activeFilter === "mastered") return word.mastered;
    return true;
  });

  const dueWords = state.words.filter((word) => Boolean(dueStage(word)) && !word.mastered);
  els.dueCount.textContent = String(dueWords.length);
  renderDueBanner(dueWords);
  renderTasks();
  renderMistakes();
  els.reviewHint.textContent = dueWords.length
    ? `今天该复习 ${dueWords.length} 个表达。优先做主动回忆，再看答案。`
    : "今天没有到期复习。你可以录入新词，或主动做一次随机抽查。";

  els.wordList.innerHTML = "";
  if (!visibleWords.length) {
    els.wordList.innerHTML = `<p class="muted">还没有符合条件的词。把今天备忘录里的生词贴进来，复习系统就开始运转。</p>`;
    return;
  }

  visibleWords.forEach((word) => {
    const stage = dueStage(word);
    const card = document.createElement("article");
    card.className = "word-card";
    card.innerHTML = `
      <header>
        <h3>${escapeHTML(word.term)}</h3>
        <span class="tag">${escapeHTML(word.level)}</span>
      </header>
      <div class="tag-row">
        <span class="tag ${stage ? "due" : ""}">${stage || `Next ${word.nextDue || "done"}`}</span>
        <span class="tag">${word.mastered ? "mastered" : `${word.correct || 0} correct`}</span>
      </div>
      <p><strong>中文：</strong>${escapeHTML(word.meaning)}</p>
      <p><strong>词性/词形：</strong>${escapeHTML(word.pos || "待补充")} · ${escapeHTML(word.family || "待补充")}</p>
      <p><strong>同义词：</strong>${escapeHTML((word.synonyms || []).join(", ") || "待补充")}</p>
      <p><strong>语境：</strong>${escapeHTML(word.context || "暂无语境")}</p>
      <div class="card-actions">
        <button type="button" data-action="review" data-id="${word.id}">测我</button>
        <button type="button" data-action="master" data-id="${word.id}">${word.mastered ? "取消掌握" : "标记掌握"}</button>
        <button class="danger-btn" type="button" data-action="delete" data-id="${word.id}">删除</button>
      </div>
    `;
    els.wordList.appendChild(card);
  });
}

function renderDueBanner(dueWords) {
  if (!dueWords.length) {
    els.dueBanner.classList.remove("active");
    els.dueBannerTitle.textContent = "今天没有到期测验";
    els.dueBannerText.textContent = "录入词汇后，我会按记忆曲线提醒你。";
    return;
  }
  const stages = dueWords.reduce((acc, word) => {
    const stage = dueStage(word);
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});
  const stageText = Object.entries(stages).map(([stage, count]) => `${stage} ${count}个`).join(" · ");
  els.dueBanner.classList.add("active");
  els.dueBannerTitle.textContent = `今天该测 ${dueWords.length} 个表达`;
  els.dueBannerText.textContent = `${stageText}。先做输入测试，再做输出复用。`;
}

function renderTasks() {
  const key = todayISO();
  const todayTasks = state.tasks?.[key] || {};
  const boxes = els.taskList.querySelectorAll("input[type='checkbox']");
  let done = 0;
  boxes.forEach((box) => {
    box.checked = Boolean(todayTasks[box.dataset.task]);
    if (box.checked) done += 1;
  });
  const percent = Math.round((done / boxes.length) * 100);
  els.taskProgress.style.width = `${percent}%`;
  if (done === boxes.length && boxes.length > 0) {
    els.taskProgress.classList.add("complete");
  } else {
    els.taskProgress.classList.remove("complete");
  }
}

function renderMistakes() {
  const mistakes = state.mistakes || [];
  els.mistakeList.innerHTML = "";
  if (!mistakes.length) {
    els.mistakeList.innerHTML = `<p class="muted">错题本还空着。把写作或口语稿检查后，可以把反馈加入这里。</p>`;
    return;
  }
  mistakes.forEach((item) => {
    const card = document.createElement("article");
    card.className = "mistake-card";
    card.innerHTML = `
      <span>${escapeHTML(item.date)}</span>
      <p>${escapeHTML(item.text)}</p>
    `;
    els.mistakeList.appendChild(card);
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function inferWord(term) {
  const key = term.toLowerCase();
  const known = LEXICON[key];
  if (known) return known;
  const words = key.split(/\s+/);
  const pos = words.length > 1 ? "phrase" : guessPOS(key);
  return {
    meaning: "",
    synonyms: guessSynonyms(pos),
    pos,
    family: guessFamily(key, pos),
    context: guessContext(term, pos),
  };
}

function guessPOS(term) {
  if (term.endsWith("tion") || term.endsWith("ity") || term.endsWith("ness")) return "noun";
  if (term.endsWith("ive") || term.endsWith("al") || term.endsWith("ous")) return "adjective";
  if (term.endsWith("ly")) return "adverb";
  if (term.endsWith("ed") || term.endsWith("ing")) return "verb form / adjective";
  return "word";
}

function guessSynonyms(pos) {
  if (pos.includes("noun")) return FALLBACK_SYNONYMS.noun;
  if (pos.includes("adjective")) return FALLBACK_SYNONYMS.adjective;
  if (pos.includes("adverb")) return FALLBACK_SYNONYMS.adverb;
  if (pos.includes("verb")) return FALLBACK_SYNONYMS.verb;
  if (pos.includes("phrase")) return FALLBACK_SYNONYMS.phrase;
  return FALLBACK_SYNONYMS.word;
}

function guessFamily(term, pos) {
  if (pos === "noun") return `${term} / plural: ${term.endsWith("y") ? `${term.slice(0, -1)}ies` : `${term}s`}`;
  if (pos.includes("adjective")) return `${term} / adverb form may be -ly`;
  if (pos.includes("verb")) return `${term} / -ed / -ing forms depend on usage`;
  return "word family待补充";
}

function guessContext(term, pos) {
  const clean = term.trim();
  if (pos.includes("noun")) return `The report treats ${clean} as a key factor in the company's long-term AI strategy.`;
  if (pos.includes("adjective")) return `The decision reflects a ${clean} shift in how the industry thinks about AI governance.`;
  if (pos.includes("adverb")) return `The market has changed ${clean}, forcing companies to rethink their product strategy.`;
  if (pos.includes("verb")) return `The new policy could ${clean} how companies build and deploy AI systems.`;
  if (pos.includes("phrase")) return `Analysts used the phrase "${clean}" to describe a growing tension in the technology sector.`;
  return `The article uses "${clean}" in a technology or business context that is worth reviewing carefully.`;
}

function createWord(term, meaning, context, level, synonyms = "", pos = "", family = "") {
  const inferred = inferWord(term.trim());
  const createdAt = todayISO();
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    term: term.trim(),
    meaning: meaning.trim() || inferred.meaning || "待补充中文释义",
    context: context.trim() || inferred.context || guessContext(term.trim(), inferred.pos),
    synonyms: Array.isArray(synonyms)
      ? synonyms
      : String(synonyms || inferred.synonyms.join(",")).split(/[,，;/]/).map((item) => item.trim()).filter(Boolean),
    pos: pos || inferred.pos,
    family: family || inferred.family,
    level,
    createdAt,
    nextDue: createdAt,
    reviews: [],
    correct: 0,
    hard: 0,
    mastered: false,
  };
}

function openQuiz(words, type = "mixed") {
  quizQueue = words.filter((word) => !word.mastered);
  if (!quizQueue.length) {
    quizQueue = state.words.filter((word) => !word.mastered).slice(0, 10);
  }
  if (!quizQueue.length) return;
  nextQuiz(type);
  els.quizDialog.showModal();
}

function nextQuiz(type = "mixed") {
  currentQuiz = quizQueue.shift();
  if (!currentQuiz) {
    els.quizTitle.textContent = "今天完成";
    els.quizBody.innerHTML = `<p class="quiz-question">复习结束。把最不熟的 2 个表达拿去造句，再发给我批改。</p>`;
    return;
  }

  const stage = dueStage(currentQuiz) || "Random";
  const mode = pickMode(currentQuiz, type);
  els.quizTitle.textContent = `${stage} · ${mode.title}`;
  els.quizBody.innerHTML = `
    <p class="quiz-question">${mode.question}</p>
    <p class="muted">${mode.instruction}</p>
    <div class="answer" id="answerBox">
      <strong>参考：</strong>${escapeHTML(currentQuiz.meaning)}<br />
      <strong>语境：</strong>${escapeHTML(currentQuiz.context || "请自己补一个商务/科技语境例句。")}
    </div>
  `;
}

function pickMode(word, type = "mixed") {
  const inputModes = [
    {
      title: "中译英",
      question: `把“${escapeHTML(word.meaning)}”说成自然英文。`,
      instruction: "要求说出完整表达，并补一个英文例句。",
    },
    {
      title: "语境复用",
      question: `用 ${escapeHTML(word.term)} 写一句和科技/商业新闻有关的句子。`,
      instruction: "注意搭配、语气和主谓结构。别只翻译中文。",
    },
    {
      title: "同义替换",
      question: `给 ${escapeHTML(word.term)} 找一个近义表达，并说明语气差别。`,
      instruction: "如果想不出，就先描述它通常出现在哪类场景。",
    },
    {
      title: "词形转换",
      question: `说出 ${escapeHTML(word.term)} 的词性或常见词形变化。`,
      instruction: "重点不是背标签，而是知道它能在句子里怎么用。",
    },
  ];
  const outputModes = [
    {
      title: "输出造句",
      question: `用 ${escapeHTML(word.term)} 写一句 C1 水平的观点句。`,
      instruction: "句子要有明确主语、判断或因果，不要只写定义。",
    },
    {
      title: "口头复述",
      question: `用 ${escapeHTML(word.term)} 做一个15秒英文复述。`,
      instruction: "说出背景、变化和你的判断。可以先写关键词再开口。",
    },
    {
      title: "完形填空",
      question: blankTerm(word),
      instruction: "先凭记忆补全，再解释为什么这里用这个表达。",
    },
  ];
  const modes = type === "input" ? inputModes : type === "output" ? outputModes : [...inputModes, ...outputModes];
  return modes[Math.floor(Math.random() * modes.length)];
}

function blankTerm(word) {
  if (!word.context) return `The company is facing renewed ______. 目标表达：${escapeHTML(word.meaning)}`;
  const pattern = new RegExp(word.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  if (pattern.test(word.context)) return escapeHTML(word.context.replace(pattern, "______"));
  return `${escapeHTML(word.context)}\n\n请把目标表达 ${escapeHTML(word.term)} 自然嵌入这句话。`;
}

function markCurrent(known) {
  if (!currentQuiz) return;
  const word = state.words.find((item) => item.id === currentQuiz.id);
  if (!word) return;
  const age = daysBetween(word.createdAt, todayISO());
  word.reviews = Array.from(new Set([...(word.reviews || []), age].filter((day) => REVIEW_DAYS.includes(day))));
  if (known) {
    word.correct = (word.correct || 0) + 1;
    if (word.correct >= 5 || word.reviews.includes(30)) word.mastered = true;
    word.nextDue = nextDueDate(word, true);
    showToast(randomFrom([
      "Clean retrieval. That one is getting stronger.",
      "Nice. Active recall is doing its work.",
      "Good answer. Now try using it in your own sentence.",
    ]));
  } else {
    word.hard = (word.hard || 0) + 1;
    word.nextDue = addDays(todayISO(), 1);
    showToast("Marked for tomorrow. Hard cards are where the growth is.");
  }
  touchStreak();
  saveState();
  render();
  nextQuiz();
}

function renderDailyQuote() {
  const index = Math.abs(hashString(`${todayISO()}-${PROFILE_ID}`)) % ENCOURAGEMENTS.length;
  els.dailyQuote.textContent = ENCOURAGEMENTS[index];
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
}

function showToast(message) {
  if (!els.toast) return;
  els.toast.textContent = message;
  els.toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    els.toast.classList.remove("visible");
  }, 3200);
}

function touchStreak() {
  const today = todayISO();
  const lastActive = state.streak?.lastActive || "";
  if (lastActive === today) return;
  const yesterday = addDays(today, -1);
  const nextCount = lastActive === yesterday ? (state.streak?.count || 0) + 1 : 1;
  state.streak = { count: nextCount, lastActive: today };
  els.streakCount.textContent = String(nextCount);
  if (nextCount > 1) {
    showToast(`${nextCount}-day streak. Keep the chain alive.`);
  }
}

function checkEasterEgg(text) {
  const lower = text.toLowerCase();
  const matched = Object.keys(EASTER_EGGS).find((key) => lower.includes(key));
  if (!matched) return;
  state.unlockedEggs = state.unlockedEggs || [];
  if (!state.unlockedEggs.includes(matched)) {
    state.unlockedEggs.push(matched);
    saveState();
  }
  showToast(EASTER_EGGS[matched]);
}

function parseBulkWords(text) {
  const cleaned = text
    .replace(/\r/g, "\n")
    .replace(/[•●·]/g, "\n")
    .replace(/\s{2,}/g, "\n");

  let items = cleaned
    .split(/\n|,|，|;|；/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/^[-*•\d.、\s]+/, "").trim())
    .filter(Boolean);

  if (items.length === 1 && !LEXICON[items[0].toLowerCase()] && items[0].split(/\s+/).length > 1) {
    items = items[0].split(/\s+/).filter(Boolean);
  }

  const merged = [];
  for (let index = 0; index < items.length; index += 1) {
    const pair = `${items[index]} ${items[index + 1] || ""}`.trim().toLowerCase();
    if (LEXICON[pair]) {
      merged.push(pair);
      index += 1;
    } else {
      merged.push(items[index]);
    }
  }
  return merged;
}

function analyzeText(text, mode) {
  const clean = text.trim();
  if (!clean) return ["先输入一段英文，我再给你反馈。"];
  const feedback = [];
  const sentences = clean.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean);
  if (sentences.length < 3 && mode === "writing") feedback.push("写作任务建议至少 3 句：背景一句、观点一句、原因或例子一句。");
  if (/\b(very|good|bad|thing|stuff|a lot)\b/i.test(clean)) feedback.push("有一些偏泛的词，可以升级：very -> highly/markedly, good -> effective/compelling, thing/stuff -> factor/issue/practice。");
  if (!/\b(however|therefore|while|although|because|as a result|in contrast|given that)\b/i.test(clean)) feedback.push("可以加入连接关系词，让逻辑更明显，比如 however, therefore, given that, in contrast。");
  if (/\bI think\b/i.test(clean)) feedback.push("I think 可以升级为 I would argue that / It seems plausible that / The key issue is that。");
  if (sentences.some((sentence) => sentence.split(/\s+/).length > 32)) feedback.push("有句子偏长，建议拆成两句，避免从句堆叠导致主线变弱。");
  if (!/\b(the|a|an)\b/i.test(clean) && clean.split(/\s+/).length > 12) feedback.push("注意冠词风险：抽象概念可零冠词，但具体单数名词通常需要 a/the。");
  if (mode === "speech") feedback.push("口语复述建议用三段：The story is about... / The tension is... / My view is...");
  if (!feedback.length) feedback.push("整体表达比较干净。下一步可以强化语气精度：把普通判断改成更有力度的 claim, tension, implication。");
  return feedback;
}

function showFeedback(title, text, mode) {
  const items = analyzeText(text, mode);
  lastFeedback = `${title}\n原文：${text}\n建议：\n${items.map((item) => `- ${item}`).join("\n")}`;
  els.feedbackBox.innerHTML = `
    <strong>${escapeHTML(title)}</strong>
    <ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
    <p class="muted">把这段英文发给我，我可以继续做逐句精修、替换高级表达，并给你下一轮输出题。</p>
  `;
}

els.wordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.words.unshift(createWord(
    els.termInput.value,
    els.meaningInput.value,
    els.contextInput.value,
    els.levelInput.value,
    els.synonymsInput.value,
  ));
  touchStreak();
  saveState();
  els.wordForm.reset();
  els.levelInput.value = "C1";
  render();
});

els.bulkAdd.addEventListener("click", () => {
  const terms = parseBulkWords(els.bulkInput.value);
  if (!terms.length) return;
  checkEasterEgg(els.bulkInput.value);
  const existing = new Set(state.words.map((word) => word.term.toLowerCase()));
  terms.forEach((term) => {
    if (!existing.has(term.toLowerCase())) state.words.unshift(createWord(term, "", "", "C1"));
  });
  els.bulkInput.value = "";
  touchStreak();
  saveState();
  render();
  showToast(`${terms.length} cards added. Today's stack is ready.`);
});

els.wordList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const word = state.words.find((item) => item.id === button.dataset.id);
  if (!word) return;
  if (button.dataset.action === "review") openQuiz([word]);
  if (button.dataset.action === "master") {
    word.mastered = !word.mastered;
    if (word.mastered) showToast("Mastered card marked. Your deck just got lighter.");
    saveState();
    render();
  }
  if (button.dataset.action === "delete") {
    state.words = state.words.filter((item) => item.id !== word.id);
    saveState();
    render();
    showToast("Card deleted.");
  }
});

els.filters.forEach((button) => {
  button.addEventListener("click", () => {
    els.filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    render();
  });
});

els.startQuiz.addEventListener("click", () => {
  const due = state.words.filter((word) => Boolean(dueStage(word)) && !word.mastered);
  openQuiz(due);
});

els.openDueQuiz.addEventListener("click", () => {
  const due = state.words.filter((word) => Boolean(dueStage(word)) && !word.mastered);
  openQuiz(due, "mixed");
});

els.bannerQuiz.addEventListener("click", () => {
  const due = state.words.filter((word) => Boolean(dueStage(word)) && !word.mastered);
  openQuiz(due, "mixed");
});

els.taskList.addEventListener("change", (event) => {
  const box = event.target.closest("input[type='checkbox']");
  if (!box) return;
  const key = todayISO();
  state.tasks[key] = state.tasks[key] || {};
  state.tasks[key][box.dataset.task] = box.checked;
  touchStreak();
  saveState();
  renderTasks();
  const done = Array.from(els.taskList.querySelectorAll("input[type='checkbox']")).filter((item) => item.checked).length;
  const total = els.taskList.querySelectorAll("input[type='checkbox']").length;
  if (done === total) showToast("Daily mission complete. You showed up.");
});

els.showAnswer.addEventListener("click", () => {
  document.querySelector("#answerBox")?.classList.toggle("visible");
});

els.markKnown.addEventListener("click", () => markCurrent(true));
els.markHard.addEventListener("click", () => markCurrent(false));

els.importSample.addEventListener("click", () => {
  const samples = [
    ["regulatory scrutiny", "监管审查", "The acquisition is likely to face heightened regulatory scrutiny.", "C1"],
    ["a material shift", "重大变化", "The policy marks a material shift in how AI systems are governed.", "C1"],
    ["to walk back a claim", "收回/淡化某个说法", "The company later walked back its claim after public criticism.", "C1"],
  ];
  const existing = new Set(state.words.map((word) => word.term.toLowerCase()));
  samples.forEach(([term, meaning, context, level]) => {
    if (!existing.has(term.toLowerCase())) state.words.unshift(createWord(term, meaning, context, level));
  });
  saveState();
  render();
  showToast("Sample cards loaded. Try one quick review.");
});

els.analyzeWriting.addEventListener("click", () => {
  checkEasterEgg(els.writingInput.value);
  touchStreak();
  saveState();
  showFeedback("写作反馈", els.writingInput.value, "writing");
});

els.analyzeSpeech.addEventListener("click", () => {
  checkEasterEgg(els.speechInput.value);
  touchStreak();
  saveState();
  showFeedback("口语复述反馈", els.speechInput.value, "speech");
});

els.saveCorrection.addEventListener("click", () => {
  if (!lastFeedback) return;
  state.mistakes = state.mistakes || [];
  state.mistakes.unshift({ date: todayISO(), text: lastFeedback });
  saveState();
  renderMistakes();
  showToast("Saved to mistake notebook. That is how errors become assets.");
});

els.clearMistakes.addEventListener("click", () => {
  state.mistakes = [];
  saveState();
  renderMistakes();
  showToast("Mistake notebook cleared. Fresh page, sharper eye.");
});

els.micButton.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    els.speechInput.value += "\n[当前浏览器不支持语音识别，请手动输入或使用 Chrome/Safari 支持版本。]";
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = false;
  els.micButton.textContent = "聆听中";
  recognition.onresult = (event) => {
    const text = Array.from(event.results).map((result) => result[0].transcript).join(" ");
    els.speechInput.value = text;
  };
  recognition.onend = () => {
    els.micButton.textContent = "麦克风";
  };
  recognition.start();
  showToast("Speak clearly, then listen back like a coach.");
});

function createBackupPayload() {
  return {
    app: "private-english-coach",
    version: 1,
    profile: PROFILE_ID,
    profileName: getProfileName(),
    exportedAt: new Date().toISOString(),
    state,
  };
}

function downloadBackup(text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `english-coach-${PROFILE_ID}-${todayISO()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

els.exportData.addEventListener("click", async () => {
  const text = JSON.stringify(createBackupPayload(), null, 2);
  downloadBackup(text);
  try {
    await navigator.clipboard.writeText(text);
    els.exportData.textContent = "已下载";
    showToast("Backup downloaded and copied. Future you is protected.");
    setTimeout(() => { els.exportData.textContent = "下载备份"; }, 1200);
  } catch {
    showToast("Backup downloaded.");
  }
});

els.importData.addEventListener("click", () => {
  els.backupFile.click();
});

els.backupFile.addEventListener("change", async () => {
  const file = els.backupFile.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const importedState = parsed.state || parsed;
    if (!importedState || !Array.isArray(importedState.words)) {
      throw new Error("Invalid backup file");
    }
    state = {
      words: importedState.words || [],
      tasks: importedState.tasks || {},
      mistakes: importedState.mistakes || [],
      streak: importedState.streak || { count: 0, lastActive: "" },
      unlockedEggs: importedState.unlockedEggs || [],
      updatedAt: importedState.updatedAt || "",
    };
    saveState();
    render();
    showToast("Backup imported. Your words are back.");
  } catch {
    showToast("Import failed. Please choose a valid English Coach backup.");
  } finally {
    els.backupFile.value = "";
  }
});

els.clearDone.addEventListener("click", () => {
  hideMastered = !hideMastered;
  els.clearDone.textContent = hideMastered ? "显示已掌握" : "隐藏已掌握";
  render();
});

els.newQuote.addEventListener("click", () => {
  const current = els.dailyQuote.textContent;
  let next = randomFrom(ENCOURAGEMENTS);
  if (ENCOURAGEMENTS.length > 1) {
    while (next === current) next = randomFrom(ENCOURAGEMENTS);
  }
  els.dailyQuote.textContent = next;
  showToast("A new line for today's momentum.");
});

els.generateFriendLink.addEventListener("click", async () => {
  const name = els.friendNameInput.value.trim();
  if (!name) {
    els.friendLinkOutput.value = "先输入朋友名字。";
    return;
  }
  const url = new URL(window.location.href);
  url.hash = new URLSearchParams({ profile: slugify(name), name }).toString();
  els.friendLinkOutput.value = url.toString();
  try {
    await navigator.clipboard.writeText(url.toString());
    els.generateFriendLink.textContent = "已复制";
    setTimeout(() => { els.generateFriendLink.textContent = "生成链接"; }, 1200);
  } catch {
    els.generateFriendLink.textContent = "生成链接";
  }
});

render();
