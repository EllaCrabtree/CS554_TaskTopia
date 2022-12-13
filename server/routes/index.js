const userRoutes = require('./users');
const buildingRoutes = require('./buildings');
const loginRoutes = require('./home.js');
const badgesRoutes = require('./badges');
const taskRoutes = require('./tasks')

const constructorMethod = (app) => {
    app.use('/', loginRoutes);
    app.use('/private/users', userRoutes);
    app.use('/private/buildings', buildingRoutes);
    app.use('/badge', badgesRoutes);
    app.use('/task', taskRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;