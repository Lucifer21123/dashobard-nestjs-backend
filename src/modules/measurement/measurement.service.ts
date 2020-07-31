import { Injectable } from '@nestjs/common';
import { Measurement } from './measurement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MeasurementCreateDto } from '~modules/measurement/dto/measurement.create.dto';
import { SensorRequest } from '~modules/sensor/sensor.guard';
import { MeasurementQueryDto } from '~modules/measurement/dto/measurement.query.dto';
import { DateRange } from '~utils/date.range';
import { MeasurementRepository } from '~modules/measurement/measurement.repository';
import { MeasurementListCreateDto } from '~modules/measurement/dto/measurement.list.create.dto';

@Injectable()
export class MeasurementService {
  constructor(
    @InjectRepository(MeasurementRepository)
    private measurementRepository: MeasurementRepository,
  ) {}

  public async findAll(
    query: MeasurementQueryDto,
  ): Promise<{ [key: string]: Measurement[] }> {
    const range = DateRange.parse(query.createdAtRange);
    const results = await this.measurementRepository.groupBy({
      ...range,
      measurementTypes: query.measurementTypes,
    });

    return results;
  }

  public async create(
    request: SensorRequest,
    data: MeasurementCreateDto,
  ): Promise<Measurement> {
    const measurement = new Measurement();
    measurement.measurement = data.measurement;
    measurement.measurementType = data.measurementType;
    measurement.sensor = request.sensor;

    await Measurement.save(measurement);

    return measurement;
  }

  public async createMultiple(
    request: SensorRequest,
    data: MeasurementListCreateDto,
  ): Promise<Measurement[]> {
    const measurements: Measurement[] = [];

    for (const measurementData of data.measurements) {
      const measurement = new Measurement();
      measurement.measurement = measurementData.measurement;
      measurement.measurementType = measurementData.measurementType;
      measurement.sensor = request.sensor;
      measurements.push(measurement);
    }

    await Measurement.save(measurements);
    return measurements;
  }
}
