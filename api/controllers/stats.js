import logger from '../utils/logger.js';
import User   from '../models/user.js';

import Database    from '../utils/db/manager.js';
import StatsWrapper from '../wrappers/stats.js';

export async function dashboard(req, res) {

    logger.info("/dashboard accessed.");
    
    let users = await User.find().lean();
    users = users.map(async (user) => {
        
        const instagram = user.instagram ? await Database.dir.getUser("instagram", user.instagram) : null;
        const tiktok    = user.tiktok    ? await Database.dir.getUser("tiktok",    user.tiktok)    : null;
        const youtube   = user.youtube   ? await Database.dir.getUser("youtube",   user.youtube)   : null;

        user = new StatsWrapper(instagram, tiktok, youtube);

    });

    res.status(200).json({
        message: "Success"
    });

}

export default { dashboard };