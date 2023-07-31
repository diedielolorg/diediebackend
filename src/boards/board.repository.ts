import { EntityRepository, Repository } from 'typeorm';
import { Board } from './board-entity';
import { InjectRepository } from '@nestjs/typeorm';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {}
