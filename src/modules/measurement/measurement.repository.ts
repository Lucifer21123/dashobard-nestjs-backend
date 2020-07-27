import { EntityRepository, Repository } from 'typeorm';
import { format } from 'date-fns';
import { RangeGroupByEnum } from '~utils/date.range';
import Measurement from '~modules/measurement/measurement.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MeasurementTypeEnum } from '~modules/measurement/enum/measurement-type.enum';

export interface MeasurementWhereInterface {
  from: Date;
  to: Date;
  measurementType: MeasurementTypeEnum;
  groupBy?: RangeGroupByEnum;
}

@EntityRepository(Measurement)
export class MeasurementRepository extends Repository<Measurement> {
  public async groupBy(
    where: MeasurementWhereInterface,
  ): Promise<Pagination<Measurement>> {
    let aggregate, timeFormat;

    switch (where.groupBy) {
      case RangeGroupByEnum.DAY:
        aggregate = `date_part('day', "createdAt")`;
        timeFormat = 'YYYY-MM-DD';
        break;
      case RangeGroupByEnum.MONTH:
        timeFormat = 'YYYY-MM';
        aggregate = `date_part('month', "createdAt")`;
        break;
      default:
        timeFormat = 'YYYY-MM-DD hh:mm';
        aggregate = `"createdAt"`;
        break;
    }

    const r = await this.manager.query(
      `
      SELECT 
        "measurementType", 
        ${aggregate} AS aggregate, 
        ROUND(AVG("measurement"::numeric)::numeric, 2) as "measurement",
        to_char(MIN("createdAt"), '${timeFormat}') as "createdAt"
      FROM "measurement"
      WHERE "measurementType" = $1
      AND "createdAt" BETWEEN 
      '${format(where.from, 'yyyy-MM-dd HH:mm:ss')}'
      AND '${format(where.to, 'yyyy-MM-dd HH:mm:ss')}'
      GROUP BY "measurementType", "aggregate"
    `,
      [where.measurementType],
    );

    return {
      items: r,
      meta: {
        totalItems: r.length,
        currentPage: 1,
        itemCount: 0,
        itemsPerPage: 0,
        totalPages: 0,
      },
      links: {},
    };
  }
}