const express = require('express');
const multer = require('multer');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const session = require('express-session');
const redis = require('redis');

const path = require('path');
// const client = redis.createClient({
//     legacyMode: true,
//     socket: {
//         host: 'redis',
//         port: 6379
//     }
// });
const client = redis.createClient();
client.connect().then(() => {});

const cors = require('cors');
app.use(cors());

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}));


// var storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function(req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// })

// var upload = multer({storage: storage}).single('img')

app.use(multer({
    limits: { fieldSize: 25 * 1024 * 1024}
}).array());

// app.use('/private', (req, res, next) => {
//     if (!req.session.user) {
//         return res.status(403).json({
//             title: "Login",
//             name: "Login",
//             error: "You are not logged in"
//         });
//     } else {
//         next();
//     }
// });

//Check if badge exists in cache
app.use('/badge/:id', async (req, res, next) => {
    if (req.originalUrl !== '/badge/all') {
        let exists = await client.HEXISTS("badge", req.params.id);
        if (exists) {
            let badge = await client.HGET("badge", req.params.id);
            return res.json(JSON.parse(badge));
        } else {
            next();
        }
    }
    else {
        next();
    }
})

//Check if all badges exists in cache
app.use('/badge/all', async (req, res, next) => {
    let exists = await client.HEXISTS("allBadges", "all");
    if (exists) {
        let badge = await client.HGET("allBadges", "all");
        return res.json(JSON.parse(badge));
    } else {
        next();
    }
})

app.use(async (req, res, next) => {
    let date = new Date().toUTCString();
    let method = req.method;
    let url = req.originalUrl;
    if (req.session.user) console.log("[" + date + "]: " + method + " " + url + " (Authenticated User)");
    else console.log("[" + date + "]: " + method + " " + url + " (Non-Authenticated User)");
    next();
});

configRoutes(app);

app.listen(4000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:4000');
});