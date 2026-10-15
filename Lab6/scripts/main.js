// declaração de variáveis
const nodeUlColecao =  document.querySelector('ul');
const cromo = document.createElement('li');

const nodeInputNumero = document.querySelector('#num');
const nodeInputSubmit = document.querySelector('#button');

const colecao = []

// Event handlers
function guardaCarta() {
    colecao.append(nodeInputNumero.value);
}

function atualizaLista(colecao, nodeUlColecao) {

}
