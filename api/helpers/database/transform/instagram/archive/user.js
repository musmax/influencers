import mongoose from "mongoose";

function transformUserData(oldDoc) {
    return {
        _id:      new mongoose.Types.ObjectId(),
        userId:   oldDoc.id,
        username: oldDoc.username,
        stats: {
            followers: oldDoc.edge_followed_by.count,
            following: oldDoc.edge_follow.count,
            media:     oldDoc.edge_owner_to_timeline_media.count,
        },
        picture: oldDoc.profile_pic_url_hd || oldDoc.profile_pic_url,
        fetched: oldDoc.fetched,
    };
}

export default transformUserData;