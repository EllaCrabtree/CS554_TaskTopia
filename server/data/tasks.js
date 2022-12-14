const mongoCollections = require("../config/mongoCollections");
const buildings = mongoCollections.buildings;
const { ObjectId } = require("mongodb");
const moment = require('moment');

async function createTask(buildingId, name, dateDue, notes) {
    if (arguments.length !== 7) throw 'You must provide 7 arguments for your task (buildingId,name,datePosted,dateDue,notes,isOverdue,isCompleted)';
    if (!buildingId) throw 'You must provide a buildingId for your task';
    if (!name) throw 'You must provide a name for your task';
    if (!dateDue) throw 'You must provide a dateDue for your task';
    if (!notes) throw 'You must provide a notes for your task';

    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (typeof name !== 'string') throw 'name must be a string';
    name = name.trim();
    if (name.length === 0) throw 'name must not be empty';

    if (typeof dateDue !== 'string') throw 'dateDue must be a string';
    dateDue = dateDue.trim();
    if (dateDue.length === 0) throw 'dateDue must not be empty';

    if (!Array.isArray(notes)) throw 'notes must be an array';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    let datePosted = moment().format('YYYY-MM-DD').toString()
    let dueDateMoment = moment(dateDue, 'YYYY-MM-DD').toString();

    const newTask = {
        _id: new ObjectId(),
        name: name,
        datePosted: datePosted,
        dateDue: dueDateMoment,
        notes: notes,
        isOverdue: false,
        isCompleted: false
    };

    building.tasks.push(newTask);
    const insertInfo = await buildingCollection.updateOne({ _id: ObjectId(buildingId) }, { $set: { tasks: building.tasks } });
    if (insertInfo.modifiedCount === 0) throw 'Could not add task';

    return await this.getTask(buildingId, newTask._id);
}

async function getTask(buildingId, taskId) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (!taskId) throw 'You must provide a taskId to search for';
    if (typeof taskId !== 'string') throw 'taskId must be a string';
    taskId = taskId.trim();
    if (taskId.length === 0) throw 'taskId must not be empty';
    if (!ObjectId.isValid(taskId)) throw 'taskId must be a valid ObjectId';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    const task = building.tasks.find((task) => task._id.toString() === taskId);
    if (task === null) throw 'No task with that id';

    return task;
}

async function getAllTasks(buildingId) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    return building.tasks;
}

async function updateTask(buildingId, taskId, updatedTask) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (!taskId) throw 'You must provide a taskId to search for';
    if (typeof taskId !== 'string') throw 'taskId must be a string';
    taskId = taskId.trim();
    if (taskId.length === 0) throw 'taskId must not be empty';
    if (!ObjectId.isValid(taskId)) throw 'taskId must be a valid ObjectId';

    if (!updatedTask) throw 'You must provide an updatedTask to search for';
    if (typeof updatedTask !== 'object') throw 'updatedTask must be an object';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    const task = building.tasks.find((task) => task._id.toString() === taskId);
    if (task === null) throw 'No task with that id';

    const updatedTaskData = {};

    if (updatedTask.name) {
        if (typeof updatedTask.name !== 'string') throw 'name must be a string';
        updatedTask.name = updatedTask.name.trim();
        if (updatedTask.name.length === 0) throw 'name must not be empty';

        updatedTaskData.name = updatedTask.name;
    }

    if (updatedTask.datePosted) {
        if (typeof updatedTask.datePosted !== 'string') throw 'datePosted must be a string';
        updatedTask.datePosted = updatedTask.datePosted.trim();
        if (updatedTask.datePosted.length === 0) throw 'datePosted must not be empty';

        updatedTaskData.datePosted = moment(updatedTask.datePosted, 'YYYY-MM-DD').toString();
    }

    if (updatedTask.dateDue) {
        if (typeof updatedTask.dateDue !== 'string') throw 'dateDue must be a string';
        updatedTask.dateDue = updatedTask.dateDue.trim();
        if (updatedTask.dateDue.length === 0) throw 'dateDue must not be empty';

        updatedTaskData.dateDue = moment(updatedTask.dateDue, 'YYYY-MM-DD').toString();
    }

    if (updatedTask.notes) {
        if (!Array.isArray(updatedTask.notes)) throw 'notes must be an array';

        updatedTaskData.notes = updatedTask.notes;
    }

    if (updatedTask.isOverdue) {
        if (typeof updatedTask !== 'boolean') throw 'isOverdue must be a boolean';

        updatedTaskData.isOverdue = updatedTask.isOverdue;
    }

    if (updatedTask.isCompleted) {
        if (typeof updatedTask !== 'boolean') throw 'isCompleted must be a boolean';

        updatedTaskData.isCompleted = updatedTask.isCompleted;
    }

    let updateCommand = {
        $set: updatedTaskData
    };
    const query = {
        _id: ObjectId(id)
    };
    await buildingCollection.updateOne
        (query, updateCommand);
    return await this.getTask(buildingId, taskId);
}

async function removeTask(buildingId, taskId) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (!taskId) throw 'You must provide a taskId to search for';
    if (typeof taskId !== 'string') throw 'taskId must be a string';
    taskId = taskId.trim();
    if (taskId.length === 0) throw 'taskId must not be empty';
    if (!ObjectId.isValid(taskId)) throw 'taskId must be a valid ObjectId';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    const task = building.tasks.find((task) => task._id.toString() === taskId);
    if (task === null) throw 'No task with that id';

    const deletionInfo = await buildingCollection.updateOne({ _id: ObjectId(buildingId) }, { $pull: { tasks: { _id: ObjectId(taskId) } } });
    if (deletionInfo.deletedCount === 0) throw `Could not delete task with id of ${taskId}`;

    return true;
}

module.exports = {
    createTask,
    getTask,
    getAllTasks,
    updateTask,
    removeTask
};



