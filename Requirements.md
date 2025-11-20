# MeterLab Requirements

## Table of Contents

- [1. Introduction](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Scope](#12-scope)
- [2. System Overview](#2-system-overview)
- [3. Functional Requirements](#3-functional-requirements)
  - [3.1 Authentication & Authorization](#31-authentication--authorization)
  - [3.2 Backend API](#32-backend-api)
  - [3.3 Test Case Management](#33-test-case-management)
  - [3.4 Test Environment Management](#34-test-environment-management)
  - [3.5 Test Run Execution](#35-test-run-execution)
  - [3.6 Reporting & Traceability](#36-reporting--traceability)
- [4. Non-Functional Requirements](#4-non-functional-requirements)
  - [4.1 Production Environment](#41-production-environment)
  - [4.2 Staging Environment](#42-staging-environment)
  - [4.3 Database Replication](#43-database-replication)
  - [4.4 Deployment Pipeline](#44-deployment-pipeline)
  - [4.5 Continuous Delivery Principles](#45-continuous-delivery-principles)
  - [4.6 Testing Requirements](#46-testing-requirements)
  - [4.7 Security Requirements](#47-security-requirements)
  - [4.8 Performance & Scalability](#48-performance--scalability)
  - [4.9 Availability](#49-availability)
  - [4.10 Usability](#410-usability)
- [5. System Architecture Requirements](#5-system-architecture-requirements)
  - [5.1 Services Included in the Monorepo](#51-services-included-in-the-monorepo)

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for MeterLab, a cloud-native test management platform used to manage, configure, and evaluate hardware tests within the MeterTest ecosystem.
It includes updated decisions regarding deployment methods, authentication, backend architecture, and development workflow.

### 1.2 Scope

The system includes:

- Auth Service (Better Auth)
- Backend API
- Worker Service for test execution
- Frontend Application
- PostgreSQL for persistent data
- Redis for session storage
- RabbitMQ for asynchronous job handling
- Integrations with InfluxDB and MQTT
- Docker-based production environment
- Kubernetes staging environment

Devices are not manually registered; they enter the system from telemetry sources (InfluxDB or MQTT).
The backend maintains internal state about device availability.

## 2. System Overview

MeterLab is built as a monorepo containing multiple services:

- Auth service with Redis-backed sessions
- Backend API service
- Worker Service that executes tests
- Frontend service (using pico.css)
- Shared code modules

Communication between services uses:

- Synchronous REST (Frontend → Backend)
- Asynchronous messaging using RabbitMQ (Backend → Worker → Backend)

Device presence and status are derived from external data streams, not user input.

## 3. Functional Requirements

### 3.1 Authentication & Authorization

- The system must include a dedicated Auth Service.
- Authentication handled using Better Auth.
- Role-based authorization is undecided and may be added later.
- User sessions stored in Redis.
- All backend endpoints require valid authentication tokens.

### 3.2 Backend API

- The backend API must be built using Hono.
- The backend API must be built using TypeScript.
- The backend API must be built using the OpenAPI spec.
- The backend API must be built using the OpenAPI spec.

### 3.3 Test Case Management

The system must allow CRUD operations for test cases:

- Create, read, update, delete test cases
- Each test case includes:
  - Name
  - Description
  - Success criteria (metric, condition, threshold)
- Validation must ensure all required fields are present.

### 3.4 Test Environment Management

The system must support CRUD operations for test environments:

- Name
- Description
- Used to specify physical or network test conditions
- Must be selectable during test run creation

### 3.5 Test Run Execution

#### Updated workflow with Worker Service

1. User configures a new test run in the frontend.
2. Backend validates the request.
3. Backend marks selected devices as In Test.
4. Backend stores a new TestRun in the database.
5. Backend sends the test job to RabbitMQ, containing:

- Device IDs
- Test case details
- Test environment
- Test parameters

6. Worker Service consumes the task from RabbitMQ.
7. Worker Service executes the test:

- Monitors device data from InfluxDB/MQTT
- (Optionally) performs OBIS parsing
- Evaluates success criteria

8. Worker sends test results back to the backend

- Through a callback API

9. Backend updates:

- TestRun status (Completed, Failed, Aborted)
- Result summary

10. Backend marks devices as Available again.

### 3.6 Reporting & Traceability

The system must provide:

- Test run history
- Filtering by device, environment, firmware, or date
- Result summary (Pass / Fail / Inconclusive)
- Link to relevant Grafana dashboards for deeper analysis

## 4. Non-Functional Requirements

### 4.1 Production Environment

- Production uses Docker, not Kubernetes.
- This is allowed by the organization.

### 4.2 Staging Environment

- Staging must use Kubernetes (assignment requirement).
- Staging environment must match production logically, despite different orchestration.
- At least one microservice must scale to multiple replicas.

### 4.3 Database Replication

The team may choose one of the required patterns:

- Shared DB with read replicas
- CQRS with separate read/write DBs
- Database-per-service

Decision will depend on performance needs.

### 4.4 Deployment Pipeline

Pipeline must include:

- Dependency installation
- Unit tests
- Integration tests
- Docker builds
- Deployment to staging (K8s)
- Deployment to production (Docker)

Branching Strategy

- Developers work on feature branches
- When ready → merge to staging branch
- Staging is automatically deployed to Kubernetes
- After validation → merge staging → main
- Main triggers production deployment

### 4.5 Continuous Delivery Principles

- Integrate code frequently
- PR reviews before merging
- Monorepo architecture
- Jira used for:
  - Tickets
  - Sprints
  - Backlog
  - Roadmap

Team collaboration

- No daily standups
- Team works colocated in the same room

### 4.6 Testing Requirements

- Every microservice must have at least one intentionally breakable unit test.
- Worker Service must be tested for:
  - Job consumption
  - Test execution behavior
  - Producing result output

- Must include at least one automated integration test simulating:

  - Multiple test run requests
  - Autoscaling behavior in staging

### 4.7 Security Requirements

- Redis session storage must be secured.
- Authentication required for all API endpoints.
- HTTPS recommended, but may be removed depending on company infrastructure:
  - Internal servers currently use HTTP only
  - The team will confirm if HTTPS is possible
- The system is internal to the company, not public.

### 4.8 Performance & Scalability

- Worker Service must support horizontal scaling in staging.
- RabbitMQ must handle multiple concurrent messages.
- Backend must efficiently track device state.
- API requests should respond within 200–300ms when possible.

### 4.9 Availability

- Aim for high availability in production.
- Services should allow rolling updates (in staging Kubernetes environment).

### 4.10 Usability

- Frontend must use pico.css for styling.
- UI must be intuitive for test engineers.
- Device and test run status should update in real-time or near real-time.

## 5. System Architecture Requirements

### 5.1 Services Included in the Monorepo

1. Auth Service

- Built with Better Auth
- Session storage backed by Redis

2. Backend Service

- API for frontend
- Stores device, test case, and test run data
- Maintains device state (Available / In Test / Offline)
- Sends test jobs to RabbitMQ
- Receives results from Worker
- Updates database accordingly

3. Worker Service (Test Runner)

- Consumes jobs from RabbitMQ
- Runs tests
- Reads telemetry from InfluxDB/MQTT
- Applies success criteria
- Sends results back to backend

4. Frontend Application

- Built with chosen framework
- Uses pico.css for styling
- Communicates via REST
- Displays devices, test cases, environments, and test runs

5. Databases & External Services

- PostgreSQL database
- Redis session storage
- RabbitMQ for job queueing
- InfluxDB for telemetry
- MQTT for device connectivity data
