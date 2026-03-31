import resolveCharacter from "./roster";
import { Client, GatewayIntentBits, Events, REST, Routes, EmbedBuilder, MessageFlags } from "discord.js";
import * as fs from "fs";
import ICONS from "./icons.json";
import commands from "./commands";
import { createCorrectInputReport, createHealthStatusReport, createServerJoinReport, createWrongInputReport, sendAnalytics } from "./analytics";

let inboundCommandRequests = 0;

interface LeaderboardData {
    entries: { Rank: number; Name: string; Points: number }[];
    timestamp: number;
}

const bot = new Client({
    intents: [
		GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds
    ]
});

bot.on(Events.ClientReady, () => {
    if (bot.user) {
        console.log(bot.user.username + " logged in");
        const embed = createHealthStatusReport(bot.user.username, new Date().getTime());
        sendAnalytics(embed);
        const restClient = new REST().setToken(process.env.BOT_TOKEN!);
        restClient.put(Routes.applicationCommands(bot.user!.id), {
            body: Object.values(commands)
        });
    }
});

bot.on(Events.GuildCreate, async (newGuild) => {
    if (newGuild.name) {
        const embed = createServerJoinReport({
            name: newGuild.name,
            image: newGuild.iconURL({
                forceStatic: true
            })
        }, newGuild.joinedTimestamp);
        sendAnalytics(embed);
    }
});

process.on("SIGTERM", async () => {
    console.log("Shutting down...");
    while (inboundCommandRequests > 0) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(null);
            }, 200)
        });
    }

    await bot.destroy();
    process.exit(0);
});

bot.on(Events.InteractionCreate, (interaction) => {
    if (interaction.isChatInputCommand()) {
        inboundCommandRequests++;
        switch (interaction.commandName) {
            case "gm": {
                const val = interaction.options.get("character", true);
                const foundCharacter = resolveCharacter(val.value!.toString());
                if (foundCharacter) {
                    const fetchedLeaderboard = JSON.parse(fs.readFileSync(`/jsons/${foundCharacter}.json`, "utf-8")) as LeaderboardData;
                    const embed = new EmbedBuilder();
                    embed.setTitle(`Grand Master Leaderboard for ${foundCharacter}`);
                    if (foundCharacter in ICONS) {
                        embed.setThumbnail(ICONS[foundCharacter as keyof typeof ICONS]);
                    }
                    embed.setColor(0x419CFF);
                    const slugified = foundCharacter.replaceAll(" ", "_").toLowerCase();
                    const flattenedEntries = fetchedLeaderboard.entries.slice(0, 11).map((entry) => {
                        return `\`${entry.Rank} - ${entry.Name} - ${entry.Points} points\``;
                    });
                    embed.setDescription(flattenedEntries.join("\n") + `\n\n-# Last updated: <t:${fetchedLeaderboard.timestamp}:f> (local time).\n-# [Full Leaderboard](<https://gm-tracker.com/${slugified}>).`);
                    interaction.reply({
                        embeds: [embed]
                    });
                    const reportEmbed = createCorrectInputReport(val.value!.toString(), foundCharacter, { name: interaction.guild?.name || "Private Messages", image: interaction.guild?.iconURL({
                        forceStatic: true
                    }) ?? null }, interaction.createdTimestamp);
                    sendAnalytics(reportEmbed);
                } else {
                    interaction.reply({
                        content: "Input `" + val.value + "` not recognized. If that's a mistake, please contact <@349940167340982272> or <@279202639957458945>.",
                        flags: MessageFlags.Ephemeral
                    });
                    const reportEmbed = createWrongInputReport(val.value!.toString(), {
                        name: interaction.guild?.name || "Private Messages",
                        image: interaction.guild?.iconURL({
                            forceStatic: true
                        }) ?? null 
                    }, interaction.createdTimestamp);
                    sendAnalytics(reportEmbed);
                }
            }
            break;
            case "feedback": {
                const content = interaction.options.get("content", true).value.toString();
                const displayUsername = !!interaction.options.get("username").value;
                const feedbackEmbed = new EmbedBuilder();
                feedbackEmbed.setColor(0x880088);
                let embedTitle = `New feedback report received`;
                if (displayUsername) {
                    embedTitle = `New feedback report sent by ${interaction.member.user.username}`;
                    feedbackEmbed.setAuthor({
                        name: interaction.member.user.username,
                    });
                }
                feedbackEmbed.setTitle(embedTitle);
                feedbackEmbed.setDescription(`\`\`\`\n${content}\n\`\`\``);
                feedbackEmbed.setFooter({
                    text: `Report timestamp: ${new Date(interaction.createdTimestamp).toLocaleDateString("fr")} ${new Date(interaction.createdTimestamp).toLocaleTimeString("fr")}.`
                });
                sendAnalytics(feedbackEmbed);
                const successEmbed = new EmbedBuilder();
                successEmbed.setColor(0x008800);
                successEmbed.setTitle("Thank you for your feedback!");
                interaction.reply({
                    embeds: [successEmbed],
                    flags: MessageFlags.Ephemeral
                });
            }
            break;
        }
        inboundCommandRequests--;          
    } 
});

bot.login(process.env.BOT_TOKEN!);