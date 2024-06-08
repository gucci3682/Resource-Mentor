import { UUID } from "crypto"

export type User = {
  user_id: UUID;
  user_name: string;
  contact_number: string;
  job_designation: string;
  job_grade: string;
  manager: UUID;
  is_manager: boolean;
}

export type Project = {
  project_id: UUID;
  project_so: string;
  project_name: string;
  project_start: Date;
  project_end: Date;
  total_billable_hours: number;
  total_unbillable_hours: number;
  total_allocated_hours: number;
}

export type Team = {
  team_id: UUID;
  team_name: string;
  person_in_charge_01: UUID;
  person_in_charge_02?: UUID;
}

export type UserTrackedHours = {
  project_id: UUID;
  user_id: UUID;
  billable_hours: number;
  non_billable_hours: number;
  allocated_hours: number;
  project_start: Date;
  project_end: Date;
  team_id: UUID;
}

export type Auth = {
  user_id: UUID;
  email: string;
  password: string;
}
