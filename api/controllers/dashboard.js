import logger from '../utils/logger.js';
import v2iua from '../models/instagram/archive/user.js';
import v2yua from '../models/youtube/archive/user.js';
import v2tua from '../models/tiktok/archive/user.js';
import user from '../models/user.js';
import v2iu from '../models/instagram/user.js'
import v2tu from '../models/tiktok/user.js';
import v2yu from '../models/youtube/user.js';
import v2tma from '../models/tiktok/archive/media.js'
import v2yma from '../models/youtube/archive/media.js'

const dashboard =  async function newDashboard(req, res) {
    logger.info("/dashboard accessed.");

    // lets get the users across board
    const totalInfluencers = await user.countDocuments();

    const allUsers = await user.find().lean();

    let influencerDataArray = await Promise.all(
        allUsers.map(async (index) => {
            const { username, tiktok, instagram, youtube } = index;
            // Query for the individual Instagram user in Mongoose
            const individualInstagram = await v2iu.findOne({
            $or: [
                { username: username }, 
                { username: tiktok }, 
                { username: instagram }
            ]
        });
            const individualTiktok = await v2tu.findOne({
                $or: [
                    { username: username }, 
                    { username: tiktok }, 
                    { username: instagram }
                ]
            });
            
            const individualYoutube = await v2yu.findOne({                 
                $or: [
                { username: username }, 
                { username: tiktok }, 
                { username: instagram }
            ] });

            let isUserActiveOnInstagram = individualInstagram !== null ? 'active' : 'not-active';
            let isUserActiveOnTiktok = individualTiktok !== null ? 'active' : 'not-active';
            let isUserActiveOnYoutube = individualYoutube !== null ? 'active' : 'not-active';

            let userInstagramUpload = await v2iua.findOne({ username: instagram }).sort({ createdAt: -1 });
            let totalUserInstagramUpload = userInstagramUpload !== null ? userInstagramUpload.stats.media: null;

            let userTiktokUpload = await v2tu.findOne({ username: tiktok }).sort({ createdAt: -1 });
            let totalUserTiktokUpload = userTiktokUpload !== null ? userTiktokUpload.stats.media: null;

            let userYoutubeUpload = await v2yu.findOne({ nickname: username }).sort({ createdAt: -1 });
            let totalUserYoutubeUpload = userYoutubeUpload !== null ? userYoutubeUpload.stats.media: null;

            const userMediaUploadArray = [totalUserInstagramUpload, totalUserTiktokUpload, totalUserYoutubeUpload];
            // lets filter out null if its present
            const filteredUserMediaUploadArray = userMediaUploadArray.filter((item) => item !== null);
            // let sum it up
            const sumUserMediaUpload = filteredUserMediaUploadArray.reduce((a, b) => a+b,0);

            let userInstagramFollower = await v2iua.findOne({ username: instagram }).sort({ createdAt: -1 });
            let totalUserInstagramFollower = userInstagramFollower !== null ? userInstagramUpload.stats.followers: null;

            let userTiktokFollower = await v2tu.findOne({ username: tiktok }).sort({ createdAt: -1 });
            let totalUserTiktokFollower = userTiktokFollower !== null ? userTiktokFollower.stats.followers: null;

            let userYoutubeFollower = await v2yu.findOne({ nickname: username }).sort({ createdAt: -1 });
            let totalUserYoutubeFollower = userYoutubeFollower !== null ? userYoutubeFollower.stats.followers: null;

            const userMediaFollowerArray = [totalUserInstagramFollower, totalUserTiktokFollower, totalUserYoutubeFollower];
            // lets filter out null if its present
            const filteredUserMediaFollowerArray = userMediaFollowerArray.filter((item) => item !== null);
            // let sum it up
            const sumUserMediaFollower = filteredUserMediaFollowerArray.reduce((a, b) => a+b, 0);

    // lets handle weekly upload per user
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const youtubeWeeklyUploads = await v2yu.aggregate([
        {
            $match: {
            "media.uploaded": { $gte: oneWeekAgo }
            }
        },
        {
            $project: {
            userId: 1,
            username: 1,
            weeklyMediaUploads: {
                $filter: {
                input: "$media",
                as: "mediaItem",
                cond: { $gte: ["$$mediaItem.uploaded", oneWeekAgo] }
                }
            }
            }
        },
        {
            $addFields: {
            totalWeeklyMediaUploads: { $size: "$weeklyMediaUploads" }
            }
        },
        {
            $project: {
            username: 1,
            totalWeeklyMediaUploads: 1
            }
        }
        ]);
        const instagramWeeklyUploads = await v2iu.aggregate([
        {
            $match: {
            "media.uploaded": { $gte: oneWeekAgo }
            }
        },
        {
            $project: {
            userId: 1,
            username: 1,
            weeklyMediaUploads: {
                $filter: {
                input: "$media",
                as: "mediaItem",
                cond: { $gte: ["$$mediaItem.uploaded", oneWeekAgo] }
                }
            }
            }
        },
        {
            $addFields: {
            totalWeeklyMediaUploads: { $size: "$weeklyMediaUploads" }
            }
        },
        {
            $project: {
            username: 1,
            totalWeeklyMediaUploads: 1
            }
        }
        ]);
        const tiktokWeeklyUploads = await v2tu.aggregate([
        {
            $match: {
            "media.uploaded": { $gte: oneWeekAgo }
            }
        },
        {
            $project: {
            userId: 1,
            username: 1,
            weeklyMediaUploads: {
                $filter: {
                input: "$media",
                as: "mediaItem",
                cond: { $gte: ["$$mediaItem.uploaded", oneWeekAgo] }
                }
            }
            }
        },
        {
            $addFields: {
            totalWeeklyMediaUploads: { $size: "$weeklyMediaUploads" }
            }
        },
        {
            $project: {
            username: 1,
            totalWeeklyMediaUploads: 1
            }
        }
        ]);

                let induvidualData = {
                    name: username,
                    profileImage: individualInstagram && individualInstagram.picture 
                        ? individualInstagram.picture 
                        : individualTiktok && individualTiktok.picture
                        ? individualTiktok.picture
                        : individualYoutube && individualYoutube.picture
                        ? individualYoutube.picture
                        : null,
                    activePlatforms: {
                        instagram: isUserActiveOnInstagram,
                        tiktok: isUserActiveOnTiktok,
                        youtube: isUserActiveOnYoutube
                    },
                    uploadedMedia: {
                        instagram: totalUserInstagramUpload,
                        tiktok: totalUserTiktokUpload,
                        youtube: totalUserYoutubeUpload,
                        total:sumUserMediaUpload
                    },
                    followers: {
                        instagram: totalUserInstagramFollower,
                        tiktok: totalUserTiktokFollower,
                        youtube: totalUserYoutubeFollower,
                        total: sumUserMediaFollower
                    },
                    weeklyMediaUploads: {
                        youtube: youtubeWeeklyUploads.length > 0 ? youtubeWeeklyUploads[0].totalWeeklyMediaUploads : 0,
                        instagram: instagramWeeklyUploads.length > 0 ? instagramWeeklyUploads[0].totalWeeklyMediaUploads : 0,
                        tiktok: tiktokWeeklyUploads.length > 0 ? tiktokWeeklyUploads[0].totalWeeklyMediaUploads : 0
                    },
                    weeklySubscribers: {
                        youtube: youtubeWeeklyUploads.length > 0 ? youtubeWeeklyUploads[0].totalWeeklyMediaUploads : 0,
                        instagram: instagramWeeklyUploads.length > 0 ? instagramWeeklyUploads[0].totalWeeklyMediaUploads : 0,
                        tiktok: tiktokWeeklyUploads.length > 0 ? tiktokWeeklyUploads[0].totalWeeklyMediaUploads : 0
                    },
                };     
                return induvidualData;       
            })
        );
    
    // Get the count of documents for each platform profile
    let instagramInfluencersProfile = await v2iua.aggregate([
        {
        $group: {
            _id: "$username"
        }
        },
        {
        $count: "uniqueUsernames"
        }
    ]);
    
    let youtubeInfluencersProfile = await v2yu.aggregate([
        {
        $group: {
            _id: "$username"
        }
        },
        {
        $count: "uniqueUsernames"
        }
    ]);
    
    let tiktokInfluencersProfile = await v2tua.aggregate([
        {
        $group: {
            _id: "$username"
        }
        },
        {
        $count: "uniqueUsernames"
        }
    ]);
    
    // Extract the count from each result
    const instagramCount = instagramInfluencersProfile.length > 0 ? instagramInfluencersProfile[0].uniqueUsernames : 0;
    const youtubeCount = youtubeInfluencersProfile.length > 0 ? youtubeInfluencersProfile[0].uniqueUsernames : 0;
    const tiktokCount = tiktokInfluencersProfile.length > 0 ? tiktokInfluencersProfile[0].uniqueUsernames : 0;
    
    // Calculate the total
    const totalInfluencersProfile = instagramCount + youtubeCount + tiktokCount;
      
    let instagramUsers = await v2iua.aggregate([
        {
          $group: {
            _id: "$username",         
            doc: { $first: "$$ROOT" },  
            stats: { $first: "$stats" } 
          }
        }
      ]);       
    let youtubeUsers = await v2yua.aggregate([
        {
          $group: {
            _id: "$username",         
            doc: { $first: "$$ROOT" },  
            stats: { $first: "$stats" } 
          }
        }
      ]);       
    let tiktokUsers = await v2tua.aggregate([
        {
          $group: {
            _id: "$username",         
            doc: { $first: "$$ROOT" },  
            stats: { $first: "$stats" } 
          }
        }
      ]);       

    let instagramMediaArray = instagramUsers.map((instagramUser) => instagramUser.stats.media);
    let totalInstagramMedia = instagramMediaArray.reduce((counter,initial) => counter + initial, 0);
    
    let youtubeMediaArray = youtubeUsers.map((youtubeUser) => youtubeUser.stats.media);
    let totalYoutubeMedia = youtubeMediaArray.reduce((counter,initial) => counter + initial, 0);

    let tiktokMediaArray = tiktokUsers.map((tiktokUser) => tiktokUser.stats.media);
    let totalTiktokMedia = tiktokMediaArray.reduce((counter,initial) => counter + initial, 0);

    const totalMedia = totalInstagramMedia + totalYoutubeMedia + totalTiktokMedia;

    // lets now break this down further by using fetched date month

    let instagramFollowerArray = instagramUsers.map((instagramUser) => instagramUser.stats?.followers || 0);
    let totalInstagramFollower = instagramFollowerArray.reduce((counter,initial) => counter + (initial || 0), 0);
    
    let youtubeFollowersArray = youtubeUsers.map((youtubeUser) => youtubeUser.stats?.followers || 0);
    let totalYoutubeFollower = youtubeFollowersArray.reduce((counter, current) => counter + (current || 0), 0);
    
    let tiktokFollowersArray = tiktokUsers.map((tiktokUser) => tiktokUser.stats?.followers || 0);
    let totalTiktokFollower = tiktokFollowersArray.reduce((counter,initial) => counter + (initial || 0), 0);

    const totalFollowers = totalInstagramFollower + totalYoutubeFollower + totalTiktokFollower;

    // Aggregate Instagram unique media by month based on unique username
// Aggregate Instagram unique media by month based on unique username
let instagramMediaByMonth = await v2iua.aggregate([
    {
        $group: {
            _id: {
                month: { $month: "$fetched" },
                username: "$username" // Group by username and month
            },
            totalInstagramMedia: { $max: "$stats.media" } // Ensure we're taking max media per user
        }
    },
    {
        $group: {
            _id: "$_id.month", // Now group by month alone
            instagram: { $sum: "$totalInstagramMedia" } // Sum unique media per month
        }
    },
    {
        $project: {
            _id: 0,
            month: "$_id", // Project the month field
            instagram: 1 // Include Instagram count
        }
    }
]);

// Similar aggregation for YouTube
let youtubeMediaByMonth = await v2yua.aggregate([
    {
        $group: {
            _id: {
                month: { $month: "$fetched" },
                username: "$username"
            },
            totalYouTubeMedia: { $max: "$stats.media" } // Use max media per user to avoid duplication
        }
    },
    {
        $group: {
            _id: "$_id.month",
            youtube: { $sum: "$totalYouTubeMedia" }
        }
    },
    {
        $project: {
            _id: 0,
            month: "$_id",
            youtube: 1
        }
    }
]);

// TikTok aggregation
let tiktokMediaByMonth = await v2tua.aggregate([
    {
        $group: {
            _id: {
                month: { $month: "$fetched" },
                username: "$username"
            },
            totalTikTokMedia: { $max: "$stats.media" }
        }
    },
    {
        $group: {
            _id: "$_id.month",
            tiktok: { $sum: "$totalTikTokMedia" }
        }
    },
    {
        $project: {
            _id: 0,
            month: "$_id",
            tiktok: 1
        }
    }
]);

    // Combine results into one array based on month
    let combinedMediaByMonth = instagramMediaByMonth.map((instagramData) => {
        let youtubeData = youtubeMediaByMonth.find(y => y.month === instagramData.month) || { youtube: 0 };
        let tiktokData = tiktokMediaByMonth.find(t => t.month === instagramData.month) || { tiktok: 0 };

        return {
            month: instagramData.month,
            instagram: instagramData.instagram,
            youtube: youtubeData.youtube,
            tiktok: tiktokData.tiktok
        };
    });
            
        let dataDashboard = {
            totalInfluencersAcrossPlatform: totalInfluencers,
            totalInfluencersProfileAcrossPlatform: {
                instagram: instagramCount,
                youtube: youtubeCount,
                tiktok: tiktokCount,
                total: totalInfluencersProfile,
            },
            totalMediaAcrossPlatform: {
                instagram: totalInstagramMedia,
                youtube: totalYoutubeMedia,
                tiktok: totalTiktokMedia,
                total: totalMedia,
                monthlyBreakdown: combinedMediaByMonth
            },
            totalFollowersAcrossPlatform: {
                instagram: totalInstagramFollower,
                youtube: totalYoutubeFollower,
                tiktok: totalTiktokFollower,
                total: totalFollowers
            },
            influencerDataBreakdown: influencerDataArray
        };
        
        res.status(200).json({
            message: 'success',
            data: dataDashboard
        });
    
}

