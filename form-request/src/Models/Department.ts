import User from "./User";

export default interface Department {
  name?: string;
  users?: User[] | null;
}
