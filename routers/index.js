const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const ApiRouter = require('./api');
const AdminRouter = require('./admin.js');
const UsersRouter = require('./users.js');
const LoginRouter = require('./login.js');

class AppRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    // /server


    routes() {

        this.router.use('/api', jsonParser, new ApiRouter().router);
        // this.router.use('/admin', new AdminRouter().router);
        this.router.use('/login', jsonParser, new LoginRouter().router);
        this.router.use('/users', jsonParser, new UsersRouter().router);

    }
}


module.exports = AppRouter;