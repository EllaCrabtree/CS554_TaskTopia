const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const router = express.Router();
const data = require('../data');
const buildingData = data.buildings;
const badgeData = data.badges;
const avatarData = require('../data/avatar.js')
const { ObjectId } = require("mongodb");

// var storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function(req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// })

// var upload = multer({storage: storage}).single('img')

router.get('/:avatarID', async (req, res) => {
    try {


        const avatarID = req.params.avatarID
        // console.log(avatarID)

        console.log('urmom')
        const getAvatar = await avatarData.getAvatar(avatarID);
        console.log('urmom2')
        res.json(getAvatar);
    } catch (e) {
        console.log(e);
    }
});

router.post('/', async (req, res) => {
    // console.log(req.headers)
    // console.log(req)
    const {name, img, welcomeList, niceList, meanList, buildingID} = req.body;
    console.log(req.body)
    // let filePath = `../files/kikimonster.jpg`;
    // console.log(req.body.img.split(',')[1]);
    // let buffer = Buffer.from(req.body.img.split(',')[1], "base64");
    // console.log(img);

    // fs.writeFileSync(path.join(__dirname, filePath), buffer);
    // console.log('woooooo')
    // upload(req, res, (err) => {
    //     if (err) {
    //         console.log(req)
    //         console.log(err)
    //     } else {
    //         console.log(req.file.path);
    //     }
    // })



    try {
        console.log('Im uploading avatar')
        console.log(name)
        const createdAvatar = await avatarData.createAvatar(name, img, welcomeList, niceList, meanList);
        await buildingData.addAvatarToBuilding(buildingID, createdAvatar._id);
        // console.log('we did it')
        // res.json({data: 'ok'});
        res.json(createdAvatar);
    } catch (e) {
        console.log(e);
    }

});

module.exports = router;