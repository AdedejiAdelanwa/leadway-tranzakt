import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTable1732807738445 implements MigrationInterface {
  name = 'UserTable1732807738445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "firstName" character varying(150) NOT NULL, "lastName" character varying(150) NOT NULL, "email" character varying(250) NOT NULL, "gender" integer NOT NULL, "dob" TIMESTAMP NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_3d29d788cd69d1ddf87e88e01eb" UNIQUE ("email"), CONSTRAINT "PK_9922406dc7d70e20423aeffadf3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "auth_user"`);
  }
}
