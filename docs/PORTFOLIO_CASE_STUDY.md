# SIPANDU — Community Health and Child Growth Platform: Engineering Case Study

## Overview

A Laravel + Inertia + React application for community health-center workflows.

**Context:** This project models an application domain rather than a documented commercial production deployment. Its value as a portfolio sample comes from how the workflows are implemented and tested.

## Implementation evidence

### Role-specific areas

User, kader (health volunteer), and admin routes with role middleware (`routes/web.php`).

### Child records and growth

Child registration and measurement handling (`app/Http/Controllers/User/ChildController.php`).

### Vaccination/queues

Immunization queue and scheduling flows (`app/Http/Controllers/User/ImmunizationController.php`, `app/Http/Controllers/Kader/ScheduleQueueController.php`).

### Administration

User and health-center management controllers (`app/Http/Controllers/Admin`).

### Tests

A dedicated feature test file covering role access and CRUD (`tests/Feature/SipanduAppTest.php`).


## Architecture

- **Stack:** PHP, Laravel 12, Inertia.js, React 18, Vite, Tailwind CSS, Eloquent, PHPUnit
- **Routing and permissions:** Begin at [routes/web.php](../routes/web.php).
- **Application layer:** Inspect the linked controllers or Livewire components in the project README.
- **Persistence:** Eloquent models and migrations model the application's data and relationships.

## Code review entry points

- [`routes/web.php`](../routes/web.php)
- [`app/Http/Controllers/User/ChildController.php`](../app/Http/Controllers/User/ChildController.php)
- [`app/Http/Controllers/Kader/ScheduleQueueController.php`](../app/Http/Controllers/Kader/ScheduleQueueController.php)
- [`tests/Feature/SipanduAppTest.php`](../tests/Feature/SipanduAppTest.php)

## Risks and improvement opportunities

Healthcare-oriented data deserves special care: use fictitious demo records, test authorization across all roles, avoid putting personal patient information in screenshots, and validate input and role ownership rules.

### Testing

Run `php artisan test` for the existing feature tests, then expand to negative cases for user/child ownership and queue edge cases.

### Reproducibility

The repository was inspected remotely. Its tests were **not executed** as part of this documentation-only update. A clean installation, test run, security review, and a short recorded walkthrough are recommended before presenting this project as production-ready.

## How to present the project to recruiters

1. Define the user problem and what the project models.
2. Demonstrate a concrete end-to-end workflow using fictional data.
3. Explain one implementation tradeoff and locate the relevant code.
4. Show passing tests or state clearly which tests remain to be added.
5. Specify your exact personal contribution and any team collaboration honestly.

Avoid unsupported claims about business impact, usage statistics, uptime or performance.
