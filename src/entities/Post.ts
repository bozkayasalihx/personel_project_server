import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";


@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ length: 100 })
    title: string;

    @Field()
    @Column()
    body: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
