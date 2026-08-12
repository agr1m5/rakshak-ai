import { Router } from 'express';

const router = Router();

// POST /api/agent/pair
router.post('/pair', (req, res) => {
  res.json({ status: 'stub', message: 'Agent pairing token issuance stub (implemented in Step 5)' });
});

// DELETE /api/agent/pair
router.delete('/pair', (req, res) => {
  res.json({ status: 'stub', message: 'Agent token revocation stub (implemented in Step 5)' });
});

export default router;
