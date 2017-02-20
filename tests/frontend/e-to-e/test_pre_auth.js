// end-to-end tests involving log-in
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston, Afika Nyati, and Stephen White

//NOTE: webpack hosts from port 8000.
var home = 'https://127.0.0.1:8000';
// var home = 'https://127.0.0.1';

module.exports = {
    'Test home button redirects to Tekuma homepage': function (browser) {
        browser
        .url(home)
        .waitForElementVisible('body', 2000)
        .click('div.header-icon.home-icon')
        .waitForElementVisible('body', 2000)
        .assert.urlEquals('http://tekuma.io/')
        .end();
    },
    'Test Login: No Email Error' : function (browser) {
        browser
            .url(home)
            .waitForElementVisible('body', 2000)
            .waitForElementVisible('input[type=password]#login-password', 2000)
            .setValue('input[type=password]#login-password', 'password')
            .click('button.login-button')
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'Please enter an email address.')
            .end();
    },
    'Test Login: No Password Error' : function (browser) {
        browser
            .url(home)
            .waitForElementVisible('body', 2000)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .click('button.login-button')
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'Please enter your password.')
            .end();
    },
    'Test Login: Invalid Email Error' : function (browser) {
        browser
            .url(home)
            .waitForElementVisible('body', 2000)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .setValue('input[type=email]#login-email', 'test')
            .setValue('input[type=password]#login-password', 'password')
            .click('button.login-button')
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'The email address you supplied is invalid.')
            .end();
    },
    'Test Login: User Doesnt Exist Error' : function (browser) {
        browser
            .url(home)
            .waitForElementVisible('body', 2000)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .setValue('input[type=email]#login-email', 'invalid@tekuma.io')
            .setValue('input[type=password]#login-password', 'password')
            .click('button.login-button')
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'There is no user record corresponding to this identifier. The user may have been deleted.')
            .end();
    },
    'Test Login: Invalid Email/Password Error' : function (browser) {
        browser
            .url(home)
            .waitForElementVisible('body', 2000)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'wrongpassword')
            .click('button.login-button')
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'The password is invalid or the user does not have a password.')
            .end();
    },
    'Test Login: Successful Login using the TravisCI Curator Portal account by pressing Enter Key': function (browser) {
        browser
            .url(home)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', ['BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9', browser.Keys.ENTER])
            .waitForElementVisible('div.tekuma-logo', 3000)
            // Open Hidden Navigation
            .waitForElementVisible('button.hamburger', 3000)
            .click('button.hamburger')
            .pause(400)
            // Log off
            .waitForElementVisible('div.logout-button', 3000)
            .click('div.logout-button')
            .waitForElementVisible('div.header-icon.home-icon', 5000)
            .end()
    },
    'Test Login: Successful Login using the TravisCI Curator Portal account by pressing Login Button': function (browser) {
        browser
            .url(home)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            // Open Hidden Navigation
            .waitForElementVisible('button.hamburger', 3000)
            .click('button.hamburger')
            .pause(400)
            // Log off
            .waitForElementVisible('div.logout-button', 3000)
            .click('div.logout-button')
            .waitForElementVisible('div.header-icon.home-icon', 5000)
            .end()
    }
};
