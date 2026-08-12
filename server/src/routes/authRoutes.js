import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/auth/signup
router.post('/signup', authLimiter, (req, res) => {
  res.status(501).json({ status: 'stub', message: 'Signup endpoint stub (implemented in Step 5)' });
});

// POST /api/auth/login
router.post('/login', authLimiter, (req, res) => {
  res.status(501).json({ status: 'stub', message: 'Login endpoint stub (implemented in Step 5)' });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ status: 'success', message: 'Logged out successfully' });
});

export default router;
