import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    _id:      mongoose.Schema.Types.ObjectId,
    userId:   { type: String, indexed: true },
    username: { type: String },
    nickname: { type: String },
    stats: {
        following: { type: Number },
        followers: { type: Number },
        media:     { type: Number },
        likes:     { type: Number },
    },
    fetched:     { type: Date    }
});

export default mongoose.model('v2tua', userSchema);
