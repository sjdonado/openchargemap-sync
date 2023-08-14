#!/bin/bash

docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d

MONGO_CLUSTER="
127.0.0.1 mongo1
127.0.0.1 mongo2
"

echo "Updating /etc/hosts..."

# Check if the entries already exist in /etc/hosts
if grep -Fq "$MONGO_CLUSTER" /etc/hosts; then
  echo "MongoDB cluster entries already exist in /etc/hosts."
else
  echo "$MONGO_CLUSTER" | sudo tee -a /etc/hosts
  echo "MongoDB cluster entries appended to /etc/hosts."
fi

echo "Waiting for MongoDB to start..."
sleep 30

docker-compose -f docker-compose.dev.yml exec -it mongo1 sh -c """
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

docker-compose -f docker-compose.dev.yml logs --follow
docker-compose -f docker-compose.dev.yml down
