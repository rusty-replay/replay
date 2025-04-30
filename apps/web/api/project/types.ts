import { BaseTimeEntity } from '../types';

export interface Project extends BaseTimeEntity {
  id: number;
  name: string;
  api_key: string;
  description: string;
}
