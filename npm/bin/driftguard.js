#!/usr/bin/env node

const os = require('os');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawnSync } = require('child_process');

const VERSION = 'v1';
const GITHUB_REPO = 'sidsri14/driftguard';

function getBinaryName() {
  const platform = os.platform();
  const arch = os.arch();

  if (platform === 'win32' && arch === 'x64') {
    return 'driftguard-windows-x86_64.exe';
  } else if (platform === 'linux' && arch === 'x64') {
    return 'driftguard-linux-x86_64';
  } else if (platform === 'darwin') {
    return 'driftguard-macos-aarch64';
  }

  throw new Error(`Unsupported platform: ${platform} (${arch}). Precompiled binaries are available for linux-x64, macos-arm64, and win32-x64.`);
}

function getDownloadUrl(binaryName) {
  return `https://github.com/${GITHUB_REPO}/releases/download/${VERSION}/${binaryName}`;
}

function downloadBinary(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        return downloadBinary(res.headers.location, destPath).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download DriftGuard binary (HTTP ${res.statusCode})`));
      }

      const file = fs.createWriteStream(destPath);
      res.pipe(file);

      file.on('finish', () => {
        file.close(() => {
          if (os.platform() !== 'win32') {
            fs.chmodSync(destPath, 0o755);
          }
          resolve();
        });
      });

      file.on('error', (err) => {
        fs.unlink(destPath, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    const binaryName = getBinaryName();
    const homeDir = os.homedir();
    const cacheDir = path.join(homeDir, '.driftguard', 'bin', VERSION);

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const binaryPath = path.join(cacheDir, binaryName);

    if (!fs.existsSync(binaryPath)) {
      process.stderr.write(`[driftguard-ci] Downloading DriftGuard ${VERSION} for ${os.platform()}-${os.arch()}...\n`);
      const url = getDownloadUrl(binaryName);
      await downloadBinary(url, binaryPath);
      process.stderr.write(`[driftguard-ci] Ready.\n`);
    }

    const args = process.argv.slice(2);
    const result = spawnSync(binaryPath, args, { stdio: 'inherit' });

    if (result.error) {
      throw result.error;
    }

    process.exit(result.status !== null ? result.status : 0);
  } catch (err) {
    console.error(`[driftguard-ci error]:`, err.message);
    process.exit(1);
  }
}

main();
