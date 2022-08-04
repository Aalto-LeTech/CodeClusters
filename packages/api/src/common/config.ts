if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== 'production') {
  await import('dotenv').then((exports) => {
    exports.config()
  })
}

export const config = {
  ENV: (process.env.NODE_ENV || 'local') as 'production' | 'local',
  PORT: process.env.PORT || 8600,
  CORS_SAME_ORIGIN: process.env.CORS_SAME_ORIGIN || true,
  LOG: {
    LEVEL: process.env.LOG_LEVEL || 'info',
  },
  DB: {
    USER: process.env.DB_USER || 'pg-user',
    PASS: process.env.DB_PASSWORD || 'my-pg-password',
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT && parseInt(process.env.DB_PORT, 10) || 5432,
    NAME: process.env.DB_NAME || 'my_postgres_db'
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'verylongrandomstring',
  },
  MODEL_SERVER_URL: process.env.MODEL_SERVER_URL,
  SOLR_URL: process.env.SOLR_URL
}
