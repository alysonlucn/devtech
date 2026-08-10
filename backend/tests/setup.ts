import 'dotenv/config';

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-min-16-chars';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-min-16-chars';
process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_USERNAME = process.env.DB_USERNAME ?? 'devpath';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'devpath_secret';
process.env.DB_DATABASE = process.env.DB_DATABASE ?? 'devpath_test';
