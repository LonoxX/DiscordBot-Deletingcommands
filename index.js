const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Client, GatewayIntentBits, Partials, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildVoiceStates],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember],
});

const rest = new REST({ version: "9" }).setToken(token);

async function removeSlashCommands(type) {
  switch (type) {
    case "guild":
      rest
        .put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
        .then(() => {
          console.log("Successfully deleted all guild commands.");
        })
        .catch(console.error);
      break;
    case "global":
      rest
        .put(Routes.applicationCommands(clientId), { body: [] })
        .then(() => {
          console.log("Successfully deleted all global commands.");
        })
        .catch(console.error);
      break;
    default:
      console.log("Invalid type");
  }
}

client.once("ready", async () => {
  const arg = process.argv[2];
  if (arg) {
    await removeSlashCommands(arg.toLowerCase());
  } else {
    console.log("Please provide a type as an argument (guild/global) to delete all slash commands.");
  }
  client.destroy();
});

client.login(token);
