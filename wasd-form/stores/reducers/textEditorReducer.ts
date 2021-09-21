import { QUOTE_USER, SET_TEXT_EDITOR_STATE, SPAWN_NEW_INSTANCE, FOCUS_EDITOR } from "../actions";

const initalState = {
    thread_id: "",
    editorState: "",
    replying_to: [],
    isFocused: false
};

export default function textEditorReducer(state : any = initalState, action : { type: string, payload: any }) {
    switch(action.type){
        case SPAWN_NEW_INSTANCE:
            state = initalState;
            state.thread_id = action.payload.thread_id;
            state.editorState = action.payload.state;
            state.isFocused = false;
            return state;
        case SET_TEXT_EDITOR_STATE: 
            state.editorState = action.payload;
            return state;
        case QUOTE_USER:
            state.replying_to.push(action.payload);
            return state;
        case FOCUS_EDITOR:
            state.isFocused = true;
            return state;
        default: 
            return state;
    }
}