import mongoose from 'mongoose';

// The Youtube info is quite well filtered - there is no need for
// strict schema that will filter out the userless stuff from the response

const userSchema = mongoose.Schema({
    _id:      mongoose.Schema.Types.ObjectId,
    userId:   { type: String, indexed: true },
    username: { type: String },
    nickname: { type: String },
    stats: {
        following: { type: Number },
        followers: { type: Number },
        views:     { type: Number },
        media:     { type: Number },
        likes:     { type: Number }
    },
    fetched: { type: Date }
});

export default mongoose.model('yua', userSchema);
