import mongoose from 'mongoose';

// The Youtube info is quite well filtered - there is no need for
// strict schema that will filter out the userless stuff from the response

const userSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    user_id: { type: String, indexed: true },
    active: { type: Boolean },
    username: { type: String },
    nickname: { type: String },
    following: { type: Number },
    followers: { type: Number },
    total_videos: { type: Number },
    total_heart: { type: Number },
    verified: { type: Boolean },
    description: { type: String },
    region: { type: String },
    bio_link: { type: Object },
    fetched: { type: Date }
});

export default mongoose.model('tua', userSchema);
