import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Generated,
} from 'typeorm';
import { SensorBoardTypesEnum } from '~/modules/sensor/enum/sensor-board-types.enum';
import Measurement from '~modules/measurement/measurement.entity';
import { AbstractEntity } from '~utils/abstract.entity';
import { MeasurementTypeEnum } from '~modules/measurement/enum/measurement-type.enum';

export type SensorId = string;

export interface SensorWhereInterface {
  sensorAccessToken?: string;
}

@Entity()
export class Sensor extends AbstractEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public location: string;

  @Column()
  @Generated('uuid')
  public sensorAccessToken: string;

  @Column()
  public boardType: SensorBoardTypesEnum;

  @OneToMany(() => Measurement, (measurement) => measurement.sensor)
  public measurements: Measurement[];

  @Column('text', { array: true, default: () => 'array[]::text[]' })
  public measurementTypes: MeasurementTypeEnum[];

  public toString(): string {
    return this.name;
  }
}

export default Sensor;
