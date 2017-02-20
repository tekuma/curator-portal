// end-to-end tests involving log-in
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston, Afika Nyati, and Stephen White

//NOTE: webpack hosts from port 8000.
var home = 'https://127.0.0.1:8000';
// var home = 'https://127.0.0.1';

module.exports = {
    'Test Post-Auth: Functional Hamburger Icon': function (browser) {
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
            //Close Hidden Navigation
            .waitForElementVisible('button.hamburger', 3000)
            .click('button.hamburger')
            .pause(400)
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
    'Test Post-Auth: Functional Search/Manager Icons in Header': function (browser) {
        browser
            .url(home)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            // Go to Search Interface
            .waitForElementVisible('div.header-icon.curator.search', 3000)
            .click('div.header-icon.curator.search')
            .waitForElementVisible('div.search-button', 3000)
            // Go to Manager Interface
            .waitForElementVisible('div.header-icon.curator.manage', 3000)
            .click('div.header-icon.curator.manage')
            .waitForElementVisible('div.project-selector-container', 3000)
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
    'Test Post-Auth: Successfully Toggle Right Drawer Interface': function (browser) {
        browser
            .url(home)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            .waitForElementVisible('div.manager-icon-wrapper.toggle-manager', 3000)
            // Close Interface
            .click('div.manager-icon-wrapper.toggle-manager')
            .waitForElementNotVisible('div.project-selector-container', 3000)
            // New Interface
            .click('div.manager-icon-wrapper.toggle-manager')
            .waitForElementVisible('div.project-selector-container', 3000)
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
