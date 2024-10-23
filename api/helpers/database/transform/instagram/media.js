import mongoose from "mongoose";

function transformMediaData(data) {
    const mediaB = {
        _id: new mongoose.Types.ObjectId(),
        mediaId: data.id || data.pk || data._id || null,
        description: data.caption && data.caption.text ? data.caption.text : null,
        cover: null,
        duration: data.video_duration || null,
        uploaded: data.taken_at ? new Date(data.taken_at * 1000) : null,
        comments: [],
        location: data.location ? {
            _id: false,
            pk: data.location.pk || null,
            name: data.location.name || null,
            address: data.location.address || null,
            city: data.location.city || null,
            lng: data.location.lng || null,
            lat: data.location.lat || null
        } : null,
        stats: {
            _id: false,
            likes: data.like_count || 0,
            plays: data.play_count || 0,
            comments: data.comment_count || 0,
            shares: 0,
            saves: 0
        },
        fetched: new Date()
    };

    if (data.image_versions2 && Array.isArray(data.image_versions2.candidates)) {
        const portraitImages = data.image_versions2.candidates
            .filter(item => item?.height > item?.width)
            .sort((a, b) => b?.height - a?.height);

        const squareImages = data.image_versions2.candidates
            .filter(item => item?.width === item?.height)
            .sort((a, b) => b?.height - a?.height);

        const selectedImages = [];
        if (portraitImages.length > 0) selectedImages.push(portraitImages[0]);
        if (squareImages.length > 0) selectedImages.push(squareImages[0]);

        if (selectedImages.length > 0) {
            mediaB.cover = selectedImages[0]?.url || null;
        } else {
            mediaB.cover = data.image_versions2.candidates[0]?.url || null;
        }
    }

    return mediaB;
}

export default transformMediaData;