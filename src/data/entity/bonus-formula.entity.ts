import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BonusStatisticEntity } from "./bonus-statistic.entity";

@Entity('bonus-formulas')
export class BonusFormulaEntity {
  @CreateDateColumn({ name: 'createDate' })
  createDate: Date;
  @Column({ name: 'bonusPerView' })
  bonusPerView: number;
  @OneToMany(
    () => BonusStatisticEntity,
    (bonusStatisticEntity) => bonusStatisticEntity.bonusFormula
  )
  bonusStatistics: Promise<BonusStatisticEntity[]>
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'isActive' })
  isActive: boolean;
}
