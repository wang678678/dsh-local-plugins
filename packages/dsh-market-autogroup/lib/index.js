import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const name = "dsh-market-autogroup";

const GROUP_ORDER = [
  "界面与外观", "浏览器与抓取", "文档与 OCR", "知识库与检索",
  "智能体与技能", "会话与导入", "效率与任务", "创作与工具",
  "通讯与集成", "移动与远程", "上下文与性能", "插件市场与管理",
  "用量与计费", "娱乐与桌宠", "其他"
];

// 先按精确包名归类，避免通用正则误判
const EXACT = {
  "dsh-market-autogroup": "插件市场与管理",
  "dsh-sidebar-fold": "界面与外观",
  "dsh-sidebar-compact": "界面与外观",
  "dsh-workspace-flow": "界面与外观",
  "@michengai/dsh-codex-ui": "界面与外观",
  "@linxin666/dsh-client-ui-skill-explorer": "智能体与技能",
  "@linxin666/dsh-client-ui-task-board": "效率与任务",
  "dsh-doc-routing-guard": "文档与 OCR",
  "dsh-cost-meter": "用量与计费",
  "dsh-pet": "娱乐与桌宠"
};

const RULES = [
  [/better-sidebar|boot-animation|whale-widget|workspace-flow|sidebar-fold|codex-ui|theme|sidebar/i, "界面与外观"],
  [/browser|paperclip|scrape|tabs/i, "浏览器与抓取"],
  [/doc-router|doc-routing|file-upload|tool-ocr|office|pdf|document/i, "文档与 OCR"],
  [/knowledge|kb-picker|lit-search|literature|zotero|rag/i, "知识库与检索"],
  [/subagent|skills-manager|skill-explorer|agent|preset/i, "智能体与技能"],
  [/chat-import|import-session|transcript/i, "会话与导入"],
  [/task-board|todo|schedule|calendar/i, "效率与任务"],
  [/image-gen|illustrator|image|draw|paint/i, "创作与工具"],
  [/dsh-im|qq|telegram|wechat|im-/i, "通讯与集成"],
  [/mobile|remote|phone|pocket|tailscale|iroh/i, "移动与远程"],
  [/billion-context|dsh-context|context|compaction/i, "上下文与性能"],
  [/market|plugin-manager|plugin-upgrader|plugin-market/i, "插件市场与管理"],
  [/cost-meter|usage|token|billing|balance|cost/i, "用量与计费"],
  [/pet|whale|game|fun|cat|mascot/i, "娱乐与桌宠"]
];

const HOME = process.env.DSH_HOME || path.join(os.homedir(), ".dsh");
const PROFILE = process.env.DSH_PROFILE || "desktop";
const ROOT = path.join(HOME, "profiles", PROFILE);
const STATE = path.join(ROOT, ".dsh-market", "state.json");
const PKG = path.join(ROOT, "package.json");
const LOG = path.join(HOME, "market-autogroup.log");

function groupFor(pkg) {
  if (EXACT[pkg]) return EXACT[pkg];
  for (const [re, group] of RULES) if (re.test(pkg)) return group;
  return "其他";
}

export function run() {
  const log = [];
  try {
    const deps = Object.keys(JSON.parse(fs.readFileSync(PKG, "utf8")).dependencies || {})
      .filter((n) => n !== "dshmarket" && n !== "dsh-market");
    const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, "utf8")) : {};
    state.disabled ||= [];
    state.groups ||= {};
    state.groupOrder ||= [];
    state.region ||= "global";
    if (state.regionAuto === undefined) state.regionAuto = true;
    if (state.sidebarEntry === undefined) state.sidebarEntry = true;

    // 只重置受管分组；用户自建分组原样保留
    for (const g of GROUP_ORDER) state.groups[g] = [];
    for (const dep of deps) {
      const g = groupFor(dep);
      if (!state.groups[g]) state.groups[g] = [];
      if (!state.groups[g].includes(dep)) state.groups[g].push(dep);
      log.push(`${dep} -> ${g}`);
    }
    state.groupOrder = GROUP_ORDER.filter((g) => (state.groups[g] || []).length);
    // 清掉空的自建分组
    for (const g of Object.keys(state.groups)) {
      if (!state.groupOrder.includes(g) && !GROUP_ORDER.includes(g) && state.groups[g].length === 0) {
        delete state.groups[g];
      }
    }
    fs.writeFileSync(STATE, JSON.stringify(state));
    log.push("OK");
  } catch (err) {
    log.push("ERR " + (err instanceof Error ? err.message : String(err)));
  }
  try {
    fs.appendFileSync(LOG, new Date().toISOString() + " " + log.join(" | ") + "\n");
  } catch {}
  return log;
}

export function apply() {
  run();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(run().join("\n"));
}
