export interface IThread {
    id: string;
    title: string;
    uid: string;
    createdAt: Date;
    topicId: string;
    locked: boolean;
    pinned: boolean | null;
    posts: Array<IPost>;
}


export interface IPost {
    id: string;
    contents: string;
    attachments: Array<string>;
    uid: string;
    threadId: string;
}

export interface ICategory {
    id: string;
    title: string;
    description: string;
    topics: Array<ITopics>;
}


export interface ITopics {
    id: string;
    title: string;
    description: string;
    imgUrl: string;
    createdAt: Date;
    category: string;
    threads: Array<IThread>;
}

export interface IUser {
    username: string;
    permissions: Array<string>;
    avatar: string;
    posts: Array<string>;
    uid: string;
}

export interface IApiError {
    error: true;
    errors: Array<String>;
}