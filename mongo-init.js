db.createUser({
  user: 'root_user',
  pwd: 'root_pass',
  roles: [
    {
      role: 'readWrite',
      db: 'EVChargingData',
    },
  ],
});
