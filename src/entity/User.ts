import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field(() => String)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field(() => String)
    @Column()
    email: string

    @Field(() => String)
    @Column()
    username: string

    @Column()
    password: string
}
