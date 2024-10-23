import express from 'express';
import multer  from 'multer';

import AdminController from '../controllers/admin.js';

const router = express.Router();

router.post('/login', multer().none(), AdminController.login);

export default router;