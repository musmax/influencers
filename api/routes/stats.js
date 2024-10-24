import express from 'express';
import multer  from 'multer';

import checkAuth      from '../middlewares/auth.js';
import StatsController from '../controllers/stats.js';

import {dashboard,likes} from '../controllers/dashboard.js';

const router = express.Router();

router.get('/dashboard', multer().none(), checkAuth(), StatsController.dashboard);
router.get('/new-dashboard', dashboard);
router.get('/most-like', likes);


export default router;