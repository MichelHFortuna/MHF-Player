const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const cover = document.getElementById("cover")
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const like = document.getElementById("like");
const currentProgress = document.getElementById("current-progress");
const shuffle = document.getElementById("shuffle");
const progressContainer = document.getElementById("progress-container");
const repeat = document.getElementById("repeat");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");

const asYouWere = {
    songName: 'As You Were',
    artist: 'TrackTribe',
    file: 'as_you_were',
    liked: false,
}

const boomBapFlick = {
    songName: 'Boom Bap Flick',
    artist: 'Quincas Moreira',
    file: 'boom_bap_flick',
    liked: false,
}

const cantHide = {
    songName: 'Can\'t Hide',
    artist: 'Otis McDonald',
    file: 'cant_hide',
    liked: false,
}

let isPlaying = false;
let isShuffled = false;
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ??
    [asYouWere, boomBapFlick, cantHide];
let sortedPlaylist = [...originalPlaylist];
let repeatClicked = false;
let index = 0;

function playSong(){ 
    play.querySelector('i.bi').classList.remove('bi-play-circle-fill')
    play.querySelector('i.bi').classList.add('bi-pause-circle-fill')
    song.play();    
    isPlaying = true;
}

function pauseSong(){ 
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill')
    play.querySelector('.bi').classList.add('bi-play-circle-fill')
    song.pause();    
    isPlaying = false;
}

function playPauseDecider() {
    if (isPlaying === true) {
        pauseSong();
    }
    else {
        playSong();
    }
}

function likeRender() {
    if(sortedPlaylist[index].liked === true) {
        like.querySelector('.bi').classList.remove('bi-heart');
        like.querySelector('.bi').classList.add('bi-heart-fill');
        like.classList.add('button-active');
    } else {
        like.querySelector('.bi').classList.add('bi-heart');
        like.querySelector('.bi').classList.remove('bi-heart-fill');
        like.classList.remove('button-active');
    }
    }

function initializeSong() {
    cover.src = `/imagens/${sortedPlaylist[index].file}.webp`;
    song.src = `/songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeRender();
}

function previousSong() {
    if (index === 0) {
        index = sortedPlaylist.length - 1;
    }
    else {
        index -= 1
    };
    initializeSong();
    playSong();
}

function nextSong() {
    if (index === sortedPlaylist.length - 1) {
        index = 0
    }
    else {
        index += 1
    };
    initializeSong();
    playSong();
}

function updateProgress() {
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }
}

function shuffleSongs() {
    if (isShuffled === false) {
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffle.classList.add('button-active');
    } else {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffle.classList.remove('button-active');
    }
}

function repeatSong() {
    if (repeatClicked === false) {
        repeatClicked = true;
        repeat.classList.add('button-active');
    } else {
        repeatClicked = false;
        repeat.classList.remove('button-active');
    }
}

function nextOrRepeat() {
    if(repeatClicked === false) {
        nextSong();
    } 
    else {
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let minutes = Math.floor((originalNumber - hours * 3600) / 60);
    let seconds = Math.floor(originalNumber - hours * 3600 - minutes * 60);

    return `${hours.toString().padStart(2,'0')}:${minutes
        .toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeClicked() {
    if(sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true;
    } else {
        sortedPlaylist[index].liked = false;
    };
    likeRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}

initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('loadedmetadata', updateTotalTime);
song.addEventListener('ended', nextOrRepeat);
progressContainer.addEventListener('click', jumpTo);
shuffle.addEventListener('click', shuffleSongs);
repeat.addEventListener('click', repeatSong);
like.addEventListener('click', likeClicked);



