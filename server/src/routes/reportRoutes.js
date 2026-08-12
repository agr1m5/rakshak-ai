import { Router } from 'express';

const router = Router();

// GET /api/reports
router.get('/', (req, res) => {
  res.json({ status: 'success', data: [], message: 'Reports list stub (implemented in Step 13)' });
});

// POST /api/reports
router.post('/', (req, res) => {
  res.json({ status: 'stub', message: 'Generate PDF report stub (implemented in Step 13)' });
});

// GET /api/reports/:id/download
router.get('/:id/download', (req, res) => {
  res.status(501).json({ status: 'stub', message: 'Report download stub' });
});

// DELETE /api/reports/:id
router.delete('/:id', (req, res) => {
  res.json({ status: 'stub', message: `Report ${req.params.id} deleted stub` });
});

export default router;
