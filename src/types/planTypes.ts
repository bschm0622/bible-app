export interface PlanEntry {
    date: string;
    reading: string;
  }
  
  export interface Plan {
    id: string;
    name: string;
    start_date: Date;
    end_date: Date;
    user_id: string;
    created_at: Date;
  }
  