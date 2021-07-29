require('dotenv').config();

var snipeChannels = process.env.farmChannels.split(' ');

const open = require('open');
const tmi = require('tmi.js');
const client = new tmi.Client({
	options: { debug: false },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.username,
		password: process.env.password
	},
	channels: snipeChannels
});
client.connect();

client.on("connecting", (address, port) => {
    console.log(`Trying to connect to: ${address}:${port}`);
});

client.on("connected", (address, port) => {
    console.log(`Connected successfully: ${address}:${port}`);
});

client.on("disconnected", (reason) => {
    console.log(`Disconnected. Reason: ${reason}`);
});

client.on("join", (channel, username, self) => {
	if(self){
		console.log(`${username} joined the channel: ${channel}`);
	}
});

client.on('message', (channel, tags, message, self) => {
	if(self) return;
	
	if(message.toLowerCase().includes("http://") || message.toLowerCase().includes("https://")) {
		if(tags.username == channel.split("#")[1]){
			open(message);
		}
	}
});