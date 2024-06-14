import { STATUS_TASK, TaskDTO } from "@/domain/entities";

export interface TaskCreateBody
  extends Pick<TaskDTO, "description" | "title" | "status"> {}

export interface TaskUpdateBody extends Pick<TaskDTO, "id"> {
  title: string;
  description: string;
  status: STATUS_TASK;
}

export interface TaskUpdateParams extends Pick<TaskDTO, "id"> {}

export interface TaskDeleteParams extends Pick<TaskDTO, "id"> {}
