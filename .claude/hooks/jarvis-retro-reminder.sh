#!/usr/bin/env bash
# jarvis-retro-reminder.sh — Stop hook. Fires ONLY when this session produced evidence.
#
# Portfolio fork of D:\MI\.claude\hooks\jarvis-retro-reminder.sh — SIGNALS match this
# monorepo's quality gate (ci-check / typecheck / lint / build / check-links), not Orbit's
# cargo/vitest-heavy stack.
#
# WHY / DESIGN: same as MI — instructions alone do not produce retros; a hook that nags
# every session gets disabled. Silent unless a real run happened AND no retro note today.
#
# OUTPUT: JSON on stdout with `systemMessage`. Never blocks the Stop (`continue` untouched).

set -uo pipefail

RAW="/d/JARVIS/raw"
payload="$(cat)"

transcript="$(printf '%s' "$payload" | sed -n 's/.*"transcript_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
transcript="${transcript//\\\\//}"
[ -n "$transcript" ] && [ -f "$transcript" ] || exit 0

# Narrow: results worth recording, not mere activity (no git/ls/grep).
SIGNALS='pnpm ci-check|pnpm typecheck|pnpm lint|pnpm build|pnpm check-links|pnpm test|npm test|vitest|playwright|lint\.sh'

hits="$(grep -oE "$SIGNALS" "$transcript" 2>/dev/null | sort -u | tr '\n' ' ')"
[ -n "$hits" ] || exit 0

# Filename date only — never mtime (a touch on an old note must not silence the hook).
today="$(date +%Y-%m-%d)"
for f in "$RAW"/"$today"-retro-*.md; do
  [ -e "$f" ] && exit 0
done

msg="JARVIS: this session ran something ($hits) and no retro note was written today.
If it produced a result worth keeping - a ci-check lesson, a named bug class, a perf
number, a decision that turned out wrong - write it now, while the account is still
first-hand:

  D:\JARVIS\raw\${today}-retro-<slug>.md

First person: what happened, what it cost, what you would do differently. By the next
session it is a retelling, which the wiki's own source scale ranks near the bottom.

If nothing was worth keeping, ignore this - that is a normal answer."

printf '%s' "$msg" | python -c 'import json,sys; print(json.dumps({"systemMessage": sys.stdin.read()}))' 2>/dev/null \
  || printf '{"systemMessage":"JARVIS: this session ran something and no retro note was written today. Consider D:\\\\JARVIS\\\\raw\\\\%s-retro-<slug>.md"}' "$today"
