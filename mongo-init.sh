#!/bin/bash

echo "[mongo-init]Waiting for MongoDB to start..."
until mongo --port 27017 --eval "quit(db.runCommand({ ping: 1 }).ok ? 0 : 1)"
do
  sleep 1
done

echo "[mongo-init]MongoDB started. Checking replica set status..."

# mongo --port 27017 <<EOF
# rs.initiate({
#   _id: 'rs0',
#   members: [
#     { _id: 0, host: 'mongo1:27017' },
#     { _id: 1, host: 'mongo2:27018' },
#   ],
# });
# EOF
#
# until mongo --port 27017 --eval "quit(rs.status().ok ? 0 : 1)"
# do
#   sleep 1
# done

# Check if this node is the primary
IS_PRIMARY=$(mongo --port 27017 --quiet --eval "rs.isMaster().ismaster")

if [ "$IS_PRIMARY" = "true" ]; then
  echo "[mongo-init] This node is the primary. Initializing the database..."

  # Execute user creation on the primary node
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

  echo "[mongo-init]: Database initialization completed."
else
  echo "[mongo-init]: This node is not the primary. Skipping user initialization."
fi

exec "$@"
