// quick and simple Firebase mock-up
//
// Assertions are used to enforce expected usage. However, in general
// checks about expectations should be implemented as part of the test
// suite outside of this module.
//
//
// Copyright 2016 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston

const assert = require('assert');


exports.initializeApp = () => {}

exports.auth = () => {
    return {
        verifyIdToken: function(authtoken) {
            return (new Promise(function (resolve, reject) {
                resolve('deadbeef');
            }));
        }
    };
}
