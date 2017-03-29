'use strict';

const MongoClient = require('mongodb').MongoClient;
const { toBase64, fromBase64 } = require('./utils');

const MONGO_URI = process.env.MONGO_URI;

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
    addCreatedPoll: (username, newPollId) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGO_URI, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                }

                const users = db.collection('users');
                User.findByName(username)
                    .then(result => {
                        const updateObj = {
                            polls: result.polls || []
                        };
                        updateObj.polls.push(newPollId);

                        users.updateOne({ username: username }, {
                            $set: updateObj
                        }, (err, result) => {
                            if (err) {
                                db.close();
                                reject(err);
                                return;
                            }

                            db.close();
                            resolve();
                        });
                    })
                    .catch(err => {
                        db.close();
                        reject(err);
                    });
            });
        });
    },

    create: (username, password) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGO_URI, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                }

                const users = db.collection('users');
                users.insertOne({ username: username, password: toBase64(password), polls: [] }, (err, result) => {
                    if (err) {
                        db.close();
                        reject(err);
                        return;
                    }

                    resolve();
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

    isValidPass: (reqPass, storedPass) => {
        return reqPass === fromBase64(storedPass);
    }
};

module.exports = User;
