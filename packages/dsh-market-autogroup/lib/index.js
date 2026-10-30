import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const name = "dsh-market-autogroup";

const GROUP_ORDER = [
  "界面与外观", "浏览器与抓取", "文档与 OCR", "知识库与检索",
  "智能体与技能", "会话与导入", "创作与工具", "通讯与集成",
  "移动与远程", "上下文与性能", "其他"
];

const RULES = [
  [/better-sidebar|boot-animation|whale-widget|workspace-flow|theme|sidebar/i, "界面与外观"],
  [/browser|paperclip|scrape|tabs/i, "浏览器与抓取"],
  [/doc-router|file-upload|tool-ocr|office|pdf|document/i, "文档与 OCR"],
  [/knowledge|kb-picker|lit-search|literature|zotero|rag/i, "知识库与检索"],
  [/subagent|skills-manager|agent|preset/i, "智能体与技能"],
  [/chat-import|import-session|session/i, "会话与导入"],
  [/image-gen|illustrator|image|draw|paint/i, "创作与工具"],
  [/dsh-im|qq|telegram|wechat|im-/i, "通讯与集成"],
  [/mobile|remote|phone|pocket/i, "移动与远程"],
  [/billion-context|dsh-context|context/i, "上下文与性能"]
];

const HOME = process.env.DSH_HOME || path.join(os.homedir(), ".dsh");
const PROFILE = process.env.DSH_PROFILE || "desktop";
const ROOT = path.join(HOME, "profiles", PROFILE);
const STATE = path.join(ROOT, ".dsh-market", "state.json");
const PKG = path.join(ROOT, "package.json");
const LOG = path.join(HOME, "market-autogroup.log");

function groupFor(pkg) {
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
    for (const g of GROUP_ORDER) if (!state.groups[g]) state.groups[g] = [];
    const assigned = new Set(Object.values(state.groups).flat());
    for (const dep of deps) {
      if (assigned.has(dep)) continue;
      const g = groupFor(dep);
      state.groups[g].push(dep);
      assigned.add(dep);
      log.push(`${dep} -> ${g}`);
    }
    state.groupOrder = GROUP_ORDER.filter((g) => (state.groups[g] || []).length);
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
