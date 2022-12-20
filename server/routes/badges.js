const express = require('express');
const router = express.Router();
const axios = require('axios');
const flat = require('flat');
const unflatten = flat.unflatten;
const redis = require('redis');
// const client = redis.createClient({
//     legacyMode: true,
//     socket: {
//         host: 'redis',
//         port: 6379
//     }});
const client = redis.createClient();
const badgeData = require('../data/badges');
client.connect().then(() => { });

router
    .route('/all')
    .get(async (req, res) => {
        try {
            const badge = await badgeData.getAllBadges();

            if (!badge) return res.status(400).json({ error: "Badges not found." });
            let flatbadge = JSON.stringify(badge)
            let addbadge = await client.HSET("allBadges", "all", flatbadge);
            if (addbadge >= 1) {
                return res.status(200).json(badge);
            }
            else {
                return res.status(400).json({ error: "Could not cache badges." });
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return res.status(err.response.status).json({ error: err.response.data });
            }
            return res.status(400).json({ error: err })
        }
    })

router
    .route('/:id')
    .get(async (req, res) => {
        if (!req.params.id) {
            return res.status(400).json({ error: "Must supply id for badge" });
        }
        try {
            const badge = await badgeData.getBadge(req.params.id);

            if (!badge) return res.status(400).json({ error: "Badge not found." });
            let flatbadge = JSON.stringify(badge)
            let addbadge = await client.HSET("badge", req.params.id, flatbadge);
            if (addbadge >= 1) {
                return res.status(200).json(badge);
            }
            else {
                return res.status(400).json({ error: "Could not cache badge." });
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return res.status(err.response.status).json({ error: err.response.data });
            }
            return res.status(400).json({ error: err })
        }
    })


module.exports = router;