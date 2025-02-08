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
    altura: 40,
    velocidade: 20
};

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
            return false;
        }
        if (f.y >= telaJogo.height) {
            perdidos++;
            document.getElementById('perdidos').innerText = `❌ Perdidos: ${perdidos}`;
            return false;
        }
        return true;
    });

    if (perdidos >= 10) gameOver();
}

function desenharFrutas() {
    frutas.forEach(f => {
        ctx.beginPath();
        ctx.fillStyle = f.cor;  
        ctx.arc(f.x, f.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}


function desenharCesta() {
    ctx.fillStyle = "brown";
    ctx.fillRect(cesta.x, cesta.y, cesta.largura, cesta.altura);
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
    localStorage.setItem("pontuacao", pontos);
    window.location.href = "../html/gameover.html";
}

loopJogo();