const likes = async function filteringBasedOnLikes(req, res) {
    const { mixed, youtube, instagram, tiktok } = req.query;

    if (tiktok) {
        const topLikedVideosInfluencersForTiktok = await v2tma.aggregate([
            // Group by username and sum the total likes for each user
            {
                $group: {
                    _id: "$user.username",
                    name: { $first: "$user.full_name" }, // Get the full name
                    totalLikes: { $sum: "$stats.likes" } // Sum the likes for each user
                }
            },
            // Sort by total likes in descending order
            { $sort: { totalLikes: -1 } },
            // Limit the result to the top 3 users
            { $limit: 6 },
        ]);

        const totalLikes = await v2tma.aggregate([
            {
                $group: {
                    _id: null,
                    totalLikesSum: { $sum: "$stats.likes" }
                }
            }
        ]);

        // Add percentage calculation
        const topThreeTiktokers = topLikedVideosInfluencersForTiktok.map(influencer => ({
            name: influencer.name,
            percentage: `${((influencer.totalLikes / totalLikes[0].totalLikesSum) * 100).toFixed(2)}%`
        }));

        return res.status(200).json({
            message: 'success',
            data: { topSixTiktoker: topThreeTiktokers }
        });
    }

    if (youtube) {
        const topLikedVideosInfluencersForYoutube = await v2yma.aggregate([
            // Group by username and sum the total likes for each user
            {
                $group: {
                    _id: "$user.username",
                    name: { $first: "$user.full_name" }, // Get the full name
                    totalLikes: { $sum: "$stats.likes" } // Sum the likes for each user
                }
            },
            // Sort by total likes in descending order
            { $sort: { totalLikes: -1 } },
            // Limit the result to the top 3 users
            { $limit: 6 },
        ]);

        const totalLikes = await v2yma.aggregate([
            {
                $group: {
                    _id: null,
                    totalLikesSum: { $sum: "$stats.likes" }
                }
            }
        ]);

        // Add percentage calculation
        const topThreeYoutubers = topLikedVideosInfluencersForYoutube.map(influencer => ({
            name: influencer.name,
            percentage: `${((influencer.totalLikes / totalLikes[0].totalLikesSum) * 100).toFixed(2)}%`
        }));

        return res.status(200).json({
            message: 'success',
            data: { topThreeYoutuber: topThreeYoutubers }
        });
    }

    if (instagram) {
        return res.status(200).json({
            message: 'Instagram functionality not implemented yet',
            data: null
        });
    }

    // If no specific platform is passed, fetch the most liked for TikTok and YouTube
    const mostLikedTiktok = await v2tma.aggregate([
        {
            $group: {
                _id: "$user.username",
                name: { $first: "$user.full_name" },
                totalLikes: { $sum: "$stats.likes" }
            }
        },
        { $sort: { totalLikes: -1 } },
        { $limit: 2 },
    ]);

    const mostLikedYoutube = await v2yma.aggregate([
        {
            $group: {
                _id: "$user.username",
                name: { $first: "$user.full_name" },
                totalLikes: { $sum: "$stats.likes" }
            }
        },
        { $sort: { totalLikes: -1 } },
        { $limit: 2 },
    ]);

    const returnResponse = {
        mostLikedTiktoker: mostLikedTiktok || null,
        mostLikedYoutuber: mostLikedYoutube[0] || null,
        mostLikedInstagram: null,
    };

    return res.status(200).json({
        message: 'success',
        data: returnResponse
    });
};


export  {
    dashboard,
    likes
}

