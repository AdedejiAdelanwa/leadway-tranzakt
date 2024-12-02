import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, dbConfig, IConfiguration, jwtConfig } from './configs';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService<IConfiguration>],
      async useFactory(configService: ConfigService<IConfiguration>) {
        const config = configService.get('db', { infer: true });
        return {
          host: config.host,
          port: config.port,
          database: config.name,
          username: config.user,
          password: config.password,
          type: config.dialect,
          useUTC: true,
          ssl: config.ssl,
          entities: ['dist/**/entities/*.entity.js'],
        };
      },
    }),
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
