// backend/src/routes/analyticsRoutes.ts
import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/dashboard', authenticateToken, getDashboardAnalytics);

export default router;
