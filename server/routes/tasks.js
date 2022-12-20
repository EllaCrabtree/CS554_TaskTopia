const express = require('express');

const router = express.Router();
const data = require('../data');
const taskData = data.tasks;

router
    .post('/', async (req, res) => {
        if (!req.body.buildingId) return res.status(400).json({ error: 'You must provide an id for the task\'s building.' });
        if (!req.body.name) return res.status(400).json({ error: 'You must provide name for the task.' });
        if (!req.body.dateDue) return res.status(400).json({ error: 'You must provide the due date for the task.' });

        try {
            const val = await taskData.createTask(req.body.buildingId, req.body.name, req.body.dateDue)
            return res.status(200).json(val);
        }
        catch (e) {
            return res.status(404).json({ error: e })
        }
    });

router
    .post('/addNotes', async (req, res) => {
        if (!req.body.buildingId) return res.status(400).json({ error: 'You must provide an id for the task\'s building.' });
        if (!req.body.taskId) return res.status(400).json({ error: 'You must provide an id for the task.' });
        if (!req.body.notes) return res.status(400).json({ error: 'You must provide notes for the task.' });

        try {
            const val = await taskData.addNotestoTask(req.body.buildingId, req.body.taskId, req.body.notes)
            return res.status(200).json(val);
        }
        catch (e) {
            return res.status(404).json({ error: e })
        }
    });

router
    .get('/:buildingId/:taskId', async (req, res) => {
        if (!req.params.buildingId) return res.status(400).json({ error: 'You must provide an id for the task\'s building.' });
        if (!req.params.taskId) return res.status(400).json({ error: 'You must provide an id for the task.' });

        try {
            const val = await taskData.getTask(req.params.buildingId, req.params.taskId);
            return res.status(200).json(val);
        }
        catch (e) {
            return res.status(404).json({ error: e })
        }
    });

router.delete('/:buildingId/:taskId', async (req, res) => {
    if (!req.params.buildingId) return res.status(400).json({ error: 'You must provide an id for the task\'s building.' });
    if (!req.params.taskId) return res.status(400).json({ error: 'You must provide an id for the task.' });
    try {
        const val = await taskData.removeTask(req.params.buildingId, req.params.taskId);
        return res.status(200).json("Task Deleted");
}
    catch (e) {
        return res.status(404).json({ error: e })
        }
});
    

module.exports = router;