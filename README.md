# Okeytoplay

## Description

Mobile-First Website for musicians and pubs/establishments that allow them to get in touch to organize concerts & display the agenda of music events.

## User Stories

404 - The user will see a nice 404 page when visiting a page that doesn’t exist and is a user fault.

500 - The user will see a nice error page when the super team screws it up so that I know that is not my fault.

Homepage - As a user I want to be able to access the homepage so that I see what the app is about and login and signup, next events with List view and calendar, Map with events.

Sign up - As a user I want to sign up on the webpage with 3 different ROLES: Groupie, Band, Establishments.

Login - Depending on the user profile:

- Establishment owner, Band, Groupie

As a user I want to be able to log in on the webpage so that I can get back to my account and manage the different options of the profile.

Logout - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account

Events list -

As a GROUPIE: - I want to see all the concerts available so that I can choose which ones I want to attend. - I want to see the list of Bands, Establishments, - Reviews

As a Establishment: - I want to see the list of Bands. - Reviews

As a Band:

- I want to see the list of Bands, Establishments.
- Reviews

Events create:

As a Establishment: - I want to create an event so that the Band can join to play.

Events detail:

As a GROUPIE: - As a user I want to see the event details and attendee list of one event so that I can decide if I want to attend

As a Establishment: - Details of the Bands, Reviews...

As a Band:

- Events available
- Details of the Establishments, Reviews...

Attend event:

As a GROUPIE: - As a user I want to be able to attend to event so that the organizers can count me in

As a Band: - Confirmation from the Establishment

As a Establishment: - Book event confirmation

## Backlog

List of other features outside of the MVPs scope

User profile: - see my profile - upload my profile picture - see other users profile - list of events created by the user - list events the user is attending

Geo Location: - add geolocation to events when creating - show event in a map in event detail page - show all events in a map in the event list page

Homepage: - …

## ROUTES:

| Method |            Description            |             Test Text              |
| :----: | :-------------------------------: | :--------------------------------: |
|  GET   |                 /                 |        Renders the homepage        |
|  GET   |           /auth/signup            |       Renders sign up screen       |
|  POST  |           /auth/signup            |     Redirects to /user/profile     |
|  GET   |            /auth/login            |       Renders log in screen        |
|  POST  |            /auth/login            |           Redirects to /           |
|  GET   |               /user               |       Renders user homepage        |
|  GET   |           /user/profile           |       Renders log in screen        |
|  POST  |           /user/profile           |         Redirects to /user         |
|  GET   |           /user/events            |        Renders user events         |
|  GET   |         /user/events/new          |         Renders new event          |
|  POST  |         /user/events/new          |     Redirects to /user/events      |
|  GET   |       /user/events/:eventID       |        Renders event screen        |
|  POST  |       /user/events/:eventID       |     Redirects to /user/events      |
|  GET   |      /user/events/attending       |   Renders user attending events    |
|  GET   |  /user/events/attending/:eventID  |    Renders user attending event    |
|  POST  |  /user/events/attending/:eventID  |   Redirects to attending events    |
|  GET   |       /user/events/bookings       |    Renders user booking events     |
|  GET   |   /user/events/booking/:eventID   |     Renders user booking event     |
|  POST  |   /user/events/booking/:eventID   |    Redirects to booking events     |
|  GET   |           /user/logout            |           Redirects to /           |
|  GET   |              /bands               |      Renders available bands       |
|  GET   |          /bands/:bandID           |     Renders a band information     |
|  POST  |          /bands/:bandID           |     Renders a band information     |
|  GET   |          /establishments          |      Renders available local       |
|  GET   | /establishments/:establishmentsID |    Renders a local information     |
|  POST  | /establishments/:establishmentsID |    Renders a local information     |
|  GET   |              /events              |      Renders available events      |
|  GET   |         /events/:eventID          |    Renders a event information     |
|  POST  |         /events/:eventID          | Redirects to user events or log in |
|        |                                   |

## Links

### Git

The url to your repository and to your deployed project

[Repository Link](http://github.com/)

[Deploy Link](http://heroku.com/)

### Slides

[Slides Link](http://slides.com/)
