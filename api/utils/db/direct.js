import UserInstagram from '../../models/instagram/user.js';
import UserYoutube   from '../../models/youtube/user.js';
import UserTiktok    from '../../models/tiktok/user.js';

const getUser = async (platform, access_key) => {

    if (platform === 'youtube') {
    
        const channelId = access_key;
        return await UserYoutube.findOne({ channelId });
    
    } else if(platform === 'instagram') {

        const username = access_key;
        return await UserInstagram.findOne({ username }).populate('media');
    
    } else if(platform === 'tiktok') {
    
        const username = access_key;
        return await UserTiktok.findOne({ username }).populate('media'); 
    
    }

}

export default { getUser };