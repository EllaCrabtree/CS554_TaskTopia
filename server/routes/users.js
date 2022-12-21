const express = require('express');

const router = express.Router();
const data = require('../data');
const userData = data.users;
const buildingData = data.buildings;

router.get('/buildings/:username', async (req, res) => {

    const username = req.params.username

    try {
        const val = await buildingData.getUserBuildings(username);
        console.log(val);
        return res.status(200).json(val);
    }
    catch (e) {
        return res.status(404).json({ error: e })
    }
})

router.get('/uid/:uid', async (req, res) => {
    if (!req.params.uid) return res.status(400).json({ error: 'You must provide a uid.' });

    try {
        const val = await userData.getUserByUID(req.params.uid);
        return res.status(200).json(val);
    }
    catch (e) {
        return res.status(404).json({ error: e })
    }
})

module.exports = router;