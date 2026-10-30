// A. Estado e variáveis
const containerProdutos = document.querySelector("#produtos div");
const containerCesto = document.querySelector("#cesto div");
const containerCustoTotal = document.querySelector("#cesto span");
const containerFiltrar = document.querySelector("#filtrar");

// para local storage
if(!localStorage.getItem('cesto')) {
  localStorage.setItem('cesto', JSON.stringify([]));
}
if(!localStorage.getItem('custoTotal')) {
  localStorage.setItem('custoTotal', 0);
}

// Fetchs
// Get de produtos
fetch("https://deisishop.pw.deisi.ulusofona.pt/products")
.then(Response => Response.json())
.then(listaP => {
  // Lista de produtos
  renderizarProdutos(listaP);
})

// Get categorias
fetch("https://deisishop.pw.deisi.ulusofona.pt/categories")
.then(Response => Response.json())
.then(listaC => {
  // Lista de categorias
  listarCategorias(listaC);
})


// Z. Funções que não sei para onde vão
// onChange das categorias

containerFiltrar.addEventListener('change', filtrarPorCategoria);

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
  preco.textContent = `Custo total: ${produto.price} €`;

  const botao = document.createElement("button");
  botao.textContent = "+ Adicionar ao Cesto";
  botao.addEventListener("click", () => { adicionarCesto(produto);});

  // Inserir todos os elementos no <article>
  article.append(titulo, imagem, preco, descricao, botao);
  return article;
}

function criarCesto(produto, index) {
  const itemCesto = document.createElement("article");
  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;

  const preco = document.createElement("p");
  preco.textContent = `Custo total: ${produto.price} €`;

  // Botão para remover do cesto
  const buttonRemover = document.createElement("button");
  buttonRemover.textContent = "Remover";
  buttonRemover.addEventListener("click", () => {
    removerDoCesto(index);
  });

  itemCesto.append(titulo, imagem, preco, buttonRemover);

  return itemCesto;
}

function adicionarCesto(produto) {
  let cesto = JSON.parse(localStorage.getItem('cesto'));
  let custoTotal = JSON.parse(localStorage.getItem('custoTotal'));

  cesto.push(produto);
  custoTotal += produto.price;

  localStorage.setItem('cesto', JSON.stringify(cesto));
  localStorage.setItem('custoTotal', custoTotal);
  // Atualizar a interface do cesto
  renderizarCesto();
}

function removerDoCesto(index) {
  let cesto = JSON.parse(localStorage.getItem('cesto'));
  let custoTotal = JSON.parse(localStorage.getItem('custoTotal'));

  custoTotal -= cesto[index].price;
  cesto.splice(index, 1);

  localStorage.setItem('cesto', JSON.stringify(cesto));
  localStorage.setItem('custoTotal', custoTotal);
  // Atualizar a interface do cesto
  renderizarCesto();
}

// C. Event handlers
function renderizarProdutos(produtos) {
  containerProdutos.innerHTML = "";

  produtos.forEach((produto) => {
    const artigoProduto = criarProduto(produto);
    containerProdutos.append(artigoProduto);
  });
}

function renderizarCesto() {
  const cesto = JSON.parse(localStorage.getItem('cesto'));
  const custoTotal = JSON.parse(localStorage.getItem('custoTotal'));

  containerCesto.innerHTML = "";

  if (cesto.length === 0) {
    containerCesto.innerHTML = "<p>O cesto está vazio.</p>";
    containerCustoTotal.textContent = "0.00";
    return;
  }

  // Criar produtos dentro do cesto
  cesto.forEach((produto, index) => {
    const itemCesto = criarCesto(produto, index);
    containerCesto.append(itemCesto);
  });

  // Atualizar o custo total no HTML
  containerCustoTotal.textContent = custoTotal;
}

function listarCategorias(listaP) {
  listaP.forEach((categoria) => {
    const option = document.createElement("option");
    option.textContent = categoria.name;
    option.value = categoria.id;

    containerFiltrar.append(option);
  });
}

// D. Event Listeners

// E. Inicialização
renderizarCesto();
