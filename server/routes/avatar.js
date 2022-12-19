const express = require('express');

const router = express.Router();
const data = require('../data');
const buildingData = data.buildings;
const badgeData = data.badges;
const avatarData = require('../data/avatar.js')
const { ObjectId } = require("mongodb");

router.get('/', async (req, res) => {
    try {
        console.log('urmom')
        const getAvatar = await avatarData.getAvatar('639fd9c54812bb1bc217a88f', 'urmom');
        console.log('urmom2')
        res.json(getAvatar);
    } catch (e) {
        console.log(e);
    }
});

router.post('/', async (req, res) => {
    // console.log(req.headers)
    // console.log(req)
    const {img} = req.body;
    // console.log(img);

    try {
        console.log('Im uploading avatar')
        const createdAvatar = await avatarData.createAvatar('1', 'Mom', img, [], [], []);
        console.log('we did it')
        res.json({data: 'ok'});
    } catch (e) {
        console.log(e);
    }

});

module.exports = router;