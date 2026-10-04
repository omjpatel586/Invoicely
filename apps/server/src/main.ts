import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app/app.module';

const logger = new Logger('Invoicely');

const GLOBAL_PREFIX = 'api/v1';
const REQUEST_BODY_LIMIT = '1mb';
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 1000;
const REQUIRED_PRODUCTION_ENV = [
  'MONGO_URI',
  'JWT_SECRET_KEY',
  'REACT_APP_URL',
];

const getValidationMessages = (
  errors: ValidationError[],
  parentPath = ''
): string[] =>
  errors.flatMap((error) => {
    const path = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    const messages = Object.values(error.constraints ?? {}).map((message) =>
      parentPath ? `${parentPath}.${message}` : message
    );
    return [...messages, ...getValidationMessages(error.children ?? [], path)];
  });

const getAllowedOrigins = (isProduction: boolean) =>
  (isProduction ? process.env.REACT_APP_URL : process.env.REACT_LOCAL_URL)
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  // Environment: fail fast when production secrets/config are missing
  if (isProduction) {
    const missingEnv = REQUIRED_PRODUCTION_ENV.filter(
      (key) => !process.env[key]
    );
    if (missingEnv.length) {
      throw new Error(
        `Missing required environment variables: ${missingEnv.join(', ')}`
      );
    }
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    logger: isProduction ? ['error', 'warn', 'log'] : undefined,
  });

  // Proxy: trust the first hop so client IPs and HTTPS are read correctly behind a load balancer
  if (isProduction) {
    app.set('trust proxy', 1);
  }

  // Security headers: helmet sets safe defaults and hides the X-Powered-By header
  app.use(helmet());

  // Rate limiting: cap requests per IP to slow down brute force and abuse
  app.use(
    rateLimit({
      windowMs: RATE_LIMIT_WINDOW_MS,
      limit: RATE_LIMIT_MAX_REQUESTS,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: {
        statusCode: 429,
        message: 'Too many requests, please try again later',
      },
    })
  );

  // Request body: parse JSON/form bodies with a size limit to block oversized payloads
  app.useBodyParser('json', { limit: REQUEST_BODY_LIMIT });
  app.useBodyParser('urlencoded', {
    limit: REQUEST_BODY_LIMIT,
    extended: true,
  });

  // Cookies: parse cookies, signed with COOKIE_SECRET when it is configured
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // CORS: only allow the configured web app origins to call the API with credentials
  app.enableCors({
    origin: getAllowedOrigins(isProduction),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  });

  // Routing: version every API route under a global prefix
  app.setGlobalPrefix(GLOBAL_PREFIX);

  // Validation: validate every DTO and reject fields without a validation decorator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) =>
        new BadRequestException(getValidationMessages(errors).join(', ')),
    })
  );

  // Lifecycle: close DB connections and finish in-flight work on shutdown signals
  app.enableShutdownHooks();

  const port = process.env.PORT || 5000;
  await app.listen(port);
  logger.log(`🚀 Application is running on port ${port} at /${GLOBAL_PREFIX}`);
}

// Startup: log the reason and exit so the process manager can restart the server
startServer().catch((error: Error) => {
  logger.error(`Failed to start server: ${error.message}`, error.stack);
  process.exit(1);
});
