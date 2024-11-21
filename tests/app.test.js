const request = require('supertest');
const app = require('../app');

describe('API Endpoints', () => {
  // Test authentication
  describe('Authentication', () => {
    it('should return 403 without API key', async () => {
      const res = await request(app).get('/cpu');
      expect(res.statusCode).toBe(403);
    });
  });

  // Test CPU endpoint
  describe('GET /cpu', () => {
    it('should return CPU usage', async () => {
      const res = await request(app)
        .get('/cpu')
        .set('x-api-key', process.env.API_KEY);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('cpuLoad');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  // Test Memory endpoint
  describe('GET /memory', () => {
    it('should return memory usage', async () => {
      const res = await request(app)
        .get('/memory')
        .set('x-api-key', process.env.API_KEY);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalMemory');
      expect(res.body).toHaveProperty('usedMemory');
      expect(res.body).toHaveProperty('freeMemory');
    });
  });

  // Test Disk endpoint
  describe('GET /disk', () => {
    it('should return disk usage', async () => {
      const res = await request(app)
        .get('/disk')
        .set('x-api-key', process.env.API_KEY);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalSpace');
      expect(res.body).toHaveProperty('usedSpace');
      expect(res.body).toHaveProperty('freeSpace');
    });
  });

  // Test Bandwidth endpoint
  describe('GET /bandwidth', () => {
    it('should return bandwidth usage or initialization message', async () => {
      const res = await request(app)
        .get('/bandwidth')
        .set('x-api-key', process.env.API_KEY);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('timestamp');
    });
  });
});
