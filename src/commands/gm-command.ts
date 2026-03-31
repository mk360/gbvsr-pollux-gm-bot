import { SlashCommandBuilder, SlashCommandStringOption } from "discord.js";

const characterCommand = new SlashCommandBuilder();
characterCommand.setName("gm");
characterCommand.setDescription("Fetch the GM ladder for a specific character.");

const nameArg = new SlashCommandStringOption();
nameArg.setName("character");
nameArg.setRequired(true);
nameArg.setDescription("The character you want the GM ladder of. Standard and EX characters share the same ladder.");

characterCommand.addStringOption(nameArg);

export default characterCommand.toJSON();
