interface JwtConfig {
    secret: string;
    expiresIn: string;
}

// src/config/configuration.ts
interface DatabaseConfig {
    uri: string;
    options: {
        authSource: string;
        directConnection: boolean;
        serverSelectionTimeoutMS: number;
    };
}

interface AppConfig {
    port: number;
    database: DatabaseConfig;
    jwt: JwtConfig;
}

export default (): AppConfig => ({
    port: Number(process.env.PORT) || 3000,
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-service',
        options: {
            authSource: 'auth-service',
            directConnection: true,
            serverSelectionTimeoutMS: 5000,
        },
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'Secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
});