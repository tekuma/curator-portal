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
    },

    'Test for text "curator"' : function (browser) {
        browser
            .url('https://127.0.0.1')
            .waitForElementVisible('body', 2000)
            .assert.containsText('body', 'Curator')
            .end();
    },

    'Test for log-in input boxes': function (browser) {
        browser
            .url('https://127.0.0.1')
            .waitForElementVisible('body', 2000)
            .assert.attributeContains('#register-email', 'type', 'email')
            .assert.attributeContains('#register-password', 'type', 'password')
            .end()
    }
};
