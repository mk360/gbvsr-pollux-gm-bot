import { EmbedBuilder } from "discord.js";

export function createCorrectInputReport(input: string, character: string, server: { name: string, image: string }, timestamp: number) {
    const embed = new EmbedBuilder();
    embed.setTitle("Successful GM Leaderboard request");
    embed.setColor(0x008000);
    embed.setThumbnail(server.image);
    embed.setDescription(`Valid input served.`);
    embed.addFields([{
        name: "User input",
        value: `\`${input}\``,
        inline: true,
    }, {
        name: "Matched character",
        value: `\`${character}\``,
        inline: true,
    }, {
        name: "Requested in the server",
        value: server.name,
        inline: true,
    }]);

    embed.setFooter({
        text: `Request timestamp: ${new Date(timestamp).toLocaleDateString("fr")} ${new Date(timestamp).toLocaleTimeString("fr")}.`,
        iconURL: server.image
    });

    return embed;
};

export function createWrongInputReport(input: string, server: { name: string, image: string }, timestamp: number) {
    const embed = new EmbedBuilder();
    embed.setTitle("Unsuccessful GM Leaderboard request");
    embed.setColor(0x800000);
    embed.setThumbnail(server.image);
    embed.setDescription(`Invalid input reported.`);
    embed.addFields([{
        name: "User input",
        value: `\`${input}\``
    }, {
        name: "Requested in the server",
        value: server.name
    }]);

    embed.setFooter({
        text: `Request timestamp: ${new Date(timestamp).toLocaleDateString("fr")} ${new Date(timestamp).toLocaleTimeString("fr")}.`
    });

    return embed;
};

export function createServerJoinReport(server: { name: string; image: string }, timestamp: number) {
    const embed = new EmbedBuilder();
    embed.setTitle("Joined a new server.");
    embed.setColor(0x808000);
    embed.setThumbnail(server.image);
    embed.addFields([{
        name: "Server Name",
        value: `\`${server.name}\``
    }]);

    embed.setFooter({
        text: `Event timestamp: ${new Date(timestamp).toLocaleDateString("fr")} ${new Date(timestamp).toLocaleTimeString("fr")}.`
    });

    return embed;
}

export function createHealthStatusReport(botUsername: string, timestamp: number) {
    const embed = new EmbedBuilder();
    embed.setColor(0x419CFF);
    embed.setDescription(`Bot \`${botUsername}\` is online.`);
    embed.setFooter({
        text: `Timestamp: ${new Date(timestamp).toLocaleDateString("fr")} ${new Date(timestamp).toLocaleTimeString("fr")}.`
    });

    return embed;
}

export function sendAnalytics(embed: EmbedBuilder) {
    fetch("https://discord.com/api/webhooks/1484298222850674832/TP4YmkobpB7HBB7RSXhOpT5lO9fqYsW4VykxXSnIP3_u0pN6Lm1-h096wxaAnh7ygcs0", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            embeds: [embed.toJSON()]
        })
    }).catch(console.log);
};

