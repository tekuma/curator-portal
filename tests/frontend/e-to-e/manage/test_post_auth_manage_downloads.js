// end-to-end tests involving log-in
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston, Afika Nyati, and Stephen White

//NOTE: webpack hosts from port 8000.
var home = 'https://127.0.0.1:8000';
// var home = 'https://127.0.0.1';

module.exports = {
    'Test Post-Auth: Successfully Download CSV': function (browser) {
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
            .pause(6000) // Wait for snackbar with 'New project added...' to leave
            // Verify Project created
            .waitForElementVisible('div.project-selector-container', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'Untitled Project')
            // Download CSV
            .waitForElementVisible('div.manager-function.download div.manager-function-box.download.center:nth-of-type(1)', 3000)
            .click('div.manager-function.download div.manager-function-box.download.center:nth-of-type(1)')
            // Assert Snackbar Message
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'CSV file is being generated. Download will begin shortly...')
            // Delete Project
            .moveToElement('div.manager-function-box.delete.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.delete.center', 3000)
            .click('div.manager-function-box.delete.center')
            .waitForElementVisible('button.confirm-yes', 3000)
            .click('button.confirm-yes')
            // Verify Project deleted
            .waitForElementVisible('div.project-selector-container div.Select-placeholder', 3000)
            .assert.containsText('div.project-selector-container div.Select-placeholder', 'Select a project...')
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
    'Test Post-Auth: Successfully Download Raw Images': function (browser) {
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
            .pause(6000) // Wait for snackbar with 'New project added...' to leave
            // Verify Project created
            .waitForElementVisible('div.project-selector-container', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'Untitled Project')
            // Download Raw Images
            .waitForElementVisible('div.manager-function.download div.manager-function-box.download.center:nth-of-type(2)', 3000)
            .click('div.manager-function.download div.manager-function-box.download.center:nth-of-type(2)')
            // Assert Snackbar Message
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'Zipped raw files are being generated. Download will begin shortly...')
            // Delete Project
            .moveToElement('div.manager-function-box.delete.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.delete.center', 3000)
            .click('div.manager-function-box.delete.center')
            .waitForElementVisible('button.confirm-yes', 3000)
            .click('button.confirm-yes')
            // Verify Project deleted
            .waitForElementVisible('div.project-selector-container div.Select-placeholder', 3000)
            .assert.containsText('div.project-selector-container div.Select-placeholder', 'Select a project...')
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
    'Test Post-Auth: Successfully Download Print Files': function (browser) {
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
            .pause(6000) // Wait for snackbar with 'New project added...' to leave
            // Verify Project created
            .waitForElementVisible('div.project-selector-container', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'Untitled Project')
            // Download Raw Images
            .waitForElementVisible('div.manager-function.download div.manager-function-box.download.center:nth-of-type(3)', 3000)
            .click('div.manager-function.download div.manager-function-box.download.center:nth-of-type(3)')
            // Assert Snackbar Message
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'Print files are being generated. Download will begin shortly...')
            // Delete Project
            .moveToElement('div.manager-function-box.delete.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.delete.center', 3000)
            .click('div.manager-function-box.delete.center')
            .waitForElementVisible('button.confirm-yes', 3000)
            .click('button.confirm-yes')
            // Verify Project deleted
            .waitForElementVisible('div.project-selector-container div.Select-placeholder', 3000)
            .assert.containsText('div.project-selector-container div.Select-placeholder', 'Select a project...')
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
