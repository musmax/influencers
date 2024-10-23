import mongoose from "mongoose";

function transformUserData(data) {
    return {
        _id: new mongoose.Types.ObjectId(),
        userId: data.user_id || data._id,
        username: data.username,
        nickname: data.nickname,
        fullname: null,
        picture: data.profile_image,
        verified: data.verified,
        private: data.is_private,
        region: data.region,
        description: data.description,
        category: null,
        stats: {
            following: data.following,
            followers: data.followers,
            media: data.total_videos,
            likes: data.total_heart
        },
        fetched: data.fetched,
        media: data.media.map(item => ({
            uploaded: item.uploaded,
            id: item.id
        }))
    };
}

export default transformUserData;