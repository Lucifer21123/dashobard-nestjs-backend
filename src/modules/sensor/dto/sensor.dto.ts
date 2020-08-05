import { SensorBoardTypesEnum } from '~/modules/sensor/enum/sensor-board-types.enum';
import Sensor from '~modules/sensor/sensor.entity';
import { MeasurementTypeEnum } from '~modules/measurement/enum/measurement-type.enum';

export class SensorDto {
  public id: string;
  public name: string;
  public boardType: SensorBoardTypesEnum;
  public location: string;
  public measurementTypes: MeasurementTypeEnum[];
  public timezone: string;

  public static fromSensor(sensor: Sensor): SensorDto {
    return {
      id: sensor.id,
      name: sensor.name,
      boardType: sensor.boardType,
      location: sensor.location,
      measurementTypes: sensor.measurementTypes,
      timezone: sensor.timezone,
    };
  }
}
