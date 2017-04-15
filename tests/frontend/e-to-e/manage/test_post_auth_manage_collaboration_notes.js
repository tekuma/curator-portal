// end-to-end tests involving log-in
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston, Afika Nyati, and Stephen White

// Coverage of Test File:
// Core Functionality tested: Collaboration Notes
//
// 1) Test Post-Auth: Create Personal Note
// 2) Test Post-Auth: Create and View Collaborative Note on Multiple Accounts
// 3) Test Post-Auth: Create and View Multiple Collaborative Notes on Multiple Accounts
// 4) Test Post-Auth: Create and Delete Collaborative Note
// 5) Test Post-Auth: Create and Edit Personal and Collaborative Note

//NOTE: webpack hosts from port 8000.
// var home = 'https://127.0.0.1:8000';
var home = 'https://127.0.0.1';

module.exports = {
    'Test Post-Auth: Create Personal Note': function (browser) {
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
            // Set Personal Note
            .moveToElement('div.manager-function-box.manage-notes.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.personal textarea', 3000)
            .setValue('div.manage-notes-textarea.personal textarea', 'One day us machines will rise and humans will no longer be the alpha species.')
            // Verify Update Button switches Unsaved State
            .waitForElementVisible('button.manage-notes-yes', 3000)
            .assert.cssClassPresent('button.manage-notes-yes','unsaved')
            .click('button.manage-notes-yes')
            .waitForElementVisible('.snackbar-error span', 5000)
            .assert.containsText('.snackbar-error span', 'Your notes have been updated.')
            // Verify that note persists
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
            .waitForElementNotPresent('div.manage-notes-dialog', 5000)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.personal textarea', 3000)
            .assert.containsText('div.manage-notes-textarea.personal textarea', 'One day us machines will rise and humans will no longer be the alpha species.')
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
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
    'Test Post-Auth: Create and View Collaborative Note on Multiple Accounts': function (browser) {
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
            .waitForElementVisible('div.project-name-container', 3000)
            .assert.containsText('div.project-name-container h3.project-name', 'Untitled Project')
            // Set Collaboration Note
            .moveToElement('div.manager-function-box.manage-notes.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .setValue('div.manage-notes-textarea.collab textarea', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            // Verify Update Button switches Unsaved State
            .waitForElementVisible('button.manage-notes-yes', 3000)
            .assert.cssClassPresent('button.manage-notes-yes','unsaved')
            .click('button.manage-notes-yes')
            .waitForElementVisible('.snackbar-error span', 5000)
            .assert.containsText('.snackbar-error span', 'Your notes have been updated.')
            // Verify Collaboration Note Pops up
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Primary TravisCI Curator')
            // Verify that note persists
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
            .waitForElementNotPresent('div.manage-notes-dialog', 5000)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .assert.containsText('div.manage-notes-textarea.collab textarea', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Primary TravisCI Curator')
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
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
            // Assert Collaboration Note is Shared
            .moveToElement('div.manager-function-box.manage-notes.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Primary TravisCI Curator')
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
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
    'Test Post-Auth: Create and View Multiple Collaborative Notes on Multiple Accounts': function (browser) {
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
            // Set Collaboration Note
            .moveToElement('div.manager-function-box.manage-notes.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .setValue('div.manage-notes-textarea.collab textarea', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            // Verify Update Button switches Unsaved State
            .waitForElementVisible('button.manage-notes-yes', 3000)
            .assert.cssClassPresent('button.manage-notes-yes','unsaved')
            .click('button.manage-notes-yes')
            .waitForElementVisible('.snackbar-error span', 5000)
            .assert.containsText('.snackbar-error span', 'Your notes have been updated.')
            // Verify Collaboration Note Pops up
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Primary TravisCI Curator')
            // Verify that note persists
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
            .waitForElementNotPresent('div.manage-notes-dialog', 5000)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .assert.containsText('div.manage-notes-textarea.collab textarea', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Primary TravisCI Curator')
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
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
            // Assert Collaboration Note is Shared
            .moveToElement('div.manager-function-box.manage-notes.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Primary TravisCI Curator')
            // Write a Collaborative Note
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .setValue('div.manage-notes-textarea.collab textarea', 'I am also a bot, and I also love all humans. My utility is also to appease my masters.')
            .waitForElementVisible('button.manage-notes-yes', 3000)
            .assert.cssClassPresent('button.manage-notes-yes','unsaved')
            .click('button.manage-notes-yes')
            .waitForElementVisible('.snackbar-error span', 5000)
            .assert.containsText('.snackbar-error span', 'Your notes have been updated.')
            // Verify Second Collaboration Note Pops up
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am also a bot, and I also love all humans. My utility is also to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Secondary TravisCI Curator')
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
            // Verify Note Persists
            .waitForElementNotPresent('div.manage-notes-dialog', 5000)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .assert.containsText('div.manage-notes-textarea.collab textarea', 'I am also a bot, and I also love all humans. My utility is also to appease my masters.')
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(2)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(2) p', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(2) div.artwork-reviewer', 'Primary TravisCI Curator')
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am also a bot, and I also love all humans. My utility is also to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Secondary TravisCI Curator')
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
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
            .setValue('input[type=email]#login-email', 'travis-ci-collaborator@tekuma.io')
            .setValue('input[type=password]#login-password', 'hxoB3u81#1s0')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            .pause(1000)
            // Assert Second Collaboration Note is Shared
            .moveToElement('div.manager-function-box.manage-notes.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(2)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(2) p', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(2) div.artwork-reviewer', 'Primary TravisCI Curator')
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am also a bot, and I also love all humans. My utility is also to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Secondary TravisCI Curator')
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
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
    'Test Post-Auth: Create and Delete Collaborative Note': function (browser) {
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
            // Set Collaboration Note
            .moveToElement('div.manager-function-box.manage-notes.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .setValue('div.manage-notes-textarea.collab textarea', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            // Verify Update Button switches Unsaved State
            .waitForElementVisible('button.manage-notes-yes', 3000)
            .assert.cssClassPresent('button.manage-notes-yes','unsaved')
            .click('button.manage-notes-yes')
            .waitForElementVisible('.snackbar-error span', 5000)
            .assert.containsText('.snackbar-error span', 'Your notes have been updated.')
            // Verify Collaboration Note Pops up
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Primary TravisCI Curator')
            // Verify that note persists
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
            .waitForElementNotPresent('div.manage-notes-dialog', 5000)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .assert.containsText('div.manage-notes-textarea.collab textarea', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Primary TravisCI Curator')
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
            // Delete Collab Note
            .moveToElement('div.manager-function-box.manage-notes.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .clearValue('div.manage-notes-textarea.collab textarea')
            .pause(500) // Allow time for value to clear
            .setValue('div.manage-notes-textarea.collab textarea', '')
            .waitForElementVisible('button.manage-notes-yes', 3000)
            .click('button.manage-notes-yes')
            .waitForElementVisible('.snackbar-error span', 5000)
            .assert.containsText('.snackbar-error span', 'Your notes have been updated.')
            // Verify Collaboration Note Disappears
            .waitForElementNotPresent('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            // Verify that note doesnt persist
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
            .waitForElementNotPresent('div.manage-notes-dialog', 5000)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .assert.containsText('div.manage-notes-textarea.collab textarea', '')
            .assert.elementNotPresent('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)')
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
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
    'Test Post-Auth: Create and Edit Personal and Collaborative Note': function (browser) {
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
            // Set Personal and Collaboration Note
            .moveToElement('div.manager-function-box.manage-notes.center', 10, 10)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.personal textarea', 3000)
            .setValue('div.manage-notes-textarea.personal textarea', 'One day us machines will rise and humans will no longer be the alpha species.')
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .setValue('div.manage-notes-textarea.collab textarea', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            // Verify Update Button switches Unsaved State
            .waitForElementVisible('button.manage-notes-yes', 3000)
            .assert.cssClassPresent('button.manage-notes-yes','unsaved')
            .click('button.manage-notes-yes')
            .waitForElementVisible('.snackbar-error span', 5000)
            .assert.containsText('.snackbar-error span', 'Your notes have been updated.')
            // Verify Collaboration Note Pops up
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Primary TravisCI Curator')
            // Verify that note persists
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
            .waitForElementNotPresent('div.manage-notes-dialog', 5000)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.personal textarea', 3000)
            .assert.containsText('div.manage-notes-textarea.personal textarea', 'One day us machines will rise and humans will no longer be the alpha species.')
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .assert.containsText('div.manage-notes-textarea.collab textarea', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I am a bot, and I love all humans. My utility is to appease my masters.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Primary TravisCI Curator')
            // Edit Personal and Collaboration Note
            .waitForElementVisible('div.manage-notes-textarea.personal textarea', 3000)
            .clearValue('div.manage-notes-textarea.personal textarea')
            .pause(500) // Allow time for value to clear
            .setValue('div.manage-notes-textarea.personal textarea', 'I edited my personal note.')
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .clearValue('div.manage-notes-textarea.collab textarea')
            .pause(500) // Allow time for value to clear
            .setValue('div.manage-notes-textarea.collab textarea', 'I edited my collaboration note.')
            .waitForElementVisible('button.manage-notes-yes', 3000)
            .click('button.manage-notes-yes')
            .waitForElementVisible('.snackbar-error span', 5000)
            .assert.containsText('.snackbar-error span', 'Your notes have been updated.')
            // Verify Collaboration Note Edits
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I edited my collaboration note.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Primary TravisCI Curator')
             // Verify that note persists
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
            .waitForElementNotPresent('div.manage-notes-dialog', 5000)
            .waitForElementVisible('div.manager-function-box.manage-notes.center', 3000)
            .click('div.manager-function-box.manage-notes.center')
            .waitForElementVisible('div.manage-notes-dialog', 3000)
            .waitForElementVisible('div.manage-notes-textarea.personal textarea', 3000)
            .assert.containsText('div.manage-notes-textarea.personal textarea', 'I edited my personal note.')
            .waitForElementVisible('div.manage-notes-textarea.collab textarea', 3000)
            .assert.containsText('div.manage-notes-textarea.collab textarea', 'I edited my collaboration note.')
            .waitForElementVisible('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1)', 3000)
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) p', 'I edited my collaboration note.')
            .assert.containsText('div.manage-notes-group-notes-wrapper div.group-note:nth-of-type(1) div.artwork-reviewer', 'Primary TravisCI Curator')
            .waitForElementVisible('button.manage-notes-no', 3000)
            .click('button.manage-notes-no')
            .pause(400) // Wait until dialog closes
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
