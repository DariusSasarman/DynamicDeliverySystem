# DynamicDeliverySystem
## Hiii 👋 - this is a work in progress project! I'm glad that you decided to visit it!

It's meant to be a system that supports a delivery service where the user can define their schedule and have the parcel be delivered at their actual location. 📦🗓️🧭📍🔄 

### Ever had to leave work early just to catch a parcel that's supposed to arrive at your home?

Basically, for each day of the week, the user can **define the time periods and the locations** where they're found at.

Using this schedule (*without needing to know ahead of time*), the courier can now do their job, at the **right place and at the right time ** - not just "Leave it at the entrance" or "It's been placed in an easybox where you can pick it up".

## Roadmap : 
  - [x] Define the use-cases 
  - [x] Determine the general architecture of the project
  - [x] Design the classes this system relies upon, in a class diagram 
  - [ ] Translate the class diagram into a back-end implementation
  - [x] Provide a user-friendly front-end web interface
  - [x] Have said implementation talk to an nginx reverse proxy
  - [x] Tie it all up with a docker-compose.yml file so it builds nicely and not only "Works on my machine"

## Use case diagram

<img width="879" height="622" alt="Untitled Diagram drawio(1)" src="https://github.com/user-attachments/assets/1977eafb-48e5-4be5-ad63-d0d7408315bc" />


## ER diagram


```mermaid
erDiagram

    USER {
        long ID
        string EMAIL
        string HASHED_PASSWORD
        string ROLE
        datetime CREATED_AT
    }

    BASIC_USER {
        string PHONE_NUMBER
    }

    MANAGER {
        long ID PK
        long ACCOUNT_MADE_BY_ID
        string CITY
        long CITY_ID
    }

    DELIVERY {
        long ACCOUNT_MADE_BY
        long MANAGER_ID
    }

    SCHEDULE {
        long SCHEDULE_ID
        long USER_ID
        datetime LAST_MODIFIED_AT
    }

    ENTRY {
        long LOCATION_ID
        int FROM
        int UNTIL
        string DAYS_AVAILABLE
        long SCHEDULE_ID
    }

    LOCATION {
        string NUMBER
        long STREET_ID
        string COORDINATES
    }

    STREET {
        string NAME
        long CITY_ID
    }

    CITY {
        long ID PK
        string NAME
        long COUNTY_ID
    }

    COUNTY {
        string NAME
        long COUNTRY_ID
    }

    COUNTRY {
        string NAME
    }

    PACKAGE {
        long SENDER_ID
        long PICKUP_COURIER_ID
        long MANAGER_ID
        long DELIVERY_COURIER_ID
        long RECEIVER_ID
        datetime ISSUE_DATE
        datetime PICKUP_DATE
        datetime DELIVERY_DATE
        string STATUS
    }

    INVOICE {
        long ISSUED_TO_ID
        long ISSUED_BY_ID
        string TEXT
        string CONFIRMATION_STATUS
    }

    COMPLAINT {
        long FILED_BY_ID
        long REGARDING_ID
        long COMPLAINT_ID
        string TEXT
        long SOLVING_INVOICE_ID
    }

    %% Inheritance
    USER ||--|| BASIC_USER : inherits
    USER ||--|| MANAGER : inherits
    USER ||--|| DELIVERY : inherits

    %% Manager belongs to City
    CITY ||--o{ MANAGER : contains

    %% Schedule
    BASIC_USER ||--o{ SCHEDULE : owns
    SCHEDULE ||--o{ ENTRY : contains
    ENTRY }o--|| LOCATION : uses

    %% Location hierarchy
    LOCATION }o--|| STREET : on
    STREET }o--|| CITY : in
    CITY }o--|| COUNTY : in
    COUNTY }o--|| COUNTRY : in

    %% Package relations
    BASIC_USER ||--o{ PACKAGE : sender
    BASIC_USER ||--o{ PACKAGE : receiver

    DELIVERY ||--o{ PACKAGE : pickup
    DELIVERY ||--o{ PACKAGE : delivery

    MANAGER ||--o{ PACKAGE : manages

    %% Invoices
    USER ||--o{ INVOICE : issued_to
    MANAGER ||--o{ INVOICE : issued_by

    %% Complaints
    BASIC_USER ||--o{ COMPLAINT : files
    USER ||--o{ COMPLAINT : regarding
    INVOICE ||--o{ COMPLAINT : resolves

    %% Account creation
    MANAGER ||--o{ DELIVERY : manages
    MANAGER ||--o{ DELIVERY : creates
    MANAGER ||--o{ MANAGER : creates
```