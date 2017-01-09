// quick and simple Firebase mock-up
//
// Assertions are used to enforce expected usage. However, in general
// checks about expectations should be implemented as part of the test
// suite outside of this module.
//
//
// Copyright 2016, 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston

const assert = require('assert');


exports.initializeApp = (config) => {}

exports.auth = () => {
    return {
        verifyIdToken: function (authtoken) {
            return (new Promise(function (resolve, reject) {
                resolve('deadbeef');
            }));
        },

        onAuthStateChanged: function (changefcn) {
            changefcn(true);
        },

        signInWithEmailAndPassword: function (email, password) {
            return (new Promise(function (resolve, reject) {
                resolve('deadbeef');
            }));
        },

        signOut: function () {
            return (new Promise(function (resolve, reject) {
                resolve();
            }));
        },

        currentUser: {
            uid: 666,
            getToken: function (x) {
                return new Promise(function (resolve, reject) {
                    resolve('deadbeef');
                });
            }
        }
    };
}

exports.database = () => {
    return {
        ref: function (userpath) {
            return {
                once: function (x, oncefcn) {
                    oncefcn({hasChild: function (uid) { return true; }});
                },

                set: function (child) { return; },

                push: function () {},

                on: function (x, onfcn) {
                    onfcn();
                },

                orderByChild: function (name) {
                    return {
                        limitToFirst: function (pageLimit) {
                            return {
                                once: function (x) {
                                    return new Promise(function (resolve, reject) {
                                        resolve('1337f00f');
                                    });
                                }
                            };
                        }
                    };
                },

                transaction: function(tfcn) {
                }
            };
        }
    };
}
