require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    ,
    GatewayIntentBits.GuildMembers,
  ],
});
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const friendsChannelId = "616445877682438187";
const myUserId = "123123123";

function sendSMS(sms) {
  twilio.messages.create({
    body: sms,
    to: process.env.PERSONAL_NUMBER,
    from: process.env.TWILIO_NUMBER,
  });
}

client.on("messageCreate", function (message) {
  if (message.author.bot) return;
  if (message.channel.id == friendsChannelId && message.author.id != myUserId) {
    const sms = `${message.author.username}: ${message.content}`;
    sendSMS(sms);
  } else if (message.mentions.members.has(myUserId)) {
    const sms = `${message.author.username} mentioned you in ${message.channel.name}: ${message.content}`;
    sendSMS(sms);
  }
});

client.login(process.env.BOT_TOKEN);
