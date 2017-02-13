// end-to-end tests involving log-in
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston
// modified from pre_auth_login_password.js, by Afika Nyati

module.exports = {
    'Test home button redirects to Tekuma homepage' : function (browser) {
        browser
            .url('https://127.0.0.1')
            .waitForElementVisible('body', 2000)
            .click('a[href="http://tekuma.io"]')
            .waitForElementVisible('body', 2000)
            .assert.urlEquals('http://tekuma.io/')
            .end();
    }
};
