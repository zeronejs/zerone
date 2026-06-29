---
name: github-release
description: 基于 @zeronejs/cli 主力包版本自动发布 GitHub Release（gh + git-cliff）。当用户要求发布、发版、出版本、release、打 tag、生成 changelog/release notes、创建 GitHub Release 时使用本技能。也适用于"发个版""发布 cli""出个 release""打个 tag 发版""自动发布"等口语化表述。
---

# GitHub Release 自动发布（cli 主力包）

以 `@zeronejs/cli` 包的版本为准，用 **git-cliff** 生成 Release Notes，用 **gh** 创建 GitHub Release。

## 核心约定

| 项目 | 约定 |
| --- | --- |
| **版本来源** | `packages/cli/package.json` 的 `version` 字段（不在此技能里改版本号，只读取） |
| **tag 规则** | `v` + version，例如 `3.11.0` → `v3.11.0` |
| **Notes 范围** | **只收录 scope 为 `(cli)` 的 Conventional Commit**（`feat(cli)`/`fix(cli)`/`perf(cli)`...），其余包的提交一律跳过 |
| **提交区间** | 上一个 tag（`git describe --tags --abbrev=0`）到 `HEAD` 的未发布提交 |
| **Release 标题** | 与 tag 同名 |

收录规则与分组由同目录的 [`cliff.toml`](cliff.toml) 定义，发布脚本是 [`scripts/prepare-release.sh`](scripts/prepare-release.sh)。

## 前置依赖

- `git-cliff`（`brew install git-cliff`）
- `gh` 并已登录（`gh auth status` 通过）

脚本会自检这两项，缺失会直接报错退出。

## 执行流程

### 1. 预览（默认，只读，不会改动任何东西）

```bash
.claude/skills/github-release/scripts/prepare-release.sh
```

输出：cli 版本、目标 tag、上个 tag、cli 提交数、tag 是否已存在等告警，以及完整 Release Notes 预览。

**把版本号、tag、Notes 内容展示给用户，等待确认。** 重点核对：

- 目标 tag 是否符合预期（= cli 包当前版本）
- Notes 是否只包含本该发布的 cli 改动
- 是否有"远程已存在 tag""工作区有未提交改动"等告警

### 2. 取得用户明确同意

发布是**对外、不可逆**操作（推 tag + 建公开 Release）。**必须在用户确认后**才进入下一步，不要在仅预览的请求里直接发布。

### 3. 发布

```bash
.claude/skills/github-release/scripts/prepare-release.sh publish
```

脚本会依次：重新生成 Notes → 打 annotated tag `vX.Y.Z` → `git push origin <tag>` → `gh release create`（标记为 latest）。完成后打印 Release 链接。

## 触发与授权约定

- 用户说"发布""发版""出个版本""发个 release""打 tag 发版"等触发词时，视为要求执行**本技能流程**，按上面"预览 → 确认 → 发布"走。
- 默认**先预览**；只有用户明确说"直接发""不用看了发吧""确认发布"等，才在一次预览后直接 `publish`。
- 用户当次更细的限制（如"只生成 notes 别推""先别建 release"）优先级最高。

## 权限

执行 `git push`、`gh release create` 时**必须使用 `required_permissions: ["all"]`**，否则拿不到 Git/gh 凭据导致推送或发布失败。不要因通用的"默认不主动 push"习惯而跳过本技能已明确要求的发布动作。

## 手动等价命令（脚本不可用时的兜底）

```bash
VERSION=$(node -p "require('./packages/cli/package.json').version")
TAG="v$VERSION"
git-cliff --config .claude/skills/github-release/cliff.toml --unreleased --tag "$TAG" --output .git/notes.md
git tag -a "$TAG" -m "release: $TAG"
git push origin "$TAG"
gh release create "$TAG" --repo zeronejs/zerone --title "$TAG" --notes-file .git/notes.md --latest
```

## 故障处理

| 现象 | 处理 |
| --- | --- |
| 远程已存在同名 tag | 终止。确认是否漏改 `packages/cli/package.json` 版本号，或该版本已发过 |
| Notes 为空 / 提示"没有 cli 相关改动" | 本区间没有 `(cli)` scope 提交。确认提交是否漏带 `(cli)` scope，或本次确实无 cli 改动 |
| `gh 未登录` | 先 `gh auth login` |
| `未安装 git-cliff` | `brew install git-cliff` |
| 想调整收录范围/分组 | 改 [`cliff.toml`](cliff.toml) 的 `commit_parsers` |

## 注意事项

- 本技能**不修改版本号**，版本由 cli 包的 `package.json` 决定；改版本号请走正常提交流程。
- Release Notes 临时文件写在 `.git/release-notes-<tag>.md`，不会进入工作区。
- `cliff.toml` 里 group 名带的 `<!-- n -->` 注释仅用于排序，GitHub 渲染 Markdown 时不显示。
