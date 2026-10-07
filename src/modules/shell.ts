// Return the basename of the $SHELL env var, e.g. "/bin/bash" -> "bash".
export function parseShell(env: NodeJS.ProcessEnv): string | null {
  const shell = env.SHELL;

  if (shell === undefined || shell.trim().length === 0) {
    return null;
  }

  return shell.split("/").pop() ?? shell;
}

export function get(): string | null {
  return parseShell(process.env);
}
