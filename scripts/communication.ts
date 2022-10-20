export enum Flag {
    WroteFragment,
    Add,
}

export type Message = {
    flag: Flag,
    payload: string
}

export const sendToParent = (child: NodeJS.Process, message: Message) => {
    if (!child || !('send' in child)) return;
    // @ts-ignore
    child?.send(message);
}