import mongoose from "mongoose";

function transformMediaData(oldDoc) {
    return {
        _id:     new mongoose.Types.ObjectId(),
        mediaId: oldDoc.video_id,
        user: {
          full_name: oldDoc.author_name,
          username:  oldDoc.author
        },
        stats: {
            likes:    oldDoc.statistics.number_of_hearts,
            views:    oldDoc.statistics.number_of_plays,
            comments: oldDoc.statistics.number_of_comments,
            saves:    oldDoc.statistics.number_of_saves,
            shares:   oldDoc.statistics.number_of_reposts,
        },
        fetched: oldDoc.fetched
      };
}

export default transformMediaData;