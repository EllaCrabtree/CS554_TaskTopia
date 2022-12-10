const users = require('./users');


async function main() {

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
    
    user2 = await users.createUser("Bella", "Cruz", "BellaTheBaddie", "TopSecret123", "Baddie@gmail.com")
    
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

main();