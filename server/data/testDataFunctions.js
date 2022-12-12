const users = require('./users');
const badgeData = require('./badges');

const buildingCodes = require("./buildingCodes");
const { ObjectId } = require("mongodb");
const connection = require("../config/mongoConnection");

async function testUsers() {

    //-----------------------------------Check users.js-----------------------------------
    let user1, user2;

    //-----------------Checking createUser()-----------------
    try {
        user1 = await users.createUser();
        console.log('Test 1 Failed! Should have errored!')
    } catch (e) {
        console.log(`Test 1 Success! ${e}`)
    }

    try {
        user1 = await users.createUser('Odin', 'Crabtree', 'Odline', 'the_baby_lulu', 'urmom@gmail.com')
        console.log('Test 2 Success!')
    } catch (e) {
        console.log(`Test 2 Failed! ${e}`)
    }

    //-----------------Checking updateLevel()-----------------

    try {
        user2 = await users.createUser("Bella", "Cruz", "BellaTheBaddie", "TopSecret123", "Baddie@gmail.com");
    }
    catch (e) {
        console.log(e);
    }

    //Bad Input Checks
    try {
        leveledUp = updateLevel();
        console.log('UpdateLevel: Test 1 Failed! Should have errored!');
    } catch (e) {
        console.log(`UpdateLevel: Test 1 Success! ${e}`)
    }
    try {
        leveledUp = updateLevel(123, "level");
        console.log('UpdateLevel: Test 2 Failed! Should have errored!');
    } catch (e) {
        console.log(`UpdateLevel: Test 2 Success! ${e}`)
    }
    try {
        leveledUp = updateLevel("BellaTheBaddie", "level");
        console.log('UpdateLevel: Test 3 Failed! Should have errored!');
    } catch (e) {
        console.log(`UpdateLevel: Test 3 Success! ${e}`)
    }
    try {
        leveledUp = updateLevel("BellaTheBaddie", -1);
        console.log('UpdateLevel: Test 4 Failed! Should have errored!');
    } catch (e) {
        console.log(`UpdateLevel: Test 4 Success! ${e}`)
    }
    try {
        leveledUp = updateLevel("BellaTheBaddie", 2);
        console.log('UpdateLevel: Test 5 Success!');
        console.log("New Level: " + leveledUp.level)
    } catch (e) {
        console.log(`UpdateLevel: Test 5 Failed! ${e}`)
    }

}

async function checkBadges() {
    let user1, badgeSucc;
    user1 = await users.createUser('Kera', 'McGovern', 'kmcgo', 'password1$', 'kmcgov@gmail.com')

    try {
        badgeSucc = await badgeData.createBadge(buildingCodes.ADMIN, 30, "description");
        console.log('Badges Test 1 Success!')
    } catch (e) {
        console.log(`Badges Test 1 Failed! ${e}`)
    }

    try {
        let badgeRes = await badgeData.createBadge(buildingCodes.ADMIN, null, "description");
        console.log('Badges Test 2 Failed!')
    } catch (e) {
        console.log(`Badges Test 2 Success! ${e}`)
    }

    try {
        let badgeRes = await badgeData.createBadge(30, 30, "description");
        console.log('Badges Test 3 Failed!')
    } catch (e) {
        console.log(`Badges Test 3 Success! ${e}`)
    }

    try {
        let badgeRes = await badgeData.createBadge(buildingCodes.ADMIN, 30, "");
        console.log('Badges Test 4 Failed!')
    } catch (e) {
        console.log(`Badges Test 4 Success! ${e}`)
    }

    try {
        let badgeRes = await badgeData.getBadge(badgeSucc._id);
        console.log('Badges Test 5 Success!')
    } catch (e) {
        console.log(`Badges Test 5 Failed! ${e}`)
    }

    try {
        let badgeRes = await badgeData.getBadge("");
        console.log('Badges Test 6 Failed!')
    } catch (e) {
        console.log(`Badges Test 6 Success! ${e}`)
    }

    try {
        let badgeRes = await badgeData.getBadge(ObjectID().toString());
        console.log('Badges Test 6 Failed!')
    } catch (e) {
        console.log(`Badges Test 6 Success! ${e}`)
    }

    try {
        let badgeRes = await badgeData.getAllBadges();
        (badgeRes.length == 1) ? console.log(`Badges Test 6 Success!`) : console.log(`Badges Test 6 Failed! Should have had one value but saw ${badgeRes.length}`)
    } catch (e) {
        console.log(`Badges Test 6 Failed! ${e}`)
    }

    try {
        let badgeRes = await badgeData.updateBadge(badgeSucc._id, buildingCodes.EDUCATION, 40, "dv");
        console.log(`Badges Test 7 Success!`);
        console.log(`old data`, badgeSucc);
        console.log(`updated data`, badgeRes);
    } catch (e) {
        console.log(`Badges Test 7 Failed! ${e}`)
    }

    try {
        let badgeRes = await badgeData.removeBadge(badgeSucc._id);
        console.log(`Badges Test 8 Success!`);
    } catch (e) {
        console.log(`Badges Test 8 Failed! ${e}`)
    }

    try {
        let badgeRes = await badgeData.getAllBadges();
        (badgeRes.length == 0) ? console.log(`Badges Test 9 Success!`) : console.log(`Badges Test 9 Failed! Should have had one value but saw ${badgeRes.length}`)
    } catch (e) {
        console.log(`Badges Test 9 Failed! ${e}`)
    }


    try {
        let badgeRes = await badgeData.removeBadge(ObjectId().toString());
        console.log(`Badges Test 10 Failed!`);
    } catch (e) {
        console.log(`Badges Test 10 Success! ${e}`)
    }

    try {
        let badgeRes = await badgeData.updateBadge(ObjectId().toString(), buildingCodes.ADMIN, 40, "dv");
        console.log(`Badges Test 11 Failed!`);
    } catch (e) {
        console.log(`Badges Test 11 Success! ${e}`)
    }

}

async function main() {
    const db = await connection.connectToDb();
    await db.dropDatabase();

    await testUsers();
    await checkBadges();

    await connection.closeConnection();
}

main();