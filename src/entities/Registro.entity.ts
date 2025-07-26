import { Entity, OneToOne, OptionalProps, PrimaryKey, Property, rel } from "@mikro-orm/core";
import { Participante } from "./Participante.entity";


@Entity()
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

  // pending, paid, failed
  @Property()
  status = 'pending'

  constructor(payer: Participante) {
    this.payer = payer;
  }
}