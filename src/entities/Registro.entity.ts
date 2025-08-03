import { Entity, Formula, OneToOne, OptionalProps, PrimaryKey, Property, rel } from "@mikro-orm/core";
import { Participante } from "./Participante.entity";


@Entity({
  tableName: 'registro'
})
export class Registro {

  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ nullable: true })
  paymentId!: string;

  @OneToOne(() => Participante)
  payer!: Participante;

  @Property({ type: 'timestamptz' })
  createdAt: Date = new Date();

  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdBy!: string;

  // pending, paid, failed
  @Property()
  status = 'pending'

  @Property()
  type!: string

  @Formula(alias => `(select count(*) from participante where participante.registro_id = ${alias}.id)`, { lazy: true })
  boletosCount?: number;

  constructor(payer: Participante, createdBy: string) {
    this.payer = payer;
    this.createdBy = createdBy;
  }
}