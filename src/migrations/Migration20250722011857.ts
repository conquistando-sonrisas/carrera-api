import { Migration } from '@mikro-orm/migrations';

export class Migration20250722011857 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "participante" ("id" uuid not null default gen_random_uuid(), "nombre" varchar(255) not null, "edad" int not null, "talla" varchar(255) not null, "sexo" varchar(255) not null, "correo" varchar(255) null, "telefono" varchar(255) null, "registered_by" varchar(255) null, constraint "participante_pkey" primary key ("id"));`);

    this.addSql(`create table "boleto" ("id" uuid not null default gen_random_uuid(), "numero" serial, "status" varchar(255) not null default 'unassigned', "created_by" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "participante_id" uuid not null, constraint "boleto_pkey" primary key ("id"));`);
    this.addSql(`alter table "boleto" add constraint "boleto_participante_id_unique" unique ("participante_id");`);

    this.addSql(`alter table "boleto" add constraint "boleto_participante_id_foreign" foreign key ("participante_id") references "participante" ("id") on update cascade;`);
  }

}
