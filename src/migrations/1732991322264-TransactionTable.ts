import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionTable1732991322264 implements MigrationInterface {
  name = 'TransactionTable1732991322264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "amount" numeric NOT NULL, "type" integer NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "REL_03114b894370038c6294a8a74b" UNIQUE ("accountId"), CONSTRAINT "PK_eba337658ffe8785716a99dcb92" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_transaction" ADD CONSTRAINT "FK_03114b894370038c6294a8a74b9" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account_transaction" DROP CONSTRAINT "FK_03114b894370038c6294a8a74b9"`,
    );
    await queryRunner.query(`DROP TABLE "account_transaction"`);
  }
}
