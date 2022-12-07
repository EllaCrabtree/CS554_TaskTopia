const mongoCollections = require('../config/mongoCollections');

const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');


async function createUser(firstName, lastName, username, password, email) {

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

    const userCollection = await users(); //Initializing User Collection Variable
    const foundEmail = await userCollection.findOne({email: new_email});

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
    const new_username = username.trim();

    
    //check if username is within database
    const foundUser = await userCollection.findOne({username: new_username});

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

    const hash = await bcrypt.hash(password.trim(), 16);

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

    const insertInfo = await userCollection.insertOne(newUser)
    if (insertInfo.insertedCount === 0) throw 'Could not add user';

    const newId = insertInfo.insertedId;
    newUser = await getUserById(newId.toString())
    return newUser 
}

async function checkUser(username, password) {

}

async function getUserById(userId) {
    if (arguments.length != 1) {
        throw 'Error: Invalid number of arguments!'
    }

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
    const user = await userCollection.findOne({_id: ObjectId(newId)})
    
    if (!user) {
        throw 'Server Error: User not found for chosen ID';
    }

    user._id = user._id.toString();
    return user;
}

async function addBuildingToUser(username, buildingID) {
    if (arguments.length != 2) {
        throw 'Error: Invalid number of arguments!'
    }

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
    const new_username = username.trim();

    
    const userCollection = await users(); //Initializing User Collection Variable

    //check if username is within database
    const foundUser = await userCollection.findOne({username: new_username});


    if (!foundUser) {
        throw 'Error: User not found!'
    }

    //-----------------------------------Check BuildingID-----------------------------------

    if (!buildingID) throw 'Error: Building ID not supplied!'
    if (typeof buildingID !== 'string') throw 'Error: Building ID must be of type string!';
    if (buildingID.trim().length === 0) throw 'Error: Building ID cannot be all spaces or empty!'

    const newBuildingID = buildingID.trim();

    if (!ObjectId.isValid(newBuildingID)) throw 'Error: Building ID is not a valid ObjectID!'




}


/* Note for Bella - I'm working on the four functions above so if you want to do these five, that would be epic
    Also, you can add your own if you think we need more. These are just some I cam up with. There's also a 
    javascript file for testing the data functions within the data directory */


//This one we may want to do later once we understand how this is updated
async function updateCompletionFrequency(username, completed) {

}

async function updateLevel(username, newLevel) {

}

async function addAwardToUser(username, award) {

}

async function addFriend(username, friendUsername) {

}

async function removeFriend(username, friendUsername) {

}

module.exports = {
    createUser,
    checkUser,
    addBuildingToUser,
    updateCompletionFrequency,
    updateLevel,
    addAwardToUser,
    addFriend,
    removeFriend
}