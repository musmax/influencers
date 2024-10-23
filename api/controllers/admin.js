import jwt       from 'jsonwebtoken';
import logger    from '../utils/logger.js';
import Admin     from '../models/admin.js';

export async function login(req, res) {
  
    let { username, password } = req.body;
  
    username = username.trim();
    password = password.trim();
    
    logger.success("user/login called with username: " + username);
    console.log(await Admin.find().lean());

    const user = await Admin.findOne({ username: username, password: password }).lean();
    if (!user) {
        logger.error(`User with username "${username}" and password "${password}" not found`);
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = jwt.sign(
        {
            userId:   user._id,
            username: user.username,
            userType: "admin"
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" });

    res.status(200).json({
        message: "Success",
        data:    {
            user:  user,
            token: token
        }
    });

};

export default { login };