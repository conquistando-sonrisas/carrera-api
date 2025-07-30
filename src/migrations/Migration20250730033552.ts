import { Migration } from '@mikro-orm/migrations';

export class Migration20250730033552 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "participante" add column "apellido" varchar(255) null, add column "nombre_completo" varchar(255) not null;`);
    this.addSql(`alter table "participante" alter column "nombre" type varchar(255) using ("nombre"::varchar(255));`);
    this.addSql(`alter table "participante" alter column "nombre" drop not null;`);

    this.addSql(`alter table "boleto" rename column "numero" to "folio";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "participante" drop column "apellido", drop column "nombre_completo";`);

    this.addSql(`alter table "participante" alter column "nombre" type varchar(255) using ("nombre"::varchar(255));`);
    this.addSql(`alter table "participante" alter column "nombre" set not null;`);

    this.addSql(`alter table "boleto" rename column "folio" to "numero";`);
  }

}
