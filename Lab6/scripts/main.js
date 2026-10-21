// Declaração de variáveis
if ( !localStorage.getItem('colecaoPrime') ) {
    localStorage.setItem('colecaoPrime', '[]')
}
if ( !localStorage.getItem('colecaoRep') ) {
    localStorage.setItem('colecaoRep', '[]')
}
if (localStorage.getItem('count') === null) {
    localStorage.setItem('count', '0');
}

let colecaoPrime = JSON.parse(localStorage.getItem('colecaoPrime'));
let colecaoRep = JSON.parse(localStorage.getItem('colecaoRep'));
let count = Number(localStorage.getItem('count'));

const nodeUlColecaoPrime = document.querySelector('#colecao #primeiras');
const nodeUlColecaoRep = document.querySelector('#colecao #repetidas');
const nodeInputNumero = document.querySelector('#num');
const nodeRegistar = document.querySelector('#button');
const nodeRemove = document.querySelector('#remove');
const nodeTotalCromos = document.querySelector('#total-cromos');

// Event handlers
function atualizaLista(colecao, nodeUlColecao) {
    // limpar a lista de cromos
    nodeUlColecao.innerHTML = '';
    // nova lista de cromos
    colecao.forEach(numero => {
        const li = document.createElement('li');
        if (Array.isArray(numero)) {
            li.textContent = `Cromo nº ${numero[0]} (Nº total: ${numero[1]})`;
        } else {
            li.textContent = `Cromo nº ${numero}`;
        }
        nodeUlColecao.appendChild(li);
    });
    // não é total é unicos
    nodeTotalCromos.textContent = count;
}

function guardaCarta(event) {
    // para não recarreguar a página
    event.preventDefault();
    const valor = Number(nodeInputNumero.value);

    if (nodeInputNumero.value !== '') {
        if (colecaoPrime.includes(valor)) {
            const repEncontrado = colecaoRep.find(item => item[0] === valor);

            if (repEncontrado) {
                repEncontrado[1]++;
            } else {
                // guardar o valor na colecao de repetidos, ordenar
                colecaoRep.push([valor, 2]);
                colecaoRep.sort((a, b) => a[0] - b[0]);
            }

            localStorage.setItem('colecaoRep', JSON.stringify(colecaoRep));
            // atualizar a interface dos repetidos
            count++;
            localStorage.setItem('count', count);
            atualizaLista(colecaoRep, nodeUlColecaoRep);
        } else {
            // guardar o valor na colecao, ordenar
            colecaoPrime.push(valor);
            colecaoPrime.sort((a, b) => a - b);

            localStorage.setItem('colecaoPrime', JSON.stringify(colecaoPrime));
            // atualizar a interface principal
            count++;
            localStorage.setItem('count', count);
            atualizaLista(colecaoPrime, nodeUlColecaoPrime);
        }
        // limpa o input
        nodeInputNumero.value = '';
        nodeInputNumero.focus();
    }
}

function removeCarta(event) {
    // para não recarreguar a página
    event.preventDefault();
    const valor = Number(nodeInputNumero.value);

    if (nodeInputNumero.value !== '') {
        const repEncontrado = colecaoRep.find(item => item[0] === valor);
        if(repEncontrado) {

            if(repEncontrado[1] === 2) {
                colecaoRep.splice(colecaoRep.indexOf(repEncontrado), 1);
            } else {
                repEncontrado[1]--;
            }

            localStorage.setItem('colecaoRep', JSON.stringify(colecaoRep));
            // atualizar a interface dos repetidos
            count--;
            localStorage.setItem('count', count);
            atualizaLista(colecaoRep, nodeUlColecaoRep);
        } else if(colecaoPrime.includes(valor)) {
            colecaoPrime.splice(colecaoPrime.indexOf(valor), 1);

            localStorage.setItem('colecaoPrime', JSON.stringify(colecaoPrime));
            // atualizar a interface principal
            count--;
            localStorage.setItem('count', count);
            atualizaLista(colecaoPrime, nodeUlColecaoPrime);
        }
        // limpa o input
        nodeInputNumero.value = '';
        nodeInputNumero.focus();
    }
}

// Event listeners
nodeRegistar.addEventListener('click', guardaCarta);
nodeRemove.addEventListener('click', removeCarta);

// Inicialização da aplicação
atualizaLista(colecaoPrime, nodeUlColecaoPrime);
atualizaLista(colecaoRep, nodeUlColecaoRep);
