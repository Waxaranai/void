import { Message } from "@open-wa/wa-automate";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";
@DefineCommand("mentionall", {
    adminOnly: true,
    aliases: ["everyone"],
    category: "group",
    description: {
        content: "Mention all group members"
    },
    groupOnly: true
})
export default class extends BaseCommand {
    public async exec(msg: Message): Promise<void> {
        const result: string[] = [];
        const members = await this.client.getGroupMembers(msg.chatId as any);
        for (const member of members) {
            if (member.isMe) continue;
            else result.push(`@${(member.id as string).replace(/@c.us/g, "")}`);
        }
        await this.client.sendTextWithMentions(msg.chatId as any, result.join(" "));
    }
}