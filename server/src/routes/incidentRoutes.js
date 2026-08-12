import { Router } from 'express';

const router = Router();

// GET /api/incidents
router.get('/', (req, res) => {
  res.json({ status: 'success', data: [], message: 'Incidents list stub (implemented in Step 11)' });
});

// GET /api/incidents/:id
router.get('/:id', (req, res) => {
  res.json({ status: 'stub', message: `Incident ${req.params.id} detail stub` });
});

// PATCH /api/incidents/:id/status
router.patch('/:id/status', (req, res) => {
  res.json({ status: 'stub', message: `Incident ${req.params.id} status updated stub` });
});

export default router;
