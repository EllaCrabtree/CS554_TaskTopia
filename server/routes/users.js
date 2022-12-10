const express = require('express');

const router = express.Router();
const data = require('../data');
const userData = data.users;
const badgeData = data.badges;
const { ObjectId } = require("mongodb");

router.get('/:username', async (req, res) => {
    //User info
    //Display user info
})

module.exports = router;