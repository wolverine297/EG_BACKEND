// src/config/security.config.ts
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

export const configureSecurityMiddleware = (app: any, configService: ConfigService) => {
    // Helmet helps secure your Express apps by setting various HTTP headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],  // Only allow content from our own domain
                scriptSrc: ["'self'"],   // Only allow scripts from our own domain
                styleSrc: ["'self'"],    // Only allow styles from our own domain
                imgSrc: ["'self'"],      // Only allow images from our own domain
                connectSrc: ["'self'"],  // Only allow API calls to our own domain
            },
        },
        xssFilter: true,                // Enable XSS filtering
        noSniff: true,                  // Prevent MIME type sniffing
        hidePoweredBy: true,           // Hide the X-Powered-By header
    }));

    // Rate limiting to prevent brute force attacks
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,      // 15 minutes
        max: 100,                       // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later',
        standardHeaders: true,          // Return rate limit info in the RateLimit-* headers
        legacyHeaders: false,           // Disable the X-RateLimit-* headers
    }));

    // Compression to reduce response size
    // app.use(compression());
};