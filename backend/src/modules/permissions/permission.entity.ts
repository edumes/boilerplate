import { IBaseEntity } from '@modules/base/base.entity';
import { Role } from '@modules/roles/role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
export class Permission implements IBaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  permission_name: string;

  @Column()
  permission_description: string;

  @Column()
  permission_resource: string; // e.g., 'users', 'companies'

  @Column()
  permission_action: string; // e.g., 'create', 'read', 'update', 'delete'

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];
}
