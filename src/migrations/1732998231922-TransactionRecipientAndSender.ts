import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionRecipientAndSender1732998231922
  implements MigrationInterface
{
  name = 'TransactionRecipientAndSender1732998231922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account_transaction" ADD "senderId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_transaction" ADD CONSTRAINT "UQ_008bdffcf5cf00ec9adb3bc9ca7" UNIQUE ("senderId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_transaction" ADD "recipientId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_transaction" ADD CONSTRAINT "UQ_f5038d9f804a917c97e3dd6b572" UNIQUE ("recipientId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_transaction" ADD CONSTRAINT "FK_008bdffcf5cf00ec9adb3bc9ca7" FOREIGN KEY ("senderId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_transaction" ADD CONSTRAINT "FK_f5038d9f804a917c97e3dd6b572" FOREIGN KEY ("recipientId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account_transaction" DROP CONSTRAINT "FK_f5038d9f804a917c97e3dd6b572"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_transaction" DROP CONSTRAINT "FK_008bdffcf5cf00ec9adb3bc9ca7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_transaction" DROP CONSTRAINT "UQ_f5038d9f804a917c97e3dd6b572"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_transaction" DROP COLUMN "recipientId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_transaction" DROP CONSTRAINT "UQ_008bdffcf5cf00ec9adb3bc9ca7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_transaction" DROP COLUMN "senderId"`,
    );
  }
}
