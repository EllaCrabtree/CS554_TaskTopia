const mongoCollections = require('../config/mongoCollections');

const users = mongoCollections.users;
const badges = mongoCollections.badges;
const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');
const buildingsData = require('./buildings');
const tasksData = require('./tasks');
const badgeData = require('./badges');


async function createUser(firstName, lastName, username, password, email) {
    console.log("in create user");
    //-----------------------------------Check Arguments-----------------------------------
    if (arguments.length !== 5) {
        throw `Error: Insufficient number of arguments!`
    }

    //-----------------------------------Check First Name-----------------------------------

    if (!firstName) {
        throw 'Error: First name not supplied!'
    }

    if (typeof firstName !== 'string') {
        throw 'Error: First name must be a string!'
    }

    if (firstName.trim().length === 0) {
        throw 'Error: First name cannot be empty or only spaces!'
    }

    const new_firstname = firstName.trim();


    //-----------------------------------Check Last Name-----------------------------------

    if (!lastName) {
        throw 'Error: Last name not supplied!'
    }

    if (typeof lastName !== 'string') {
        throw 'Error: Last name must be a string!'
    }

    if (lastName.trim().length === 0) {
        throw 'Error: Last name cannot be empty or only spaces!'
    }

    const new_lastname = lastName.trim();


    //-----------------------------------Check email-----------------------------------

    if (!email) {
        throw 'Error: Email not supplied!'
    }


    if (typeof email !== 'string') {
        throw 'Error: Email must be a string!'
    }


    if (email.trim().length === 0) {
        throw 'Error: Email cannot be empty or only spaces!'
    }


    const new_email = email.trim();

    console.log(new_email);

    const userCollection = await users(); //Initializing User Collection Variable
    const foundEmail = await userCollection.findOne({ email: new_email });

    if (foundEmail) {
        throw 'Error: Email already in use!'
    }

    // if (!emailValidator.validate(new_email)) {
    //     throw 'Error: Not a valid email address!'
    // }

    //-----------------------------------Check Username-----------------------------------

    if (!username) {
        throw 'Error: Username not supplied!'
    }

    if (typeof username !== 'string') {
        throw 'Error: Username must be a string!'
    }

    if (username.trim().length === 0) {
        throw 'Error: Username cannot be empty or only spaces!'
    }

    // Check username requirements - decide later
    const new_username = username.trim().toLowerCase();

    if (new_username.length < 4) {
        throw 'Server Error: Username must be at least 4 characters or longer!'
    }

    //check if username is within database
    const foundUser = await userCollection.findOne({ username: new_username });

    if (foundUser) {
        throw 'Error: Username already in use!'
    }

    //-----------------------------------Check Password-----------------------------------

    if (!password) {
        throw 'Error: Password not supplied!'
    }

    if (typeof password !== 'string') {
        throw 'Error: Password must be a string!'
    }

    if (password.trim().length === 0) {
        throw 'Error: Password cannot be empty or only spaces!'
    }

    //Check Password Conditions - Decide Later

    const new_password = password.trim();

    if (new_password.length < 8) {
        throw 'Error: Password must be 8 characters or longer!'
    }

    if (!(/[0-9]/.test(new_password))) {
        throw 'Error: Password must contain at least one number!'
    }

    if (!(/[$@*%#=+]/.test(new_password))) {
        throw 'Error: Password must contain at least one special character!'
    }

    const hash = await bcrypt.hash(new_password, 16);

    let newUser = {
        firstName: new_firstname,
        lastName: new_lastname,
        username: new_username,
        password: hash,
        email: new_email,
        buildings: [],
        level: 1,
        completionFreq: 1,
        awards: [],
        friends: []
    }

    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw 'Could not add user';

    const newId = insertInfo.insertedId;
    newUser = await getUserByUsername(new_username);
    return newUser;
}

async function checkUser(username, password) {

    //-----------------------------------Check Arguments-----------------------------------
    if (arguments.length !== 2) {
        throw `Server Error: Insufficient number of arguments!`
    }

    //-----------------------------------Check Username-----------------------------------

    if (!username) {
        throw 'Server Error: Username not supplied!'
    }

    if (typeof username !== 'string') {
        throw 'Server Error: Username must be a string!'
    }

    if (username.trim().length === 0) {
        throw 'Server Error: Username cannot be empty or only spaces!'
    }

    const new_username = username.trim().toLowerCase();;


    //check if username is within database
    const foundUser = await userCollection.findOne({ username: new_username });

    if (!foundUser) {
        throw 'Server Error: Incorrect username/password!'
    }

    //-----------------------------------Check Password-----------------------------------

    if (!password) {
        throw 'Server Error: Password not supplied!'
    }

    if (typeof password !== 'string') {
        throw 'Server Error: Password must be a string!'
    }

    if (password.trim().length === 0) {
        throw 'Server Error: Password cannot be empty or only spaces!'
    }

    //-----------------------------------Checking if Password is correct -----------------------------------

    const match = await bcrypt.compare(password.trim(), foundUser.password);

    if (match) {
        return { _id: foundUser._id.toString(), username: foundUser.username }
    } else {
        throw 'Server error: Invalid username/password!'
    }

}

async function getUserById(userId) {

    //-----------------------------------Check Arguments-----------------------------------
    if (arguments.length != 1) {
        throw 'Error: Invalid number of arguments!'
    }

    //-----------------------------------Check User ID-----------------------------------
    if (!userId) {
        throw 'Error: User ID not supplied!'
    }

    if (typeof userId !== 'string') {
        throw 'Error: User ID must be of type string!';
    }

    if (userId.trim().length === 0) {
        throw 'Error: User ID cannot be all spaces or empty!'
    }

    const newId = userId.trim();

    if (!ObjectId.isValid(newId)) {
        throw 'Error: User ID is not a valid ObjectID!'
    }

    const userCollection = await users()
    const user = await userCollection.findOne({ _id: ObjectId(newId) })

    if (!user) {
        throw 'Server Error: User not found for chosen ID';
    }

    user._id = user._id.toString();
    return user;
}

async function addBuildingToUser(username, building) {

    //-----------------------------------Check Arguments-----------------------------------
    if (arguments.length != 2) {
        throw 'Error: Invalid number of arguments!'
    }

    //-----------------------------------Check Username-----------------------------------
    if (!username) {
        throw 'Error: Username not supplied!'
    }

    if (typeof username !== 'string') {
        throw 'Error: Username must be a string!'
    }

    if (username.trim().length === 0) {
        throw 'Error: Username cannot be empty or only spaces!'
    }

    // Trim off spaces from username
    const new_username = username.trim().toLowerCase();;

    //Will not check username requirements (only in create)

    const userCollection = await users(); //Initializing User Collection Variable

    //check if username is within database
    const foundUser = await userCollection.findOne({ username: new_username });


    if (!foundUser) {
        throw 'Error: User not found!'
    }

    

    //-----------------------------------Check BuildingID-----------------------------------

    const {buildingID, type} = building;

    if (!buildingID) throw 'Error: Building ID not supplied!'
    if (typeof buildingID !== 'string') throw 'Error: Building ID must be of type string!';
    if (buildingID.trim().length === 0) throw 'Error: Building ID cannot be all spaces or empty!'

    const newBuildingID = buildingID.trim();

    if (!ObjectId.isValid(newBuildingID)) throw 'Error: Building ID is not a valid ObjectID!'

    const update = await userCollection.updateOne(
        { _id: ObjectId(foundUser._id) },
        { $addToSet: { buildings: building } }
    )

    if (!update.matchedCount && !update.modifiedCount) {
        throw 'AddBuildings: Update failed';
    }

    return newBuildingID;
}


/* Note for Bella - I'm working on the four functions above so if you want to do these five, that would be epic
    Also, you can add your own if you think we need more. These are just some I cam up with. There's also a 
    javascript file for testing the data functions within the data directory */


//This one we may want to do later once we understand how this is updated
// ~~ I agree, we'll wait
async function updateCompletionFrequency(username, completed) {
    //make sure to - username.toLowerCase();
}
/**
 * Gets a user by username
 * 
 * @param {String} username 
 * @returns the user with the given username
 */
async function getUserByUsername(username) {

    //-----------------------------------Check Arguments-----------------------------------
    if (arguments.length != 1) {
        throw 'Error: Invalid number of arguments!'
    }

    //-----------------------------------Check User ID-----------------------------------
    if (!username) {
        throw 'Error: Username is not supplied!'
    }

    if (typeof username !== 'string') {
        throw 'Error: Username must be of type string!';
    }

    if (username.trim().length === 0) {
        throw 'Error: Username cannot be all spaces or empty!'
    }

    const newUsername = username.trim().toLowerCase();;

    const userCollection = await users();
    await badgeData.giveUserAllBadges(username);
    const user = await userCollection.findOne({ username: newUsername });

    if (!user) {
        throw 'Server Error: User not found for chosen Username';
    }


    user.username = user.username.toString();
    return user;
}

/**
 * Updates the level of a user
 * 
 * @param {String} username 
 * @param {Int} newLevel 
 * @returns user with updated level
 */
async function updateLevel(username, newLevel) {

    if (arguments.length != 2) throw 'Error: Invalid number of arguments!'

    //-----------------------------------Check Username-----------------------------------

    if (!username) throw 'Error: Username not supplied!'

    if (typeof username !== 'string') throw 'Error: Username must be a string!'

    if (username.trim().length === 0) throw 'Error: Username cannot be empty or only spaces!'

    // Check username requirements - decide later
    const new_username = username.trim().toLowerCase();;

    //check if username is within database
    const userCollection = await users();
    const foundUser = await userCollection.findOne({ username: new_username });

    if (!foundUser) throw 'Error: User not found!'

    //-----------------------------------Check newLevel -----------------------------------

    if (!newLevel) throw 'Error: New Level not supplied!'

    if (!Number.isInteger(newLevel)) throw 'Error: New Level must be of type int!';

    // For now, going to saw the highest possible level is 100; can change later
    if (newLevel < 1) throw 'Error: New Level cannot be less than 1!'
    if (newLevel > 100) throw 'Error: New Level cannot be greater than 100!'

    const updatedInfo = await userCollection.updateOne({ username: username }, { $set: { level: newLevel } });
    if (updatedInfo.modifiedCount === 0) {
        throw 'Could Not Update User Successfully';
    }

    return await this.getUserById(foundUser._id);
}

/**
 * Adds a user to a user's friends list
 * 
 * @param {String} username 
 * @param {String} friendUsername 
 * @returns the user with updated friends list
 */
async function addFriend(username, friendUsername) {

    if (arguments.length != 2) throw 'Error: Invalid number of arguments!'

    //-----------------------------------Check Username-----------------------------------

    if (!username) throw 'Error: Username not supplied!'

    if (typeof username !== 'string') throw 'Error: Username must be a string!'

    if (username.trim().length === 0) throw 'Error: Username cannot be empty or only spaces!'

    // Check username requirements - decide later
    const new_username = username.trim().toLowerCase();;

    //check if username is within database
    const userCollection = await users();
    const foundUser = await userCollection.findOne({ username: new_username });

    if (!foundUser) throw 'Error: User not found!'

    //-----------------------------------Check friendUsername------------------------------

    if (!friendUsername) throw 'Error: friendUsername not supplied!'

    if (typeof friendUsername !== 'string') throw 'Error: friendUsername must be a string!'

    if (friendUsername.trim().length === 0) throw 'Error: friendUsername cannot be empty or only spaces!'

    // Check username requirements - decide later
    const new_friendUsername = friendUsername.trim().toLowerCase();;

    //check if username is within database
    const foundFriendUser = await userCollection.findOne({ username: new_friendUsername });

    if (!foundFriendUser) throw 'Error: friendUser not found!'

    //----------------------------Add new Friend to User's Friends-------------------------

    let new_friends = foundUser.friends.push(friendUsername);

    const updatedInfo1 = await userCollection.updateOne({ username: username }, { $set: { friends: new_friends } });
    if (updatedInfo1.modifiedCount === 0) {
        throw 'Could Not Update User Friends Successfully';
    }

    //----------------------------Add User to new Friend's Friends---------------------------

    let new_friends_friendUser = foundFriendUser.friends.push(username);

    const updatedInfo2 = await userCollection.updateOne({ username: friendUsername }, { $set: { friends: new_friends_friendUser } });
    if (updatedInfo2.modifiedCount === 0) {
        throw 'Could Not Update FriendUser Friends Successfully';
    }

    return await this.getUserById(foundUser._id);
}

/**
 * Removes a user to a user's friends list
 * 
 * @param {String} username 
 * @param {String} friendUsername 
 * @returns the user with updated friends list
 */
async function removeFriend(username, friendUsername) {

    if (arguments.length != 2) throw 'Error: Invalid number of arguments!'

    //-----------------------------------Check Username-----------------------------------

    if (!username) throw 'Error: Username not supplied!'

    if (typeof username !== 'string') throw 'Error: Username must be a string!'

    if (username.trim().length === 0) throw 'Error: Username cannot be empty or only spaces!'

    // Check username requirements - decide later
    const new_username = username.trim().toLowerCase();

    //check if username is within database
    const userCollection = await users();
    const foundUser = await userCollection.findOne({ username: new_username });

    if (!foundUser) throw 'Error: User not found!'

    //-----------------------------------Check friendUsername------------------------------

    if (!friendUsername) throw 'Error: friendUsername not supplied!'

    if (typeof friendUsername !== 'string') throw 'Error: friendUsername must be a string!'

    if (friendUsername.trim().length === 0) throw 'Error: friendUsername cannot be empty or only spaces!'

    // Check username requirements - decide later
    const new_friendUsername = friendUsername.trim().toLowerCase();

    //check if username is within database
    const foundFriendUser = await userCollection.findOne({ username: new_friendUsername });

    if (!foundFriendUser) throw 'Error: friendUser not found!'

    //----------------------------Remove Friend from User's Friends-------------------------

    let new_friends = foundUser.friends;

    for (var i = 0; i < new_friends.length; i++) {

        if (new_friends[i] === new_friendUsername) {
            new_friends.splice(i, 1);
        }
    }

    const updatedInfo1 = await userCollection.updateOne({ username: username }, { $set: { friends: new_friends } });
    if (updatedInfo1.modifiedCount === 0) {
        throw 'Could Not Update User Friends Successfully';
    }

    //----------------------------Add User to new Friend's Friends---------------------------

    let new_friends_friendUser = foundFriendUser.friends;

    for (var i = 0; i < new_friends_friendUser.length; i++) {

        if (new_friends_friendUser[i] === new_username) {
            new_friends_friendUser.splice(i, 1);
        }
    }

    const updatedInfo2 = await userCollection.updateOne({ username: friendUsername }, { $set: { friends: new_friends_friendUser } });
    if (updatedInfo2.modifiedCount === 0) {
        throw 'Could Not Update FriendUser Friends Successfully';
    }

    return await this.getUserById(foundUser._id);
}

/**
 * Deletes a user
 * 
 * @param {ObjectId} userId 
 * @returns true if the user is successfully deleted
 */
async function deleteUser(userId) {

    if (arguments.length != 1) throw 'Error: Invalid number of arguments!'

    //-----------------------------------Check userId -----------------------------------

    if (!userId) throw 'Error: UserID must be supplied!';

    if (typeof userId !== 'string') throw 'Error: UserID must be a string!';

    if (userId.trim().length === 0) throw 'Error: UserID cannot be an empty string or just spaces';

    userId = userId.trim();
    if (!ObjectId.isValid(userId)) throw 'Error: UserID given is an invalid object ID';

    const userCollection = await users();
    const deletionInfo = await userCollection.deleteOne({ _id: ObjectId(userId) });

    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete User with id of ${userId}`;
    }
    return { deleted: true };
}

module.exports = {
    createUser,
    checkUser,
    addBuildingToUser,
    updateCompletionFrequency,
    getUserByUsername,
    updateLevel,
    addFriend,
    removeFriend,
    deleteUser
}