import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';

@Injectable()
export class SearchService {
    // private searchStrategies: { [key:string]: SearchStrategy } = {};
    constructor(
        private searchRepository: SearchRepository
    ) {}


}
