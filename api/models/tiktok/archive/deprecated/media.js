import mongoose from 'mongoose';

// The Youtube info is quite well filtered - there is no need for
// strict schema that will filter out the userless stuff from the response

const mediaSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    video_id: { type: String, indexed: true },
    description: { type: String },
    create_time: { type: Number },
    author: { type: String },
    author_id: { type: String },
    author_name: { type: String },
    statistics: { type: Object },
    video_definition: { type: String },
    format: { type: Object },
    bitrate: { type: Number },
    duration: { type: Number },
    fetched: { type: Date }
});

export default mongoose.model('tma', mediaSchema);