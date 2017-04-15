// end-to-end tests involving log-in
//
// Copyright 2017 Tekuma Inc.
// All rights reserved.
// created by Scott C. Livingston, Afika Nyati, and Stephen White

// Coverage of Test File:
// Core Functionality tested: Edit Proect Name
//
// 1) Test Post-Auth: Testing Open All Accordion
// 2) Test Post-Auth: Testing Clear All Button
// 3) Test Post-Auth: Testing Hint Circles
// 4) Test Post-Auth: Test Search Snackbar

//NOTE: webpack hosts from port 8000.
// var home = 'https://127.0.0.1:8000';
var home = 'https://127.0.0.1';

module.exports = {
    'Test Post-Auth: Testing Open All Accordion': function (browser) {
        browser
            .url(home)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            // Open All Accordion
            .waitForElementVisible('header div.header-icon.curator.search', 3000)
            .click('header div.header-icon.curator.search')
            .waitForElementVisible('section.search-manager div.search-tool.open', 3000)
            .click('section.search-manager div.search-tool.open')
            // Assert Every Accordion Drawer Open
            // GENERAL
            .moveToElement('article.search-accordion #general-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #general-accordion-drawer', 3000)
            .assert.cssClassPresent('article.search-accordion #general-accordion-drawer', 'open')
            // ARTIST
            .moveToElement('section.search-manager #artist-accordion-drawer', 10, 10)
            .waitForElementVisible('section.search-manager #artist-accordion-drawer', 3000)
            .assert.cssClassPresent('section.search-manager #artist-accordion-drawer', 'open')
            // TAG
            .moveToElement('article.search-accordion #tag-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #tag-accordion-drawer', 3000)
            .assert.cssClassPresent('article.search-accordion #tag-accordion-drawer', 'open')
            // TITLE
            .moveToElement('article.search-accordion #title-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #title-accordion-drawer', 3000)
            .assert.cssClassPresent('article.search-accordion #title-accordion-drawer', 'open')
            // TIME
            .moveToElement('article.search-accordion #time-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #time-accordion-drawer', 3000)
            .assert.cssClassPresent('article.search-accordion #time-accordion-drawer', 'open')
            // COLOR
            .moveToElement('article.search-accordion #color-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #color-accordion-drawer', 3000)
            .assert.cssClassPresent('article.search-accordion #color-accordion-drawer', 'open')
            // Close All Accordion
            .waitForElementVisible('section.search-manager div.search-tool', 3000)
            .click('section.search-manager div.search-tool')
            // Assert Every Accordion Drawer Closed
            // GENERAL
            .moveToElement('article.search-accordion #general-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #general-accordion-drawer', 3000)
            .assert.cssClassNotPresent('article.search-accordion #general-accordion-drawer', 'open')
            // ARTIST
            .moveToElement('article.search-accordion #artist-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #artist-accordion-drawer', 3000)
            .assert.cssClassNotPresent('article.search-accordion #artist-accordion-drawer', 'open')
            // TAG
            .moveToElement('article.search-accordion #tag-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #tag-accordion-drawer', 3000)
            .assert.cssClassNotPresent('article.search-accordion #tag-accordion-drawer', 'open')
            // TITLE
            .moveToElement('article.search-accordion #title-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #title-accordion-drawer', 3000)
            .assert.cssClassNotPresent('article.search-accordion #title-accordion-drawer', 'open')
            // TIME
            .moveToElement('article.search-accordion #time-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #time-accordion-drawer', 3000)
            .assert.cssClassNotPresent('article.search-accordion #time-accordion-drawer', 'open')
            // COLOR
            .moveToElement('article.search-accordion #color-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #color-accordion-drawer', 3000)
            .assert.cssClassNotPresent('article.search-accordion #color-accordion-drawer', 'open')
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
    'Test Post-Auth: Testing Clear All Button': function (browser) {
        browser
            .url(home)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            // Go to Search Interface
            .waitForElementVisible('header div.header-icon.curator.search', 3000)
            .click('header div.header-icon.curator.search')
            // Fill GENERAL
            .moveToElement('article.search-accordion #general-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #general-accordion-drawer', 3000)
            .click('article.search-accordion #general-accordion-drawer')
            .assert.cssClassPresent('article.search-accordion #general-accordion-drawer', 'open')
            .waitForElementVisible('article.search-accordion #general-accordion-drawer + div.accordion-content.open', 3000)
            .setValue('article.search-accordion #general-accordion-drawer + div.accordion-content.open input', 'art')
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(1) div.hint-circle', 3000) // Check search hint filled
            .assert.cssClassPresent('div.search-hints div.hint:nth-of-type(1) div.hint-circle', 'filled')
            // Fill ARTIST
            .moveToElement('article.search-accordion #artist-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #artist-accordion-drawer', 3000)
            .click('article.search-accordion #artist-accordion-drawer')
            .assert.cssClassPresent('article.search-accordion #artist-accordion-drawer', 'open')
            .waitForElementVisible('article.search-accordion #artist-accordion-drawer + div.accordion-content.open', 3000)
            .setValue('article.search-accordion #artist-accordion-drawer + div.accordion-content.open input', 'artist')
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(2) div.hint-circle', 3000) // Check search hint filled
            .assert.cssClassPresent('div.search-hints div.hint:nth-of-type(2) div.hint-circle', 'filled')
            // Fill TITLE
            .moveToElement('article.search-accordion #title-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #title-accordion-drawer', 3000)
            .click('article.search-accordion #title-accordion-drawer')
            .assert.cssClassPresent('article.search-accordion #title-accordion-drawer', 'open')
            .waitForElementVisible('article.search-accordion #title-accordion-drawer + div.accordion-content.open', 3000)
            .setValue('article.search-accordion #title-accordion-drawer + div.accordion-content.open input', 'artwork title')
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(4) div.hint-circle', 3000) // Check search hint filled
            .assert.cssClassPresent('div.search-hints div.hint:nth-of-type(4) div.hint-circle', 'filled')
            // Click Clear and Assert No Filled Hints or Open Accordion Drawers
            .waitForElementVisible('section.search-manager div.search-tool.clear', 3000)
            .click('section.search-manager div.search-tool.clear')
            .assert.cssClassNotPresent('article.search-accordion #general-accordion-drawer', 'open')
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(1) div.hint-circle', 'filled')
            .assert.cssClassNotPresent('article.search-accordion #artist-accordion-drawer', 'open')
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(2) div.hint-circle', 'filled')
            .assert.cssClassNotPresent('article.search-accordion #title-accordion-drawer', 'open')
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(4) div.hint-circle', 'filled')
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
    'Test Post-Auth: Testing Hint Circles': function (browser) {
        browser
            .url(home)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            // Go to Search Interface
            .waitForElementVisible('header div.header-icon.curator.search', 3000)
            .click('header div.header-icon.curator.search')
            // Assert Hint Circle Functional
            // GENERAL
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(1) div.hint-circle', 'filled')
            .moveToElement('article.search-accordion #general-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #general-accordion-drawer', 3000)
            .click('article.search-accordion #general-accordion-drawer')
            .assert.cssClassPresent('article.search-accordion #general-accordion-drawer', 'open')
            .waitForElementVisible('article.search-accordion #general-accordion-drawer + div.accordion-content.open', 3000)
            .setValue('article.search-accordion #general-accordion-drawer + div.accordion-content.open input', 'art')
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(1) div.hint-circle', 3000) // Check search hint filled
            .assert.cssClassPresent('div.search-hints div.hint:nth-of-type(1) div.hint-circle', 'filled')
            .getValue('article.search-accordion #general-accordion-drawer + div.accordion-content.open input', function(result){
              for (let c in result.value){
                browser.setValue('article.search-accordion #general-accordion-drawer + div.accordion-content.open input', "\u0008")
              }
            })
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(1) div.hint-circle', 'filled')
            .click('article.search-accordion #general-accordion-drawer')
            .assert.cssClassNotPresent('article.search-accordion #general-accordion-drawer', 'open')
            // ARTIST
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(2) div.hint-circle', 'filled')
            .moveToElement('article.search-accordion #artist-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #artist-accordion-drawer', 3000)
            .click('article.search-accordion #artist-accordion-drawer')
            .assert.cssClassPresent('article.search-accordion #artist-accordion-drawer', 'open')
            .waitForElementVisible('article.search-accordion #artist-accordion-drawer + div.accordion-content.open', 3000)
            .setValue('article.search-accordion #artist-accordion-drawer + div.accordion-content.open input', 'artist')
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(2) div.hint-circle', 3000) // Check search hint filled
            .assert.cssClassPresent('div.search-hints div.hint:nth-of-type(2) div.hint-circle', 'filled')
            .getValue('article.search-accordion #artist-accordion-drawer + div.accordion-content.open input', function(result){
              for (let c in result.value){
                browser.setValue('article.search-accordion #artist-accordion-drawer + div.accordion-content.open input', "\u0008")
              }
            })
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(2) div.hint-circle', 'filled')
            .click('article.search-accordion #artist-accordion-drawer')
            .assert.cssClassNotPresent('article.search-accordion #artist-accordion-drawer', 'open')
            // TAG
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(3) div.hint-circle', 'filled')
            .moveToElement('article.search-accordion #tag-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #tag-accordion-drawer', 3000)
            .click('article.search-accordion #tag-accordion-drawer')
            .assert.cssClassPresent('article.search-accordion #tag-accordion-drawer', 'open')
            .waitForElementVisible('article.search-accordion #tag-accordion-drawer + div.accordion-content.open', 3000)
            .setValue('article.search-accordion #tag-accordion-drawer + div.accordion-content.open input', ['tag', browser.Keys.ENTER])
            .waitForElementPresent('article.search-accordion #tag-accordion-drawer + div.accordion-content.open div.ReactTags__tags span.ReactTags__tag', 3000)
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(3) div.hint-circle', 3000) // Check search hint filled
            .assert.cssClassPresent('div.search-hints div.hint:nth-of-type(3) div.hint-circle', 'filled')
            .click('article.search-accordion #tag-accordion-drawer + div.accordion-content.open span.ReactTags__tag a.ReactTags__remove')
            .waitForElementNotPresent('article.search-accordion #tag-accordion-drawer + div.accordion-content.open div.ReactTags__tags span.ReactTags__tag', 3000)
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(3) div.hint-circle', 'filled')
            .click('article.search-accordion #tag-accordion-drawer')
            .assert.cssClassNotPresent('article.search-accordion #tag-accordion-drawer', 'open')
            // TITLE
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(4) div.hint-circle', 'filled')
            .moveToElement('article.search-accordion #tag-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #title-accordion-drawer', 3000)
            .click('article.search-accordion #title-accordion-drawer')
            .assert.cssClassPresent('article.search-accordion #title-accordion-drawer', 'open')
            .waitForElementVisible('article.search-accordion #title-accordion-drawer + div.accordion-content.open', 3000)
            .setValue('article.search-accordion #title-accordion-drawer + div.accordion-content.open input', 'artwork title')
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(4) div.hint-circle', 3000) // Check search hint filled
            .assert.cssClassPresent('div.search-hints div.hint:nth-of-type(4) div.hint-circle', 'filled')
            .getValue('article.search-accordion #title-accordion-drawer + div.accordion-content.open input', function(result){
              for (let c in result.value){
                browser.setValue('article.search-accordion #title-accordion-drawer + div.accordion-content.open input', "\u0008")
              }
            })
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(4) div.hint-circle', 'filled')
            .click('article.search-accordion #title-accordion-drawer')
            .assert.cssClassNotPresent('article.search-accordion #title-accordion-drawer', 'open')
            // TIME
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(5) div.hint-circle', 'filled')
            .moveToElement('article.search-accordion #time-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #time-accordion-drawer', 3000)
            .click('article.search-accordion #time-accordion-drawer')
            .assert.cssClassPresent('article.search-accordion #time-accordion-drawer', 'open')
            .waitForElementVisible('article.search-accordion #time-accordion-drawer + div.accordion-content.open', 3000)
            .waitForElementVisible('article.search-accordion #time-accordion-drawer + div.accordion-content.open label.search-time-label', 3000)
            .pause(400) // Wait for drawer to open
            .click('article.search-accordion #time-accordion-drawer + div.accordion-content.open label.search-time-label')
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(5) div.hint-circle', 3000) // Check search hint filled
            .assert.cssClassPresent('div.search-hints div.hint:nth-of-type(5) div.hint-circle', 'filled')
            .waitForElementVisible('section.search-manager div.search-tool.clear', 3000)
            .click('section.search-manager div.search-tool.clear')
            .pause(400) // Wait for accordion to settle
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(5) div.hint-circle', 'filled')
            .assert.cssClassNotPresent('article.search-accordion #time-accordion-drawer', 'open')
            // COLOR
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(6) div.hint-circle', 'filled')
            .moveToElement('article.search-accordion #color-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #color-accordion-drawer', 3000)
            .click('article.search-accordion #color-accordion-drawer')
            .pause(400) // Wait for accordion drawer to open
            .assert.cssClassPresent('article.search-accordion #color-accordion-drawer', 'open')
            .waitForElementVisible('article.search-accordion #color-accordion-drawer + div.accordion-content.open', 3000)
            .waitForElementVisible('article.search-accordion #color-accordion-drawer + div.accordion-content.open div.color-box-wrapper div.color-box:nth-of-type(2)', 3000)
            .click('article.search-accordion #color-accordion-drawer + div.accordion-content.open div.color-box-wrapper div.color-box:nth-of-type(2)')
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(6) div.hint-circle', 3000) // Check search hint filled
            .assert.cssClassPresent('div.search-hints div.hint:nth-of-type(6) div.hint-circle', 'filled')
            .waitForElementVisible('section.search-manager div.search-tool.clear', 3000)
            .click('section.search-manager div.search-tool.clear')
            .assert.cssClassNotPresent('div.search-hints div.hint:nth-of-type(6) div.hint-circle', 'filled')
            .assert.cssClassNotPresent('article.search-accordion #color-accordion-drawer', 'open')
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
    'Test Post-Auth: Test Search Snackbar': function (browser) {
        browser
            .url(home)
            .waitForElementVisible('input[type=email]#login-email', 2000)
            .waitForElementVisible('input[type=password]#login-password', 1000)
            .setValue('input[type=email]#login-email', 'travis-ci@tekuma.io')
            .setValue('input[type=password]#login-password', 'BczEZW{p8fgyhYs,_-2)%o5Jd/Vt6bqUm9')
            .click('button.login-button')
            .waitForElementVisible('div.tekuma-logo', 3000)
            // Go to Search Interface
            .waitForElementVisible('header div.header-icon.curator.search', 3000)
            .click('header div.header-icon.curator.search')
            // GENERAL
            .moveToElement('article.search-accordion #general-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #general-accordion-drawer', 3000)
            .click('article.search-accordion #general-accordion-drawer')
            .assert.cssClassPresent('article.search-accordion #general-accordion-drawer', 'open')
            .pause(1000)
            .waitForElementVisible('article.search-accordion #general-accordion-drawer + div.accordion-content.open', 3000)
            .setValue('article.search-accordion #general-accordion-drawer + div.accordion-content.open input', ['art', browser.Keys.ENTER])
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(1) div.hint-circle', 3000) // Check search hint filled
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'Performing your search. Results will arrive shortly...')
            .waitForElementNotVisible('.snackbar-error span', 5000) // Wait for snackbar to leave
            .click('article.search-accordion #general-accordion-drawer')
            .assert.cssClassNotPresent('article.search-accordion #general-accordion-drawer', 'open')
            .waitForElementVisible('section.search-manager div.search-tool.clear', 3000)
            .click('section.search-manager div.search-tool.clear')
            .pause(400) // Wait for accordion to settle
            // ARTIST
            .moveToElement('article.search-accordion #artist-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #artist-accordion-drawer', 3000)
            .click('article.search-accordion #artist-accordion-drawer')
            .assert.cssClassPresent('article.search-accordion #artist-accordion-drawer', 'open')
            .waitForElementVisible('article.search-accordion #artist-accordion-drawer + div.accordion-content.open', 3000)
            .setValue('article.search-accordion #artist-accordion-drawer + div.accordion-content.open input', ['artist', browser.Keys.ENTER])
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(2) div.hint-circle', 3000) // Check search hint filled
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'Performing your search. Results will arrive shortly...')
            .waitForElementNotVisible('.snackbar-error span', 5000) // Wait for snackbar to leave
            .click('article.search-accordion #artist-accordion-drawer')
            .assert.cssClassNotPresent('article.search-accordion #artist-accordion-drawer', 'open')
            .waitForElementVisible('section.search-manager div.search-tool.clear', 3000)
            .click('section.search-manager div.search-tool.clear')
            .pause(400) // Wait for accordion to settle
            // TITLE
            .moveToElement('article.search-accordion #title-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #title-accordion-drawer', 3000)
            .click('article.search-accordion #title-accordion-drawer')
            .assert.cssClassPresent('article.search-accordion #title-accordion-drawer', 'open')
            .waitForElementVisible('article.search-accordion #title-accordion-drawer + div.accordion-content.open', 3000)
            .setValue('article.search-accordion #title-accordion-drawer + div.accordion-content.open input', ['artwork title', browser.Keys.ENTER])
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(4) div.hint-circle', 3000) // Check search hint filled
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'Performing your search. Results will arrive shortly...')
            .waitForElementNotVisible('.snackbar-error span', 5000) // Wait for snackbar to leave
            .click('article.search-accordion #title-accordion-drawer')
            .assert.cssClassNotPresent('article.search-accordion #title-accordion-drawer', 'open')
            .waitForElementVisible('section.search-manager div.search-tool.clear', 3000)
            .click('section.search-manager div.search-tool.clear')
            .pause(400) // Wait for accordion to settle
            // MAIN SEARCH BUTTON
            .moveToElement('article.search-accordion #general-accordion-drawer', 10, 10)
            .waitForElementVisible('article.search-accordion #general-accordion-drawer', 3000)
            .click('article.search-accordion #general-accordion-drawer')
            .assert.cssClassPresent('article.search-accordion #general-accordion-drawer', 'open')
            .waitForElementVisible('article.search-accordion #general-accordion-drawer + div.accordion-content.open', 3000)
            .setValue('article.search-accordion #general-accordion-drawer + div.accordion-content.open input', 'art')
            .waitForElementVisible('section.search-manager div.search-manager-container div.search-button', 3000)
            .click('section.search-manager div.search-manager-container div.search-button')
            .waitForElementVisible('div.search-hints div.hint:nth-of-type(1) div.hint-circle', 3000) // Check search hint filled
            .waitForElementVisible('.snackbar-error span', 4000)
            .assert.containsText('.snackbar-error span', 'Performing your search. Results will arrive shortly...')
            .waitForElementNotVisible('.snackbar-error span', 5000) // Wait for snackbar to leave
            .click('article.search-accordion #general-accordion-drawer')
            .assert.cssClassNotPresent('article.search-accordion #general-accordion-drawer', 'open')
            .waitForElementVisible('section.search-manager div.search-tool.clear', 3000)
            .click('section.search-manager div.search-tool.clear')
            .pause(400) // Wait for accordion to settle
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
