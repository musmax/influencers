import mongoose from "mongoose";

function transformMediaData(oldDoc) {
    return {
        _id:     new mongoose.Types.ObjectId(),
        mediaId: oldDoc.id,
        user: {
            full_name: oldDoc.full_name,
            username:  oldDoc.username
        },
        stats: {
            likes:    oldDoc.like_count,
            views:    oldDoc.play_count,
            comments: oldDoc.comment_count,
        },
        fetched:  oldDoc.fetched,
    };
}

export default transformMediaData;