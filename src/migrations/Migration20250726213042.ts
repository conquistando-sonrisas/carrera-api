import { Migration } from '@mikro-orm/migrations';

export class Migration20250726213042 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "registro" ("id" uuid not null default gen_random_uuid(), "payment_id" varchar(255) not null, "payer_id_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "status" varchar(255) not null default 'pending', constraint "registro_pkey" primary key ("id"));`);
    this.addSql(`alter table "registro" add constraint "registro_payer_id_id_unique" unique ("payer_id_id");`);

    this.addSql(`alter table "registro" add constraint "registro_payer_id_id_foreign" foreign key ("payer_id_id") references "participante" ("id") on update cascade;`);

    this.addSql(`alter table "participante" drop column "registered_by";`);

    this.addSql(`alter table "participante" add column "registro_id" uuid null;`);
    this.addSql(`alter table "participante" add constraint "participante_registro_id_foreign" foreign key ("registro_id") references "registro" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "participante" drop constraint "participante_registro_id_foreign";`);

    this.addSql(`drop table if exists "registro" cascade;`);

    this.addSql(`alter table "participante" drop column "registro_id";`);

    this.addSql(`alter table "participante" add column "registered_by" varchar(255) null;`);
  }

}
