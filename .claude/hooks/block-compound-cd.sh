#!/usr/bin/env bash
# Hook: Block compound commands that chain cd with other commands.
#
# Agents frequently write "cd /path && git add ..." or "cd /path && yarn ..."
# which bypasses permission prefix matching (the system sees "cd", not "git")
# and triggers manual approval even when the inner command is whitelisted.
#
# This hook blocks the pattern and tells the agent to split into separate
# Bash calls. It also provides a hint if the first inner command has a
# built-in directory flag (so the cd can be avoided entirely).

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Match: cd <path> && <rest> or cd <path> ; <rest> or cd <path> || <rest>
if echo "$COMMAND" | grep -qE '^\s*cd\s+.+\s*(&&|;|\|\|)\s*'; then
  # Use perl to extract directory, split all commands, and generate hints
  MSG=$(echo "$COMMAND" | perl -e '
    $_ = <STDIN>; chomp;

    # Extract directory and remainder
    /^\s*cd\s+(.*?)\s*(?:&&|;|\|\|)\s*(.*)/s or exit;
    my $dir = $1;
    my $rest = $2;

    # Split remainder on && ; ||
    my @cmds = split /\s*(?:&&|;|\|\|)\s*/, $rest;

    # Known directory flags: command => flag
    my %dir_flags = (
      git       => "-C",
      yarn      => "--cwd",
      uv        => "run --directory",
      npm       => "--prefix",
      node      => "--cwd",       # for node --cwd (limited support)
      npx       => "--cwd",
    );

    # Commands that work from any directory (no cd needed)
    my %global_cmds = (bd => 1, brew => 1, which => 1);

    # Build numbered list
    my $n = 1;
    my $list = "($n) cd $dir";
    for my $cmd (@cmds) {
      $n++;
      $list .= "\n($n) $cmd";
    }

    print "Split into separate Bash calls:\n$list";

    # Add hint for first command if applicable
    my ($first_cmd) = $cmds[0] =~ /^\s*(\S+)/;
    if (exists $dir_flags{$first_cmd}) {
      my $flag = $dir_flags{$first_cmd};
      print "\nTip: $first_cmd supports the $flag flag to set working directory, which avoids the cd entirely.";
    } elsif (exists $global_cmds{$first_cmd}) {
      print "\nNote: $first_cmd works from any directory — the cd is likely unnecessary.";
    }
  ')

  jq -n --arg reason "$MSG" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: ("Do not use compound cd commands. " + $reason)
    }
  }'
else
  exit 0
fi
