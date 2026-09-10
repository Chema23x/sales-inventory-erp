import { Router } from 'express';
import { createSubscription, getSubscriptions, createPayment, getPaymentHistory } from '../controllers/billingController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Forzar seguridad JWT en todos los endpoints de este archivo
router.use(authenticateToken);

router.post('/subscriptions', createSubscription);
router.get('/subscriptions', getSubscriptions);
router.post('/payments', createPayment);
router.get('/payments', getPaymentHistory);

export default router;
