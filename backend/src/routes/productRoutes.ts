// backend/src/routes/productRoutes.ts
import { Router } from 'express';
import { 
  createProduct, 
  getProducts, 
  updateProduct, 
  deleteProduct, 
  getLowStockAlerts 
} from '../controllers/productController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Bloqueo de seguridad para todo el módulo de inventario
router.use(authenticateToken);

// Rutas base del CRUD
router.post('/', createProduct);
router.get('/', getProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Ruta especializada en análisis de stock escaseante
router.get('/alerts/low-stock', getLowStockAlerts);

export default router;
