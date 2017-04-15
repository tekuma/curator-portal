// end-to-end tests involving log-in
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston, Afika Nyati, and Stephen White

// Coverage of Test File:
// Core Functionality tested: Edit Project Name
//
// 1) Test Post-Auth: Edit Project Name (Blank Project Name)
// 2) Test Post-Auth: Edit Project Name (Press Enter to Save)
// 3) Test Post-Auth: Edit Project Name (Press Icon to Save)

//NOTE: webpack hosts from port 8000.
// var home = 'https://127.0.0.1:8000';
var home = 'https://127.0.0.1';

module.exports = {
    'Test Post-Auth: Edit Project Name (Blank Project Name)': function (browser) {
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
            .waitForElementVisible('.snackbar-error span', 5000)
            .waitForElementNotVisible('.snackbar-error span', 5000) // Wait for snackbar with 'New project added...' to leave
            // Verify Project created
            .waitForElementVisible('div.project-selector-container', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'Untitled Project')
            // Edit Project Name
            .waitForElementVisible('div.project-name-container div.project-edit-button-container img.project-edit-button', 3000)
            .click('div.project-name-container div.project-edit-button-container img.project-edit-button')
            .waitForElementVisible('div.project-name-container input', 3000)
            .clearValue('div.project-name-container input')
            .pause(500) // Allow time for value to clear
            .setValue('div.project-name-container input', '')
            .click('div.project-name-container .project-edit-button-container img.project-edit-button')
            .pause(200)
            .click('div.project-name-container .project-edit-button-container img.project-edit-button')
            // Assert Error
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'Project Name cannot be blank. Please choose another name.')
            // Assert Project Name Same
            .waitForElementVisible('div.project-name-container h3.project-name', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'Untitled Project')
            .assert.containsText('div.project-selector-container div.project-selector .Select-value-label', 'Untitled Project')
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
    },
    'Test Post-Auth: Edit Project Name (Press Enter to Save)': function (browser) {
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
            .waitForElementVisible('.snackbar-error span', 5000)
            .waitForElementNotVisible('.snackbar-error span', 5000) // Wait for snackbar with 'New project added...' to leave
            // Verify Project created
            .waitForElementVisible('div.project-selector-container', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'Untitled Project')
            // Edit Project Name
            .waitForElementVisible('div.project-name-container div.project-edit-button-container img.project-edit-button', 3000)
            .click('div.project-name-container div.project-edit-button-container img.project-edit-button')
            .waitForElementVisible('div.project-name-container input', 3000)
            .clearValue('div.project-name-container input')
            .pause(500) // Allow time for value to clear
            .setValue('div.project-name-container input', ['New Project Name', browser.Keys.ENTER])
            .pause(2000)
            // Assert Project Name Change
            .waitForElementVisible('div.project-name-container h3.project-name', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'New Project Name')
            .assert.containsText('div.project-selector-container div.project-selector .Select-value-label', 'New Project Name')
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
    },
    'Test Post-Auth: Edit Project Name (Press Icon to Save)': function (browser) {
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
            .waitForElementVisible('.snackbar-error span', 5000)
            .waitForElementNotVisible('.snackbar-error span', 5000) // Wait for snackbar with 'New project added...' to leave
            // Verify Project created
            .waitForElementVisible('div.project-selector-container', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'Untitled Project')
            // Edit Project Name
            .waitForElementVisible('div.project-name-container div.project-edit-button-container img.project-edit-button', 3000)
            .click('div.project-name-container div.project-edit-button-container img.project-edit-button')
            .waitForElementVisible('div.project-name-container input', 3000)
            .clearValue('div.project-name-container input')
            .pause(500) // Allow time for value to clear
            .setValue('div.project-name-container input', 'New Project Name')
            .click('div.project-name-container .project-edit-button-container img.project-edit-button')
            // Assert Project Name Change
            .waitForElementVisible('div.project-name-container h3.project-name', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'New Project Name')
            .assert.containsText('div.project-selector-container div.project-selector .Select-value-label', 'New Project Name')
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
