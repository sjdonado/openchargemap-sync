# openchargemap-sync

**Run in dev**

1. Create `.env` file following `.env.example`
2. Run docker-compose + scripts
```bash
./setup.sh
```
3. Run services
```bash
yarn --cwd scraper dev
yarn --cwd graphql-subgraph dev
```

## Test Coverage

- scraper-service

```bash
----------------------------|---------|----------|---------|---------|-------------------
File                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------------|---------|----------|---------|---------|-------------------
All files                   |   98.57 |    90.38 |   94.73 |   98.57 |
 __tests__/fixtures         |     100 |      100 |     100 |     100 |
  poiList.ts                |     100 |      100 |     100 |     100 |
  referenceData.ts          |     100 |      100 |     100 |     100 |
 __tests__/helpers          |     100 |      100 |     100 |     100 |
  time.ts                   |     100 |      100 |     100 |     100 |
 __tests__/mocks            |     100 |      100 |     100 |     100 |
  http.ts                   |     100 |      100 |     100 |     100 |
  repository.ts             |     100 |      100 |     100 |     100 |
 src                        |   91.54 |       80 |     100 |   91.54 |
  server.ts                 |   91.54 |       80 |     100 |   91.54 | 42-46,55
 src/@types                 |     100 |      100 |     100 |     100 |
  router.ts                 |     100 |      100 |     100 |     100 |
 src/config                 |     100 |        0 |     100 |     100 |
  constant.ts               |     100 |      100 |     100 |     100 |
  env.ts                    |     100 |        0 |     100 |     100 | 6-7
 src/consumers              |     100 |    93.75 |     100 |     100 |
  openChargeMapConsumer.ts  |     100 |    93.75 |     100 |     100 | 25
 src/controllers            |     100 |      100 |     100 |     100 |
  health.ts                 |     100 |      100 |     100 |     100 |
  run.ts                    |     100 |      100 |     100 |     100 |
 src/publishers             |     100 |      100 |     100 |     100 |
  openChargeMapPublisher.ts |     100 |      100 |     100 |     100 |
 src/repository             |   97.95 |      100 |    87.5 |   97.95 |
  database.ts               |     100 |      100 |     100 |     100 |
  messageQueue.ts           |   97.14 |      100 |      80 |   97.14 | 65-66
 src/services               |     100 |      100 |     100 |     100 |
  openChargeMap.ts          |     100 |      100 |     100 |     100 |
----------------------------|---------|----------|---------|---------|-------------------

Test Suites: 5 passed, 5 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        10.023 s
Ran all test suites.
✨  Done in 10.90s.
```

- graphql-subgraph
```bash
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   96.65 |     92.3 |   88.88 |   96.65 |
 __tests__/fixtures |     100 |      100 |     100 |     100 |
  pois.ts           |     100 |      100 |     100 |     100 |
 __tests__/mocks    |   88.46 |      100 |     100 |   88.46 |
  repository.ts     |   88.46 |      100 |     100 |   88.46 | 9-11
 src                |   88.46 |      100 |     100 |   88.46 |
  server.ts         |   88.46 |      100 |     100 |   88.46 | 41-46
 src/config         |     100 |        0 |     100 |     100 |
  constants.ts      |     100 |      100 |     100 |     100 |
  env.ts            |     100 |        0 |     100 |     100 | 6
 src/repository     |     100 |      100 |      50 |     100 |
  database.ts       |     100 |      100 |      50 |     100 |
 src/resolvers      |     100 |      100 |     100 |     100 |
  index.ts          |     100 |      100 |     100 |     100 |
  pois.ts           |     100 |      100 |     100 |     100 |
 src/serializers    |     100 |      100 |     100 |     100 |
  poi.ts            |     100 |      100 |     100 |     100 |
--------------------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        3.008 s
Ran all test suites.
✨  Done in 3.53s.
```

## Linter reports

- scraper-service

```bash
yarn run v1.22.19
$ eslint . --ext .ts

/Users/sjdonado/projects/openchargemap-sync/scraper/__tests__/consumers/openChargeMapConsumer.spec.ts
  86:5  warning  Unexpected 'todo' comment: 'TODO: configure retry/recovery logic'  no-warning-comments

✖ 1 problem (0 errors, 1 warning)

✨  Done in 1.81s.
```

- graphql-subgraph
```bash
yarn run v1.22.19
$ eslint . --ext .ts
✨  Done in 1.71s.
```
