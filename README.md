# DynamicDeliverySystem
## Hiii 👋 - this is a work in progress project! I'm glad that you decided to visit it!

It's meant to be a system that supports a delivery service where the user can define their schedule and have the parcel be delivered at their actual location. 📦🗓️🧭📍🔄 

### Ever had to leave work early just to catch a parcel that's supposed to arrive at your home?

Basically, for each day of the week, the user can **define the time periods and the locations** where they're found at.

Using this schedule (*without needing to know ahead of time*), the courier can now do their job, at the **right place and at the right time ** - not just "Leave it at the entrance" or "It's been placed in an easybox where you can pick it up".

## Quick start (Docker)

**Prerequisites:** Docker 24+, Docker Compose v2

```bash
docker compose up --build
```

Open **http://localhost** once all services are healthy.

### Seed manager account

On first startup, a root manager is created automatically:

| Field | Value |
|-------|-------|
| Email | `manager@delivery.local` |
| Password | `Manager123!` |

### Typical demo flow

1. Register two **basic** users (sender and recipient).
2. As sender: open **My account (schedule)**, add map locations, and save.
3. As sender: **Place an order** with the recipient's email and a pickup date (today or later).
4. Log in as the seed manager and create a **delivery** courier account.
5. Assign the pending package to the courier for pickup, then delivery.
6. As courier: confirm pickup and deposit under **Review Current Assignments**.
7. As manager: assign the package for final delivery once it is in storage.
8. As courier: use **Finish delivery** to get the confirmation code.
9. As recipient: **Confirm Delivery** with that code.

### Local development (without Docker)

**Backend:** Java 21, Maven 3.9+, MySQL 8

```bash
cd frontend && npm ci && npm run build
cd ../backend && mvn package
java -jar target/*.jar
```

**Frontend dev server** (proxies `/api` to port 8080):

```bash
cd frontend && npm run dev
```

Copy `.env.example` to `.env` and adjust `DB_*` / `JWT_SECRET` as needed.

If the backend fails on startup with a `phone_number` constraint error after upgrading, reset the database volume:

```bash
docker compose down -v
docker compose up --build
```

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
        long MANAGING_LOCATION_ID
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
        string DAYS_VALID
        long SCHEDULE_ID
    }

    LOCATION {
        long LOCATION_ID
        long LATITUDE
        long LONGITUDE
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
    LOCATION ||--o{ MANAGER : contains

    %% Schedule
    BASIC_USER ||--o{ SCHEDULE : owns
    SCHEDULE ||--o{ ENTRY : contains
    ENTRY }o--|| LOCATION : uses

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
    PACKAGE ||--o{ COMPLAINT : regarding
    INVOICE ||--o{ COMPLAINT : resolves

    %% Account creation
    MANAGER ||--o{ DELIVERY : manages
    MANAGER ||--o{ DELIVERY : creates
    MANAGER ||--o{ MANAGER : creates
```

## Regarding Security...

Exposing your entire schedule might seem risky. It's true!

Here's how information leak issues are avoided:

1. Couriers are never aware about whom the package is 
delivered to. All they see is a phone number,
some coordinates and the available time window.

2. On delivery, identity is confirmed by a
common confirmation code.

3. When someone desires to send a package,
all they need is an email - no other personal details
to be specified.

4. Managers can't view the schedules of clients at all.

Unless attacked, this system is safer by design
than the standard delivery apps.