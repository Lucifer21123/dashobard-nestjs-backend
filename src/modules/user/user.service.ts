import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { UserCreateDto } from '~modules/user/dto/user.create.dto';
import { User, UserWhereInterface } from '~modules/user/user.entity';
import { PaginationQueryDto } from '~utils/pagination.query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async findAll(
    where: UserWhereInterface,
    pagination: PaginationQueryDto,
  ): Promise<Pagination<User>> {
    const results = await paginate<User>(this.userRepository, pagination, {
      where,
    });

    return results;
  }

  async find(where: UserWhereInterface): Promise<User> {
    const user = await this.userRepository.findOne(where);
    if (user) {
      return user;
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  async create(data: UserCreateDto): Promise<User> {
    const user = new User();
    user.username = data.username;
    user.password = data.password;
    user.email = data.email;
    user.name = data.name;
    user.surname = data.surname;

    await User.save(user);

    return user;
  }
}
