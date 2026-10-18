// Declaração de variáveis
const nodeUlColecaoPrime = document.querySelector('#colecao #primeiras');
const nodeUlColecaoRep = document.querySelector('#colecao #repetidas');
const nodeInputNumero = document.querySelector('#num');
const nodeForm = document.querySelector('form');
const nodeTotalCromos = document.querySelector('#total-cromos');

const colecaoPrime = [];
const colecaoRep = [];

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
    nodeTotalCromos.textContent = colecaoPrime.length;
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
            // atualizar a interface dos repetidos
            atualizaLista(colecaoRep, nodeUlColecaoRep);
        } else {
            // guardar o valor na colecao, ordenar
            colecaoPrime.push(valor);
            colecaoPrime.sort((a, b) => a - b);
            // atualizar a interface principal
            atualizaLista(colecaoPrime, nodeUlColecaoPrime);
        }
        // limpa o input
        nodeInputNumero.value = '';
        nodeInputNumero.focus();
    }
}
// Event listeners
nodeForm.addEventListener('submit', guardaCarta);
