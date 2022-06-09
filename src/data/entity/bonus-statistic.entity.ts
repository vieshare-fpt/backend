import { BonusStatisticStatus } from "@constant/bonus-statistic-status.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BonusFormulaEntity } from "./bonus-formula.entity";
import { PostEntity } from "./post.entity";

@Entity('bounus-statistics')
export class BonusStatisticEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'postId' })
  postId: string;

  @Column({ name: 'views', default: 0 })
  views: number

  @Column({ name: 'from' })
  from: Date;

  @Column({ name: 'to' })
  to: Date;

  @Column({ name: 'bonusFormulaId' })
  bonusFormulaId: string;

  @Column({ name: 'status', type: 'enum', enum: BonusStatisticStatus, default: BonusStatisticStatus.Processing })
  status: BonusStatisticStatus;

  @ManyToOne(
    () => BonusFormulaEntity,
    (bonusFormulaEntity) => bonusFormulaEntity.bonusStatistics
  )
  bonusFormula: Promise<BonusFormulaEntity>
  @ManyToOne(
    () => PostEntity,
    (postEntity) => postEntity.bonusStatistics
  )
  post: Promise<PostEntity>
}
