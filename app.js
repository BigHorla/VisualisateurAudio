const audioPlayer = document.querySelector("audio");
const disque = document.querySelector(".pochette");
const suivant = document.querySelector(".suivant");
const precedent = document.querySelector(".precedent");
let musiques = [];
let musique = 0;

const selectionMusique = (musique) => {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  console.log(musique.song);
  audioPlayer.setAttribute("src", musique.song);
  console.log(musique.img);
  document.querySelector(".disqueImage").setAttribute("src", musique.img);
  document.querySelector(".vinyleStyle").style.background = musique.color;
};

fetch("music.json")
  .then((res) => res.json())
  .then((res) => {
    musiques = res.music;
    selectionMusique(musiques[musique]);
  })
  .catch((error) => console.log(`Erreur : ${error}`));

audioPlayer.addEventListener("play", () => {
  disque.classList.add("tourne");
  disque.style.animationPlayState = "running";

  const contexteAudio = new AudioContext();
  const src = contexteAudio.createMediaElementSource(audioPlayer);
  const analyseur = contexteAudio.createAnalyser();

  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");

  src.connect(analyseur);
  analyseur.connect(contexteAudio.destination);

  analyseur.fftSize = 2048;

  const frequencesAudio = analyseur.frequencyBinCount;
  //console.log(frequencesAudio);

  const tableauFrequences = new Uint8Array(frequencesAudio);

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  const largeurBarre = WIDTH / tableauFrequences.length;
  let hauteurBarre;
  let x;

  const retourneBarres = () => {
    requestAnimationFrame(retourneBarres);

    x = x_ = WIDTH / 2;

    analyseur.getByteFrequencyData(tableauFrequences);

    ctx.fillStyle = "#232323";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.font = "200px sans-serif";
    ctx.fillStyle = "#1a1a1a66";
    ctx.fillText(musiques[musique].style, 5, HEIGHT - 5);

    document.querySelector(
      ".titre"
    ).textContent = `"${musiques[musique].name}"`;

    for (let i = 0; i < frequencesAudio; i++) {
      hauteurBarre = tableauFrequences[i] + 5;

      let r = 250 - i / 2;
      let g = i / 2;
      let b = i;

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, HEIGHT, largeurBarre, -hauteurBarre);
      ctx.fillRect(x_, HEIGHT, largeurBarre, -hauteurBarre);

      x += largeurBarre + 1;
      x_ -= largeurBarre + 1;

      /* audioPlayer.style.transform = `translate(-50%,-50%) scale(${1+(1/i)})`; */
    }
  };
  retourneBarres();
});

audioPlayer.addEventListener("pause", () => {
  audioPlayer.classList.remove("playing");
  disque.style.animationPlayState = "paused";
});

suivant.addEventListener("click", () => {
  disque.classList.remove("tourne");
  disque.style.animationPlayState = "paused";
  disque.style.animationPlayState = "inherit";
  disque.style.transform = "rotate(0deg)";
  if (musique === musiques.length - 1) {
    musique = 0;
  } else {
    musique++;
  }
  selectionMusique(musiques[musique]);
});
precedent.addEventListener("click", () => {
  disque.classList.remove("tourne");
  if (musique === 0) {
    musique = musiques.length - 1;
  } else {
    musique--;
  }
  selectionMusique(musiques[musique]);
});

audioPlayer.play();
audioPlayer.pause();
