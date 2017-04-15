// end-to-end tests involving log-in
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston, Afika Nyati, and Stephen White

// Coverage of Test File:
// Core Functionality tested: Collaborators
//
// 1) Test Post-Auth: Check Self is Collaborator in Project
// 2) Test Post-Auth: Add Collaborator with No Selection
// 3) Test Post-Auth: Add Self as Collaborator
// 4) Test Post-Auth: Successfully add Collaborator
// 5) Test Post-Auth: Successfully add and delete Collaborator
// 6) Test Post-Auth: Verify Creator not deletable in collaborator profile/Delete via collaborator profile

//NOTE: webpack hosts from port 8000.
// var home = 'https://127.0.0.1:8000';
var home = 'https://127.0.0.1';

module.exports = {
    'Test Post-Auth: Check Self is Collaborator in Project': function (browser) {
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
            // Check Collaborator is Self
            .moveToElement('div.manager-function.collaborate', 10, 10)
            .waitForElementVisible('div.collaborator-box', 3000)
            .assert.containsText('div.collaborator-box article:nth-of-type(1) p.collaborator-name', '(creator)')
            .waitForElementVisible('div.collaborator-box article:nth-of-type(1) p.collaborator-name span', 3000)
            .assert.containsText('div.collaborator-box article:nth-of-type(1) p.collaborator-name span', '(creator)')
            // Assert Self is black
            .assert.cssClassPresent('div.collaborator-box article:nth-of-type(1)', 'self')
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
            // Assert Collaborator Name is Same as Display Name
            .waitForElementVisible('div.nav-username', 3000)
            .assert.containsText('span.nav-username-writing', 'PRIMARY TRAVISCI CURATOR')
            // Log off
            .waitForElementVisible('div.logout-button', 3000)
            .click('div.logout-button')
            .waitForElementVisible('div.header-icon.home-icon', 5000)
            .end()
    },
    'Test Post-Auth: Add Collaborator with No Selection': function (browser) {
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
            // Add Collaborator with No Selection
            .moveToElement('div.manager-function.collaborate', 10, 10)
            .waitForElementVisible('div.collaborator-add-button', 3000)
            .click('div.collaborator-add-button')
            // Assert Error
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'Please select a collaborator to add to this project.')
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
    'Test Post-Auth: Add Self as Collaborator': function (browser) {
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
            // Select Self
            .waitForElementVisible('div.manager-function.collaborate', 3000)
            .moveToElement('div.manager-function.collaborate', 10, 10)
            .waitForElementVisible('div.collaborator-select-container', 3000)
            .click('div.collaborator-select-container')
            .waitForElementVisible('div.collaborator-select-container .Select-menu-outer .Select-menu #react-select-3--option-1', 3000)
            .click('div.collaborator-select-container .Select-menu-outer .Select-menu #react-select-3--option-1')
            .pause(400)
            // Check that self is selected and add
            .waitForElementVisible('div.collaborator-select-container .Select.add-collaborator-selector .Select-value-label', 3000)
            .assert.containsText('div.collaborator-select-container .Select.add-collaborator-selector .Select-value-label', 'Primary TravisCI Curator')
            .click('div.collaborator-add-button')
            // Assert Error
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'You are already a collaborator in this project.')
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
    'Test Post-Auth: Successfully add Collaborator': function (browser) {
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
            // Select Collaborator
            .waitForElementVisible('div.manager-function.collaborate', 3000)
            .moveToElement('div.manager-function.collaborate', 10, 10)
            .waitForElementVisible('div.collaborator-select-container', 3000)
            .click('div.collaborator-select-container')
            .waitForElementVisible('div.collaborator-select-container .Select-menu-outer .Select-menu #react-select-3--option-0', 3000)
            .click('div.collaborator-select-container .Select-menu-outer .Select-menu #react-select-3--option-0')
            .pause(400)
            // Check that collaborator is selected and add
            .waitForElementVisible('div.collaborator-select-container .Select.add-collaborator-selector .Select-value-label', 3000)
            .assert.containsText('div.collaborator-select-container .Select.add-collaborator-selector .Select-value-label', 'Secondary TravisCI Curator')
            .click('div.collaborator-add-button')
            // Assert Added
            .waitForElementVisible('div.collaborator-box article:nth-of-type(1) p.collaborator-name', 3000)
            .assert.containsText('div.collaborator-box article:nth-of-type(1) p.collaborator-name', 'Primary TravisCI Curator')
            .waitForElementVisible('div.collaborator-box article:nth-of-type(2) p.collaborator-name', 3000)
            .assert.containsText('div.collaborator-box article:nth-of-type(2) p.collaborator-name', 'Secondary TravisCI Curator')
            .pause(3000)    // Don't create project then delete in short timeframe
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
    'Test Post-Auth: Successfully add and delete Collaborator': function (browser) {
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
            // Select Collaborator
            .waitForElementVisible('div.manager-function.collaborate', 3000)
            .moveToElement('div.manager-function.collaborate', 10, 10)
            .waitForElementVisible('div.collaborator-select-container', 3000)
            .click('div.collaborator-select-container')
            .waitForElementVisible('div.collaborator-select-container .Select-menu-outer .Select-menu #react-select-3--option-0', 3000)
            .click('div.collaborator-select-container .Select-menu-outer .Select-menu #react-select-3--option-0')
            .pause(400)
            // Check that collaborator is selected and add
            .waitForElementVisible('div.collaborator-select-container .Select.add-collaborator-selector .Select-value-label', 3000)
            .assert.containsText('div.collaborator-select-container .Select.add-collaborator-selector .Select-value-label', 'Secondary TravisCI Curator')
            .click('div.collaborator-add-button')
            // Assert Added
            .waitForElementVisible('div.collaborator-box article:nth-of-type(1) p.collaborator-name', 3000)
            .assert.containsText('div.collaborator-box article:nth-of-type(1) p.collaborator-name', 'Primary TravisCI Curator')
            .waitForElementVisible('div.collaborator-box article:nth-of-type(2) p.collaborator-name', 3000)
            .assert.containsText('div.collaborator-box article:nth-of-type(2) p.collaborator-name', 'Secondary TravisCI Curator')
            .pause(3000)    // Don't create then delete in short timeframe
            // Delete Collaborator
            .waitForElementVisible('div.collaborator-box article:nth-of-type(2) div.delete-collaborator', 3000)
            .click('div.collaborator-box article:nth-of-type(2) div.delete-collaborator')
            .waitForElementVisible('button.confirm-yes', 3000)
            .click('button.confirm-yes')
            .waitForElementNotPresent('div.collaborator-box article:nth-of-type(2)', 3000)
            .pause(1000)
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
    'Test Post-Auth: Verify Creator not deletable in collaborator profile/Delete via collaborator profile': function (browser) {
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
            .waitForElementVisible('.snackbar-error span', 5000)
            .waitForElementNotVisible('.snackbar-error span', 5000) // Wait for snackbar with 'New project added...' to leave
            // Select Collaborator
            .waitForElementVisible('div.manager-function.collaborate', 3000)
            .moveToElement('div.manager-function.collaborate', 10, 10)
            .waitForElementVisible('div.collaborator-select-container', 3000)
            .click('div.collaborator-select-container')
            .waitForElementVisible('div.collaborator-select-container .Select-menu-outer .Select-menu #react-select-3--option-0', 3000)
            .click('div.collaborator-select-container .Select-menu-outer .Select-menu #react-select-3--option-0')
            .pause(400)
            // Check that collaborator is selected and add
            .waitForElementVisible('div.collaborator-select-container .Select.add-collaborator-selector .Select-value-label', 3000)
            .assert.containsText('div.collaborator-select-container .Select.add-collaborator-selector .Select-value-label', 'Secondary TravisCI Curator')
            .click('div.collaborator-add-button')
            // Assert Added
            .waitForElementVisible('div.collaborator-box article:nth-of-type(1) p.collaborator-name', 3000)
            .assert.containsText('div.collaborator-box article:nth-of-type(1) p.collaborator-name', 'Primary TravisCI Curator')
            .assert.cssClassPresent('div.collaborator-box article:nth-of-type(1)','self')
            .waitForElementVisible('div.collaborator-box article:nth-of-type(2) p.collaborator-name', 3000)
            .assert.containsText('div.collaborator-box article:nth-of-type(2) p.collaborator-name', 'Secondary TravisCI Curator')
            .assert.cssClassNotPresent('div.collaborator-box article:nth-of-type(2)', 'self')
            // Open Hidden Navigation
            .waitForElementVisible('button.hamburger', 3000)
            .click('button.hamburger')
            .pause(400)
            // Log off
            .waitForElementVisible('div.logout-button', 3000)
            .click('div.logout-button')
            .waitForElementVisible('div.header-icon.home-icon', 5000)
            // Log onto Secondary Profile
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci-collaborator@tekuma.io')
            .setValue('input[type=password]#login-password', 'hxoB3u81#1s0')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            .pause(1000)
            // Assert collaborators
            .moveToElement('div.manager-function-box.center.collaborators', 10, 10)
            .waitForElementVisible('div.collaborator-box article:nth-of-type(1) p.collaborator-name', 6000)
            .assert.containsText('div.collaborator-box article:nth-of-type(1) p.collaborator-name', 'Primary TravisCI Curator')
            .assert.cssClassNotPresent('div.collaborator-box article:nth-of-type(1)', 'self')
            .waitForElementVisible('div.collaborator-box article:nth-of-type(2) p.collaborator-name', 3000)
            .assert.containsText('div.collaborator-box article:nth-of-type(2) p.collaborator-name', 'Secondary TravisCI Curator')
            .assert.cssClassPresent('div.collaborator-box article:nth-of-type(2)', 'self')
            // Assert Creator Not Deletable
            .assert.elementNotPresent('div.collaborator-box article:nth-of-type(1) div.delete-collaborator', 3000)
            // Delete Collaborator/Self
            .waitForElementVisible('div.collaborator-box article:nth-of-type(2) div.delete-collaborator', 3000)
            .click('div.collaborator-box article:nth-of-type(2) div.delete-collaborator')
            .waitForElementVisible('button.confirm-yes', 3000)
            .click('button.confirm-yes')
            .waitForElementNotPresent('div.collaborator-box article:nth-of-type(2)', 3000)
            .pause(1000)
            // Open Hidden Navigation
            .waitForElementVisible('button.hamburger', 3000)
            .click('button.hamburger')
            .pause(400)
            // Log off
            .waitForElementVisible('div.logout-button', 3000)
            .click('div.logout-button')
            .waitForElementVisible('div.header-icon.home-icon', 5000)
            // Log onto Primary Profile
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            .pause(1000)
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
