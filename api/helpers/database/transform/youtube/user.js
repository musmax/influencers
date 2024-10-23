
import mongoose from "mongoose";

function transformUserData(oldData) {
    const newData = {};

    // Generate a new ObjectId for _id
    newData._id = new mongoose.Types.ObjectId();

    // Map userId from old _id
    newData.userId = oldData._id;

    // Map username from snippet.customUrl (remove '@' if present)
    if (oldData.snippet && oldData.snippet.customUrl) {
        newData.username = oldData.snippet.customUrl.replace(/^@/, '');
    }

    // Map nickname and fullname from snippet.title
    if (oldData.snippet && oldData.snippet.title) {
        newData.nickname = oldData.snippet.title;
        newData.fullname = oldData.snippet.title;
    }

    // Map picture from snippet.thumbnails.high.url
    if (
        oldData.snippet &&
        oldData.snippet.thumbnails &&
        oldData.snippet.thumbnails.high &&
        oldData.snippet.thumbnails.high.url
    ) {
        newData.picture = oldData.snippet.thumbnails.high.url;
    }

    // Map verified from active
    newData.verified = typeof oldData.active === 'boolean' ? oldData.active : false;

    // Assume private is false (since data is not provided)
    newData.private = false;

    // Map region if available
    newData.region = oldData.snippet && oldData.snippet.country ? oldData.snippet.country : undefined;

    // Map description from snippet.description
    if (oldData.snippet && oldData.snippet.description) {
        newData.description = oldData.snippet.description;
    }

    // Set category to 'YouTube' or use oldData.kind if preferred
    newData.category = 'YouTube';

    // Map stats
    newData.stats = {
        following: 0, // Assuming 0 as data is not available
        followers: oldData.statistics && oldData.statistics.subscriberCount
            ? parseInt(oldData.statistics.subscriberCount, 10)
            : 0,
        media: oldData.statistics && oldData.statistics.videoCount
            ? parseInt(oldData.statistics.videoCount, 10)
            : 0,
        likes: 0 // Total likes are not available for YouTube channels
    };

    // Map fetched date
    newData.fetched = oldData.fetched ? new Date(oldData.fetched) : new Date();

    // Map media from videos
    newData.media = Array.isArray(oldData.videos)
        ? oldData.videos.map(video => ({
              uploaded: video.uploaded,
              id: video.id
          }))
        : [];

    return newData;
}

export default transformUserData;