Feature: Requests

    Background: User is able to modify requests.

    Scenario: Creating a request
        Given the user is logged into the web app as User
        When the user opens the create modal
        Then the user enters "Request 1" for the request name
        Then the user enters 100 for the cost
        Then the user enters "Author 1" for the author name
        Then the user clicks "Audiobook" for the type
        Then the user clicks create request and should see request "Request 1" created

    Scenario: Creating a request to be reviewed
        When the user opens the create modal
        Then the user enters "Test Request for Review" for the request name
        Then the user enters 100 for the cost
        Then the user enters "Author 1" for the author name
        Then the user clicks "Audiobook" for the type
        Then the user clicks create request and should see request "Test Request for Review" created

    Scenario: Cancels a request
        Given the request "Request 1" has been created
        Then the user cancels the request "Request 1"

