import { IBaseEntity } from '@modules/base/base.entity';
import { Permission } from '@modules/permissions/permission.entity';
import { User } from '@modules/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role implements IBaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  role_name: string;

  @Column()
  role_description: string;

  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: Permission[];

  @ManyToMany(() => User, user => user.roles)
  users: User[];
}
