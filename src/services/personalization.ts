import { User } from "../models/user.model";
import { getData } from "./util";

export const getUser = (uid: string) => getData().users.find((u: User) => u.id === uid);
