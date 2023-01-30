// This has a two way connection and was made for testing purposes
import dotenv from "dotenv";
import twilio from "twilio";
import { Client, GatewayIntentBits } from "discord.js";
import express, { urlencoded } from "express";

dotenv.config();

const app = express();
app.use(
  urlencoded({
    extended: true,
  })
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const friendsChannelId = "616445877682438187";
const myUserId = "123123123";
// 334433747145326604

function sendSMS(sms) {
  console.log("sms time");
  twilioClient.messages.create({
    body: sms,
    to: "+16782064017",
    from: "+18444583649",
  });
}

client.on("message", function (message) {
  if (message.author.bot) return;
  //   if (message.channel.id == friendsChannelId) {
  const sms = `${message.author.username}: ${message.content}`;
  console.log(sms);
  sendSMS(sms);
  //   }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.post("/sms", async (req, res) => {
  if (req.body.From != process.env.PERSONAL_NUMBER) return;
  const channel = client.channels.cache.get(friendsChannelId);
  channel.send(req.body.Body);
});

client.login(process.env.BOT_TOKEN);

export {};
