const userRoutes = require('./users');
const buildingRoutes = require('./buildings');

const constructorMethod = (app) => {
    app.use('/users', userRoutes);
    app.use('/buildings', buildingRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;