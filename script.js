console.log("Hello world");
let currentSong=new Audio();
let songs;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/spotify/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("[iSongs.info]%20")[1]);
    }
  }
  let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("ul")[0]
  songUL.innerHTML="";

for (const song of songs) {
  songUL.innerHTML =
    songUL.innerHTML +
    `
      <li>
      <img src="./images/music.svg" alt="" class="invert">
      <div class="info">
          <div>${song
            .replaceAll("%20", " ")
            } </div>
          <div>VVRS TEJA</div>
      </div>
      <div class="playnow">
          <span>Play Now</span>
          <img src="./images/play.svg" alt="" class="invert">
      </div>            
  </li> `;
}

Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
  console.log(e.querySelector(".info").firstElementChild.innerHTML)
  e.addEventListener("click", element => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

  })
})
}

const playMusic=(track,pause=false)=>{
    //let audio=new Audio("/spotify/songs/[iSongs.info]%20"+track);
    currentSong.src=`/spotify/songs/[iSongs.info]%20`+track;
    if(!pause){
         currentSong.play();
        play.src="./images/pause.svg"
    }
   
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}






async function main() {

   await getSongs("/songs/");
  console.log(songs);
  playMusic(songs[0], true)

play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="./images/pause.svg"
    }
    else{
        currentSong.pause();
        play.src="./images/play.svg"
    }
})

currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
})

document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    console.log(percent);
    console.log(e.offsetX)
    console.log(e.target.getBoundingClientRect().width)
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
    console.log(currentSong.currentTime)
})

document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0";

})
document.querySelector(".closeit").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
        document.querySelector(".left").style.transition="all .75s ease-out"; 
})
previous.addEventListener("click",()=>{
    let index=songs.indexOf(currentSong.src.split("[iSongs.info]%20").slice(-1)[0])

    if((index-1)>=0){
        playMusic(songs[index-1]);
    }

})

next.addEventListener("click",()=>{
    currentSong.pause();
     let index=songs.indexOf(currentSong.src.split("[iSongs.info]%20").slice(-1)[0])
     console.log(currentSong.src.split("[iSongs.info]%20").slice(-1)[0])
     console.log(currentSong)
     console.log(songs)
    console.log(index)
    if((index+1)<songs.length){
        playMusic(songs[index+1]);
    }
})

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume=parseInt(e.target.value)/100
})

document.querySelector(".songList").style.display="none";
let b=document.querySelector(".card").addEventListener("click",(e)=>{

    playMusic(songs[0]);
    document.querySelector(".songList").style.display="block";

})




}

main();
