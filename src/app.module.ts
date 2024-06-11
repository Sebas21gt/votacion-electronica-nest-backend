import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/infraestructure/user.module';
import { StudentModule } from './modules/students/infraestructure/student.module';
import { FacultyModule } from './modules/faculties/infraestructure/faculty.module';
import { CareerModule } from './modules/careers/infraestructure/career.module';
import { StudentsFrontModule } from './modules/students_fronts/infraestructure/student_front.module';
import { ProposalsModule } from './modules/proposals/infraestructure/proposal.module';
import { StudentPositionModule } from './modules/student_positions/infraestructure/student_position.module';
import { EntitySubscriber } from './modules/shared/subscriber/context.subscriber';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware } from './modules/auth/middleware/auth.middleware';
import { ElectoralConfigurationModule } from './modules/electoral_configuration/infraestructure/electoral_configuration.module';
import { ElectoralRecordModule } from './modules/electoral_records/infraestructure/electoral_record.module';
import { DelegatesModule } from './modules/delegates/infraestructure/delegate.module';
import { PollingTablesModule } from './modules/polling_tables/infraestructure/polling_table.module';
import { ElectoralRecordSignatureModule } from './modules/electoral_records_signature/infraestructure/electoral_record_signature.module';
import { VotesModule } from './modules/votes/infraestructure/vote.module';
import { ResultsModule } from './modules/results/infraestructure/results.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ContractModule } from './modules/eth_contracts/eth_contract.module';
import { DataHashModule } from './modules/hashes/infraestructure/hash.module';

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
    AuthModule, //! Falta el logout
    CareerModule, //* Testeado
    DelegatesModule, //* Testeado
    ElectoralConfigurationModule, //* Testeado
    ElectoralRecordModule, //* Testeado
    ElectoralRecordSignatureModule, //* Testeado
    FacultyModule, //* Testeado
    PollingTablesModule, //* Testeado
    ProposalsModule, //* Testeado
    ResultsModule, //! Falta testear
    //RolesModule,
    StudentPositionModule, //* Testeado
    StudentModule, //* Testeado
    StudentsFrontModule, //! Falta el delete
    UserModule, //* Testeado
    VotesModule,
    ContractModule,
    DataHashModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    });
  }
}
