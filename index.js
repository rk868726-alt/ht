const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const fs = require("fs");

const config = require("./config.json");
let prefixes = require("./prefix.json");
let warns = require("./warns.json");

const mirrorChannel = "SOURCE_CHANNEL_ID";
const targetChannel = "TARGET_CHANNEL_ID";

if (message.channel.id === mirrorChannel) {

 const channel = client.channels.cache.get(targetChannel);

 if (channel) {
  channel.send(`${message.author.tag}: ${message.content}`);
 }

}

const client = new Client({
 intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers
 ]
});

client.on("ready", () => {
 console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {

 if (message.author.bot) return;

 let prefix = prefixes[message.guild.id] || config.prefix;

 // Anti Link
 if (message.content.includes("http")) {
  if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
   message.delete();
   message.channel.send("Links are not allowed here");
  }
 }

 // Auto responder
 if (message.content.toLowerCase() === "hello") {
  message.reply("Hi there 👋");
 }

 if (!message.content.startsWith(prefix)) return;

 const args = message.content.slice(prefix.length).trim().split(/ +/);
 const cmd = args.shift().toLowerCase();

 // SET PREFIX
 if (cmd === "setprefix") {

  if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
   return message.reply("Admin only");

  let newPrefix = args[0];

  prefixes[message.guild.id] = newPrefix;

  fs.writeFileSync("./prefix.json", JSON.stringify(prefixes, null, 2));

  message.channel.send(`Prefix changed to ${newPrefix}`);
 }

 // BAN
 if (cmd === "ban") {

  if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
   return;

  let user = message.mentions.members.first();
  if (!user) return message.reply("Mention user");

  await user.ban();

  message.channel.send(`${user.user.tag} banned`);
 }

 // WARN
 if (cmd === "warn") {

  let user = message.mentions.users.first();
  if (!user) return;

  if (!warns[user.id]) warns[user.id] = 0;

  warns[user.id] += 1;

  fs.writeFileSync("./warns.json", JSON.stringify(warns, null, 2));

  message.channel.send(`${user.tag} warned (${warns[user.id]} warns)`);
 }

 // TIMEOUT
 if (cmd === "timeout") {

  if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
   return;

  let user = message.mentions.members.first();
  let minutes = args[1];

  if (!user) return;

  await user.timeout(minutes * 60000);

  message.channel.send(`${user.user.tag} timed out for ${minutes} minutes`);
 }

});

client.login(config.token);
