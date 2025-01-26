# Secure NestJS Authentication System

## Project Overview
This project implements a robust, production-ready authentication system using NestJS, MongoDB, and JWT. The system is built with security as a primary concern, incorporating industry best practices for user authentication, rate limiting, and data protection.

## Security Features

### Request Protection
The system implements multiple layers of security through middleware and guards:

```typescript
export const configureSecurityMiddleware = (app: any, configService: ConfigService) => {
    // Helmet configuration for HTTP security headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'"],
                imgSrc: ["'self'"],
                connectSrc: ["'self'"],
            },
        },
        xssFilter: true,
        noSniff: true,
        hidePoweredBy: true,
    }));
}
```

### Rate Limiting
Protection against brute force attacks and DOS attempts:

```typescript
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                  // 100 requests per window
    message: 'Too many requests from this IP, please try again later'
}));
```

### Password Security
Strong password requirements enforced through validation:

```typescript
@IsString()
@MinLength(8)
@Matches(/[A-Za-z]/, { message: 'Password must contain at least 1 letter' })
@Matches(/[0-9]/, { message: 'Password must contain at least 1 number' })
@Matches(/[!@#$%^&*]/, { message: 'Password must contain at least 1 special character' })
password: string;
```

## Architecture

### Configuration Management
The system uses a structured configuration system for different environments:

```typescript
interface AppConfig {
    port: number;
    database: DatabaseConfig;
    jwt: JwtConfig;
}
```

### Database Schema
MongoDB schema with Mongoose, including security features:

```typescript
@Schema({
    timestamps: true,
    toJSON: {
        transform: (_, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    }
})
export class User extends Document {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    password: string;
}
```

## Core Features

### Authentication Service
Handles user registration and authentication:

- Secure password hashing with bcrypt
- JWT token generation and validation
- User data management
- Error handling and logging

### JWT Strategy
Implements Passport JWT strategy for route protection:

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('jwt.secret'),
        });
    }
}
```

### Comprehensive Logging
Winston-based logging system for monitoring and debugging:

```typescript
private logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
        new transports.Console()
    ]
});
```

## Setup and Installation

1. Clone the repository
```bash
git clone [repository-url]
cd nestjs-auth-system
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Required environment variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth-service
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
```

4. Start MongoDB
```bash
mongod
```

5. Run the application
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/signin` - Authenticate user and receive JWT
- `GET /auth/users/:id` - Get user profile (protected)

## Error Handling
The system implements comprehensive error handling:

- Validation errors with detailed messages
- Authentication failures with secure responses
- Rate limit exceeded notifications
- Database operation errors
- JWT validation failures

## Security Best Practices

### Implementation Details
- Secure password hashing with bcrypt
- JWT-based authentication
- Rate limiting on auth endpoints
- CORS configuration
- HTTP security headers
- Request validation
- Sensitive data filtering

### Data Protection
- Password hashing before storage
- Removal of sensitive fields from responses
- Secure cookie handling
- Input sanitization
- XSS protection

## Development Best Practices

### Code Organization
- Modular architecture with clear separation of concerns
- TypeScript for type safety
- Dependency injection for loose coupling
- Interface-based design
- Comprehensive documentation

### Testing
```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Monitoring and Logging
The system includes comprehensive logging:

- Authentication attempts
- Failed login tracking
- Error logging with stack traces
- Request rate monitoring
- System events tracking

## Production Considerations
- Environment-based configuration
- Secure headers configuration
- Rate limiting
- Error handling
- Logging setup
- CORS configuration
- Database connection management

## Contributing
Please read the contributing guidelines before submitting pull requests. Ensure all tests pass and security measures are maintained.

## License
This project is licensed under the MIT License.