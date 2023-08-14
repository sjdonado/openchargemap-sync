#!/bin/bash

docker-compose build
docker-compose up -d

echo "Waiting for MongoDB to start..."
sleep 30

docker-compose exec -it mongo1 sh -c """
mongo --port 27017 <<EOF
use scraperDatabase

db.createUser({
  user: 'root_user',
  pwd: 'root_pass',
  roles: [
    { role: 'readWrite', db: 'scraperDatabase' }
  ]
});
EOF
"""

echo "MongoDB configuration completed."

docker-compose logs --follow subgraph_service scraper_service
docker-compose down
