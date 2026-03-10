import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserAccount } from "./user-account.entity";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'first_name'})
  firstName: string;

  @Column({name: 'last_name'})
  lastName: string;

  @Column({type: 'int', nullable: true})
  age: number;

  @Column({name: 'date_of_birth', type: 'date', nullable: true})
  dob: Date;

  @Column()
  bio: string;

  @Column({name: 'avatar_url'})
  avatarUrl: string;
  
  @Column({unique: true })
  phone: string;

  @Column({name: 'postal_code'})
  postalCode: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column({name: 'social_links', type: 'json', nullable: true})
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender: string;

  @Column()
  occupation: string;

  @OneToOne(() => UserAccount, user => user.profile)
  user: UserAccount;
}