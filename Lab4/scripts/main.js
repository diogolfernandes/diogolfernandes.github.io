// 1. Passagem
const passagem = document.querySelector("#passagem");
const mainContent = document.querySelector("#main-content");

const textoOriginal = passagem.textContent;

passagem.addEventListener("mouseover", () => {
    passagem.textContent = "1. Obrigado por passares!";
    mainContent.classList.add("img-meme");
});

passagem.addEventListener("mouseout", () => {
    passagem.textContent = textoOriginal;
    mainContent.classList.remove("img-meme");
});

// 4. Contador
let count = 0;
const botaoConta = document.querySelector("#contar");
const spanContador = document.querySelector("span");

botaoConta.addEventListener("click", () => {
    count++;
    spanContador.textContent = count;
});

