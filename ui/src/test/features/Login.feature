Feature: Login

    Background: Given the user navigates to the web app and logs in

    Scenario: Logs into the web app
        Given user navigates to the web app
        When user enters the Valid username and password
        Then user should be successfully logged in to the app