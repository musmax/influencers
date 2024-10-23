import mongoose from 'mongoose';

// The Youtube info is quite well filtered - there is no need for
// strict schema that will filter out the userless stuff from the response

const mediaSchema = mongoose.Schema({
    _id: { type: String },
    fetched: { type: Date },
}, { strict: false });

mediaSchema.pre('save', function(next) {
    this.fetched = new Date().roundHours();
    next();
});

mediaSchema.pre('findOneAndUpdate', function(next) {
    this._update.$set = this._update.$set || {};
    this._update.$set.fetched = this._update.$set.fetched?.roundHours();
    next();
});

export default mongoose.model('ym', mediaSchema);

// A common response from the RapidAPI

// {
//     "kind": "youtube#searchResult",
//     "id": {
//         "kind": "youtube#video",
//         "videoId": "Ngqhnw5MxV4"
//     },
//     "snippet": {
//         "publishedAt": "2024-03-09T13:00:06Z",
//         "channelId": "UCIs2OPiBUjAdzjE3GiLIOcg",
//         "title": "ISHNLV - Mirrors",
//         "description": "carmusic #gangstermusic #carbassmusic #twerk #skibidi #skibidibopyesyesyes #techno #hypertechno #tiktoktechnomusic ...",
//         "thumbnails": {
//             "default": {
//                 "url": "https://i.ytimg.com/vi/Ngqhnw5MxV4/default.jpg",
//                 "width": 120,
//                 "height": 90
//             },
//             "medium": {
//                 "url": "https://i.ytimg.com/vi/Ngqhnw5MxV4/mqdefault.jpg",
//                 "width": 320,
//                 "height": 180
//             },
//             "high": {
//                 "url": "https://i.ytimg.com/vi/Ngqhnw5MxV4/hqdefault.jpg",
//                 "width": 480,
//                 "height": 360
//             }
//         },
//         "channelTitle": "KEAN DYSSO",
//         "liveBroadcastContent": "none",
//         "publishTime": "2024-03-09T13:00:06Z"
//     }
// }