# User Stories

This document outlines the user stories for MeterLab, a cloud-native test management platform. Each story follows the format: "As a [role], I want [goal], So that [benefit]." These stories guide the development of features and functionality across authentication, device management, test execution, reporting, and infrastructure.

## Table of Contents

- [1. Authentication & Authorization](#1-authentication--authorization)
- [2. Device Management](#2-device-management)
- [3. Test Cases](#3-test-cases)
- [4. Test Environments](#4-test-environments)
- [5. Test Runs](#5-test-runs)
- [6. Reporting & Visualization](#6-reporting--visualization)
- [7. System & Infrastructure](#7-system--infrastructure)
- [8. CI/CD Pipeline](#8-cicd-pipeline)
- [9. Testing Requirements](#9-testing-requirements)
- [10. Frontend & UI](#10-frontend--ui)

## 1. Authentication & Authorization

### US-001 – User Login

As a test engineer <br>
I want to log in using secure authentication <br>
So that I can access the MeterLab platform safely.

### US-002 – Session Handling

As a user <br>
I want my login session to persist securely <br>
So that I don’t have to log in repeatedly.

### US-003 – Unauthorized Access Prevention

As a system <br>
I want to reject unauthorized requests <br>
So that no unverified users can access devices or test data. <br>

## 2. Device Management

### US-010 – Automatic Device Discovery

As a system <br>
I want to automatically detect devices based on telemetry <br>
So that users do not need to register devices manually.

> Notes: <br>
> It is undecided whether the logic lives fully in the backend or whether the frontend also plays a role in detection. <br>
> Telemetry sources will likely include InfluxDB and/or MQTT, but exact mechanism is TBD.

### US-011 – Device Status Tracking

As a test engineer <br>
I want to see each device’s status (Available, In Test, Offline) <br>
So that I can choose suitable devices for testing.

### US-012 – Device Offline Handling

As a system <br>
I want to detect when a device may be offline <br>
So that users understand when a device is not responding. <br>

> Notes: <br>
> The exact rule for marking devices offline is not yet determined.
> Could be:
> - Time since last telemetry
> - MQTT last-will signals
> - Manual override
> - Other logic

### US-013 – Prevent Parallel Usage

As a test engineer <br>
I want to be prevented from starting a test on a device already in use <br>
So that I avoid test conflicts. 

## 3. Test Cases

### US-020 – Create Test Case

As a test engineer <br>
I want to create a new test case <br>
So that I can define custom success criteria.

### US-021 – Edit Test Case

As a test engineer <br>
I want to modify an existing test case <br>
So that I can update parameters when requirements change.

### US-022 – Delete Test Case

As a test engineer <br>
I want to delete unused test cases <br>
So that the system stays clean.

### US-023 – View Test Case List

As a test engineer <br>
I want to view all available test cases <br>
So that I can select one when starting a test.

## 4. Test Environments

### US-030 – Create Test Environment

As a test engineer <br>
I want to create a test environment <br>
So that I can define relevant test conditions.

### US-031 – View Environment Library

As a user <br>
I want to see all defined test environments <br>
So that I can choose the correct one for a test.

## 5. Test Runs
### US-040 – Start Test Run

As a test engineer <br>
I want to start a new test run with selected devices, test case, and environment <br>
So that I can execute a controlled test.

### US-041 – Test Run State Tracking

As a backend system <br>
I want to mark devices as In Test when a test begins <br>
So that the system prevents overlapping usage.

### US-042 – Queue Test Job

As a backend service <br>
I want to send test configuration data to RabbitMQ <br>
So that the Worker Service can run the test asynchronously. 

### US-043 – Backend Receives Result Callback

As a backend service <br>
I want to receive an API callback from the Worker Service when a test has finished <br>
So that I can update the test run status and release the devices.

### US-044 – Complete/Fail Test Run

As a backend service <br>
I want to update the test run with its final result <br>
So that users know whether the test passed or failed.

### US-045 – Release Devices After Test

As a backend system <br>
I want to mark devices as Available again after a test completes <br>
So that they can be used in future test runs.

### US-046 – View Test Run History

As a test engineer <br>
I want to view a list of previous test runs <br>
So that I can analyze past performance.

## 6. Reporting & Visualization

### US-060 – View Detailed Test Run Information

As a user <br>
I want to see the details of a completed test run <br>
So that I can understand the test outcome and summary.

### US-061 – Link to Grafana Dashboards

As a user <br>
I want to open Grafana dashboards from the test run page <br>
So that I can analyze deeper telemetry data.

## 7. System & Infrastructure
### US-070 – Staging Deployment to Kubernetes

As a team <br>
I want to deploy updates automatically to a Kubernetes staging environment <br>
So that we can test new features in a realistic environment.

### US-071 – Docker-Based Production Deployment

As a team <br>
I want to deploy the application to production using Docker <br>
So that it integrates with the company’s infrastructure. <br>

## 8. CI/CD Pipeline

### US-080 – Merge Feature Branch into Staging

As a developer <br>
I want to merge my feature branch into the staging branch <br>
So that the feature can be tested in Kubernetes.

### US-081 – Promote Staging to Main for Production Deployment

As a developer <br>
I want to merge staging into main after verification <br>
So that the feature is automatically deployed to production.

### US-082 – Pipeline Fails on Tests

As a team <br>
I want the CI pipeline to fail if tests fail <br>
So that broken code cannot reach staging or production.

## 9. Testing Requirements

### US-090 – Unit Test for Each Microservice

As a team <br>
I want each service to have at least one meaningful unit test <br>
So that we meet project requirements.

### US-091 – Integration Test Load Simulation

As a QA engineer <br>
I want an integration test that simulates many test requests <br>
So that we can verify system behavior under load.

## 10. Frontend & UI

### US-100 – Modern UI with pico.css

As a user <br>
I want the interface styled with pico.css <br>
So that the UI is consistent and clean.

### US-101 – Real-Time Device and Test Status

As a test engineer <br>
I want live updates on device and test statuses <br>
So that I always see accurate system information.
