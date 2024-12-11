export interface IBaseModel {
  id: number;
  created_at?: Date;
  updated_at?: Date;
  created_by_fk_user_id?: number;
  updated_by_fk_user_id?: number;
}