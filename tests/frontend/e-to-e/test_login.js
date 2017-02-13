// end-to-end tests involving log-in
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston

module.exports = {
    // modified from pre_auth_home_button.js of the dev-artist-portal repo
    // by Afika Nyati
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
