import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CategoryModule } from '~modules/category/category.module';
import { Comment } from '~modules/comment/comment.entity';
import {
  CommentFixture,
  CommentFixtureInterface,
} from '~modules/comment/comment.fixture';
import { CommentModule } from '~modules/comment/comment.module';
import { CommentService } from '~modules/comment/comment.service';
import { CommentCreateDto } from '~modules/comment/dto/comment.create.dto';
import { CommentUpdateDto } from '~modules/comment/dto/comment.update.dto';
import { TopicModule } from '~modules/topic/topic.module';
import { UserModule } from '~modules/user/user.module';

describe('CommentService', () => {
  let commentService: CommentService;
  let module: TestingModule = null;
  let fixture: CommentFixtureInterface;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [CommentService],
      imports: [
        CommentModule,
        UserModule,
        TopicModule,
        CategoryModule,
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Comment]),
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    fixture = await CommentFixture(module);
  }, 20000);

  it('should create a comment', async () => {
    const data = plainToClass(CommentCreateDto, {
      description: { entityMap: {}, blocks: [] },
      topicId: fixture.topicOne.id,
    });

    await validateOrReject(data);
    const comment = await commentService.create(fixture.userRequest, data);
    expect(comment).toBeDefined();
    expect(comment.description).toBeDefined();
  });

  it('should update a comment', async () => {
    const data = plainToClass(CommentUpdateDto, {
      description: { blocks: [], entityMap: {} },
    });

    await validateOrReject(data);
    const comment = await commentService.update(fixture.commentOne.id, data);
    expect(comment).toBeDefined();
    expect(comment.description).toEqual({ blocks: [], entityMap: {} });
  });

  it('should list comments', async () => {
    const comments = await commentService.findAll(
      {},
      {},
      {
        limit: 20,
        page: 1,
      },
    );

    expect(comments.items.length).not.toBe(0);
  });

  it('should delete a comment', async () => {
    const success = await commentService.delete({
      id: fixture.commentOne.id,
    });

    expect(success).toEqual(true);
  });

  afterAll(async () => {
    await module.close();
  });
});
