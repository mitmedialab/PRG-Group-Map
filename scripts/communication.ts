import { Serializable } from "child_process";

export enum Flag {
    Add,
}

export type Message = {
    flag: Flag,
    payload: Serializable
}

export const sendToParent = (child: NodeJS.Process, message: Message) => {
    if (!child || !('send' in child)) return;
    // @ts-ignore
    child?.send(message);
}