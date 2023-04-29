/*
	Hello! I usually don't use many comments in my code, but because I'm collaborating on this with Molotov, I'll be adding a few comments to help him understand what this code does.
		- Shostakovich
*/

const Discord = require("discord.js"); // This imports discord.js, which is used to communicate with the Discord API.
const express = require("express"); // This imports express, which is used to run a web server, which is used to keep the bot online.
const client = new Discord.Client({intents:65535}); // Creates a new client object with all of the intents (so that we don't need to keep track of intents).
var fs = require('fs'); // Imports fs, which allows the js file to access the other files it needs.
client.on("ready", () => { // Once the bot logs in, it does this stuff
	console.log("LeninBot logged in as " + client.user.tag);
	newLogEntry("LeninBot logged in as " + client.user.tag);
});
const server = express(); // Creates a server using express
server.get('/', (request, response) => { // Whenever the server receives a request, it responds.
	return response.sendFile('index.html', { root: '.' });
});
server.listen(80, () => {console.log("Server listening");}); // The server listens to port 80, which is the HTTP port.
function newLogEntry(data) { // pretty self-explanatory
	let d = new Date();
	let newValue = "\n[" + d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds() + "] " + data;
	fs.appendFileSync('log.txt', newValue, 'utf-8');
}
function pLevel(id) { // Returns the permission level of a user from the ID. The code is self-explanatory.
	let elevatedPermissions = ["792895538135171124", "880354058270031894", "726917386858528850"]; // Shostakovich, Molotov, Morning (remember, all comrades are equal, some are just more equal than others)
	let permissionLevels = [10, 10, 8]; // 10: can do anything, 9: can use non-harmful commands, 8: can use some debug commands
	return ((elevatedPermissions.indexOf(id) != -1) ? (permissionLevels[elevatedPermissions.indexOf(id)]) : 0);
}
function pCheck(id, level) {
	return (pLevel(id) >= level);
}
newLogEntry("LeninBot started");
const prefix = "!";
client.on("messageCreate", msg => { // Whenever a message is sent, the callback is run.
	try { // try ... catch tries something and usually catches an exception if one is thrown. Sometimes the exception still slips through, though...
		if(!msg.author.bot) { // Ignores any message from a bot.
			if (msg.content.substr(0, prefix.length) == prefix) { // If the message starts with the prefix...
				let args = msg.content.substr(prefix.length).split(' ');
				let cmd = args[0];
				let id = msg.author.id;
				args.shift();
				switch(cmd) { // Checks which command is being used.
					case 'say':
						newLogEntry(msg.author.tag + " used the \"say\" command with argument " + msg.content.substr(prefix.length + 4));
						if(msg.content.length - prefix.length + 3 + msg.author.tag.length < 2001 && msg.content.substr(prefix.length + 4)) { // If the message doesn't go over the message length limit, and the message exists
							msg.channel.send(msg.author.tag + " says: " + msg.content.substr(prefix.length + 4));
							newLogEntry("The command by " + msg.author.tag + " completed successfully");
						} else {
							msg.reply("Chances are that you tried to crash me. This is a game of clever ingenuity that may end very badly."); // Note to self: code it so that trying to crash the bot like this causes the police to be sent to the user's house.
							newLogEntry("The command by " + msg.author.tag + " failed, message too large or invalid");
						}
					break;
					case "help":
						newLogEntry(msg.author.tag + " used the \"help\" command");
						{
							msg.channel.send({embeds:[{ // Sends an embed
								title:"LeninBot help",
								description: msg.author.username + " requested assistance. The commands that may be used are as follows:",
								fields:[
									{name: "help", value: "The purpose of this command is known to the one reading this."},
									{name: "say", value: "You may not tell me to say anything. But... I'll allow it... for now."},
									{name: "eval", value: "This command causes LeninBot to execute some Javascript. You need authorisation level 9 for this."},
									{name: "viewlog", value: "LeninBot records a comprehensive list of commands."}
								],
								color: 0xe61700, 
								footer:{text:"LeninBot by Molotov and Shostakovich (but mostly by Shostakovich)."}, // I need my credit.
								timestamp:(new Date())
							}]});
						}
						newLogEntry("The command by " + msg.author.tag + " completed successfully");
					break;
					case "eval":
						newLogEntry(msg.author.tag + " used the \"eval\" command with argument \"" + args.join(" ") + "\"");
						if(pCheck(id, 9)) {
							newLogEntry(msg.author.tag + " passed the authentication for the command");
							let command = args.join(" ").toLowerCase();
							if(command.indexOf("env") != -1 && !pCheck(id, 10)) { // A series of checks to make sure that the command executed can harm the bot. People with permission level 10 can still run the commands.
								msg.reply("The command contained a blacklisted word (env) and cannot be run.");
								newLogEntry("The command was not run because it contained the word env. This is a game of clever ingenuity that may end very badly.");
							} else if (command.indexOf("token") != -1 && !pCheck(id, 10)) {
								msg.reply("The command contained a blacklisted word (token) and cannot be run.");
								newLogEntry("The command was not run because it contained the word token. This is a game of clever ingenuity that may end very badly.");
							} else if (command.indexOf("fs") != -1 && !pCheck(id, 10)) {
								msg.reply("The command contained a blacklisted term (fs) and cannot be run.");
								newLogEntry("The command was not run because it contained the term fs. This is a game of clever ingenuity that may end very badly.");
							} else if (command.indexOf("exec") != -1 && !pCheck(id, 10)) {
								msg.reply("The command contained a blacklisted command (exec) and cannot be run.");
								newLogEntry("The command was not run because it contained the command exec. This is a game of clever ingenuity that may end very badly.");
							} else if (command.indexOf("client") != -1 && !pCheck(id, 10)) {
								msg.reply("The command contained a blacklisted word (client) and cannot be run.");
								newLogEntry("The command was not run because it contained the word client. This is a game of clever ingenuity that may end very badly.");
							} else if (command.indexOf("process") != -1 && !pCheck(id, 10)) {
								msg.reply("The command contained a blacklisted word (process) and cannot be run.");
								newLogEntry("The command was not run because it contained the word process. This is a game of clever ingenuity that may end very badly.");
							} else {
								newLogEntry("The eval command is about to be run");
								try {
									eval(args.join(" "));
									newLogEntry("The command by " + msg.author.tag + " completed successfully");
								} catch (error) {
									newLogEntry("An exception occured during " + msg.author.tag + "'s command.");
									msg.reply(error.toString());
								}
							}
						} else {
							msg.reply("You are unauthorised to use the eval command. Your authorisation level is " + pLevel(id) + ", but the minimum required for this action is 9. I will be keeping an eye on you.");
							newLogEntry(msg.author.tag + " attempted to use the \"eval\" command without authorisation");
						}
					break;
					case "viewlog":
						newLogEntry(msg.author.tag + " used the \"viewlog\" command");
						if(!args[0]) { // If there is no argument
							newLogEntry("The command by " + msg.author.tag + " had no arguments");
							msg.reply({files:["log.txt"]}); // Sends the log as a message attachment
							newLogEntry("The command by " + msg.author.tag + " completed successfully");
						} else {
							if(!isNaN(parseInt(args[0]))) { // If the argument is a number
								newLogEntry("The command by " + msg.author.tag + " had argument " + args[0]);
								let log = (fs.readFileSync("log.txt", "utf-8")).split("\n"); // Stores the log as an array (note that there is a limit to variable size, so this can be problematic)
								log = log.slice(log.length - parseInt(args[0])); // Only keeps the number of entries the user asked for
								log = log.join("\n"); // Turns the log array back into a string with the appropriate newline characters
								fs.writeFileSync("partlog.txt", log, "utf-8"); // Writes the part of the log into a file to attach
								msg.channel.send({files:["partlog.txt"]}); // Attaches the part of the log to a message and sends it
							} else {
								msg.reply("The argument you have inputted is not a number or other valid argument.")
							}
						}
					break;
				}
			}
		}
	} catch (err) {
		msg.reply(err.toString());
	}
});
client.login(process.env.TOKEN);