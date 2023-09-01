# OPERATIONS-API

API used for data ranking.

In order to run the API a `.env.local` file must be placed in the root of `apps/operations-api` directory with the following pattern:

```
PORT=8003
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
GOOGLE_CLOUD_PROJECT=bmatch-dev
MINER_API_URL=http://localhost:80.......
SCRAPPER_API_URL=" ... "
FIREBASE_API_KEY=" ... "
AUTHORIZATION_TOKEN= " ... "
```

Tu run the API execute `npm run dev -w operations-api` from the root directory.
