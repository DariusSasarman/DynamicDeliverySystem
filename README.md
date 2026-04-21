# DynamicDeliverySystem
## Hiii 👋 - this is a work in progress project! I'm glad that you decided to visit it!

It's meant to be a system that supports a delivery service where the user can define their schedule and have the parcel be delivered at their actual location. 📦🗓️🧭📍🔄 

### Ever had to leave work early just to catch a parcel that's supposed to arrive at your home?

Basically, for each day of the week, the user can **define the time periods and the locations** where they're found at.

Using this schedule (*without knowing ahead of time*), the courier can now do their job, at the **right place and at the right time - 
not just** "Leave it at the entrance" or "It's been placed in an easybox where you can pick it up".

## Roadmap : 
  - [x] Define the use-cases 
  - [x] Determine the general architecture of the project
  - [ ] Design the classes this system relies upon, in a class diagram 
  - [ ] Implement said classes as a database schema 
  - [ ] Translate the class diagram into a back-end implementation
  - [ ] Provide a user-friendly front-end web interface
  - [ ] Have said implementation talk to an nginx reverse proxy
  - [ ] Tie it all up with a docker-compose.yml file so it builds nicely and not only "Works on my machine"
  - [ ] Extend said interface to a mobile-native application

That's about it for now. I'm sure I'll add more intermediate steps to this roadmap but it's enough for now.

## Use case diagram

<img width="879" height="622" alt="Untitled Diagram drawio(1)" src="https://github.com/user-attachments/assets/1977eafb-48e5-4be5-ad63-d0d7408315bc" />

## C4-style Architectural Diagram

<img width="781" height="521" alt="Untitled Diagram drawio(2)" src="https://github.com/user-attachments/assets/c8d70de1-0e88-4a3b-bf88-1208f59d49df" />
