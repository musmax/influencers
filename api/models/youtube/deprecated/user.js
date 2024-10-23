import mongoose from 'mongoose';

// The Youtube info is quite well filtered - there is no need for
// strict schema that will filter out the userless stuff from the response

const userSchema = mongoose.Schema({
    _id: { type: String },
    fetched: { type: Date },
    videos: {
        type: [{
            _id: false,
            uploaded: { type: String },
            id: { type: String, ref: 'ym' }
        }]
    },
    active: { type: Boolean, default: true }
}, { strict: false });

userSchema.pre('save', function(next) {
    this.fetched = new Date().roundHours();
    next();
});

userSchema.pre('findOneAndUpdate', function(next) {
    this._update.$set = this._update.$set || {};
    this._update.$set.fetched = this._update.$set.fetched?.roundHours();
    next();
});

export default mongoose.model('yu', userSchema);


// A common response from the RapidAPI

// {
//     "kind": "youtube#channelListResponse",
//     "pageInfo": {
//         "totalResults": 1,
//         "resultsPerPage": 5
//     },
//     "items": [
//         {
//             "kind": "youtube#channel",
//             "id": "UCIs2OPiBUjAdzjE3GiLIOcg",
//             "snippet": {
//                 "title": "KEAN DYSSO",
//                 "description": "OFFICIAL KEAN DYSSO Artist channel",
//                 "customUrl": "@keandysso",
//                 "publishedAt": "2019-02-11T20:01:46Z",
//                 "thumbnails": {
//                     "default": {
//                         "url": "https://yt3.ggpht.com/0QBlg6-uFrpDLcQt16e4i2gtZtsr7DbudiXjUdeO6IH9LFWDFD7KhZ3o_r08-TKlr8C7j66U=s88-c-k-c0x00ffffff-no-nd-rj",
//                         "width": 88,
//                         "height": 88
//                     },
//                     "medium": {
//                         "url": "https://yt3.ggpht.com/0QBlg6-uFrpDLcQt16e4i2gtZtsr7DbudiXjUdeO6IH9LFWDFD7KhZ3o_r08-TKlr8C7j66U=s240-c-k-c0x00ffffff-no-nd-rj",
//                         "width": 240,
//                         "height": 240
//                     },
//                     "high": {
//                         "url": "https://yt3.ggpht.com/0QBlg6-uFrpDLcQt16e4i2gtZtsr7DbudiXjUdeO6IH9LFWDFD7KhZ3o_r08-TKlr8C7j66U=s800-c-k-c0x00ffffff-no-nd-rj",
//                         "width": 800,
//                         "height": 800
//                     }
//                 },
//                 "localized": {
//                     "title": "KEAN DYSSO",
//                     "description": "OFFICIAL KEAN DYSSO Artist channel"
//                 },
//                 "country": "US"
//             },
//             "contentDetails": {
//                 "relatedPlaylists": {
//                     "likes": "",
//                     "uploads": "UUIs2OPiBUjAdzjE3GiLIOcg"
//                 }
//             },
//             "statistics": {
//                 "viewCount": "501778598",
//                 "subscriberCount": "690000",
//                 "hiddenSubscriberCount": false,
//                 "videoCount": "1024"
//             },
//             "brandingSettings": {
//                 "channel": {
//                     "title": "KEAN DYSSO",
//                     "description": "OFFICIAL KEAN DYSSO Artist channel",
//                     "keywords": "\"kean dysso\" \"plain jane\" \"car music\" \"car bass\" \"bass house\" \"bass boosted\" \"gamgster music\" \"gangster gang\" \"house music\" \"bass music\" ggang ghouse midtempo rap \"hip hop\" 2021 \"new music\"",
//                     "unsubscribedTrailer": "TwCIazfSueA",
//                     "country": "US"
//                 },
//                 "image": {
//                     "bannerExternalUrl": "https://yt3.googleusercontent.com/Ii1md8lH2_vxEQsTGTfJYy5Ue02ZLOG-M_CcEFnwjIDwoeZ44-dNKDkfHUjSc37gCHPm3HQnmA"
//                 }
//             }
//         }
//     ]
// }