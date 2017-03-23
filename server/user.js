'use strict';

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const { toBase64, fromBase64 } = require('./utils');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/voting';

/**
 * Creates an unique index on the 'username' field, if not already created.
 */
MongoClient.connect(MONGO_URI, (err, db) => {
    if (err) {
        console.error(err);
        return;
    }

    const users = db.collection('users');
    users.createIndex({ username: 1 }, { unique: true }, (err, indexName) => {
        if (err) {
            console.error(err);
            db.close();
            return;
        }
        db.close();
        console.log(`Index "${indexName}" created on "users" collection.`);
    });
});

/**
 * MongoDB user methods.
 */
const User = {
    create: (username, password) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGO_URI, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                }

                const users = db.collection('users');
                users.insertOne({ username: username, password: toBase64(password) })
                    .then(result => {
                        db.close();
                        resolve();
                    })
                    .catch(err => {
                        db.close();
                        reject();
                    });
            });
        });
    },

    findByName: (username) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGO_URI, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                }

                const users = db.collection('users');
                users.findOne({ username: username })
                    .then(user => {
                        db.close();
                        resolve(user);
                    })
                    .catch(err => {
                        db.close();
                        reject(err);
                    });
            });
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGO_URI, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                }

                const users = db.collection('users');
                users.findOne({ _id: ObjectID.createFromHexString(id) })
                    .then(user => {
                        db.close();
                        resolve(user);
                    })
                    .catch(err => {
                        db.close();
                        reject(err);
                    });
            });
        });
    },

    isValidPass: (reqPass, storedPass) => {
        return reqPass === fromBase64(storedPass);
    }
};

module.exports = User;
