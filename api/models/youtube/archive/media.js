import mongoose from 'mongoose';

// The Youtube info is quite well filtered - there is no need for
// strict schema that will filter out the userless stuff from the response

const mediaSchema = mongoose.Schema({
    _id:              mongoose.Schema.Types.ObjectId,
    mediaId:         { type: String, indexed: true },
    user: {
        type: {
            _id: false,
            full_name: { type: String },
            username: { type: String }
        }
    },
    stats: {
        likes:    { type: Number }, // statistics.likeCount
        views:    { type: Number }, // statistics.viewCount
        comments: { type: Number }, // statistics.commentCount
        saves:    { type: Number }, // statistics.favoriteCount 
        shares:   { type: Number },
    },
    fetched:  { type: Date }
});

export default mongoose.model('v2yma', mediaSchema);