import { BaseModel } from '@modules/base/base.model';
import { Project } from '@modules/projects/project.model';
import { User } from '@modules/users/user.model';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'project_users' })
export class ProjectUser extends BaseModel {
    @PrimaryGeneratedColumn({ name: 'project_user_id' })
    id: number;

    @Column({ name: 'project_id' })
    project_id: number;

    @Column({ name: 'user_id' })
    user_id: number;

    @ManyToOne(() => Project, project => project.project_users)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToOne(() => User, user => user.project_users)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: true })
    role: string;

    @Column({ type: 'timestamp', nullable: true })
    assigned_date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
} 