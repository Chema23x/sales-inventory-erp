import { Router } from 'express';
import { createClient, getClients, updateClient, deleteClient } from '../controllers/clientController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Protegemos TODO este archivo inyectando el middleware de token en la raíz del enrutador
router.use(authenticateToken);

router.post('/', createClient);
router.get('/', getClients);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
