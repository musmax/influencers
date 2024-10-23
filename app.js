import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';

import StatsRoutes from './api/routes/stats.js';
import AdminRoute  from './api/routes/admin.js';

import Mongo from './api/utils/mongo.js';
Mongo.connect();

Date.prototype.roundHours = function () {
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
}

const app = express();

app.use(express.static(path.resolve('public')));
app.use(morgan('dev'));
app.use(cors());

app.use('/stats', StatsRoutes);
app.use('/admin', AdminRoute);

export default app;