#!/usr/bin/env node
/**
 * 🧰 Monorepo 管理工具
 * 兼容 Yarn 1 + Windows/macOS/Linux
 * 支持 clean / install / reinstall / list / help
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();
const projects = [];

// 递归查找 package.json
function findPackages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'build'].includes(entry.name)) continue;
      const pkg = path.join(full, 'package.json');
      if (fs.existsSync(pkg)) projects.push(full);
      findPackages(full);
    }
  }
}

// 删除 node_modules
function removeNodeModules(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') {
        process.stdout.write(`🧹 Deleting ${fullPath} ... `);
        try {
          fs.rmSync(fullPath, { recursive: true, force: true });
          console.log('done');
        } catch (e) {
          console.log('failed:', e.message);
        }
      } else {
        removeNodeModules(fullPath);
      }
    }
  }
}

// 进度条显示
function progressBar(current, total) {
  const width = 20;
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  return `[${'#'.repeat(filled)}${'.'.repeat(empty)}]`;
}

// 执行 yarn install
function installAll() {
  console.log(`📦 Found ${projects.length} package.json file(s)\n`);
  projects.forEach((dir, idx) => {
    const name = path.basename(dir);
    console.log(`${progressBar(idx + 1, projects.length)} (${idx + 1}/${projects.length}) Installing ${name} ...`);
    try {
      execSync('yarn install', { cwd: dir, stdio: 'inherit' });
    } catch (e) {
      console.error(`❌ Failed in ${dir}:`, e.message);
    }
  });
  console.log('\n✅ All installations completed.\n');
}

// 列出所有 package.json
function listPackages() {
  console.log('📂 Package directories found:\n');
  projects.forEach((p, i) => console.log(`${String(i + 1).padStart(2)}. ${p}`));
  console.log(`\nTotal: ${projects.length}`);
}

// 帮助信息
function help() {
  console.log(`
🧰 Monorepo 管理命令：

  node tools/manage.js list       列出所有 package.json
  node tools/manage.js clean      删除所有 node_modules
  node tools/manage.js install    安装所有依赖（含进度条）
  node tools/manage.js reinstall  清理并重新安装
  node tools/manage.js help       显示帮助信息
`);
}

// 主逻辑
(function main() {
  const cmd = process.argv[2] || 'help';
  findPackages(rootDir);

  switch (cmd) {
    case 'list':
      listPackages();
      break;
    case 'clean':
      console.log('🧹 Cleaning node_modules ...');
      removeNodeModules(rootDir);
      console.log('\n✅ Cleanup complete.\n');
      break;
    case 'install':
      installAll();
      break;
    case 'reinstall':
      console.log('🧹 Step 1/2: Cleaning node_modules ...');
      removeNodeModules(rootDir);
      console.log('📦 Step 2/2: Installing dependencies ...\n');
      installAll();
      break;
    default:
      help();
  }
})();
