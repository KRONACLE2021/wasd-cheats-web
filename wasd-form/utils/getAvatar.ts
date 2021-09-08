import { IUser } from "../interfaces";

export default function getAvatar (user: IUser | null) {  
    return user?.avatar ? user?.avatar : `https://avatars.dicebear.com/api/jdenticon/${user?.uid}.svg`;
}