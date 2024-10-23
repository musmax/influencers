import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    _id:          mongoose.Schema.Types.ObjectId,
    userId:       { type: String  },
    username:     { type: String  },
    nickname:     { type: String  },
    fullname:     { type: String  },
    picture:      { type: String  },
    verified:     { type: Boolean },
    private:      { type: Boolean },
    region:       { type: String  },
    description:  { type: String  },
    category:     { type: String  },
    region:       { type: String  },
    stats: {
        type: {
            _id:       false,
            following: { type: Number },
            followers: { type: Number },
            media:     { type: Number },
            likes:     { type: Number }
        }
    },
    fetched: { type: Date },
    media: {
        type: [{
            _id:      false,
            uploaded: { type: String },
            id:       { type: String, ref: 'tm' }
        }]
    }
});

userSchema.pre('save', function (next) {
    this.fetched = new Date().roundHours();
    next();
});

userSchema.pre('findOneAndUpdate', function (next) {
    this._update.$set = this._update.$set || {};
    this._update.$set.fetched = this._update.$set.fetched?.roundHours();
    next();
});

export default mongoose.model('v2tu', userSchema);