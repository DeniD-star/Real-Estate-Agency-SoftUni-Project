const User = require('../models/User');

async function createUser(name, username, hashedPassword){
    const user = new User({
      name,
        username,
        hashedPassword
    })

    await user.save();
    console.log(user);
    return user;
}

async function getUserByUsername(username){
    const pattern = new RegExp(`^${username}$`, 'i')
    const user = await User.findOne({username: {$regex: pattern}});
    return user;
}
async function getUserByName(name){
    const pattern = new RegExp(`^${name}$`, 'i')
    const user = await User.findOne({name: {$regex: pattern}});
    return user;
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserByName
}