const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");


async function createUser(fisrtName, lastName, username, password, email) {
    //Check Arguments


    //Check First Name

    //Check Last Name

    //Check email

    //Check Username

    //Check Password

}

async function checkUser(username, password) {

}

async function addBuildingToUser(username, buildingID) {

}

async function updateLevel(username, newLevel) {

}

async function updateCompletionFrequency(username, completed) {

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
    addBuildingToUser
}