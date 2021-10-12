import { IUser } from "../interfaces";
import { BASE_IMAGE_URL } from "../requests/config";

export default function getAvatar (user: IUser | null) {  
    return user?.avatar ? BASE_IMAGE_URL(user?.avatar) : `https://avatars.dicebear.com/api/jdenticon/${user?.uid}.svg`;
}