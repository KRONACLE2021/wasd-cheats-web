import { IUser } from "../models/Users";

export default function sanitizeUsers(users: Array<IUser>, user : IUser | null = null) {
    
    if(users.length){
        let sanitizedUsers = [];

        for(var i of users){
            let user_ = {
                uid: i.uid,
                username: i.username,
                avatar: i.avatar,
                tags: i.tags,
                permissions: i.permissions,
                banned: i.banned,
                banId: i.banId,
                active_subscriptions: i.active_subscriptions,
                created_at: i.created_at,
                posts: i.posts
            }

            sanitizedUsers.push(user_);
        }

        return sanitizedUsers;

    } else if(user !== null) {
        let user_ = {
            uid: user.uid,
            username: user.username,
            avatar: user.avatar,
            tags: user.tags,
            permissions: user.permissions,
            banned: user.banned,
            banId: user.banId,
            active_subscriptions: user.active_subscriptions,
            created_at: user.created_at,
            posts: user.posts
        };

        return user_;
    }
}