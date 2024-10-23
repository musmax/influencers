import logger from '../utils/logger.js';
import v2iua from '../models/instagram/archive/user.js';
import v2yua from '../models/youtube/archive/user.js';
import v2tua from '../models/tiktok/archive/user.js';
import user from '../models/user.js';
import v2iu from '../models/instagram/user.js'
import v2tu from '../models/tiktok/user.js';
import v2yu from '../models/youtube/user.js';

export async function newDashboard(req, res) {
    logger.info("/dashboard accessed.");

    // lets get the users across board
    const totalInfluencers = await user.countDocuments();

    const allUsers = await user.find().lean();

    let influencerDataArray = await Promise.all(
        allUsers.map(async (index) => {
            const { username, tiktok, instagram, youtube } = index;
            console.log(username)
            // Query for the individual Instagram user in Mongoose
        const individualInstagram = await v2iua.findOne({
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
    
    console.log(totalInfluencersProfile);
  
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
    console.log(instagramMediaArray);
    let totalInstagramMedia = instagramMediaArray.reduce((counter,initial) => counter + initial, 0);
    
    let youtubeMediaArray = youtubeUsers.map((youtubeUser) => youtubeUser.stats.media);
    let totalYoutubeMedia = youtubeMediaArray.reduce((counter,initial) => counter + initial, 0);

    let tiktokMediaArray = tiktokUsers.map((tiktokUser) => tiktokUser.stats.media);
    let totalTiktokMedia = tiktokMediaArray.reduce((counter,initial) => counter + initial, 0);

    const totalMedia = totalInstagramMedia + totalYoutubeMedia + totalTiktokMedia;

    let instagramFollowerArray = instagramUsers.map((instagramUser) => instagramUser.stats?.followers || 0);
    let totalInstagramFollower = instagramFollowerArray.reduce((counter,initial) => counter + (initial || 0), 0);
    
    let youtubeFollowersArray = youtubeUsers.map((youtubeUser) => youtubeUser.stats?.followers || 0);
    let totalYoutubeFollower = youtubeFollowersArray.reduce((counter, current) => counter + (current || 0), 0);
    

    let tiktokFollowersArray = tiktokUsers.map((tiktokUser) => tiktokUser.stats?.followers || 0);
    let totalTiktokFollower = tiktokFollowersArray.reduce((counter,initial) => counter + (initial || 0), 0);

    const totalFollowers = totalInstagramFollower + totalYoutubeFollower + totalTiktokFollower;

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

export default { newDashboard };
