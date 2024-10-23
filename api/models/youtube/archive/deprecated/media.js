import mongoose from 'mongoose';

// The Youtube info is quite well filtered - there is no need for
// strict schema that will filter out the userless stuff from the response

const mediaSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    fetched: { type: Date }
}, { strict: false });

export default mongoose.model('yma', mediaSchema);