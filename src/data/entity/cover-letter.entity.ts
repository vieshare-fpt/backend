import { PositionApply } from "@constant/position-apply.enum";
import { StatusCoverLetter } from "@constant/status-cover-letter.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('cover-letters')
export class CoverLetterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.coverLetters)
  @JoinColumn({ name: 'userId' })
  user: Promise<UserEntity>

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ name: 'title', type: 'text' })
  title: string;

  @Column({ name: 'connent', type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'publishDate' })
  createDate: Date;

  @Column('enum', { enum: PositionApply, nullable: true })
  positionApply: PositionApply;

  @Column('enum', { enum: StatusCoverLetter, default: StatusCoverLetter.Pending })
  status: StatusCoverLetter

}
