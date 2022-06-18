import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {User} from "./User";

@ObjectType()
@Entity()
export class Note extends BaseEntity {
    @Field(() => String)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => String)
    @Column()
    title: string;

    @Field(() => String)
    @Column("longtext")
    content: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.id)
    createdBy: string;

    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;
}