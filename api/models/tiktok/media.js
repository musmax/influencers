import mongoose from 'mongoose';

const mediaSchema = mongoose.Schema({
    _id:          mongoose.Schema.Types.ObjectId,
    mediaId:     { type: String, index: true },
    description: { type: String },
    cover:       { type: String },
    duration:    { type: Number }, 
    uploaded:    { type: Date },
    comments:    { type: [String] },
    location:    { 
        type: {
            _id:      false,
            pk:      { type: String },
            name:    { type: String },
            address: { type: String },
            city:    { type: String },
            lng:     { type: Number },
            lat:     { type: Number }
        }
    },
    stats:  {
        type: {
            _id: false,
            likes:    { type: Number },
            plays:    { type: Number },
            comments: { type: Number },
            shares:   { type: Number },
            saves:    { type: Number }
        }
    },
    fetched:     { type: Date }
});

mediaSchema.pre('save', function(next) {
    this.fetched = new Date().roundHours();
    next();
});


mediaSchema.pre('findOneAndUpdate', function(next) {
    this._update.$set = this._update.$set || {};
    this._update.$set.fetched = this._update.$set.fetched?.roundHours();
    next();
});

export default mongoose.model('v2tm', mediaSchema);