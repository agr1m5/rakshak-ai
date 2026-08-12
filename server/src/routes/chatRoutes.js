import { Router } from 'express';

const router = Router();

// GET /api/chat
router.get('/', (req, res) => {
  res.json({ status: 'success', data: [], message: 'Chat list stub (implemented in Step 7)' });
});

// POST /api/chat
router.post('/', (req, res) => {
  res.json({ status: 'stub', message: 'New chat creation stub' });
});

// GET /api/chat/:id
router.get('/:id', (req, res) => {
  res.json({ status: 'stub', message: `Chat ${req.params.id} messages stub` });
});

// POST /api/chat/:id/message
router.post('/:id/message', (req, res) => {
  res.json({ status: 'stub', message: 'Send chat message stub (implemented in Step 8)' });
});

// DELETE /api/chat/:id
router.delete('/:id', (req, res) => {
  res.json({ status: 'stub', message: `Chat ${req.params.id} removed stub` });
});

export default router;
