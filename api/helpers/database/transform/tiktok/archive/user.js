import mongoose, { mongo } from "mongoose";

function transformUserData(oldDoc) {
    return {
        _id: new mongoose.Types.ObjectId(),
        userId: oldDoc.user_id,
        username: oldDoc.username,
        nickname: oldDoc.nickname,
        stats: {
            following: oldDoc.following,
            followers: oldDoc.followers,
            media: oldDoc.total_videos,
            likes: oldDoc.total_heart
        },
        fetched: oldDoc.fetched
    };
}

export default transformUserData;