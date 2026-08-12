import { Router } from 'express';

const router = Router();

// GET /api/threats
router.get('/', (req, res) => {
  res.json({ status: 'success', data: [], message: 'Threats list stub (implemented in Step 11)' });
});

// GET /api/threats/:id
router.get('/:id', (req, res) => {
  res.json({ status: 'stub', message: `Threat ${req.params.id} detail stub` });
});

// DELETE /api/threats/:id
router.delete('/:id', (req, res) => {
  res.json({ status: 'stub', message: `Threat ${req.params.id} dismissed stub` });
});

export default router;
