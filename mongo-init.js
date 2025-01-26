// mongo-init.js
print('Start creating database and users...');

db = db.getSiblingDB('auth-service');

// Create application user
db.createUser({
    user: 'app_user',
    pwd: 'app_password',
    roles: [
        {
            role: 'readWrite',
            db: 'auth-service'
        }
    ]
});

print('Database and users created.');