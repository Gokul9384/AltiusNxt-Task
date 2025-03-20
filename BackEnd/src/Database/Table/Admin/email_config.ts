import { Column, Entity } from "typeorm";
import { BaseTable } from "../BaseTable";

@Entity()
export class email_config extends BaseTable {

  @Column()
  email_id: string;

  @Column({ type: "mediumtext" })
  password: string;

  @Column({ nullable: true, default: "TempleDonation" })
  mailer_name: string;

  @Column({ nullable: true, default: "smtp.gmail.com" })
  host: string;
}
