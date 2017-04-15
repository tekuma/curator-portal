# Tekuma Curator Portal End-2-End Test Coverage List
--------------------------
Outlined below is an elaborated list of all the End-2-End tests performed on the Tekuma Curator Portal. For the purposes of testing, two dummy users have been created in the `curator-tekuma` Firebase console which respectively act as the primary user (email: `travis-ci@tekuma.io`) for tasks that don't require collaborative testing, and the secondary user (email: `travis-ci-collaborator@tekuma.io`) for tasks that require collaborative testing.

End-2-End tests are written using the Nightwatch (http://nightwatchjs.org/) framework. An extensive list of assertion and command statements in Nightwatch can be found at: http://nightwatchjs.org/api.

Note: The tests are currently written with the expectation that in the list of `users` in the Firebase Database, the first user is `travis-ci-collaborator@tekuma.io` and the second user is `travis-ci@tekuma.io`. This was necessary so that in the process of 'adding collaborators', the test users would remain at deterministic positions within the dropdown. It is not a perfect solution, so it definitely should be subject to revision in the future, especially because newer randomly generated users could be placed above or in between these user profiles within the `users` Firebase Database node.

## Setup

To get the Selenium standalone server that the curator-portal configuration of
Nightwatch (http://nightwatchjs.org/) is expecting,

    ./get-testing-deps.sh

For end-to-end testing, install ChromeDriver
(https://sites.google.com/a/chromium.org/chromedriver/).
On a Debian GNU/Linux host, try

    sudo apt-get install chromedriver

On Ubuntu, use instead `apt-get install chromium-chromedriver`.
Note that nightwatch.json lists the path of the ChromeDriver executable as
/usr/lib/chromium/chromedriver, which is consistent with the location from the
`chromedrive` deb package. You might need to change the path on other sy


## Test Coverage
### Pre Authentication Tests

1) Test home button redirects to Tekuma homepage
2) Test Login: No Email Error
3) Test Login: No Password Error
4) Test Login: Invalid Email Error
5) Test Login: User Doesnt Exist Error
6) Test Login: Invalid Email/Password Error
7) Test Login: Successful Login using the TravisCI Curator Portal account by pressing Enter Key
8) Test Login: Successful Login using the TravisCI Curator Portal account by pressing Login Button

### Post Authentication Tests

9) Test Post-Auth: Functional Hamburger Icon
10) Test Post-Auth: Functional Search/Manager Icons in Header
11) Test Post-Auth: Successfully Toggle Right Drawer Interface
12) Test Post-Auth: Functional Interface Swop by Pressing Empty Project Box in Manager Interface

#### Manage Tests
##### Add/Delete Projects

13) Test Post-Auth: Add/Delete Project (Using Empty Artwork Card Section)
14) Test Post-Auth: Add/Delete Project (Using Project Manager)
15) Test Post-Auth: Add/Delete Project (Using Project Selector)

##### Downloads

16) Test Post-Auth: Successfully Download CSV
17) Test Post-Auth: Successfully Download Raw Images
18) Test Post-Auth: Successfully Download Print Files

##### Edit Project Name

19) Test Post-Auth: Edit Project Name (Blank Project Name)
20) Test Post-Auth: Edit Project Name (Press Enter to Save)
21) Test Post-Auth: Edit Project Name (Press Icon to Save)

##### Collaborators

22) Test Post-Auth: Check Self is Collaborator in Project
23) Test Post-Auth: Add Collaborator with No Selection
24) Test Post-Auth: Add Self as Collaborator
25) Test Post-Auth: Successfully add Collaborator
26) Test Post-Auth: Successfully add and delete Collaborator
27) Test Post-Auth: Verify Creator not deletable in collaborator profile/Delete via collaborator profile

##### Collaboration Notes

28) Test Post-Auth: Create Personal Note
29) Test Post-Auth: Create and View Collaborative Note on Multiple Accounts
30) Test Post-Auth: Create and View Multiple Collaborative Notes on Multiple Accounts
31) Test Post-Auth: Create and Delete Collaborative Note
32) Test Post-Auth: Create and Edit Personal and Collaborative Note

#### Search Tests
##### General UI Functionality

33) Test Post-Auth: Testing Open All Accordion
34) Test Post-Auth: Testing Clear All Button
35) Test Post-Auth: Testing Hint Circles
36) Test Post-Auth: Test Search Snackbar

#### Review Tests

    Unimplemented

#### Profile Tests

    Unimplemented
