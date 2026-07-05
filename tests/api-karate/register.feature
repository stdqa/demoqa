Feature: Account registration and verification (light API check)

  Background:
    * url 'https://demoqa.com'
    * def password = 'StrongPass1!'

  Scenario: A newly registered user can be verified to exist
    * def randomUser = 'user_' + java.lang.System.currentTimeMillis()

    # 1. Register the user
    Given path 'Account/v1/User'
    And request { userName: '#(randomUser)', password: '#(password)' }
    When method post
    Then status 201
    And match response.userName == randomUser
    * def userId = response.userId

    # 2. Get a token for the same credentials (needed to call GET /User/{id})
    Given path 'Account/v1/GenerateToken'
    And request { userName: '#(randomUser)', password: '#(password)' }
    When method post
    Then status 200
    And match response.token == '#notnull'
    * def token = response.token

    # 3. Confirm the user actually exists
    Given path 'Account/v1/User', userId
    And header Authorization = 'Bearer ' + token
    When method get
    Then status 200
    And match response.userName == randomUser

  Scenario: Registering with an already-used username is rejected
    * def randomUser = 'user_' + java.lang.System.currentTimeMillis()

    Given path 'Account/v1/User'
    And request { userName: '#(randomUser)', password: '#(password)' }
    When method post
    Then status 201

    Given path 'Account/v1/User'
    And request { userName: '#(randomUser)', password: '#(password)' }
    When method post
    Then status 406
    And match response.message == 'User exists!'

  Scenario: Registering with a weak password is rejected
    * def randomUser = 'user_' + java.lang.System.currentTimeMillis()

    Given path 'Account/v1/User'
    And request { userName: '#(randomUser)', password: '123' }
    When method post
    Then status 400
