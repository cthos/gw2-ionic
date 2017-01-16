@daily_events
Feature: Seeing the cool stuff to do today
  In order to figure out what the heck I want to do today
  As a player of Guild Wars 2
  I want a place to view all the daily events and boss events

Scenario: Seeing Daily PVE Events
  Given I have opened the app
  When the app starts up for the first time
  And the data has finished loading
  Then I should see a list of PVE Events

Scenario: Seeing those sweet PVP Events
  Given I have opened the app
  And I'm on the daily page
  When I visit the PVP Tab
  And the data has finished loading
  Then I should see who I need to slaughter in PVP today

Scenario: WVW is where it's at
  Given I have opened the app
  And I'm on the daily page
  When I visit the WVW Tab
  And the data has finished loading
  Then I should see some WVW events, or else

Scenario: Boss Timers are my jam
  Given I have opened the app
  And I'm on the daily page
  When I visit the event timers page
  And the data has finished loading
  Then Those bosses won't know what hit them






  