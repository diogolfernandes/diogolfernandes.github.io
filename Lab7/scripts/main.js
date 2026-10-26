// A. Estado e variáveis com referência de elementos do DOM
const containerProdutos = document.querySelector("#produtos div");

// B. Funções utilitárias
function criarProduto(produto) {
  const article = document.createElement("article");
  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;

  const descricao = document.createElement("p");
  descricao.textContent = produto.description;

  const preco = document.createElement("p");
  preco.textContent = `Preço: ${produto.price} €`;

  const botao = document.createElement("button");
  botao.textContent = "+ Adicionar ao Cesto";

  // Inserir todos os elementos no <article>
  article.append(titulo, imagem, preco, descricao, botao);
  return article;
}

// C. Event handlers
function renderizarProdutos(produtos) {
  containerProdutos.innerHTML = "";

  produtos.forEach((produto) => {
    // para verificação, não ligar
    console.log(produto.title);
    console.log(produto);

    const artigoProduto = criarProduto(produto);
    containerProdutos.append(artigoProduto);
  });
}

// D. Event Listeners

// E. Inicialização
if (typeof produtos !== "undefined") {
  renderizarProdutos(produtos);
} else {
  console.error("A lista 'produtos' não foi encontrada. Certifique-se de que o ficheiro produtos.js está a carregar a variável corretamente.");
}
