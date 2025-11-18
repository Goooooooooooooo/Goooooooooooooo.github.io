#!/usr/bin/env node
/**
 * 检查 monorepo 中 package.json 指定版本是否存在 npm registry
 * - 支持 Yarn 1 / Windows / macOS
 * - 无额外依赖
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// ===== 配置 =====
const ROOT = process.cwd();
const TARGET_KEYS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
  "resolutions",
];

// ===== 工具函数 =====
function getAllPackageJsonPaths(dir) {
  const result = [];
  function walk(current) {
    const entries = fs.readdirSync(current);
    for (const entry of entries) {
      const full = path.join(current, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        if (entry === "node_modules" || entry.startsWith(".")) continue;
        walk(full);
      } else if (entry === "package.json") {
        result.push(full);
      }
    }
  }
  walk(dir);
  return result;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    console.error(`❌ 解析 ${filePath} 失败`, e);
    return null;
  }
}

// 使用 https 获取 npm registry 信息
function checkVersionExists(pkgName, version) {
  const encodedName = encodeURIComponent(pkgName);
  const url = `https://registry.npmjs.org/${encodedName}`;

  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.versions && json.versions[version]) {
              resolve(true);
            } else {
              resolve(false);
            }
          } catch (e) {
            resolve(false);
          }
        });
      })
      .on("error", () => resolve(false));
  });
}

// 渲染简单进度条
function renderProgress(current, total, currentFile) {
  const width = 40;
  const percent = current / total;
  const filled = Math.round(width * percent);
  const bar = "█".repeat(filled) + "-".repeat(width - filled);
  const pct = Math.round(percent * 100).toString().padStart(3, " ");
  const displayName = path.relative(ROOT, currentFile);
  process.stdout.write(
    `\r[${bar}] ${pct}% (${current}/${total}) ${displayName}   `
  );
  if (current === total) process.stdout.write("\n");
}

// ===== 主逻辑 =====
async function main() {
  console.log("🔍 Searching for package.json files...");
  const files = getAllPackageJsonPaths(ROOT);
  if (files.length === 0) {
    console.log("❌ No package.json found.");
    process.exit(0);
  }
  console.log(`🔧 Found ${files.length} package.json files. Checking versions...\n`);

  let invalidDeps = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    renderProgress(i + 1, files.length, file);

    const pkg = readJson(file);
    if (!pkg) continue;

    for (const key of TARGET_KEYS) {
      if (!pkg[key]) continue;
      for (const dep in pkg[key]) {
        const version = pkg[key][dep];
        // 忽略 tag / 非严格版本（可根据需要调整）
        if (!version.match(/^\d+\.\d+\.\d+$/)) continue;

        const exists = await checkVersionExists(dep, version);
        if (!exists) {
          invalidDeps.push({
            file: path.relative(ROOT, file),
            dep,
            version,
          });
        }
      }
    }
  }

  // ===== 输出结果 =====
  console.log("\n✅ Check completed.");
  if (invalidDeps.length === 0) {
    console.log("All specified versions exist in npm registry.");
  } else {
    console.log("❌ Some versions are missing in npm registry:");
    invalidDeps.forEach(({ file, dep, version }) => {
      console.log(`  - ${file} -> ${dep}@${version}`);
    });
  }
}

// ===== 执行 =====
main();
