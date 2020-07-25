import { Module } from '@nestjs/common';
import { MeasurementService } from '~/modules/measurement/measurement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Measurement from '~/modules/measurement/measurement.entity';
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';
import { MeasurementController } from '~/modules/measurement/measurement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Measurement]), DefaultAdminModule],
  providers: [MeasurementService],
  exports: [MeasurementService, TypeOrmModule],
  controllers: [MeasurementController],
})
export class MeasurementModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Measurement', Measurement);
  }
}
