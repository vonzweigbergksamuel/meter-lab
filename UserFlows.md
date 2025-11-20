# User Flows

## 1. User logs in

1. User opens the app
2. Frontend redirects to login
3. User logs in via Better Auth
4. Auth Service creates session (stored in Redis)
5. User is redirected to Dashboard

```mermaid
flowchart TD

%% USER LOGIN
A1[User Opens App] --> A2[Frontend Requests Login]
A2 --> A3[Auth Service]
A3 --> A4[Redis Stores Session]
A4 --> A5[User Logged In]
```

## 2. Devices become visible

1. Frontend requests
2. Backend reads device state from Redis
3. Backend updates device states using:
4. Frontend displays:

- Available devices
- In Test devices
- Offline devices

```mermaid
flowchart TD

%% DEVICE VISIBILITY
B1[Frontend Requests Devices]
B1 --> B2[Backend Service or MQTT/Influx]
B2 --> B3[Fetch Device State from Backend]
B3 --> B4[Update Device State]
B4 --> B5[Return Device List/Status]
B5 --> B6[Frontend Displays Devices]
```

## 3. User creates a Test Run

1. User selects:

- Device(s)
- Test Case
- Environment

2. User presses Start Test
3. Backend:

- Validates device availability
- Sets device state → `In Test`
- Stores TestRun in DB
- Sends job to RabbitMQ

```mermaid
flowchart TD

%% START TEST RUN
C1[User Selects Device + Test Case + Environment]
C1 --> C2[User Starts Test]
C2 --> C3[Backend Validates]
C3 --> C4[Backend Marks Devices In Test]
C4 --> C5[Create TestRun]
C5 --> C6[Send Job to RabbitMQ]
```

## 4. Worker Service executes the test

1. Worker receives job from RabbitMQ
2. Worker runs test:

- Polls telemetry from InfluxDB / MQTT

- Monitors metrics

- Evaluates success criteria

3. Worker completes test
4. Worker calls Backend API `/test-runs/:id/callback` with results

```mermaid
flowchart TD

%% WORKER SERVICE
D1[RabbitMQ Queue]
D1 --> D2[Worker Consumes Job]
D2 --> D3[Worker Executes Test]
D3 --> D4[Worker Evaluates Criteria]
D4 --> D5[Worker Sends Callback to Backend]
```

## 5. Backend finalizes test

1. Backend:

- Saves results to DB
- Marks device(s) as Available
- Updates TestRun status (Completed, Failed, etc.)

```mermaid
flowchart TD

%% FINALIZE TEST
E1[Backend Updates TestRun Status]
E1 --> E2[Backend Saves Result Summary]
E2 --> E3[Backend Marks Devices Available]
```

## 6. User views report

1. User opens test run details
2. Backend returns all metadata
3. User can click View in Grafana
4. User analyzes deeper telemetry if needed

```mermaid
flowchart TD

%% REPORTING
F1[User Opens Test Run Details]
F1 --> F2[Backend Returns Test Data]
F2 --> F3[User Views Result]
F3 --> F4[Optional: Open Grafana Dashboard]
```