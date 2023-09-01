# APP-API

APIs used for the app.

In order to run the API a `.env.local` file must be placed in the root of `apps/app-api` directory with the following pattern:

```
PORT=8001
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
GOOGLE_CLOUD_PROJECT=bmatch-dev
MINER_API_URL=http://localhost:8011
SCRAPPER_API_URL=http://localhost:8010
FIREBASE_API_KEY= ` ... `
```

Tu run the API execute `npm run dev -w app-api` from the root directory.