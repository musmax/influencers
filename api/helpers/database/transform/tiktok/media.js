import mongoose from "mongoose";

function transformMediaData(data) {
    return {
        _id: new mongoose.Types.ObjectId(),
        mediaId: data.video_id,
        description: data.description,
        cover: data.cover,
        duration: data.duration,
        uploaded: new Date(data.create_time * 1000),
        comments: [],
        stats: {
          likes: data.statistics?.number_of_hearts || 0,
          plays: data.statistics?.number_of_plays || 0,
          comments: data.statistics?.number_of_comments || 0,
          shares: data.statistics?.number_of_reposts || 0,
          saves: data.statistics?.number_of_saves || 0,
        },
        fetched: data.fetched || new Date(),
      }
}

export default transformMediaData;