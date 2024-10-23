import mongoose from 'mongoose';

// The Youtube info is quite well filtered - there is no need for
// strict schema that will filter out the userless stuff from the response

const mediaSchema = mongoose.Schema({
    _id:              mongoose.Schema.Types.ObjectId,
    mediaId:         { type: String, indexed: true },
    user: {
        type: {
            _id: false,
            full_name: { type: String }, // author_name
            username: { type: String }   // author
        }
    },
    stats: {
        likes:    { type: Number }, // statistics.number_of_hearts
        views:    { type: Number }, // statistics.number_of_plays
        comments: { type: Number }, // statistics.number_of_comments
        saves:    { type: Number }, // statistics.number_of_saves 
        shares:   { type: Number }, // statistics.number_of_reposts
    },
    fetched:  { type: Date }
});

export default mongoose.model('v2tma', mediaSchema);