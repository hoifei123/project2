var displayName;
var currentChannel;
var channelList=[];

document.addEventListener('DOMContentLoaded',()=>{

  //check if nickname is in starage, if not, prompt to create one
  var socket=io.connect(location.protocol + "//" + document.domain +":" +location.port);

  socket.on('connect',()=>{
    socket.send("Socket connected");
  });

  //get existing channel names once socket connected and update webpage

  socket.on('populate channels', rooms =>{
    var ch=rooms.rooms;
    for (room in rooms.rooms){

      channelList[channelList.length]=ch[room];
      createChannelItem(ch[room]);
    }


  });


  if (!localStorage.getItem('nickname')){

    displayName=prompt('Please enter your nickname: ');
    localStorage.setItem('nickname',displayName);

  }else{
    displayName=localStorage.getItem('nickname');
  }

  document.querySelector('#nickname').innerHTML="Hello, " + displayName;

  //Create new channel
  document.querySelector('#create_new_channel').onsubmit=()=>{
      //create new channel if channel not exist

      const channel_name=document.querySelector('#new_channel').value;
      console.log(channel_name);
      if (channelList.includes(channel_name)){
        alert("Channel already exists");

      }else{
        socket.emit('create room', {'username': displayName, 'room':channel_name});

      }
      document.querySelector('#new_channel').value="";


  };

  
  socket.on('add channel', data =>{
      const channel_name=data.room;
      channelList[channelList.length]=channel_name;

      createChannelItem(channel_name);

    });


  function createChannelItem(room){
    const b = document.createElement('li');
    b.innerHTML=room;
    b.setAttribute('class','channel');
    b.onclick=()=>{
      console.log(b.innerHTML);
    };
    document.querySelector('#channel_list').append(b);

  }

  //enter and leave channel
  document.querySelectorAll('.channel').forEach(p=>{
    p.onclick = ()=>{

      console.log(p.innerHTML);
    };
  });



});
