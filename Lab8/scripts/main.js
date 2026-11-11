// A. Estado e variáveis
//-produtos e cesto
const containerProdutos = document.querySelector("#produtos div");
const containerCesto = document.querySelector("#cesto div");
const containerCustoTotal = document.querySelector("#cesto span");
//-filtros
const containerFiltrar = document.querySelector("#filtrar");
const containerOrdenar = document.querySelector("#ordenar");
const containerProcurar = document.querySelector("#procurar");
//-comprar
const containerBox = document.querySelector("#box");
const containerText = document.querySelector("#text");
const containerComprar = document.querySelector("#comprar");
const containerInfo = document.querySelector("#infoDeCompra");

let listaProdutos = [];
let listaCategorias = [];

// para local storage
if(!localStorage.getItem('cesto')) {
  localStorage.setItem('cesto', JSON.stringify([]));
}

// Fetchs
// Get de produtos
fetch("https://deisishop.pw.deisi.ulusofona.pt/products")
.then(Response => Response.json())
.then(listaP => {
  listaProdutos = listaP;
  renderizarProdutos(listaP);
})

// Get categorias
fetch("https://deisishop.pw.deisi.ulusofona.pt/categories")
.then(Response => Response.json())
.then(listaC => {
  listaCategorias = listaC;
  listarCategorias(listaC);
})

// Z. Funções que não sei para onde vão

// B. Funções utilitárias
// Produtos
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

  article.append(titulo, imagem, preco, descricao, botao);
  return article;
}

// filtrar, ordenar e procurar produtos
function atualizarProdutos() {
  const categoria = containerFiltrar.value;
  const ordem = containerOrdenar.value;
  const pesquisa = containerProcurar.value.toLowerCase();

  let listaP = [...listaProdutos];

  // Filtrar
  if (categoria !== "0") {
    const nomeCategoria = listaCategorias.find(cat => cat.id == categoria).name;
    listaP = listaP.filter(produto => produto.category === nomeCategoria);
  }

  // Ordenar
  if (ordem === "1") {
    listaP.sort((a, b) => b.price - a.price);
  } else if (ordem === "2") {
    listaP.sort((a, b) => a.price - b.price);
  }

  // Procurar
  if (pesquisa !== "") {
    listaP = listaP.filter(produto =>
      produto.title.toLowerCase().includes(pesquisa)
    );
  }

  renderizarProdutos(listaP);
}

// Cesto
function criarCesto(produto, index) {
  const itemCesto = document.createElement("article");
  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;

  const preco = document.createElement("p");
  preco.textContent = `Custo total: ${Number(produto.price)} €`;

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

  cesto.push(produto);
  localStorage.setItem('cesto', JSON.stringify(cesto));
  renderizarCesto();
}

function removerDoCesto(index) {
  let cesto = JSON.parse(localStorage.getItem('cesto'));

  cesto.splice(index, 1);
  localStorage.setItem('cesto', JSON.stringify(cesto));
  renderizarCesto();
}

// Compras
function executarCompra() {
  const cesto = JSON.parse(localStorage.getItem('cesto'));

  fetch("https://deisishop.pw.deisi.ulusofona.pt/buy", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      "products": cesto.map(produto => produto.id),
      "student": false,
      "coupon": "",
      "name": ""
    })
  })
  .then(response => response.json())
  .then(data => {
    renderizarCompra(data.totalCost, data.reference);

  })
  .catch(erro => {
    console.error("Erro na compra:", erro);
  });

}

// Valor final a pagar (com eventuais descontos): {preço} €
// Referencia de pagamento: {referencia} €

// C. Event handlers
// Produtos
function renderizarProdutos(produtos) {
  containerProdutos.innerHTML = "";

  produtos.forEach((produto) => {
    const artigoProduto = criarProduto(produto);
    containerProdutos.append(artigoProduto);
  });
}

// Cesto
function renderizarCesto() {
  const cesto = JSON.parse(localStorage.getItem('cesto'));

  containerCesto.innerHTML = "";

  if (cesto.length === 0) {
    containerCesto.innerHTML = "<p>O cesto está vazio.</p>";
    containerCustoTotal.textContent = "0.00";
    return;
  }

  cesto.forEach((produto, index) => {
    const itemCesto = criarCesto(produto, index);
    containerCesto.append(itemCesto);
  });

  // Preço
  const custoTotal = cesto.reduce((total, produto) => {
    return total + Number(produto.price);
  }, 0);

  containerCustoTotal.textContent = custoTotal;
}

// Categorias
function listarCategorias(listaP) {
  listaP.forEach((categoria) => {
    const option = document.createElement("option");
    option.textContent = categoria.name;
    option.value = categoria.id;

    containerFiltrar.append(option);
  });
}

// Compras
function renderizarCompra( custoTotal, referencia) {
  containerInfo.innerHTML = "";

  const p1 = document.createElement('p');
  p1.textContent = "Valor final a pagar (com eventuais descontos): "+custoTotal+" €";
  const p2 = document.createElement('p');
  p2.textContent = "Referencia de pagamento: "+referencia+" €";
  containerInfo.append(p1, p2);
}

// D. Event Listeners
containerFiltrar.addEventListener('change', atualizarProdutos);
containerOrdenar.addEventListener('change', atualizarProdutos);
containerProcurar.addEventListener('input', atualizarProdutos);
containerComprar.addEventListener('click', executarCompra);

// E. Inicialização
renderizarCesto();
