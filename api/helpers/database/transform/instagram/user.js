import mongoose from "mongoose";

function transformUserData(data) {
    return {
        _id: new mongoose.Types.ObjectId(),
        userId: data.id || data._id || null,
        username: data.username || null,
        nickname: null,
        fullname: data.full_name || null,
        picture: data.profile_pic_url || null,
        verified: data.is_verified || false,
        private: data.is_private || false,
        region: null,
        description: data.biography || null,
        category: data.category_name || null,
        stats: {
            _id: false,
            following: (data.edge_follow && data.edge_follow.count) || 0,
            followers: (data.edge_followed_by && data.edge_followed_by.count) || 0,
            media: (data.edge_owner_to_timeline_media && data.edge_owner_to_timeline_media.count) || 0,
            likes: 0
        },
        fetched: new Date(),
        media: Array.isArray(data.media) ? data.media.map(m => ({
            _id: false,
            uploaded: m.uploaded || null,
            id: m.id || null
        })) : []
    };
}

export default transformUserData;