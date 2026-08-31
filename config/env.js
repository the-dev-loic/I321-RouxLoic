/*
-----------------------------------------------------------------------------------------------------------------------
file name           :   env.js
author              :   loic
creation date       :   28.08.2026
modification date   :   28.08.2026
-----------------------------------------------------------------------------------------------------------------------
*/
require('dotenv').config();

const env = {

    dbHost: process.env.DB_HOST,

    dbUser: process.env.DB_USER,

    dbPassword: process.env.DB_PASSWORD,

    dbName: process.env.DB_NAME,

    port: process.env.PORT || 3000,


};

module.exports = env;