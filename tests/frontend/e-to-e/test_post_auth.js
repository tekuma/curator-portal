// end-to-end tests involving log-in
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston, Afika Nyati, and Stephen White

// Coverage of Test File:
// Core Functionality tested: General Post-Auth Functionality
//
// 1) Test Post-Auth: Functional Hamburger Icon
// 2) Test Post-Auth: Functional Search/Manager Icons in Header
// 3) Test Post-Auth: Successfully Toggle Right Drawer Interface
// 4) Test Post-Auth: Functional Interface Swop by Pressing Empty Project Box in Manager Interface

//NOTE: webpack hosts from port 8000.
// var home = 'https://127.0.0.1:8000';
var home = 'https://127.0.0.1';

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
            // Verify Switched to Search Interface
            .waitForElementVisible('div.search-button', 3000)
            // Go to Manager Interface
            .waitForElementVisible('div.header-icon.curator.manage', 3000)
            .click('div.header-icon.curator.manage')
            // Verify Switched to Manager Interface
            .waitForElementVisible('div.first-project-button', 3000)
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
    },
    'Test Post-Auth: Functional Interface Swop by Pressing Empty Project Box in Manager Interface': function (browser) {
        browser
            .url(home)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            .waitForElementVisible('div.manager-icon-wrapper.toggle-manager', 3000)
            // Switch to Search Interface via Empty Project Box
            .waitForElementVisible('div.empty-project-box', 3000)
            .click('div.empty-project-box') // Add new project
            .click('div.empty-project-box') // Switch to Search Interface
            // Verify Switched to Search Interface
            .waitForElementVisible('div.search-button', 3000)
            // Go to Manager Interface
            .waitForElementVisible('div.header-icon.curator.manage', 3000)
            .click('div.header-icon.curator.manage')
            // Delete Project
            .moveToElement('div.manager-function-box.delete.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.delete.center', 3000)
            .click('div.manager-function-box.delete.center')
            .waitForElementVisible('button.confirm-yes', 3000)
            .click('button.confirm-yes')
            // Verify Project deleted
            .waitForElementVisible('div.project-selector-container div.project-selector div.Select-placeholder', 3000)
            .assert.containsText('div.project-selector-container div.project-selector div.Select-placeholder', 'Select a project...')
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
