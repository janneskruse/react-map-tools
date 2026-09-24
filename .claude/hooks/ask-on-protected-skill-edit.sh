#!/usr/bin/env bash
# Hook: Control which skill files can be auto-edited vs require approval.
#
# Three tiers:
#   PROTECTED_SKILLS — explicitly dangerous (real-world side effects: Auth0, DB, etc.)
#                      Always asks, with a clear reason why.
#   SAFE_SKILLS      — explicitly safe to auto-edit (local-only, no side effects)
#                      Never asks.
#   (unlisted)       — defaults to asking (safe fallback), with instructions to classify.
#
# To change behavior, edit the arrays below — not settings.json.

# --- Skills with real-world side effects (external APIs, destructive ops) ---
PROTECTED_SKILLS=(
  # none yet — add skills here if they trigger external APIs or DB mutations
)

# --- Skills safe to auto-edit (local-only, no side effects) ---
SAFE_SKILLS=(
  "claude-session-transcript"  # local JSONL extraction, no side effects
)

HOOK_FILE=".claude/hooks/ask-on-protected-skill-edit.sh"

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty')

# Normalize to relative path for matching
FILE_PATH="${FILE_PATH#$CLAUDE_PROJECT_DIR/}"

# Only act on skill files
if [[ ! "$FILE_PATH" =~ \.claude/skills/ ]]; then
  exit 0
fi

# Extract skill name
SKILL_NAME=$(echo "$FILE_PATH" | sed -n 's|.*\.claude/skills/\([^/]*\)/.*|\1|p')

# Allow whitelisted skills
for skill in "${SAFE_SKILLS[@]}"; do
  if [[ "$SKILL_NAME" == "$skill" ]]; then
    exit 0
  fi
done

# Explicit protection — clear message about why
for skill in "${PROTECTED_SKILLS[@]}"; do
  if [[ "$SKILL_NAME" == "$skill" ]]; then
    jq -n --arg skill "$skill" --arg hook "$HOOK_FILE" '{
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: ("[PROTECTED SKILL] \"\($skill)\" has real-world side effects. To allow auto-edit, move it from PROTECTED_SKILLS to SAFE_SKILLS in \($hook)")
      }
    }'
    exit 0
  fi
done

# Unknown skill — safe default, still ask
jq -n --arg skill "${SKILL_NAME:-unknown}" --arg hook "$HOOK_FILE" '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "ask",
    permissionDecisionReason: ("[UNCLASSIFIED SKILL] \"\($skill)\" is not in SAFE_SKILLS or PROTECTED_SKILLS. To allow auto-edit, add it to SAFE_SKILLS in \($hook). To mark as dangerous, add it to PROTECTED_SKILLS.")
  }
}'
