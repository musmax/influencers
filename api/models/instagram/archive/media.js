import mongoose from "mongoose";

const mediaSchema = mongoose.Schema({
    _id:     mongoose.Schema.Types.ObjectId,
    mediaId: { type: String, indexed: true },
    user: {
        type: {
            _id:       false,
            full_name: { type: String },
            username:  { type: String }
        }
    },
    stats: {
        likes:    { type: Number },
        views:    { type: Number },
        comments: { type: Number },
    },
    fetched:  { type: Date }
});

export default mongoose.model('v2ima', mediaSchema);