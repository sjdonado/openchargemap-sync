# openchargemap-sync

## Test Coverage

- scraper-service

```bash
----------------------------|---------|----------|---------|---------|-------------------
File                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------------|---------|----------|---------|---------|-------------------
All files                   |   98.56 |    85.71 |   94.44 |   98.56 |
 __tests__/fixtures         |     100 |      100 |     100 |     100 |
  poiList.ts                |     100 |      100 |     100 |     100 |
  referenceData.ts          |     100 |      100 |     100 |     100 |
 __tests__/helpers          |   97.72 |     87.5 |     100 |   97.72 |
  http.ts                   |    97.5 |    83.33 |     100 |    97.5 | 36
  time.ts                   |     100 |      100 |     100 |     100 |
 __tests__/mocks            |     100 |      100 |     100 |     100 |
  http.ts                   |     100 |      100 |     100 |     100 |
  repository.ts             |     100 |      100 |     100 |     100 |
 src                        |   93.33 |    81.81 |     100 |   93.33 |
  router.ts                 |     100 |      100 |     100 |     100 |
  server.ts                 |   90.76 |       80 |     100 |   90.76 | 36-40,49
 src/config                 |     100 |        0 |     100 |     100 |
  env.ts                    |     100 |        0 |     100 |     100 | 18-19
 src/consumers              |     100 |       80 |     100 |     100 |
  openChargeMapConsumer.ts  |     100 |       80 |     100 |     100 | 26-31
 src/controllers            |     100 |      100 |     100 |     100 |
  health.ts                 |     100 |      100 |     100 |     100 |
  run.ts                    |     100 |      100 |     100 |     100 |
 src/publishers             |     100 |      100 |     100 |     100 |
  openChargeMapPublisher.ts |     100 |      100 |     100 |     100 |
 src/repository             |   97.82 |      100 |   83.33 |   97.82 |
  database.ts               |     100 |      100 |     100 |     100 |
  messageQueue.ts           |   97.01 |      100 |      75 |   97.01 | 62-63
 src/services               |     100 |      100 |     100 |     100 |
  openChargeMap.ts          |     100 |      100 |     100 |     100 |
----------------------------|---------|----------|---------|---------|-------------------

Test Suites: 5 passed, 5 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        6.28 s
Ran all test suites.
✨  Done in 6.89s.
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

## How to run

1. Create `.env` file following `.env.example`

2. Run docker-compose
```bash
./start.sh
```

3. Run services
```bash
yarn --cwd scraper dev
```
