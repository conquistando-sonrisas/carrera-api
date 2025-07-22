import { Entity, OneToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Participante } from "./Participante.entity";

@Entity()
export class Boleto {

  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ autoincrement: true })
  numero!: number;

  /**
   * - unassigned
   * - pending_payment
   * - paid
   * - checked_in
   * - cancelled?
   * - refunded?
   */
  @Property()
  status = 'unassigned';

  @Property()
  createdBy!: string;

  @Property({ type: 'timestamptz' })
  createdAt: Date = new Date();

  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToOne()
  participante!: Participante;
}