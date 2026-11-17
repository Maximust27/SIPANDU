# SIPANDU — Community Health and Child Growth Platform

A Laravel + Inertia + React application for community health-center workflows.

**Public demo:** Not currently provided. Review the code on GitHub or follow the local setup instructions below. This repository is a portfolio project, not a claim of production deployment.

## What it demonstrates

| Area | Evidence in source code |
| --- | --- |
| Role-specific areas | User, kader (health volunteer), and admin routes with role middleware (`routes/web.php`) |
| Child records and growth | Child registration and measurement handling (`app/Http/Controllers/User/ChildController.php`) |
| Vaccination/queues | Immunization queue and scheduling flows (`app/Http/Controllers/User/ImmunizationController.php`, `app/Http/Controllers/Kader/ScheduleQueueController.php`) |
| Administration | User and health-center management controllers (`app/Http/Controllers/Admin`) |
| Tests | A dedicated feature test file covering role access and CRUD (`tests/Feature/SipanduAppTest.php`) |

## Stack

PHP, Laravel 12, Inertia.js, React 18, Vite, Tailwind CSS, Eloquent, PHPUnit

## Architecture

```text
Browser
  -> UI (React/Inertia or Blade/Livewire, depending on this project)
  -> Laravel routes / middleware
  -> Controllers or Livewire components
  -> Eloquent models and database
```

Refer to `routes/web.php` and `app/` for this project's implementation details.

## Local development

Requirements: a compatible PHP/Composer environment, Node.js/npm, and a database configured for Laravel.

```bash
git clone https://github.com/Maximust27/SIPANDU.git
cd SIPANDU
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Configure your `.env` database settings and run:

```bash
php artisan migrate
php artisan serve
```

In another terminal run `npm run dev`. Run tests with `php artisan test` and check production asset compilation using `npm run build`.

**Verification:** These commands are a standard starting point, not evidence that this repository was installed or tested during this documentation change. Project-specific seed data or configuration may be needed. Do not commit secrets or real personal data.

## Source code walkthrough

- [`routes/web.php`](./routes/web.php)
- [`app/Http/Controllers/User/ChildController.php`](./app/Http/Controllers/User/ChildController.php)
- [`app/Http/Controllers/Kader/ScheduleQueueController.php`](./app/Http/Controllers/Kader/ScheduleQueueController.php)
- [`tests/Feature/SipanduAppTest.php`](./tests/Feature/SipanduAppTest.php)

Read [PORTFOLIO_CASE_STUDY.md](./docs/PORTFOLIO_CASE_STUDY.md) for engineering decisions, current limitations, and proposed verification tasks.

## Engineering next steps

- Healthcare-oriented data deserves special care: use fictitious demo records, test authorization across all roles, avoid putting personal patient information in screenshots, and validate input and role ownership rules.
- Run `php artisan test` for the existing feature tests, then expand to negative cases for user/child ownership and queue edge cases.
- Capture screenshots using fictional sample data and record a short walkthrough.
- Add a verified demo and reproducible setup instructions when available.

## Recruiter note

The documentation describes code that is visible in this repository. It does **not** claim real deployments, production users, validated performance gains, or a completed security assessment. Any team contribution should be described accurately before including it on a CV.

**Maintained by:** [@Maximust27](https://github.com/Maximust27) · [Portfolio](https://maximust27.github.io/)
