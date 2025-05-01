import { BaseTimeEntity } from '../types';

export interface Project extends BaseTimeEntity {
  id: number;
  name: string;
  apiKey: string;
  description: string;
}

export interface ProjectCreateRequest {
  name: string;
  description: string | null;
}

export interface ProjectResponse extends BaseTimeEntity {
  id: number;
  name: string;
  apiKey: string;
  description: string | null;
}
