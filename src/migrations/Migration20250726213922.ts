import { Migration } from '@mikro-orm/migrations';

export class Migration20250726213922 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "registro" drop constraint "registro_payer_id_id_foreign";`);

    this.addSql(`alter table "registro" drop constraint "registro_payer_id_id_unique";`);

    this.addSql(`alter table "registro" alter column "payment_id" type varchar(255) using ("payment_id"::varchar(255));`);
    this.addSql(`alter table "registro" alter column "payment_id" drop not null;`);
    this.addSql(`alter table "registro" rename column "payer_id_id" to "payer_id";`);
    this.addSql(`alter table "registro" add constraint "registro_payer_id_foreign" foreign key ("payer_id") references "participante" ("id") on update cascade;`);
    this.addSql(`alter table "registro" add constraint "registro_payer_id_unique" unique ("payer_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "registro" drop constraint "registro_payer_id_foreign";`);

    this.addSql(`alter table "registro" drop constraint "registro_payer_id_unique";`);

    this.addSql(`alter table "registro" alter column "payment_id" type varchar(255) using ("payment_id"::varchar(255));`);
    this.addSql(`alter table "registro" alter column "payment_id" set not null;`);
    this.addSql(`alter table "registro" rename column "payer_id" to "payer_id_id";`);
    this.addSql(`alter table "registro" add constraint "registro_payer_id_id_foreign" foreign key ("payer_id_id") references "participante" ("id") on update cascade;`);
    this.addSql(`alter table "registro" add constraint "registro_payer_id_id_unique" unique ("payer_id_id");`);
  }

}
