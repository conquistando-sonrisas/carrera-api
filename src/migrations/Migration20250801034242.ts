import { Migration } from '@mikro-orm/migrations';

export class Migration20250801034242 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "registro" add column "type" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "registro" drop column "type";`);
  }

}
