const { Client, GatewayIntentBits, Events, REST, Routes, EmbedBuilder, MessageFlags } = require("discord.js");
const resolveCharacter = require("./roster");
const fs = require("fs");
const command = require("./gm-command");

const bot = new Client({
    intents: [
		GatewayIntentBits.MessageContent
    ]
});

bot.on(Events.ClientReady, () => {
    console.log(bot.user.username + " logged in");
    const restClient = new REST().setToken(process.env.BOT_TOKEN);
    restClient.post(Routes.applicationCommands(bot.user.id), {
        body: command
    });
});

bot.on(Events.InteractionCreate, (interaction) => {
    if (interaction.isChatInputCommand() && interaction.commandName === "gm") {
        const val = interaction.options.get("character", true);
        const foundCharacter = resolveCharacter(val.value);
        if (foundCharacter) {
            const fetchedLeaderboard = JSON.parse(fs.readFileSync(`/jsons/${foundCharacter}.json`));
            const embed = new EmbedBuilder();
            embed.setTitle(`Grand Master Leaderboard for ${foundCharacter}.`);
            embed.setColor(0x419CFF);
            const slugified = foundCharacter.replaceAll(" ", "_").toLowerCase()
            const flattenedEntries = fetchedLeaderboard.entries.map((entry) => {
                return `\`${entry.Rank} - ${entry.Name} - ${entry.Points} points\``;
            });
            embed.setDescription(flattenedEntries.join("\n"));
            embed.setFooter({
                text: `Source: https://gm-tracker.com/${slugified}\nLast updated: ${fetchedLeaderboard.timestamp}.`
            });
            interaction.reply({
                embeds: [embed]
            });
        } else {
            interaction.reply({
                content: "Input `" + val.value + "` not recognized. If that's a mistake, please contact <@349940167340982272> or <@279202639957458945>.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
});

bot.login(process.env.BOT_TOKEN)