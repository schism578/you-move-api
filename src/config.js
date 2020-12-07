module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql: //adrianmarquis@localhost/you-move-test',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://adrianmarquis@localhost/you-move',
  JWT_SECRET: process.env.JWT_SECRET || 'sprechensiedeutsch',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '20s',
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL ||
    'http://localhost:8000/',
}
