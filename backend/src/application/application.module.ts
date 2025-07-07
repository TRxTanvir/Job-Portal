import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { JwtModule } from '@nestjs/jwt'; // <-- STEP 1: Import JwtModule

@Module({
  imports: [TypeOrmModule.forFeature([Application]),JwtModule.register({})],
  providers: [ApplicationService],
  controllers: [ApplicationController],
})
export class ApplicationModule {}