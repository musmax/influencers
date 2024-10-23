import mongoose from "mongoose";

function transformUserData(oldDoc) {

    const newDoc = {
        _id: oldDoc._id,
        fetched: oldDoc.fetched,
        stats: {}
    };

    // Extract userId from contentDetails or snippet.customUrl
    if (oldDoc.contentDetails && oldDoc.contentDetails.relatedPlaylists && oldDoc.contentDetails.relatedPlaylists.uploads) {
        const uploadsId = oldDoc.contentDetails.relatedPlaylists.uploads;
        if (uploadsId.startsWith('UU')) {
            newDoc.userId = 'UC' + uploadsId.slice(2);
        }
    } else if (oldDoc.snippet && oldDoc.snippet.customUrl) {
        newDoc.userId = oldDoc.snippet.customUrl.replace(/^@/, '');
    }

    // Extract username from snippet.title
    if (oldDoc.snippet && oldDoc.snippet.title) {
        newDoc.username = oldDoc.snippet.title;
    }

    // Extract nickname from snippet.customUrl
    if (oldDoc.snippet && oldDoc.snippet.customUrl) {
        newDoc.nickname = oldDoc.snippet.customUrl.replace(/^@/, '');
    }

    // Extract statistics
    if (oldDoc.statistics) {
        if (oldDoc.statistics.subscriberCount && !oldDoc.statistics.hiddenSubscriberCount) {
            newDoc.stats.followers = parseInt(oldDoc.statistics.subscriberCount, 10);
        }
        if (oldDoc.statistics.viewCount) {
            newDoc.stats.views = parseInt(oldDoc.statistics.viewCount, 10);
        }
        if (oldDoc.statistics.videoCount) {
            newDoc.stats.media = parseInt(oldDoc.statistics.videoCount, 10);
        }
        // You can set defaults for likes and following if needed
        newDoc.stats.likes = 0;
        newDoc.stats.following = 0;
    }

    return newDoc;

}

export default transformUserData;