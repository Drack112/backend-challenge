import { UserDTO } from "@/domain/entities";

export interface UserRequestSignupBody extends Omit<UserDTO, "id" | "token"> {
  password: string;
}

export interface UserRequestSigninBody extends Pick<UserDTO, "username"> {
  password: string;
}

export interface UserRequestGetInfoParams {
  userId: string;
}
