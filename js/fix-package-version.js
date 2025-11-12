#!/usr/bin/env node
/**
 * 🧰 固定依赖版本脚本（Yarn 1 / Turbo 通用）
 * - 去除所有 package.json 中 ^ 和 ~
 * - 实时进度条显示
 * - 跨平台无依赖
 */

const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();
const TARGET_KEYS = ["dependencies", "devDependencies", "peerDependencies"];
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

// ====== 获取所有 package.json 路径 ======
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

// ====== 修正依赖版本 ======
function fixPackageJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const pkg = JSON.parse(content);
    let changed = false;

    for (const key of TARGET_KEYS) {
      if (!pkg[key]) continue;
      for (const dep in pkg[key]) {
        const v = pkg[key][dep];
        const fixed = v.replace(/^[\^~]/, "");
        if (v !== fixed) {
          pkg[key][dep] = fixed;
          changed = true;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + "\n");
    }
    return changed;
  } catch (err) {
    console.warn(`⚠️  Failed to process ${filePath}: ${err.message}`);
    return false;
  }
}

// ====== 渲染进度条 ======
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

// ====== 主逻辑 ======
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

// ====== 执行 ======
main();
