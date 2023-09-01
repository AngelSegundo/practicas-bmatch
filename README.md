# Bmatch Core Monorepo.

## Sub Projects
### Applications
The applications are available under the `/apps` directory.

- `/apps/api` - **API** : Express+ TS Backend service that is used by the backoffice and the Mobile App.
- `/apps/backoffice` - **Backoffice** : Next.js app for the administration and configuration of the Bmatch services.


### Packages
The packages are available under the `/packages` directory.

- `/packages/eslin-config-custom`: ESLint configuration defaults introduced by `turborepo`. This is imported in different packages in order to maintain consistancy.
- `/packages/tsconfig`: TSconfig configuration defaults introduced by `turborepo`. This is imported in different packages in order to maintain consistancy.
- `/packages/domain` **DOMAIN**: Basic TS project that enclosures all the business logic throug out the entire project.
- `/packages/ui` **UI Ki**: Core React components to use through the web projects.

## Instructions

### API
In order to run the API a `.env.local` file must be placed in the root of `apps/api` directory with the following pattern:

```
PORT=8000
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

> Ask for the credentials file to the admin!

Tu run the API execute `npm run dev -w api` from the root directory
