if(message.content.includes("http")){

 if(!message.member.permissions.has("Administrator")){
  message.delete();
  message.channel.send("Links not allowed");
 }

}

const usersMap = new Map();

client.on("messageCreate", message=>{

 if(message.author.bot) return;

 if(!usersMap.has(message.author.id)){
  usersMap.set(message.author.id,{msg:1,time:Date.now()});
 }else{

  let data = usersMap.get(message.author.id);
  data.msg++;

  if(data.msg >=5){
   message.member.timeout(60000);
   message.channel.send("Spam detected");
  }

 }

});

const mirrorChannel = "CHANNEL_ID";

client.on("messageCreate",message=>{

 if(message.channel.id === mirrorChannel){

  const target = client.channels.cache.get("TARGET_CHANNEL_ID");

  if(target){
   target.send(`${message.author.tag}: ${message.content}`);
  }

 }

});