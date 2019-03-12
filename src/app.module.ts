import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserService } from './auth/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'lol',
      database: 'blog',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    ArticleModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
