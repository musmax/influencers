import mongoose from "mongoose";

const mediaSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    pk: { type: String, indexed: true },
    id: { type: String },
    like_count: { type: Number },
    play_count: { type: Number },
    user: {
        type: {
            full_name: { type: String },
            username: { type: String },
            id: { type: String }
        }
    },
    comment_count: { type: Number },
    fetched: { type: Date }
});

export default mongoose.model('ima', mediaSchema);