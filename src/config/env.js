const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'];

const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const dbPort = Number(process.env.DB_PORT);
if (Number.isNaN(dbPort)) {
  throw new Error('DB_PORT must be a valid number');
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  db: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: dbPort,
  },
  shouldSyncAlter: process.env.DB_SYNC_ALTER
    ? process.env.DB_SYNC_ALTER === 'true'
    : process.env.NODE_ENV !== 'production',
};
