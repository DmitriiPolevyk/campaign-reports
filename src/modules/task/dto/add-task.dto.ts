export class AddTaskDto {
  from_date: string;
  to_date: string;
  manually?: boolean = false;
}
