#!/usr/bin/env bash
# Hook: Control which shell commands can auto-execute vs require approval.
#
# Three tiers:
#   PROTECTED_COMMANDS — explicitly dangerous (git remotes, DB resets, beads push)
#                        Always asks, with a clear reason why.
#   SAFE_COMMANDS      — explicitly safe subcommands (read-only, local-only)
#                        Never asks (checked first, overrides PROTECTED_COMMANDS).
#   (unlisted)         — no opinion, falls through to normal permission handling.
#
# Patterns are matched as command prefixes. More specific SAFE entries
# override broader PROTECTED entries (e.g. safe "git push --dry-run" overrides
# protected "git push").
#
# To change behavior, edit the arrays below — not settings.json.

# --- Commands with real-world side effects ---
PROTECTED_COMMANDS=(
  "git push"                  # sends commits to remote
  "git reset"                 # can lose uncommitted work
  "git rebase"                # rewrites commit history
  "git merge"                 # modifies branch history
  # bd dolt push removed — we use bd export + git commit instead
)

# --- Safe subcommands (read-only or local-only, checked first) ---
SAFE_COMMANDS=(
  "git push --dry-run"        # read-only push simulation
  "bd ready"                  # read-only: list available work
  "bd show"                   # read-only: view issue details
  "bd close"                  # local beads completion
  "bd update"                 # local beads update
)

HOOK_FILE=".claude/hooks/ask-on-protected-command.sh"

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Check safe commands first (more specific overrides broader protected)
# Match as exact command or command followed by space (word boundary)
for safe in "${SAFE_COMMANDS[@]}"; do
  if [[ "$COMMAND" == "$safe" || "$COMMAND" == "$safe "* ]]; then
    exit 0
  fi
done

# Check protected commands (exact or followed by space)
for protected in "${PROTECTED_COMMANDS[@]}"; do
  if [[ "$COMMAND" == "$protected" || "$COMMAND" == "$protected "* ]]; then
    jq -n --arg cmd "$protected" --arg hook "$HOOK_FILE" '{
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: ("[PROTECTED COMMAND] \"\($cmd)\" has real-world side effects. To allow auto-execution, move it from PROTECTED_COMMANDS to SAFE_COMMANDS in \($hook)")
      }
    }'
    exit 0
  fi
done

# Unlisted commands — no opinion, fall through to normal permissions
exit 0
