import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { SensorService } from '~modules/sensor/sensor.service';
import { SensorCreateDto } from '~modules/sensor/dto/sensor.create.dto';
import { Test } from '@nestjs/testing';
import { SensorBoardTypesEnum } from '~modules/sensor/enum/sensor-board-types.enum';
import { TypeOrmModule } from '@nestjs/typeorm';
import Sensor from '~modules/sensor/sensor.entity';
import { getConnection } from 'typeorm';

describe('SensorService', () => {
  let sensorService: SensorService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [SensorService],
      imports: [TypeOrmModule.forFeature([Sensor]), TypeOrmModule.forRoot()],
    }).compile();

    sensorService = module.get<SensorService>(SensorService);
  }, 10000);

  afterAll(async () => {
    await getConnection().close();
  });

  it('should create a sensor', async () => {
    const data = plainToClass(SensorCreateDto, {
      name: 'A sensor name',
      boardType: SensorBoardTypesEnum.BME680,
      location: 'A location',
    });

    await validateOrReject(data);
    const sensor = await sensorService.create(data);
    expect(sensor).toBeDefined();
  });

  it('should list sensors', async () => {
    const sensors = await sensorService.findAll(
      {},
      {
        limit: 20,
        page: 1,
      },
    );

    expect(sensors.items.length).not.toBe(0);
  });
});