Feature: Login

    Background: Given the user navigates to the web app and logs in

    Scenario: Unsuccessfully logs into the web app
        Given user navigates to the web app
        When user enters the Invalid username and password
        Then user should see a login error message

    Scenario: Logs into the web app
        Given user navigates to the web app
        When user enters the Valid username and password
        Then user should be successfully logged in to the app

    Scenario: Logs out of the web app
        Given the user is logged into the web app
        Then the user should log out
