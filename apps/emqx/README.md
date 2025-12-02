# EMQX Publisher

Mock MQTT publisher that simulates device data for testing purposes. It will use Authentication as default with username/password.

> Note <br>
> You need to login to the dashboard and create a user. <br>
> No support to auto create user with docker. <br>
> However in pipelines we can add a job that fetch to the dashboard and create a user.

Connection string: `mqtt://emqx:1883` or `mqtts://emqx:8883`

> Note <br>
> If you dont run it using docker change `emqx` to `localhost`. <br>
> ``mqtts`` and port ``8883`` is for TLS

## What it does

- Connects to an EMQX broker
- Generates simulated meter readings from multiple virtual devices
- Publishes data every 10 seconds

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BROKER_URL` | MQTT broker connection URL | - |
| `TOPIC` | Topic to publish messages to | - |
| `NUM_DEVICE` | Number of virtual devices to simulate | - |

## Example payload

- meter_id: The Device ID
- value: Some value
- unit: The unit of the value

```json
[
  {"meter_id":1764255278504,"value":53,"unit":"W"},
  {"meter_id":1764255278504,"value":74,"unit":"W"},
  {"meter_id":1764255278504,"value":77,"unit":"W"},
  {"meter_id":1764255278504,"value":46,"unit":"W"}
]
```

## Scripts

```bash
pnpm dev      # Run with hot reload
pnpm build    # Compile TypeScript
pnpm start    # Run compiled output
```

## Docker

From the root of the repo:

```bash
docker compose -f docker-mock-compose.yaml up - --build
```

## EMQX Dashboard

[http://localhost:18083](http://localhost:18083)

| Username | Password |
|----------|----------|
| `admin`  | `admin123` |

## Test

To test this run the docker compose and then the test app:

```bash
cd  /apps/emqx
node ./src/test.js
```

## Create a user with rest api (NOT TESTED):

```bash
curl -u admin:admin123 \
  -X POST http://emqx:18083/api/v5/authentication/built_in_database/users \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "meter-app",
    "password": "supersecret"
  }'

```
