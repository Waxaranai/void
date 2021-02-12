import VoidConfig from "../config";
import { create, ConfigObject } from "@open-wa/wa-automate";
import MessageHandler from "../handler/Message";
import Util from "./Util";

export default class Void {
    public constructor(public readonly config: typeof VoidConfig, public readonly options: ConfigObject) {
        void create(options).then(async client => {
            const handler = new MessageHandler(client, this.config.prefix);
            client.handler = handler;
            client.config = config;
            client.util = new Util(client);
            void handler.loadAll();
            await client.onAnyMessage(async message => {
                await client.getAmountOfLoadedMessages().then(msg => msg >= 3000 ? client.cutMsgCache() : msg);
                await handler.handle(message);
            });
            await client.onStateChanged(async state => {
                if (state === "CONFLICT" || state === "UNLAUNCHED") {
                    await client.forceRefocus();
                    return undefined;
                }
                if (state === "CONNECTED") console.log("Connected to the phone!");
                if (state === "UNPAIRED") console.log("Logged out!");
            });
        });
    }
}

declare module "@open-wa/wa-automate" {
    interface Client {
        handler: MessageHandler;
        config: typeof VoidConfig;
        util: Util;
    }
}