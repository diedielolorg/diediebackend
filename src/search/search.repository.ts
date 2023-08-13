import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Search } from "./search.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class SearchRepository extends Repository<Search> {
    constructor(private dataSource: DataSource) {
        super(Search, dataSource.createEntityManager())
    }




}