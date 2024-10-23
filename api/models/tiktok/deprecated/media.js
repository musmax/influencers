import mongoose from 'mongoose';

// The Youtube info is quite well filtered - there is no need for
// strict schema that will filter out the userless stuff from the response

const mediaSchema = mongoose.Schema({
    _id: { type: String },
    fetched: { type: Date, default: Date.now }
}, { strict: false });

export default mongoose.model('tm', mediaSchema);