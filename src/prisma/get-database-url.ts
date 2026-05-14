type DatabaseEnv = {
  DATABASE_URL?: string;
  POSTGRES_USER?: string;
  POSTGRES_PASSWORD?: string;
  POSTGRES_HOST?: string;
  POSTGRES_PORT?: string;
  POSTGRES_DB?: string;
};

export function getDatabaseUrl(env: DatabaseEnv = process.env): string {
  if (env.DATABASE_URL && !env.DATABASE_URL.includes('${')) {
    return env.DATABASE_URL;
  }

  const requiredKeys = [
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_DB',
  ] as const;

  const missingKeys = requiredKeys.filter((key) => !env[key]);
  if (missingKeys.length > 0) {
    throw new Error(`Missing database environment: ${missingKeys.join(', ')}`);
  }

  const user = encodeURIComponent(env.POSTGRES_USER!);
  const password = encodeURIComponent(env.POSTGRES_PASSWORD!);
  const host = env.POSTGRES_HOST!;
  const port = env.POSTGRES_PORT!;
  const database = encodeURIComponent(env.POSTGRES_DB!);

  return `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;
}
