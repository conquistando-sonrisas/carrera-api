import { Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Registro } from "./Registro.entity";


@Entity({
  tableName: 'participante'
})
export class Participante {

  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ nullable: true })
  nombre!: string;

  @Property({ nullable: true })
  apellido!: string;

  @Property()
  nombreCompleto!: string;

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

  constructor(participanteDto: {
    nombreCompleto?: string, edad: number,
    talla: string, sexo: string, nombre?: string,
    apellido?: string
  },
    contacto?: { correo: string, telefono: string }) {

    this.edad = participanteDto.edad;
    this.talla = participanteDto.talla;
    this.sexo = participanteDto.sexo;

    if (participanteDto.nombreCompleto) {
      this.nombreCompleto = participanteDto.nombreCompleto;
    }
    
    if (participanteDto.nombre && participanteDto.apellido) {
      this.nombre = participanteDto.nombre;
      this.apellido = participanteDto.apellido;
      this.nombreCompleto = `${participanteDto.nombre} ${participanteDto.apellido}`;
    }

    if (contacto) {
      this.correo = contacto.correo;
      this.telefono = contacto.telefono;
    }

  }

}