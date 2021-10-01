'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Users", deps: []
 * addIndex "UserID_UNIQUE" to table "Users"
 * addIndex "Email_UNIQUE" to table "Users"
 * addIndex "PRIMARY" to table "Users"
 *
 **/

var info = {
    "revision": 1,
    "name": "second_migration",
    "created": "2021-09-28T14:57:31.679Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Users",
            {
                "UserID": {
                    "type": Sequelize.INTEGER,
                    "field": "UserID",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "Password": {
                    "type": Sequelize.STRING(45),
                    "field": "Password",
                    "allowNull": false
                },
                "FirstName": {
                    "type": Sequelize.STRING(45),
                    "field": "FirstName",
                    "allowNull": false
                },
                "LastName": {
                    "type": Sequelize.STRING(45),
                    "field": "LastName",
                    "allowNull": false
                },
                "Email": {
                    "type": Sequelize.STRING(45),
                    "field": "Email",
                    "unique": "Email_UNIQUE",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "addIndex",
        params: [
            "Users",
            [{
                "name": "UserID"
            }],
            {
                "indexName": "UserID_UNIQUE",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "Users",
            [{
                "name": "Email"
            }],
            {
                "indexName": "Email_UNIQUE",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "Users",
            [{
                "name": "UserID"
            }],
            {
                "indexName": "PRIMARY",
                "indicesType": "UNIQUE"
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
