// end-to-end tests involving log-in
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston

module.exports = {
    // modified from pre_auth_home_button.js of the dev-artist-portal repo
    // by Afika Nyati
    'Test home button redirects to Tekuma homepage': function (browser) {
        browser
            .url('https://127.0.0.1')
            .waitForElementVisible('body', 2000)
            .click('a[href="http://tekuma.io"]')
            .waitForElementVisible('body', 2000)
            .assert.urlEquals('http://tekuma.io/')
            .end();
    },

    'Test for text "curator"': function (browser) {
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
    },

    'Try to log-in using the TravisCI curator-portal account': function (browser) {
        browser
            .url('https://127.0.0.1')
            .waitForElementVisible('input#register-email', 2000)
            .waitForElementVisible('input#register-password', 1000)
            .setValue('input[type=email]', 'travis-ci@tekuma.io')
            .setValue('input[type=password]', ['BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9', browser.Keys.ENTER])
            .waitForElementVisible('.header-icon.curator.search', 3000)
            .click('.header-icon.curator.search')
            .waitForElementVisible('.empty-search-box', 1000)
            .pause(100)
            .assert.containsText('body', 'Search for Artworks')
            .end()
    }
};
