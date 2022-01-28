Feature: Admin functionalities.

    Background: The admin can approve and decline requests.

    Scenario: Admin approves the request
        Given the user is logged into the web app as Admin
        Then the admin views their authorised page
        Given the admmin should see "Test Request for Review" in their authorised requests
        Then the admin approves the request "Test Request for Review"
        Given the user is logged into the web app as User
        When the user ticks the see completed requests box
        Then the user should see "Test Request for Review" in their requests
