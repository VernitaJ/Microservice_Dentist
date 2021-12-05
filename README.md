# Dentist Manager

A micro service to store and manage dentist data using NodeJS, MongoDB and Mqtt.

## Getting Started

- Create .env file by following the template on .env.sample
- `docker-compose up`

### To Run Stand-alone

- `npm install`
- `npm start` or `npm dev`
- There might be need to minor modifications to run service without docker. Check `server.js`.

## Request from Frontend Template

#### MQTT Request Topic -> _"frontend/dentist/req"_

#### MQTT Response Topic -> _"frontend/dentist/{uniqueId}/res"_

#### Get one

```JSON
{
"requestId":"uniqueId",
"requestType": "getOne",
"requestParams": {
	"id": "dentistId"
	}
}
```

#### Get all

```JSON
{
"requestId":"uniqueId",
"requestType": "getAll",
}
```
