import mongoose from 'mongoose';

// Helper function to parse ISO 8601 duration to total seconds
function parseISODurationToSeconds(duration) {
    const regex = /P(?:([\d.]+)Y)?(?:([\d.]+)M)?(?:([\d.]+)W)?(?:([\d.]+)D)?T?(?:([\d.]+)H)?(?:([\d.]+)M)?(?:([\d.]+)S)?/;
    const matches = duration.match(regex);

    const years = parseFloat(matches[1]) || 0;
    const months = parseFloat(matches[2]) || 0;
    const weeks = parseFloat(matches[3]) || 0;
    const days = parseFloat(matches[4]) || 0;
    const hours = parseFloat(matches[5]) || 0;
    const minutes = parseFloat(matches[6]) || 0;
    const seconds = parseFloat(matches[7]) || 0;

    // Convert all to seconds (approximate values for months and years)
    const totalSeconds =
        seconds +
        minutes * 60 +
        hours * 3600 +
        days * 86400 +
        weeks * 604800 +
        months * 2629800 + // Average month in seconds
        years * 31557600;  // Average year in seconds

    return totalSeconds;
}

function transformMediaData(oldData) {
    const newData = {};

    // Generate a new ObjectId for _id
    newData._id = new mongoose.Types.ObjectId();

    // Map mediaId from old video_id or _id
    newData.mediaId = oldData.video_id || oldData._id;

    // Map description from snippet.description
    if (oldData.snippet && oldData.snippet.description) {
        newData.description = oldData.snippet.description;
    }

    // Map cover from snippet.thumbnails (prefer maxres, then high)
    if (oldData.snippet && oldData.snippet.thumbnails) {
        if (oldData.snippet.thumbnails.maxres && oldData.snippet.thumbnails.maxres.url) {
            newData.cover = oldData.snippet.thumbnails.maxres.url;
        } else if (oldData.snippet.thumbnails.high && oldData.snippet.thumbnails.high.url) {
            newData.cover = oldData.snippet.thumbnails.high.url;
        } else {
            // Fallback to default thumbnail
            newData.cover = oldData.snippet.thumbnails.default.url;
        }
    }

    // Map duration from contentDetails.duration (convert ISO 8601 duration to seconds)
    if (oldData.contentDetails && oldData.contentDetails.duration) {
        newData.duration = parseISODurationToSeconds(oldData.contentDetails.duration);
    }

    // Map uploaded date from snippet.publishedAt
    if (oldData.snippet && oldData.snippet.publishedAt) {
        newData.uploaded = new Date(oldData.snippet.publishedAt);
    }

    // Initialize comments as an empty array (since comments data isn't provided)
    newData.comments = [];

    // Location data isn't available in the old data
    newData.location = undefined;

    // Map stats from statistics
    newData.stats = {
        likes: oldData.statistics && oldData.statistics.likeCount
            ? parseInt(oldData.statistics.likeCount, 10)
            : 0,
        plays: oldData.statistics && oldData.statistics.viewCount
            ? parseInt(oldData.statistics.viewCount, 10)
            : 0,
        comments: oldData.statistics && oldData.statistics.commentCount
            ? parseInt(oldData.statistics.commentCount, 10)
            : 0,
        shares: 0, // Not available in the old data
        saves: 0   // Not available in the old data
    };

    // Map fetched date
    newData.fetched = oldData.fetched ? new Date(oldData.fetched) : new Date();

    return newData;
}

export default transformMediaData;
