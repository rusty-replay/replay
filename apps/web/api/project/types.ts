import { BaseTimeEntity } from '../types';

export interface Project extends BaseTimeEntity {
  id: number;
  name: string;
  apiKey: string;
  description: string;
}
