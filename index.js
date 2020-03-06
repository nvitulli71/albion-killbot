const Discord = require("discord.js");
const moment = require("moment");
const events = require("./queries/events");
const guilds = require("./queries/guilds");
const messages = require("./messages");

// TODO: Configure this
const PLAYER_IDS = [];
const GUILD_IDS = ["m1HVpwomTMiAJKxwopwIpQ"]; // Black River
const ALLIANCE_IDS = [];

const token = process.env.TOKEN;
if (!token) {
  console.log(
    "Please define TOKEN environment variable with the discord token."
  );
  process.exit(0);
}
const client = new Discord.Client();

const scanEvents = async () => {
  // TODO: Configure channel
  const channel = client.channels.find(c => c.name === "geral");

  const newEvents = await events.getEvents(PLAYER_IDS, GUILD_IDS, ALLIANCE_IDS);
  newEvents.forEach(event => {
    channel.send(messages.embedEvent(event));
  });
};

const scanRanking = async () => {
  // TODO: Configure channel
  const channel = client.channels.find(c => c.name === "geral");

  GUILD_IDS.forEach(async guildId => {
    const rankings = await guilds.getGuildRankings(guildId);
    channel.send(messages.embedRankings(rankings));
  });
};

client.on("ready", () => {
  console.log(`Connected successfully as ${client.user.tag}`);
  setInterval(scanEvents, 30000);

  let millisTill12 =
    moment()
      .hour(12)
      .minute(0)
      .second(0) -
    moment() +
    1;
  if (millisTill12 < 0) {
    millisTill12 += 86400000;
  }
  setTimeout(function() {
    scanRanking();
  }, millisTill12);
});

client.on("message", msg => {
  if (msg.content === "test") {
    const channel = client.channels.find(c => c.name === "geral");
    channel.send(messages.embedRankings(null));
  }
});

client.login(token);