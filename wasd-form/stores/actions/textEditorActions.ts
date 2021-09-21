import { FOCUS_EDITOR, QUOTE_USER, SET_TEXT_EDITOR_STATE, SPAWN_NEW_INSTANCE } from "../actions";

export function SpawnNewInstacne({ thread_id, state } : { thread_id: string, state: any } ) {
     return {
        type: SPAWN_NEW_INSTANCE,
        payload: {
            thread_id,
            state
        }
    }
}

export function SetEditorState(state : any) {
    return {
        type: SET_TEXT_EDITOR_STATE,
        payload: state
    }
}

export function QuoteUser(post_id: string) {
    return {
        type: QUOTE_USER,
        payload: post_id
    }
}

export function SetEditorFocused(isFocused: boolean) {
    return {
        type: FOCUS_EDITOR,
        payload: isFocused
    }
}