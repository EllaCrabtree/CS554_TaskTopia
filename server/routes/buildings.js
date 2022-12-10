const express = require('express');

const router = express.Router();
const data = require('../data');
const buildingData = data.buildings;
const badgeData = data.badges;
const { ObjectId } = require("mongodb");

router.get('/', async (req, res) => {
    try {
        const buildings = await buildingData.getAllBuildings();
        res.json(buildings);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const building = await buildingData.getBuildingById(req.params.id);
        res.json(building);
    } catch (e) {
        res.status(404).json({ error: 'Building not found' });
    }
});

router.post('/', async (req, res) => {
    const buildingData = req.body;

    if (!buildingData) {
        res.status(400).json({ error: 'You must provide data to create a building' });
        return;
    }

    if (!buildingData.name) {
        res.status(400).json({ error: 'You must provide a name for the building' });
        return;
    }

    if (!buildingData.address) {
        res.status(400).json({ error: 'You must provide an address for the building' });
        return;
    }

    if (!buildingData.city) {
        res.status(400).json({ error: 'You must provide a city for the building' });
        return;
    }

    if (!buildingData.state) {
        res.status(400).json({ error: 'You must provide a state for the building' });
        return;
    }

    if (!buildingData.zip) {
        res.status(400).json({ error: 'You must provide a zip code for the building' });
        return;
    }

    if (!buildingData.country) {
        res.status(400).json({ error: 'You must provide a country for the building' });
        return;
    }

    if (!buildingData.latitude) {
        res.status(400).json({ error: 'You must provide a latitude for the building' });
        return;
    }

    if (!buildingData.longitude) {
        res.status(400).json({ error: 'You must provide a longitude for the building' });
        return;
    }

    if (!buildingData.description) {
        res.status(400).json({ error: 'You must provide a description for the building' });
        return;
    }

    try {
        const { name, address, city, state, zip, country, latitude, longitude, description } = buildingData;
        const newBuilding = await buildingData.addBuilding(name, address, city, state, zip, country, latitude, longitude, description);
        res.json(newBuilding);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.put('/:id', async (req, res) => {
    //check arguments
    const buildingData = req.body;
    if (!buildingData) {
        res.status(400).json({ error: 'You must provide data to create a building' });
        return;
    }

    if (!buildingData.name) {
        res.status(400).json({ error: 'You must provide a name for the building' });
        return;
    }

    if (!buildingData.address) {
        res.status(400).json({ error: 'You must provide an address for the building' });
        return;
    }

    if (!buildingData.city) {
        res.status(400).json({ error: 'You must provide a city for the building' });
        return;
    }

    if (!buildingData.state) {
        res.status(400).json({ error: 'You must provide a state for the building' });
        return;
    }

    if (!buildingData.zip) {
        res.status(400).json({ error: 'You must provide a zip code for the building' });
        return;
    }

    if (!buildingData.country) {
        res.status(400).json({ error: 'You must provide a country for the building' });
        return;
    }

    if (!buildingData.latitude) {
        res.status(400).json({ error: 'You must provide a latitude for the building' });
        return;
    }

    if (!buildingData.longitude) {
        res.status(400).json({ error: 'You must provide a longitude for the building' });
        return;
    }

    if (!buildingData.description) {
        res.status(400).json({ error: 'You must provide a description for the building' });
        return;
    }
    try{
        const updatedBuilding = await buildingData.updateBuilding(req.params.id, buildingData);
        res.status(200).json({message: "Building updated"});
    } catch{
        res.status(404).json({error: "Building not found"});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await buildingData.removeBuilding(req.params.id);
        res.sendStatus(200);
    } catch (e) {
        res.status(404).json({ error: 'Building not found' });
    }
});

module.exports = router;