// backend/src/routes/billingRoutes.ts
import { Router } from 'express';
import { 
  getBillingSummary, 
  createSubscription, 
  getSubscriptions, 
  getPaymentHistory 
} from '../controllers/billingController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Todas las rutas financieras requieren autenticación JWT estricta
router.use(authenticateToken);

// GET /api/billing/summary -> Obtener MRR, facturación total e historial reciente
router.get('/summary', getBillingSummary);

// POST /api/billing/subscribe -> Activar plan a un cliente (Transacción atómica)
router.post('/subscribe', createSubscription);

// Rutas de respaldo / auditoría si se requieren en el futuro
router.get('/subscriptions', getSubscriptions);
router.get('/payments', getPaymentHistory);

export default router;
