import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    id: { type: String, indexed: true },
    username: { type: String },
    edge_followed_by: { type: Object },
    edge_follow: { type: Object },
    profile_pic_url: { type: String },
    profile_pic_url_hd: { type: String },
    edge_owner_to_timeline_media: {
        type: {
            count: { type: Number },
        }
    },
    fetched: { type: Date, default: Date.now },
    active: { type: Boolean, default: true }
});

export default mongoose.model('iua', userSchema);