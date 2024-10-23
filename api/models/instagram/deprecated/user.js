import mongoose from 'mongoose';

// The Youtube info is quite well filtered - there is no need for
// strict schema that will filter out the userless stuff from the response

const userSchema = mongoose.Schema({
    _id: { type: String },
    biography: { type: String },
    bio_links: {
        type: [{
            _id: false,
            title: { type: String },
            url: { type: String },
            link_type: { type: String }
        }],
    },
    fb_profile_biolink: { type: Object },
    biography_with_entities: {
        type: {
            _id: false,
            entities: { type: [Object] }
        }
    },
    external_url: { type: String },
    edge_followed_by: {
        type: {
            _id: false,
            count: Number
        }
    },
    edge_follow: {
        type: {
            _id: false,
            count: Number
        }
    },
    fbid: { type: String },
    full_name: { type: String },
    highlight_reel_count: { type: Number },
    hide_like_and_view_counts: { type: Boolean },
    id: { type: String },
    is_business_account: { type: Boolean },
    is_professional_account: { type: Boolean },
    business_address_json: { type: String },
    business_contact_method: { type: String },
    business_email: { type: String },
    business_phone_number: { type: String },
    business_category_name: { type: String },
    overall_category_name: { type: String },
    category_enum: { type: String },
    category_name: { type: String },
    is_private: { type: Boolean },
    is_verified: { type: Boolean },
    is_verified_by_mv4b: { type: Boolean },
    is_regulated_c18: { type: Boolean },
    profile_pic_url: { type: String },
    profile_pic_url_hd: { type: String },
    username: { type: String },
    connected_fb_page: { type: String },
    pronouns: { type: Array },
    edge_owner_to_timeline_media: {
        type: {
            _id: false,
            count: { type: Number },
        }
    },
    media: {
        type: [{
            _id: false,
            uploaded: { type: String },
            id: { type: String, ref: 'im' }
        }]
    },
    fetched: { type: Date, default: Date.now },
    active: { type: Boolean, default: true }
});

export default mongoose.model('iu', userSchema);