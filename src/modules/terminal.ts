// Return the best available terminal label from env vars.
export function parseTerminal(env: NodeJS.ProcessEnv): string | null {
  if (env.TERM_PROGRAM !== undefined && env.TERM_PROGRAM.trim().length > 0) {
    return env.TERM_PROGRAM;
  }

  if (env.TERM !== undefined && env.TERM.trim().length > 0) {
    return env.TERM;
  }

  return null;
}

export function get(): string | null {
  return parseTerminal(process.env);
}
