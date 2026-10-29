const request = require('supertest');
const app = require('../app');

describe('Health & General Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return 200 and healthy status details without exposing credentials', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.status).toBe('healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('database');
      expect(response.body.database).toHaveProperty('status');

      // Security check: ensure no database connection strings or secret keys are leaked
      const responseString = JSON.stringify(response.body);
      expect(responseString).not.toContain('mongodb');
      expect(responseString).not.toContain('password');
      expect(responseString).not.toContain('secret');
    });
  });

  describe('GET / (Root API endpoint)', () => {
    it('should return 200 and API overview info', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('GET /api/unregistered-path (404 Handler)', () => {
    it('should return 404 with structured error message', async () => {
      const response = await request(app).get('/api/unregistered-path');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Resource not found');
    });
  });
});
