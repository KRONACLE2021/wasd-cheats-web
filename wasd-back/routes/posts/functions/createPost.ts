import Posts from "../../../models/Posts";
import Threads from "../../../models/Threads";
import { v4 as uuid } from 'uuid';

export default async function CreatePost(attachments: Array<string> | null, contents: string, uid: string, threadId: string, refrenced_post_id: string | null) {
    
    let id : string = "";

    let thread = await Threads.findOne({ id: threadId });

    if(!thread) return false;

    const createId = async () => {
        id = uuid();
        let postCheck = await Posts.findOne({ id });
        if(postCheck) createId();
    }

    let validatedAttachments : Array<string> = [];

    await createId();

    let post = await Posts.create({
        attachments: validatedAttachments,
        id,
        contents,
        uid,
        threadId,
        refrenced_post_id
    });

    thread.posts.push(id);

    await thread.save();

    return post;
}