module.exports = {
 name:"timeout",

 async execute(message,args){

 const user = message.mentions.members.first();
 const time = args[1];

 if(!user) return;

 await user.timeout(time * 60000);

 message.channel.send(`${user.user.tag} timed out`);
 }
}