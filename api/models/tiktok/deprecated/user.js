import mongoose from 'mongoose';

// The Youtube info is quite well filtered - there is no need for
// strict schema that will filter out the userless stuff from the response

const userSchema = mongoose.Schema({
    _id: { type: String },
    fetched: { type: Date, default: Date.now },
    media: {
        type: [{
            _id: false,
            uploaded: { type: String },
            id: { type: String, ref: 'tm' }
        }]
    },
    active: { type: Boolean, default: true }
}, { strict: false });
export default mongoose.model('tu', userSchema);