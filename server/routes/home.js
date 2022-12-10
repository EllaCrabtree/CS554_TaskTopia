const express = require('express');

const router = express.Router();
const data = require('../data');
const userData = data.users;
const badgeData = data.badges;
const { ObjectId } = require("mongodb");

router.get('/', (req, res) => {
    //Home Page
    //links to login, signup, has description of website
});

router.get('/login', (req, res) => {

});

router.post('/login', async (req, res) => {

});

router.get('/signup', (req, res) => {

});

router.post('/signup', async (req, res) => {
    
});


module.exports = router;