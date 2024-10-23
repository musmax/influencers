// This class could make it easier to work with the Stats data for single 
// influecner comming from the database... 

class UserWrapper {
    constructor(instagram, tiktok, youtube) {
        this.getFollowers = () => {
            return {
                instagram: instagram?.stats.followers,
                tiktok:    tiktok   ?.stats.followers,
                youtube:   youtube  ?.stats.followers
            };
        };
        this.getTotalMedia = () => {/*...*/}
        this.getTotalLikes = () => {/*...*/}
    }
}

export default UserWrapper;