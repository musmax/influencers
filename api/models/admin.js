import mongoose from 'mongoose';

const adminSchema = mongoose.Schema({
    _id:      { type: mongoose.Schema.Types.ObjectId },
    username: { type: String, required: true },
    password: { type: String, required: true },
});

export default mongoose.model('admin', adminSchema);