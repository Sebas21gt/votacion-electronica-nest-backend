import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/users/infraestructure/user.module';
import { StudentModule } from './modules/students/infraestructure/student.module';
import { FacultyModule } from './modules/faculties/infraestructure/faculty.module';
import { CareerModule } from './modules/careers/infraestructure/career.module';
import { StudentsFrontModule } from './modules/students_fronts/infraestructure/student_front.module';
import { ProposalsModule } from './modules/proposals/infraestructure/proposal.module';
import { StudentPositionModule } from './modules/student_positions/infraestructure/student_position.module';
import { EntitySubscriber } from './modules/shared/subscriber/context.subscriber';
import { AuthModule } from './modules/auth/auth.module';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: !ENV ? '.env' : `.env.${ENV}` }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
        __dirname + '/**/*.view{.ts,.js}',
      ],
      subscribers: [EntitySubscriber]
    }),
    AuthModule,
    UserModule,
    CareerModule,
    FacultyModule,
    StudentModule,
    StudentsFrontModule,
    ProposalsModule,
    StudentPositionModule
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
