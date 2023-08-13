import { User } from "src/users/user.model";
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Search extends BaseEntity {
    // @PrimaryGeneratedColumn()
    // userId: number;

    @Column()
    summonerName: string;

    @Column()
    summunerPhoto: string;
    
    // @ManyToOne(() => User)
    // @JoinColumn({ name: 'reportId'})
    // report: User;
}