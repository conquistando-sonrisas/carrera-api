import { Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Registro } from "./Registro.entity";


@Entity()
export class Participante {

  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property()
  nombre!: string;

  @Property()
  edad!: number;

  @Property()
  talla!: string;

  @Property()
  sexo!: string;

  @Property({ nullable: true })
  correo!: string | null;

  @Property({ nullable: true })
  telefono!: string | null;

  @ManyToOne(() => Registro, { nullable: true })
  registro!: Registro;

  constructor(participante: { nombre: string, edad: number, talla: string, sexo: string }, contacto?: { correo: string, telefono: string }) {
    this.nombre = participante.nombre;
    this.edad = participante.edad;
    this.talla = participante.talla;
    this.sexo = participante.sexo;

    if (contacto) {
      this.correo = contacto.correo;
      this.telefono = contacto.telefono;
    }

  }

}