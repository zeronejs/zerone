#!/usr/bin/env bash
#
# github-release skill —— 基于 @zeronejs/cli 主力包的版本，用 git-cliff 生成
# Release Notes，并用 gh 发布到 GitHub。
#
# tag 规则：v + packages/cli/package.json 的 version 字段（如 3.11.0 -> v3.11.0）
# Notes 范围：仅收录 scope 为 (cli) 的 Conventional Commit（见同级 cliff.toml）
#
# 用法：
#   prepare-release.sh            预览（默认，只读）：读版本 → 生成 Notes → 打印，不改动任何东西
#   prepare-release.sh notes      仅把 Release Notes 写到 .git 下并打印路径
#   prepare-release.sh publish    发布（不可逆）：打 tag → 推送 → 创建 GitHub Release
#
# ⚠️ publish 是对外、不可逆操作，务必先 preview 确认无误、并取得用户同意后再执行。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIFF_CONFIG="$SCRIPT_DIR/../cliff.toml"
ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
PKG="$ROOT/packages/cli/package.json"
REPO="zeronejs/zerone"

cd "$ROOT"

read_version() {
  if command -v node >/dev/null 2>&1; then
    node -p "require('$PKG').version"
  else
    grep -m1 '"version"' "$PKG" | sed -E 's/.*:[[:space:]]*"([^"]+)".*/\1/'
  fi
}

[ -f "$PKG" ] || { echo "❌ 找不到 $PKG"; exit 1; }
VERSION="$(read_version)"
[ -n "$VERSION" ] || { echo "❌ 读取 cli 版本失败：$PKG"; exit 1; }
TAG="v$VERSION"
PREV="$(git describe --tags --abbrev=0 2>/dev/null || true)"
NOTES="$ROOT/.git/release-notes-$TAG.md"   # 放 .git 内，不会进入工作区/版本控制

generate_notes() {
  command -v git-cliff >/dev/null 2>&1 || { echo "❌ 未安装 git-cliff（brew install git-cliff）"; exit 1; }
  git-cliff --config "$CLIFF_CONFIG" --unreleased --tag "$TAG" --output "$NOTES"
}

tag_exists_local()  { git rev-parse -q --verify "refs/tags/$TAG" >/dev/null 2>&1; }
tag_exists_remote() { git ls-remote --exit-code --tags origin "$TAG" >/dev/null 2>&1; }

cmd_preview() {
  echo "📦 cli 版本 : $VERSION"
  echo "🏷️  目标 tag : $TAG"
  echo "⬅️  上个 tag : ${PREV:-<无>}"
  local n
  n="$(git log "${PREV:+$PREV..}HEAD" --pretty='%s' | grep -cE '^\w+\(cli\)' || true)"
  echo "📝 cli 提交 : $n 个（${PREV:-起始}..HEAD）"
  tag_exists_local  && echo "⚠️  本地已存在 tag $TAG"
  tag_exists_remote && echo "⚠️  远程已存在 tag $TAG —— publish 会失败，请先处理"
  if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  工作区有未提交改动；发布前建议先提交干净"
  fi
  generate_notes
  echo
  echo "----- RELEASE NOTES（GitHub 上不显示 HTML 注释）-----"
  sed 's/<!--[^>]*-->//g' "$NOTES"
  echo "-----------------------------------------------------"
  echo "✅ 预览完成，未做任何改动。确认无误后执行：$0 publish"
}

cmd_publish() {
  command -v gh >/dev/null 2>&1 || { echo "❌ 未安装 gh"; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "❌ gh 未登录（gh auth login）"; exit 1; }
  tag_exists_remote && { echo "❌ 远程已存在 tag $TAG，终止"; exit 1; }

  generate_notes

  if ! tag_exists_local; then
    git tag -a "$TAG" -m "release: $TAG"
    echo "🏷️  已创建本地 tag $TAG"
  else
    echo "ℹ️  本地已存在 tag $TAG，复用"
  fi

  git push origin "$TAG"
  echo "⬆️  已推送 tag 到 origin"

  gh release create "$TAG" \
    --repo "$REPO" \
    --title "$TAG" \
    --notes-file "$NOTES" \
    --latest
  echo "🎉 已发布：https://github.com/$REPO/releases/tag/$TAG"
}

case "${1:-preview}" in
  preview|"") cmd_preview ;;
  notes)      generate_notes; echo "📄 $NOTES"; sed 's/<!--[^>]*-->//g' "$NOTES" ;;
  publish)    cmd_publish ;;
  *)          echo "用法：$(basename "$0") [preview|notes|publish]"; exit 1 ;;
esac
