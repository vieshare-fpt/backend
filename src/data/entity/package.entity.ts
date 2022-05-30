import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('packages')
export class PackageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'expirationTime', type: 'bigint' })
  expirationTime: number;

  @Column({ name: 'price', type: 'float' })
  price: number;

  @Column({ name: 'createDate', type: 'bigint' })
  createDate: number;
}
