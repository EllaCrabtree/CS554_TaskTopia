const data = require("../data");
const badgeData = data.badges;
const usersData = data.users;
const buildingsData = data.buildings;
const taskData = data.tasks;
const { ObjectId } = require("mongodb");

const connection = require("../config/mongoConnection");

const buildingCodes = require("../data/buildingCodes");


async function main() {
    const db = await connection.connectToDb();
    await db.dropDatabase();

    try {
        //create users
        const user1 = await usersData.createUser("Patrick", "Hill", "patrickhill", "goCS554#", "patrickhill@gmail.com", "ZsTaPopkPGUFVRmk8VBwEDnkKms1");
        const user2 = await usersData.createUser("Test", "User", "testuser", "testing123$", "testing@gmail.com", "de9kwSlQQ8NzeAEHeEe2vZcABr33")

        //Create buildings
        const bu1 = await buildingsData.createBuilding("Homework", "EDUCATION", 20, 100, 2, user1.email);
        const bu2 = await buildingsData.createBuilding("Gaming Dubs", "ADMIN", 2, 30, 1, user1.email);
        const bu3 = await buildingsData.createBuilding("Puuurrrr Queeen", "PARK", 8, 10, 3, user2.email);

        // Populate all possible badges
        const b1 = await badgeData.populateBadges("ADMIN", [20, 25, 35]);
        const b2 = await badgeData.populateBadges("EDUCATION", [10, 20, 30]);
        const b3 = await badgeData.populateBadges("STORE", [5, 15, 30]);
        const b4 = await badgeData.populateBadges("PARK", [10, 20, 30]);
        const b5 = await badgeData.populateBadges("GARDEN", [5, 10, 20]);
        const b6 = await badgeData.populateBadges("HOME", [5, 15, 30]);

        // Create Task
        const t1 = await taskData.createTask(bu1._id, "Finish 554 Project", "2022-12-20");
        const t2 = await taskData.createTask(bu1._id, "Take final", "2022-12-16");
        const t3 = await taskData.createTask(bu2._id, "Sign Lease", "2022-12-28");
        const t4 = await taskData.createTask(bu3._id, "Workout", "2022-12-31");

        await usersData.getUserByUsername(user1.username);
        await usersData.getUserByUsername(user2.username);
    }
    catch (error) {
        console.log(error);
    }

    await connection.closeConnection();
}

main();