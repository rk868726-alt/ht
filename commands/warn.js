const mongoose = require("mongoose");

const warnSchema = new mongoose.Schema({
 userId:String,
 guildId:String,
 warns:Number
});

const Warn = mongoose.model("warns",warnSchema);

module.exports = {
 name:"warn",

 async execute(message,args){

 const user = message.mentions.users.first();

 if(!user) return message.reply("Mention user");

 let data = await Warn.findOne({
  userId:user.id,
  guildId:message.guild.id
 });

 if(!data){
  data = new Warn({
   userId:user.id,
   guildId:message.guild.id,
   warns:1
  });
 }else{
  data.warns +=1;
 }

 await data.save();

 message.channel.send(`${user.tag} warned. Total warns: ${data.warns}`);
 }
}