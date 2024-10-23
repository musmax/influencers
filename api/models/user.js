import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    _id:        { type: mongoose.Schema.Types.ObjectId },
    tiktok:     { type: String, unique: true, dropDups: true, sparse: true },
    instagram:  { type: String, unique: true, dropDups: true, sparse: true },
    youtube:    { type: String, unique: true, dropDups: true, sparse: true },
    username:   { type: String, unique: true, dropDups: true, sparse: true },
    optionals:  { type: Object }
});

userSchema.post('find', function (docs) {
    
});

export default mongoose.model('user', userSchema);