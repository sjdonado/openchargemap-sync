# openchargemap-sync

## Setup and run

1. Create `.env` (copy and paste from `./.env.example`)
2. Run docker-compose + scripts (sudo required)
```bash
./setup.sh
```
3. Pull data
```bash
curl -X GET http://localhost:3000/run
```
4. Output example
```bash
MongoDB configuration completed.
scraper_service   | yarn run v1.22.19
scraper_service   | $ node ./dist/bin/index.js
scraper_service   | [database]: Connected to mongodb://root_user:root_pass@mongo1:27017,mongo2:27018/scraperDatabase?replicaSet=rs0
scraper_service   | [messageQueue]: Consumer connected to scraper-main-queue
scraper_service   | [server] listening on PORT 3000
subgraph_service  | yarn run v1.22.19
subgraph_service  | $ node ./dist/bin/index.js
subgraph_service  | [database]: Connected to mongodb://root_user:root_pass@mongo1:27017,mongo2:27018/scraperDatabase?replicaSet=rs0
subgraph_service  | Enabling inline tracing for this subgraph. To disable, use ApolloServerPluginInlineTraceDisabled.
subgraph_service  | [server] Server is running, GraphQL Playground available at http://localhost:4000/
scraper_service   | [openChargeMapPublisher]: ca9bb35a-9f71-400b-b9e0-a2ed0c70ed13 CO - 2
scraper_service   | [openChargeMapPublisher]: ca9bb35a-9f71-400b-b9e0-a2ed0c70ed13 DE - 2
scraper_service   | [openChargeMapConsumer]: 21 POIs stored in database
scraper_service   | [openChargeMapConsumer]: CO - poiListIds 21
scraper_service   | [openChargeMapConsumer]: 5000 POIs stored in database
scraper_service   | [openChargeMapConsumer]: DE - poiListIds 5021
subgraph_service  | [poisResolver] snapshot: ca9bb35a-9f71-400b-b9e0-a2ed0c70ed13 poiListIds: 5021 edges: 100
subgraph_service  | [poisResolver] snapshot: ca9bb35a-9f71-400b-b9e0-a2ed0c70ed13 poiListIds: 5021 edges: 10
```

## Tests

To run tests
```bash
yarn --cwd scraper test
yarn --cwd graphql-subgraph test
```

### Results

- scraper-service

```bash
----------------------------|---------|----------|---------|---------|-------------------
File                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------------|---------|----------|---------|---------|-------------------
All files                   |   98.58 |       90 |   94.73 |   98.58 |
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
 src/consumers              |     100 |    92.85 |     100 |     100 |
  openChargeMapConsumer.ts  |     100 |    92.85 |     100 |     100 | 25
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
Time:        9.426 s
Ran all test suites.
✨  Done in 10.05s.
```

- graphql-subgraph
```bash
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   98.82 |    89.65 |    90.9 |   98.82 |
 __tests__/fixtures |     100 |      100 |     100 |     100 |
  pois.ts           |     100 |      100 |     100 |     100 |
  queries.ts        |     100 |      100 |     100 |     100 |
 __tests__/mocks    |     100 |      100 |     100 |     100 |
  repository.ts     |     100 |      100 |     100 |     100 |
 src                |    87.5 |      100 |     100 |    87.5 |
  server.ts         |    87.5 |      100 |     100 |    87.5 | 44-50
 src/config         |     100 |        0 |     100 |     100 |
  constants.ts      |     100 |      100 |     100 |     100 |
  env.ts            |     100 |        0 |     100 |     100 | 6
 src/helpers        |     100 |     87.5 |     100 |     100 |
  pagination.ts     |     100 |     87.5 |     100 |     100 | 21
 src/repository     |     100 |      100 |      50 |     100 |
  database.ts       |     100 |      100 |      50 |     100 |
 src/resolvers      |     100 |      100 |     100 |     100 |
  index.ts          |     100 |      100 |     100 |     100 |
  pois.ts           |     100 |      100 |     100 |     100 |
 src/serializers    |     100 |      100 |     100 |     100 |
  poi.ts            |     100 |      100 |     100 |     100 |
--------------------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        3.516 s, estimated 4 s
Ran all test suites.
✨  Done in 3.92s.
```

## Linter reports

- scraper-service

```bash
$ eslint . --ext .ts

/Users/sjdonado/projects/openchargemap-sync/scraper/__tests__/consumers/openChargeMapConsumer.spec.ts
  294:5  warning  Unexpected 'todo' comment: 'TODO: configure retry/recovery logic'  no-warning-comments

/Users/sjdonado/projects/openchargemap-sync/scraper/src/consumers/openChargeMapConsumer.ts
  74:7  warning  Unexpected 'todo' comment: 'TODO: database cleanup: remove old...'  no-warning-comments

✖ 2 problems (0 errors, 2 warnings)

✨  Done in 1.77s.
```

- graphql-subgraph
```bash
$ eslint . --ext .ts

/Users/sjdonado/projects/openchargemap-sync/graphql-subgraph/__tests__/resolvers/pois.spec.ts
  182:26  warning  Too many nested callbacks (5). Maximum allowed is 4  max-nested-callbacks
  183:22  warning  Too many nested callbacks (5). Maximum allowed is 4  max-nested-callbacks

✖ 2 problems (0 errors, 2 warnings)

✨  Done in 1.69s.
```
