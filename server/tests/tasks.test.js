const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Task = require('../models/Task');
const { connectTestDB, clearTestDB, closeTestDB } = require('./setup');

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe('Task REST API Endpoints', () => {
  describe('POST /api/tasks (Create Task)', () => {
    it('should create a task successfully with valid data', async () => {
      const newTask = {
        title: 'Complete CI/CD Pipeline Setup',
        description: 'Configure GitHub Actions for automated linting, test, and build',
        priority: 'high',
        status: 'pending',
        dueDate: '2026-11-15T18:00:00.000Z',
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe(newTask.title);
      expect(res.body.data.description).toBe(newTask.description);
      expect(res.body.data.priority).toBe('high');
      expect(res.body.data.status).toBe('pending');
      expect(new Date(res.body.data.dueDate).toISOString()).toBe(newTask.dueDate);
    });

    it('should apply defaults when optional fields are omitted', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Simple Task' });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Simple Task');
      expect(res.body.data.status).toBe('pending');
      expect(res.body.data.priority).toBe('medium');
      expect(res.body.data.description).toBe('');
      expect(res.body.data.dueDate).toBeNull();
    });

    it('should return 400 if title is missing or empty', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title given' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContain('Task title is required');
    });

    it('should return 400 if title is less than 3 characters', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'AB' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContain('Task title must be at least 3 characters long');
    });

    it('should return 400 if priority is invalid', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Valid Title', priority: 'critical' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContain('Priority must be "low", "medium", or "high"');
    });

    it('should return 400 if status is invalid', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Valid Title', status: 'in-progress' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContain('Status must be either "pending" or "completed"');
    });
  });

  describe('GET /api/tasks (Retrieve Tasks)', () => {
    beforeEach(async () => {
      await Task.create([
        { title: 'Write Documentation', status: 'completed', priority: 'low' },
        { title: 'Implement Authentication', status: 'pending', priority: 'high' },
        { title: 'Deploy to Render', status: 'pending', priority: 'medium' },
      ]);
    });

    it('should retrieve all tasks', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(3);
      expect(res.body.data.length).toBe(3);
    });

    it('should filter tasks by status=completed', async () => {
      const res = await request(app).get('/api/tasks?status=completed');

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].title).toBe('Write Documentation');
    });

    it('should filter tasks by priority=high', async () => {
      const res = await request(app).get('/api/tasks?priority=high');

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].title).toBe('Implement Authentication');
    });

    it('should search tasks by title keyword', async () => {
      const res = await request(app).get('/api/tasks?search=Deploy');

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].title).toBe('Deploy to Render');
    });
  });

  describe('GET /api/tasks/:id (Retrieve Single Task)', () => {
    it('should retrieve task by ID', async () => {
      const task = await Task.create({ title: 'Inspect Unit Tests', priority: 'medium' });

      const res = await request(app).get(`/api/tasks/${task._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Inspect Unit Tests');
    });

    it('should return 400 for invalid ObjectId format', async () => {
      const res = await request(app).get('/api/tasks/not-a-valid-mongo-id');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid task ID format');
    });

    it('should return 404 if task does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/tasks/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });
  });

  describe('PUT /api/tasks/:id (Update Task)', () => {
    it('should update task details successfully', async () => {
      const task = await Task.create({ title: 'Old Title', priority: 'low' });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send({
          title: 'Updated Task Title',
          priority: 'high',
          status: 'completed',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Task Title');
      expect(res.body.data.priority).toBe('high');
      expect(res.body.data.status).toBe('completed');
    });

    it('should return 400 on invalid update data', async () => {
      const task = await Task.create({ title: 'Test Task' });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send({ title: 'X' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContain('Task title must be at least 3 characters long');
    });

    it('should return 404 for updating non-existent task', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/tasks/${nonExistentId}`)
        .send({ title: 'Does Not Exist' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/tasks/:id/status (Update Task Status)', () => {
    it('should update task status to completed', async () => {
      const task = await Task.create({ title: 'Finish Final Project', status: 'pending' });

      const res = await request(app)
        .patch(`/api/tasks/${task._id}/status`)
        .send({ status: 'completed' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('completed');
    });

    it('should return 400 if status is omitted in PATCH', async () => {
      const task = await Task.create({ title: 'Task without status' });

      const res = await request(app)
        .patch(`/api/tasks/${task._id}/status`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('Status is required');
    });

    it('should return 400 for invalid status value', async () => {
      const task = await Task.create({ title: 'Task with bad status' });

      const res = await request(app)
        .patch(`/api/tasks/${task._id}/status`)
        .send({ status: 'archived' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('Status must be either "pending" or "completed"');
    });
  });

  describe('DELETE /api/tasks/:id (Delete Task)', () => {
    it('should delete task and return 200', async () => {
      const task = await Task.create({ title: 'Task to be deleted' });

      const res = await request(app).delete(`/api/tasks/${task._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted successfully');

      // Verify deletion in database
      const found = await Task.findById(task._id);
      expect(found).toBeNull();
    });

    it('should return 404 when deleting non-existent task', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/tasks/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when deleting with invalid ID format', async () => {
      const res = await request(app).delete('/api/tasks/invalid-id-123');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
