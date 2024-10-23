import UserYoutube          from '../../models/youtube/user.js';
import MediaYoutube         from '../../models/youtube/media.js';
import MediaYoutubeArchive  from '../../models/youtube/archive/media.js';
import UserYoutubeArchive   from '../../models/youtube/archive/user.js';

import UserTiktok         from '../../models/tiktok/user.js';
import MediaTiktok        from '../../models/tiktok/media.js';
import UserTiktokArchive  from '../../models/tiktok/archive/user.js';
import MediaTiktokArchive from '../../models/tiktok/archive/media.js';

import UserInstagram         from '../../models/instagram/user.js';
import MediaInstagram        from '../../models/instagram/media.js';
import MediaInstagramArchive from '../../models/instagram/archive/media.js';
import UserInstagramArchive  from '../../models/instagram/archive/user.js';

const getArchiveModel = (type, platform) => {
    if (platform.toLowerCase() === "instagram") {
        if (type.toLowerCase() === "user") {
            return UserInstagramArchive;
        } else {
            return MediaInstagramArchive;
        }
    } else if (platform.toLowerCase() === "youtube") {
        if (type.toLowerCase() === "user") {
            return UserYoutubeArchive;
        } else {
            return MediaYoutubeArchive;
        }
    } else if (platform.toLowerCase() === "tiktok") {
        if (type.toLowerCase() === "user") {
            return UserTiktokArchive;
        } else {
            return MediaTiktokArchive;
        }
    }
}

const getModel = (type, platform) => {
    if (platform.toLowerCase() === "instagram") {
        if (type.toLowerCase() === "user") {
            return UserInstagram;
        } else {
            return MediaInstagram;
        }
    } else if (platform.toLowerCase() === "youtube") {
        if (type.toLowerCase() === "user") {
            return UserYoutube;
        } else {
            return MediaYoutube;
        }
    } else if (platform.toLowerCase() === "tiktok") {
        if (type.toLowerCase() === "user") {
            return UserTiktok;
        } else {
            return MediaTiktok;
        }
    }
}

function getModelSearchQuery(type, platform, id, start, final) {

    const accessors = {
        instagram: {
            user: "id",
            media: "user.id"
        },
        tiktok: {
            user: "user_id",
            media: "author_id"
        },
        youtube: {
            user: "channelId",
            media: "channelId"
        }
    };

    const accessor = accessors[platform][type];
    return { [accessor]: id, fetched: { $gte: start, $lte: final } };

}

function getMediaIdField(platform) {
    return {
        instagram: "pk",
        youtube:   "video_id",
        tiktok:    "video_id"
    } [platform];
}

export default { getArchiveModel, getModel, getMediaIdField, getModelSearchQuery };