import { Migration } from '@mikro-orm/migrations';

export class Migration20250801033800 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "registro" add column "created_by" varchar(255) not null;`);

    this.addSql(`alter table "boleto" drop column "status";`);

    this.addSql(`alter table "boleto" add column "check_in_at" timestamptz null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "registro" drop column "created_by";`);

    this.addSql(`alter table "boleto" drop column "check_in_at";`);

    this.addSql(`alter table "boleto" add column "status" varchar(255) not null default 'unassigned';`);
  }

}
