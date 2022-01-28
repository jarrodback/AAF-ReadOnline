Feature: Employee

    Employees can assign and review requests.

    Scenario: Employee assigns a request to themselves
        Given the user is logged into the web app as Employee
        Then the employee should navigate to the assign page
        Then the employee should assign "Test Request for Review" to themselves

    Scenario: Employee should put a request into review
        Then the employee should navigate to their assigned page
        Given the employee should see "Test Request for Review" in their assigned requests
        Then the employee should put "Test Request for Review" into review.

    Scenario: Employee should ask for more information and the User should add additional comments
        Then the employee should set "Test Request for Review" to require more information
        Then the employee should ask the user to add "Please add more information on the book" to the request
        Given the user is logged into the web app as User
        Then the user should edit the request "Test Request for Review"
        Then the user should add the response "Here's the additional information"

    Scenario: Employee should send the request off for Authorisation
        Given the user is logged into the web app as Employee
        Then the employee should navigate to their assigned page
        Then the employee should approve the request "Test Request for Review"
        Then the employee decides the cost is actually 1000 and approves it

