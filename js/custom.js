const telaJogo = document.getElementById('telaJogo');
const ctx = telaJogo.getContext('2d');

telaJogo.width = window.innerWidth;
telaJogo.height = window.innerHeight;

let frutas = [];
let pontos = 0;
let perdidos = 0;

const cesta = {
    x: telaJogo.width / 2 - 40,
    y: telaJogo.height - 80,
    largura: 200,
    altura: 90,
    velocidade: 20
};

const imagensFrutas = {
  red: new Image(),
  green: new Image(),
  yellow: new Image(),
  purple: new Image()
};

imagensFrutas.red.src = "../img/banana.png";
imagensFrutas.green.src = "../img/laranja.png";
imagensFrutas.yellow.src = "../img/melancia.png";
imagensFrutas.purple.src = "../img/morango.png";

const imagemCesta = new Image();
imagemCesta.src = "../img/cesta-de-piquenique.png";

const musicaFundo = new Audio("../sound/musica-fundo.mp3");
musicaFundo.volume = 0.5;
musicaFundo.loop = true;
musicaFundo.play();


const somColetado = new Audio("../sound/coleta.mp3");
const somPerdido = new Audio("../sound/perdido.mp3");
somColetado.volume = 0.7;
somPerdido.volume = 0.7;

function tocarSom(som) {
    som.currentTime = 0;
    som.play();
  }

function redimensionarCanvas() {
    telaJogo.width = window.innerWidth;
    telaJogo.height = window.innerHeight;
    cesta.x = telaJogo.width / 2 - 40;
    cesta.y = telaJogo.height - 80;
}

window.addEventListener('resize', () => {
    const frutasBackup = frutas.slice();
    redimensionarCanvas();
    frutas = frutasBackup;
});

document.addEventListener('mousemove', (event) => {
    cesta.x = event.clientX - cesta.largura / 2;
});

function criarFruta() {
    if (Math.random() < 0.02) {
        const cores = ["red", "green", "yellow", "purple"];
        const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
        frutas.push({ 
            x: Math.random() * (telaJogo.width - 20), 
            y: 0, 
            velocidade: Math.random() * 2 + 2, 
            cor: corAleatoria
        });
    }
}

function atualizarFrutas() {
    frutas.forEach(f => f.y += f.velocidade);
    
    frutas = frutas.filter(f => {
        if (f.y + 20 >= cesta.y && f.x > cesta.x && f.x < cesta.x + cesta.largura) {
            pontos += 10;
            document.getElementById('pontos').innerText = `⭐ Acertos: ${pontos}`;
            tocarSom(somColetado);
            return false;
        }
        if (f.y >= telaJogo.height) {
            perdidos++;
            document.getElementById('perdidos').innerText = `❌ Perdidos: ${perdidos}`;
            tocarSom(somPerdido);
            return false;
        }
        return true;
    });

    if (perdidos >= 10) gameOver();
}

function desenharFrutas() {
    frutas.forEach(f => {
        ctx.drawImage(imagensFrutas[f.cor], f.x - 20, f.y - 20, 40, 40);
    });
}

function desenharCesta() {
    ctx.drawImage(imagemCesta, cesta.x, cesta.y,cesta.largura, cesta.altura);
}

function loopJogo() {
    ctx.clearRect(0, 0, telaJogo.width, telaJogo.height);
    desenharCesta();
    criarFruta();
    atualizarFrutas();
    desenharFrutas();
    requestAnimationFrame(loopJogo);
}

function gameOver() {
    musicaFundo.pause();
    localStorage.setItem("pontuacao", pontos);
    window.location.href = "../html/gameover.html";
}

loopJogo();
