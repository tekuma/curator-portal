// end-to-end tests involving log-in
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston, Afika Nyati, and Stephen White

//NOTE: webpack hosts from port 8000.
var home = 'https://127.0.0.1:8000';
// var home = 'https://127.0.0.1';

module.exports = {
    'Test Post-Auth: Add/Delete Project (Using Empty Artwork Card Section)': function (browser) {
        browser
            .url(home)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            // Click Empty Artwork Card Section
            .waitForElementVisible('img.first-project-icon', 3000)
            .click('img.first-project-icon')
            // Verify Project created
            .waitForElementVisible('div.project-selector-container', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'Untitled Project')
            // Delete Project
            .moveToElement('div.manager-function-box.delete.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.delete.center', 3000)
            .click('div.manager-function-box.delete.center')
            .waitForElementVisible('button.confirm-yes', 3000)
            .click('button.confirm-yes')
            // Verify Project deleted
            .waitForElementVisible('div.project-selector-container div.project-selector span#react-select-2--value.Select-multi-value-wrapper div.Select-placeholder', 3000)
            .assert.containsText('div.project-selector-container div.project-selector span#react-select-2--value.Select-multi-value-wrapper div.Select-placeholder', 'Select a project...')
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
    'Test Post-Auth: Add/Delete Project (Using Project Manager)': function (browser) {
        browser
            .url(home)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            // Click Create First Project in Project Manager
            .waitForElementVisible('div.first-project-button', 3000)
            .click('div.first-project-button')
            // Verify Project created
            .waitForElementVisible('div.project-selector-container', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'Untitled Project')
            // Delete Project
            .moveToElement('div.manager-function-box.delete.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.delete.center', 3000)
            .click('div.manager-function-box.delete.center')
            .waitForElementVisible('button.confirm-yes', 3000)
            .click('button.confirm-yes')
            // Verify Project deleted
            .waitForElementVisible('div.project-selector-container div.project-selector span#react-select-2--value.Select-multi-value-wrapper div.Select-placeholder', 3000)
            .assert.containsText('div.project-selector-container div.project-selector span#react-select-2--value.Select-multi-value-wrapper div.Select-placeholder', 'Select a project...')
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
    'Test Post-Auth: Add/Delete Project (Using Project Selector)': function (browser) {
        browser
            .url(home)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            // Click Create First Project in Project Manager
            .waitForElementVisible('div.project-edit-button-container', 3000)
            .click('div.project-edit-button-container')
            // Verify Project created
            .waitForElementVisible('div.project-selector-container', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'Untitled Project')
            // Delete Project
            .moveToElement('div.manager-function-box.delete.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.delete.center', 3000)
            .click('div.manager-function-box.delete.center')
            .waitForElementVisible('button.confirm-yes', 3000)
            .click('button.confirm-yes')
            // Verify Project deleted
            .waitForElementVisible('div.project-selector-container div.project-selector span#react-select-2--value.Select-multi-value-wrapper div.Select-placeholder', 3000)
            .assert.containsText('div.project-selector-container div.project-selector span#react-select-2--value.Select-multi-value-wrapper div.Select-placeholder', 'Select a project...')
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
