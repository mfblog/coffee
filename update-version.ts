import fs from 'fs';
import path from 'path';

// 获取新版本号
const newVersion = process.argv[2];
if (!newVersion) {
  console.error('请提供新的版本号，例如: ts-node update-version.ts 1.0.8');
  process.exit(1);
}

// 验证版本号格式
if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error('版本号格式错误，请使用 x.y.z 格式（例如：1.0.8）');
  process.exit(1);
}

// 更新 package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('✅ 已更新 package.json 版本号');

// 更新 lib/config.ts
const configPath = path.join(process.cwd(), 'lib', 'config.ts');
let configContent = fs.readFileSync(configPath, 'utf8');
configContent = configContent.replace(
  /export const APP_VERSION = "[^"]+"/,
  `export const APP_VERSION = "${newVersion}"`
);
fs.writeFileSync(configPath, configContent);
console.log('✅ 已更新 lib/config.ts 中的 APP_VERSION');

// 更新 Android 版本号
const gradlePath = path.join(process.cwd(), 'android', 'app', 'build.gradle');
let gradleContent = fs.readFileSync(gradlePath, 'utf8');
gradleContent = gradleContent.replace(
  /versionName "[^"]+"/,
  `versionName "${newVersion}"`
);
fs.writeFileSync(gradlePath, gradleContent);
console.log('✅ 已更新 Android build.gradle 版本号');

// 更新 iOS 版本号
console.log('\n🔔 iOS 版本号需要在 Xcode 中手动更新：');
console.log('1. 打开 Xcode 项目');
console.log('2. 选择 App target');
console.log('3. 在 General 标签页中更新 Version 为:', newVersion);
console.log('\n✨ 版本号更新完成！'); 