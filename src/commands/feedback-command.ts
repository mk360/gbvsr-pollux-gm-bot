import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";

const feedbackCommand = new SlashCommandBuilder();
feedbackCommand.setName("feedback");
feedbackCommand.setDescription("Share your feedback or suggestions about the GM Tracker.");

const feedback = new SlashCommandStringOption();
feedback.setName("content");
feedback.setRequired(true);
feedback.setDescription("Write your feedback or your suggestion.");

const includeUsername = new SlashCommandBooleanOption();
includeUsername.setName("username");
includeUsername.setDescription("Include your username? This will allow the dev to reach out if needed.");

feedbackCommand.addStringOption(feedback);
feedbackCommand.addBooleanOption(includeUsername);

export default feedbackCommand.toJSON();
