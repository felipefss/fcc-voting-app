'use strict';

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const MONGO_URI = process.env.MONGO_URI;

/**
 * Creates an unique index on the 'title' field, if not already created.
 */
MongoClient.connect(MONGO_URI, (err, db) => {
    if (err) {
        console.error(err);
        return;
    }

    const polls = db.collection('polls');
    polls.createIndex({ title: 1 }, { unique: true }, (err, indexName) => {
        if (err) {
            console.error(err);
            db.close();
            return;
        }
        db.close();
        console.log(`Index "${indexName}" created on "polls" collection.`);
    });
});

const Polls = {
    createPoll: (pollInfo) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGO_URI, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                }

                const polls = db.collection('polls');
                polls.insertOne(pollInfo, (err, result) => {
                    if (err) {
                        db.close();
                        reject(err);
                        return;
                    }

                    db.close();
                    resolve(result.insertedId);
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

                const polls = db.collection('polls');
                polls.findOne(ObjectID.createFromHexString(id), (err, doc) => {
                    if (err) {
                        db.close();
                        reject(err);
                        return;
                    }

                    db.close();
                    resolve(doc);
                });
            });
        });
    },

    getAll: () => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGO_URI, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                }

                const polls = db.collection('polls');
                polls.find().toArray((err, docs) => {
                    if (err) {
                        db.close();
                        reject(err);
                        return;
                    }

                    const modifiedDocs = [];

                    for (const doc of docs) {
                        const obj = {
                            id: doc._id,
                            title: doc.title
                        };
                        modifiedDocs.push(obj);
                    }

                    db.close();
                    resolve(modifiedDocs);
                });
            });
        });
    },

    getUserPolls: (username) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGO_URI, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                }

                const polls = db.collection('polls');
                polls.find({ user: username }).toArray((err, docs) => {
                    if (err) {
                        db.close();
                        reject(err);
                        return;
                    }

                    const modifiedDocs = [];

                    for (const doc of docs) {
                        const obj = {
                            id: doc._id,
                            title: doc.title
                        };
                        modifiedDocs.push(obj);
                    }

                    db.close();
                    resolve(modifiedDocs);
                });
            });
        });
    },

    remove: (id) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGO_URI, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                }

                const polls = db.collection('polls');
                polls.deleteOne({ _id: ObjectID.createFromHexString(id) }, (err) => {
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

    update: (id, data) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGO_URI, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                }

                const polls = db.collection('polls');
                polls.updateOne({ _id: ObjectID.createFromHexString(id) }, {
                    $set: data
                }, (err, result) => {
                    if (err) {
                        db.close();
                        reject(err);
                        return;
                    }

                    db.close();
                    resolve();
                });
            });
        });
    }
};

module.exports = Polls;