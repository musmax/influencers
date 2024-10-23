import mongoose from 'mongoose';

function transformMediaData(oldDoc) {
    const newDoc = {
        _id:     new mongoose.Types.ObjectId(),
        fetched: oldDoc.fetched,
        stats: {}
    };

    // Extract mediaId from thumbnail URL
    let videoId = null;
    if (
        oldDoc.snippet &&
        oldDoc.snippet.thumbnails &&
        oldDoc.snippet.thumbnails.default &&
        oldDoc.snippet.thumbnails.default.url
    ) {
        const thumbnailUrl = oldDoc.snippet.thumbnails.default.url;
        const match = thumbnailUrl.match(/\/vi\/([^\/]+)\//);
        if (match && match[1]) {
            videoId = match[1];
        }
    }

    if (videoId) {
        newDoc.mediaId = videoId;
    } else {
        // Handle the case when videoId is not found
        console.error('Video ID not found in old document');
    }

    // Extract user information
    if (oldDoc.snippet && oldDoc.snippet.channelTitle) {
        newDoc.user = {
            full_name: oldDoc.snippet.channelTitle,
            username: oldDoc.snippet.channelTitle // You can set this to null if preferred
        };
    }

    // Extract stats
    if (oldDoc.statistics) {
        newDoc.stats.likes = parseInt(oldDoc.statistics.likeCount, 10) || 0;
        newDoc.stats.views = parseInt(oldDoc.statistics.viewCount, 10) || 0;
        newDoc.stats.comments = parseInt(oldDoc.statistics.commentCount, 10) || 0;
        newDoc.stats.saves = parseInt(oldDoc.statistics.favoriteCount, 10) || 0;
        newDoc.stats.shares = 0;
    }

    return newDoc;
}

export default transformMediaData;
