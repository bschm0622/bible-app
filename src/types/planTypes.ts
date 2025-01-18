export interface PlanEntry {
    id: string;
    plan_id: string;
    date: string;
    reading: string;
    created_at: Date;
    is_checked: boolean;
  }
  
  export interface Plan {
    id: string;
    name: string;
    start_date: Date;
    end_date: Date;
    user_id: string;
    created_at: Date;
  }
  