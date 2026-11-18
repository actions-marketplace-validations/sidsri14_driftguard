# driftguard-ci

**Local-first CI guard for environment drift and AI prompt output contracts.**

[![npm version](https://img.shields.io/npm/v/driftguard-ci.svg)](https://www.npmjs.com/package/driftguard-ci)
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-DriftGuard%20CI%20Guard-blue?logo=github)](https://github.com/marketplace/actions/driftguard-ci-guard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

DriftGuard catches missing environment variables and broken AI model output contracts before merge. This npm package wraps the precompiled high-performance Rust engine for sub-second execution on any machine with zero compilation required.

---

## ⚡ Instant Usage (No Install Needed)

Run DriftGuard directly in any repo using `npx`:

```bash
# Check current codebase against environment manifests
npx driftguard-ci check

# Run preflight diagnostics
npx driftguard-ci doctor

# Initialize driftguard.toml configuration
npx driftguard-ci init
```

---

## 📦 Global or Local Installation

```bash
# Install globally
npm install -g driftguard-ci

# Or add to project devDependencies
npm install -D driftguard-ci
```

---

## 🛠️ GitHub Actions CI Usage

Add DriftGuard to your GitHub Actions workflow in 3 lines:

```yaml
- name: Run DriftGuard
  uses: sidsri14/driftguard@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

Official GitHub Action Marketplace: https://github.com/marketplace/actions/driftguard-ci-guard  
Source Code: https://github.com/sidsri14/driftguard  
License: MIT
