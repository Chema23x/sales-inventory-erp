// backend/src/routes/saleRoutes.ts
import { Router } from 'express';
import { createSale, getSalesHistory } from '../controllers/saleController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Seguridad JWT obligatoria para operaciones comerciales
router.use(authenticateToken);

// Registrar un tique comercial / venta
router.post('/', createSale);

// Consultar historial analítico paginado
router.get('/history', getSalesHistory);

export default router;
