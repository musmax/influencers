import mongoose from "mongoose";

const mediaSchema = mongoose.Schema({
    _id: { type: String },
    taken_at: { type: Number },
    pk: { type: String },
    id: { type: String },
    like_and_view_counts_disabled: { type: Boolean },
    commerciality_status: { type: String },
    comment_threading_enabled: { type: Boolean },
    is_quiet_post: { type: Boolean },
    like_count: { type: Number },
    media_type: { type: Number },
    usertags: {
        type: {
            _id: false,
            in: {
                type: [{
                    _id: false,
                    user: {
                        type: {
                            _id: false,
                            pk: { type: String },
                            id: { type: String },
                            username: { type: String },
                            full_name: { type: String },
                            is_private: { type: Boolean },
                            is_verified: { type: Boolean },
                            profile_pic_url: { type: String }
                        }
                    }
                }]
            }
        }
    },
    code: { type: String },
    caption: {
        type: {
            _id: false,
            created_at: { type: Number },
            share_enabled: { type: Boolean },
            status: { type: String },
            has_translation: { type: Boolean },
            text: { type: String }
        }
    },
    play_count: { type: Number },
    coauthor_producers: {
        type: [{
            _id: false,
            username: { type: String },
            full_name: { type: String },
            is_verified: { type: Boolean },
            profile_pic_url: { type: String }
        }]
    },
    user: {
        type: {
            _id: false,
            id: { type: String },
            pk: { type: String },
            full_name: { type: String },
            username: { type: String },
            is_verified: { type: String }
        }
    },
    original_width: { type: Number },
    original_height: { type: Number },
    is_artist_pick: { type: Boolean },
    product_type: { type: String },
    is_paid_partnership: { type: Boolean },
    location: {
        type: {
            _id: false,
            pk: { type: String },
            short_name: { type: String },
            facebook_places_id: { type: String },
            external_source: { type: String },
            name: { type: String },
            address: { type: String },
            city: { type: String },
            lng: { type: Number },
            lat: { type: Number }
        }
    },
    image_versions2: {
        type: {
            _id: false,
            candidates: {
                type: [{
                    _id: false,
                    width: { type: Number },
                    height: { type: Number },
                    url: { type: String }
                }]
            }
        }
    },
    comment_count: { type: Number },

    // Carousel
    carousel_media_count: { type: Number },
    carousel_media_ids: { type: [String] },
    carousel_media: {
        type: [{
            _id: false,
            product_type: { type: String },
            media_type: { type: Number },
            accessibility_caption: { type: String },
            image_versions2: {
                type: {
                    _id: false,
                    candidates: {
                        type: [{
                            _id: false,
                            width: { type: Number },
                            height: { type: Number },
                            url: { type: String }
                        }]
                    }
                }
            },
            original_width: { type: Number },
            original_height: { type: Number },
            usertags: {
                type: {
                    _id: false,
                    in: {
                        type: [{
                            _id: false,
                            user: {
                                type: {
                                    _id: false,
                                    pk: { type: String },
                                    id: { type: String },
                                    username: { type: String },
                                    full_name: { type: String },
                                    is_private: { type: Boolean },
                                    is_verified: { type: Boolean },
                                    profile_pic_url: { type: String }
                                }
                            }
                        }]
                    }
                }
            },
        }]
    },

    // Video
    music_metadata: { type: Object },
    organic_tracking_token: { type: String },
    video_duration: { type: Number },
    has_audio: { type: Boolean },
    clips_metadata: {
        type: {
            _id: false,
            audio_type: { type: String },
        }
    },
    video_versions: {
        type: [{
            _id: false,
            type: { type: Number },
            width: { type: Number },
            height: { type: Number },
            url: { type: String },
            id: { type: String }
        }]
    },
    video_subtitles_confidence: { type: Number },
    video_subtitles_locale: { type: String },

    // My fields
    fetched: { type: Date, default: Date.now }
});

mediaSchema.pre('save', function (next) {

    this.image_versions2.candidates =
        [
            this.image_versions2.candidates
                .filter(item => item.height > item.width)
                .sort((a, b) => b.height - a.height)[0],
            this.image_versions2.candidates
                .filter(item => item.width == item.height)
                .sort((a, b) => b.height - a.height)[0]
        ]

    if (this.carousel_media) {
        for (const media of this.carousel_media) {
            media.image_versions2.candidates =
                [
                    media.image_versions2.candidates
                        .filter(item => item.height > item.width)
                        .sort((a, b) => b.height - a.height)[0],
                    media.image_versions2.candidates
                        .filter(item => item.width == item.height)
                        .sort((a, b) => b.height - a.height)[0],
                ]
        }
    }

    next();

});

export default mongoose.model('im', mediaSchema);