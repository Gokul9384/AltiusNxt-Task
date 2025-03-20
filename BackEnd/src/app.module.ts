import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@Controller/Admin/User.controller';
import { UserRoleController } from '@Controller/Admin/UserRole.controller';
import { LoginController } from '@Controller/Auth/Login.controller';
import { ExceptionHelper } from '@Helper/Exception.helper';
import { UserService } from '@Service/Admin/User.service';
import { UserRoleService } from '@Service/Admin/UserRole.service';
import { AuthService } from '@Service/Auth/Auth.service';
import { JwtStrategy } from '@Service/Auth/JwtStrategy.service';
import { EmailService } from '@Service/Email.service';
import { EmailConfigService } from '@Service/Admin/EmailConfig.service';
import { CommonService } from '@Service/Common.service';
import Configuration from './Config/Configuration';
import { EncryptionService } from '@Service/Encryption.service';
import { CommonSeederService } from '@Database/Seeds/CommonSeeder.service';
import { MailerService } from '@Service/Mailer.service';
import { ErrorLogService } from '@Service/Admin/ErrorLog.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { Redis } from 'ioredis';
import { CacheService } from '@Service/Cache.service';
import { StockEntryService } from './Service/Inventory/StockEntry.service';
import { ProductController } from './Controller/Inventory/Product.controller';
import { ProductCategoryController } from './Controller/Inventory/ProductCategory.controller';
import { StockEntryController } from './Controller/Inventory/StockEntry.controller';
import { ProductService } from './Service/Inventory/Product.service';
import { ProductCategoryService } from './Service/Inventory/ProductCategory.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: __dirname + '/client',
      exclude: ['/api/*', 'swagger'],
    }),
    EventEmitterModule.forRoot({ maxListeners: 0 }),
    ConfigModule.forRoot({ isGlobal: true, load: [Configuration] }),
    MulterModule.register(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (_ConfigService: ConfigService) => ({
        type: 'mysql',
        host: _ConfigService.get("Database.Host"),
        port: _ConfigService.get("Database.Port"),
        username: _ConfigService.get("Database.User"),
        password: _ConfigService.get("Database.Password"),
        database: _ConfigService.get("Database.Name"),
        synchronize: _ConfigService.get("Database.Sync"),
        keepConnectionAlive: true,
        entities: [__dirname + '/Database/**/*.{ts,js}'],
        logger: "advanced-console",
        logging: _ConfigService.get("Database.LOG"),
        bigNumberStrings: false,
        supportBigNumbers: true,
        dateStrings: true,
        timezone: "local"
      }),
      inject: [ConfigService]
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
      property: 'user',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (_ConfigService: ConfigService) => ({
        secret: _ConfigService.get("JWT.SecertToken"),
        signOptions: { expiresIn: _ConfigService.get("JWT.ExpiresIn") },
      }),
      inject: [ConfigService]

    }),
  ],
  controllers: [
    LoginController,
    UserController,
    UserRoleController,
    ProductController,
    ProductCategoryController,
    StockEntryController
  ],
  providers: [
    AuthService,
    UserService,
    UserRoleService,
    EmailService,
    EmailConfigService,
    CommonService,
    JwtStrategy,
    ErrorLogService,
    StockEntryService,
    ProductService,
    ProductCategoryService,
       {
      provide: APP_FILTER,
      useClass: ExceptionHelper,
    },
    MailerService,
    EncryptionService,
    CommonSeederService,
    CacheService,
    {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        });
      },
    },
    CacheService
  ],
  exports: [AuthService, EncryptionService],
})
export class AppModule {
}
