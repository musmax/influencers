import mongo from '../../utils/mongo.js';

import IUserV2 from '../../models/instagram/user.js';
import IUserV1 from '../../models/instagram/deprecated/user.js';

import AIMediaV2 from '../../models/instagram/archive/media.js';
import AIMediaV1 from '../../models/instagram/archive/deprecated/media.js';

import AIUserV2 from '../../models/instagram/archive/user.js';
import AIUserV1 from '../../models/instagram/archive/deprecated/user.js';

import ATUserV2 from '../../models/tiktok/archive/user.js';
import ATUserV1 from '../../models/tiktok/archive/deprecated/user.js';

import AYUserV2 from '../../models/youtube/archive/user.js';
import AYUserV1 from '../../models/youtube/archive/deprecated/user.js';

import ATMediaV2 from '../../models/tiktok/archive/media.js';
import ATMediaV1 from '../../models/tiktok/archive/deprecated/media.js';

import TUserV2 from '../../models/tiktok/user.js';
import TUserV1 from '../../models/tiktok/deprecated/user.js';

import YUserV2 from '../../models/youtube/user.js';
import YUserV1 from '../../models/youtube/deprecated/user.js';

import IMediaV2 from '../../models/instagram/media.js';
import IMediaV1 from '../../models/instagram/deprecated/media.js';

import TMediaV2 from '../../models/tiktok/media.js';
import TMediaV1 from '../../models/tiktok/deprecated/media.js';

import YMediaV2 from '../../models/youtube/media.js';
import YMediaV1 from '../../models/youtube/deprecated/media.js';

import AYMediaV2 from '../../models/youtube/archive/media.js';
import AYMediaV1 from '../../models/youtube/archive/deprecated/media.js';

import transformUserDataYT_ARCHIVE from './transform/youtube/archive/user.js'
import transformMediaDataYT_ARCHIVE from './transform/youtube/archive/media.js'

import transformUserDataINSTA_ARCHIVE from './transform/instagram/archive/user.js'
import transformMediaDataINSTA_ARCHIVE from './transform/instagram/archive/media.js'

import transformUserDataTTK_ARCHIVE from './transform/tiktok/archive/user.js'
import transformMediaDataTTK_ARCHIVE from './transform/tiktok/archive/media.js'

import transformUserDataINSTA from './transform/instagram/user.js';
import transformMediaDataINSTA from './transform/instagram/media.js';

import transformUserDataTTK from './transform/tiktok/user.js';
import transformMediaDataTTK from './transform/tiktok/media.js';

import transformUserDataYT from './transform/youtube/user.js';
import transformMediaDataYT from './transform/youtube/media.js';


const Instagram = {
    transform: (type, oldDocument) => {
        if (type.toLowerCase() == "user") {
            return transformUserDataINSTA(oldDocument);
        } else {
            return transformMediaDataINSTA(oldDocument);
        }
    },
    archiveTransform: (type, oldDocument) => {
        if (type.toLowerCase() == "user") {
            return transformUserDataINSTA_ARCHIVE(oldDocument);
        } else {
            return transformMediaDataINSTA_ARCHIVE(oldDocument);
        }
    },
}

const Tiktok = {
    transform: (type, oldDocument) => {
        if (type.toLowerCase() == "user") {
            return transformUserDataTTK(oldDocument);
        } else {
            return transformMediaDataTTK(oldDocument);
        }
    },
    archiveTransform: (type, oldDocument) => {
        if (type.toLowerCase() == "user") {
            return transformUserDataTTK_ARCHIVE(oldDocument);
        } else {
            return transformMediaDataTTK_ARCHIVE(oldDocument);
        }
    },
}

const Youtube = {
    transform: (type, oldDocument) => {
        if (type.toLowerCase() == "user") {
            return transformUserDataYT(oldDocument);
        } else {
            return transformMediaDataYT(oldDocument);
        }
    },
    archiveTransform: (type, oldDocument) => {
        if (type.toLowerCase() == "user") {
            return transformUserDataYT_ARCHIVE(oldDocument);
        } else {
            return transformMediaDataYT_ARCHIVE(oldDocument);
        }
    },
}

const archive = true;
const platform = "youtube";
const model = "media";

mongo.connect();

Date.prototype.roundHours = function () {
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
}

if (!archive) {
    if (platform == "instagram") {
        if (model == "user") {
            const users = await IUserV1.find({}).lean();
            users.forEach(async user => {
                await IUserV2(Instagram.transform("user", user)).save();
                console.log(`User ${user.username} refactored and saved to database.`);
            });
        } else if (model == "media") {
            const media = await IMediaV1.find({}).lean();
            media.forEach(async media => {
                await IMediaV2(Instagram.transform("media", media)).save();
                console.log(`Media ${media.pk} refactored and saved to database.`);
            });
        }
    } else if (platform == "tiktok") {
        if (model == "user") {
            const users = await TUserV1.find({}).lean();
            users.forEach(async user => {
                await TUserV2(Tiktok.transform("user", user)).save();
                console.log(`User ${user.username} refactored and saved to database.`);
            });
        } else if (model == "media") {
            const media = await TMediaV1.find({}).lean();
            media.forEach(async media => {
                await TMediaV2(Tiktok.transform("media", media)).save();
                console.log(`Media ${media.video_id} refactored and saved to database.`);
            });
        }
    } else if (platform == "youtube") {
        if (model == "user") {
            const users = await YUserV1.find({}).lean();
            users.forEach(async user => {
                await YUserV2(Youtube.transform("user", user)).save();
                console.log(`User ${user.username} refactored and saved to database.`);
            });
        } else if (model == "media") {
            const media = await YMediaV1.find({}).lean();
            media.forEach(async media => {
                await YMediaV2(Youtube.transform("media", media)).save();
                console.log(`Media ${media.video_id} refactored and saved to database.`);
            });
        }
    }
} else {
    if (platform == "instagram") {
        if (model == "user") {
            const users = await AIUserV1.find({}).lean();
            users.forEach(async user => {
                await AIUserV2(Instagram.archiveTransform("user", user)).save();
                console.log(`User ${user.username} refactored and saved to database.`);
            });
        } else if (model == "media") {
            const media = await AIMediaV1.find({}).lean();
            for (const m of media) {
                await AIMediaV2(Instagram.archiveTransform("media", m)).save();
                console.log(`Media ${media.mediaId} refactored and saved to database.`);
            }
        }
    } else if (platform == "tiktok") {
        if (model == "user") {
            const users = await ATUserV1.find({}).lean();
            users.forEach(async user => {
                await ATUserV2(Tiktok.archiveTransform("user", user)).save();
                console.log(`User ${user.username} refactored and saved to database.`);
            });
        } else if (model == "media") {
            const media = await ATMediaV1.find({}).lean();
            for (const m of media) {
                await ATMediaV2(Tiktok.archiveTransform("media", m)).save();
                console.log(`Media ${media.mediaId} refactored and saved to database.`);
            }
        }
    } else if (platform == "youtube") {
        if (model == "user") {
            const users = await AYUserV1.find({}).lean();
            users.forEach(async user => {
                await AYUserV2(Youtube.archiveTransform("user", user)).save();
                console.log(`User ${user.username} refactored and saved to database.`);
            });
        } else if (model == "media") {
            const media = await AYMediaV1.find({}).lean();
            for (const m of media) {
                await AYMediaV2(Youtube.archiveTransform("media", m)).save();
                console.log(`Media ${media.mediaId} refactored and saved to database.`);
            }
        }
    }
}