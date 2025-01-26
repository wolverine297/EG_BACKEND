// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
    imports: [
        // Global configuration module
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),

        // MongoDB connection configuration
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const uri = configService.get<string>('database.uri');
                const options = configService.get<Record<string, any>>('database.options');
                
                console.log('MongoDB Connection URI:', uri); // For debugging
                console.log('MongoDB Options:', options); // For debugging
                
                return {
                    uri,
                    ...options,
                    connectionFactory: (connection) => {
                        connection.on('connected', () => {
                            console.log('MongoDB is connected');
                        });
                        connection.on('error', (error) => {
                            console.error('MongoDB connection error:', error);
                        });
                        return connection;
                    },
                };
            },
            inject: [ConfigService],
        }),

        // Rate limiting configuration
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService): Promise<ThrottlerModuleOptions> => ({
                throttlers: [
                    {
                        ttl: config.get('THROTTLE_TTL', 60),
                        limit: config.get('THROTTLE_LIMIT', 10),
                    },
                ],
            }),
        }),

        // Feature modules
        AuthModule,
        SharedModule,
    ],
})
export class AppModule {}