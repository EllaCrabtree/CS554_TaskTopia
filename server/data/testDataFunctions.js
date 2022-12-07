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
}

main();