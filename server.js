import http   from 'http';
import dotenv from 'dotenv';
import app    from './app.js';

dotenv.config();

const server = http.createServer(app);
server.listen(process.env.PORT || 4000);

server.on('listening', () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
