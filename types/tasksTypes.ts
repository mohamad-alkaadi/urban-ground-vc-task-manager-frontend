export interface TaskType {
  id: number;
  title: string;
  status: "pending" | "completed";
  due_date?: string;
  created_at: string;
}
