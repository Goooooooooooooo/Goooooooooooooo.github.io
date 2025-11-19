#!/usr/bin/env node
/**
 * 🧰 固定依赖版本脚本（增强版）
 * - 递归处理所有依赖字段（支持嵌套 like overrides/resolutions）
 * - 去除 ^ 和 ~ 等前缀
 * - 无依赖 / 跨平台
 * - 带进度条
 */

const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();

const IGNORE_DIRS = [
  "node_modules",
  ".git",
  ".turbo",
  "dist",
  "build",
  "coverage",
  ".next",
  ".cache",
];

// ======================= 通用字段 =======================
const TOP_LEVEL_TARGET_KEYS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
  "bundledDependencies",
  "resolutions",
  "overrides",
];

// ======================= 获取所有 package.json =======================
function getAllPackageJsonPaths(dir) {
  const result = [];
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (IGNORE_DIRS.includes(entry.name) || entry.name.startsWith(".")) continue;
        walk(full);
      } else if (entry.name === "package.json") {
        result.push(full);
      }
    }
  }
  walk(dir);
  return result;
}

// ======================= 递归处理对象中的版本号 =======================
function cleanVersionValue(value) {
  if (typeof value !== "string") return value;

  // 去除 ^、~、>=、<=、>、<、* 等前缀
  return value.replace(/^[~^><=*\s]+/, "");
}

/**
 * 递归遍历对象，清洗所有字符串版本号
 */
function processVersionObject(obj) {
  if (!obj || typeof obj !== "object") return { changed: false };

  let changed = false;

  for (const key of Object.keys(obj)) {
    const val = obj[key];

    if (typeof val === "string") {
      const cleaned = cleanVersionValue(val);
      if (cleaned !== val) {
        obj[key] = cleaned;
        changed = true;
      }
    } else if (typeof val === "object") {
      // 递归处理嵌套对象
      const nested = processVersionObject(val);
      if (nested.changed) changed = true;
    }
  }

  return { changed };
}

// ======================= 处理单个 package.json =======================
function fixPackageJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const pkg = JSON.parse(content);

    let changed = false;

    // 处理顶层 dependencies/overrides/resolutions
    for (const key of TOP_LEVEL_TARGET_KEYS) {
      if (pkg[key] && typeof pkg[key] === "object") {
        const r = processVersionObject(pkg[key]);
        if (r.changed) changed = true;
      }
    }

    // Workspaces 或其他结构可能也含有依赖（例如 turbo 的 extra configs）
    if (pkg.workspaces && typeof pkg.workspaces === "object") {
      const r = processVersionObject(pkg.workspaces);
      if (r.changed) changed = true;
    }

    // 万一 package.json 中还有其它结构中含有 "version" 等字段，也处理
    const all = processVersionObject(pkg);

    if (all.changed) changed = true;

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + "\n");
    }

    return changed;
  } catch (err) {
    console.warn(`⚠️  Failed to process ${filePath}: ${err.message}`);
    return false;
  }
}

// ======================= 渲染进度条 =======================
function renderProgress(current, total, currentFile) {
  const width = 40;
  const percent = current / total;
  const filled = Math.round(width * percent);
  const bar = "█".repeat(filled) + "-".repeat(width - filled);
  const pct = String(Math.round(percent * 100)).padStart(3, " ");
  const name = path.relative(ROOT, currentFile);
  process.stdout.write(`\r[${bar}] ${pct}% (${current}/${total}) ${name}   `);
  if (current === total) process.stdout.write("\n");
}

// ======================= 主逻辑 =======================
function main() {
  const start = Date.now();
  console.log("🔍 Searching for package.json files...");
  const files = getAllPackageJsonPaths(ROOT);

  if (files.length === 0) {
    console.log("❌ No package.json found.");
    return;
  }

  console.log(`🔧 Found ${files.length} package.json file(s). Processing...\n`);

  let fixedCount = 0;
  files.forEach((file, i) => {
    const changed = fixPackageJson(file);
    if (changed) fixedCount++;
    renderProgress(i + 1, files.length, file);
  });

  const time = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\n✨ Done! ${fixedCount} file(s) modified in ${time}s.\n`);
}

// ======================= 执行 =======================
main();
