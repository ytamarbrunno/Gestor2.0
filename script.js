let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let boletos = JSON.parse(localStorage.getItem("boletos")) || [];
let saldoTotal = parseFloat(localStorage.getItem("saldoTotal")) || 0;
let entradas = parseFloat(localStorage.getItem("entradas")) || 0;
let gastos = parseFloat(localStorage.getItem("gastos")) || 0;

function formatarValor(valor) {
    return valor % 1 === 0 ? `R$ ${valor.toFixed(0)}` : `R$ ${valor.toFixed(2)}`;
}
function adicionarCliente() {
    const nome = document.getElementById("nome").value;
    const perfume = document.getElementById("perfume").value;
    const valorTotal = parseFloat(document.getElementById("valorTotal").value);
    const valorPago = parseFloat(document.getElementById("valorPago").value);

    if (!nome || !perfume || isNaN(valorTotal) || isNaN(valorPago)) {
        alert("Preencha todos os campos corretamente");
        return;
    }
    entradas += valorPago; 
    gastos += (valorTotal - valorPago); 

    saldoTotal = entradas - gastos;

    const cliente = {
        nome,
        perfume,
        valorTotal,
        valorPago
    };

    clientes.push(cliente);
    salvarDados();
    atualizarListaClientes(clientes); 
    atualizarResumo();
    limparCampos();
}

function excluirCliente(nome) {
    const index = clientes.findIndex(cliente => cliente.nome === nome);

    if (index !== -1) {
        clientes.splice(index, 1);
        salvarDados();
        recalcularResumo();
        atualizarListaClientes(clientes);
    }
}
function adicionarBoleto() {
    const boletoDescricao = document.getElementById("boletoDescricao").value;
    const boletoValor = parseFloat(document.getElementById("boleto").value);

    if (!boletoDescricao || isNaN(boletoValor) || boletoValor <= 0) {
        alert("Informe uma descrição e um valor válido para o boleto");
        return;
    }
    const boleto = {
        descricao: boletoDescricao,
        valor: boletoValor
    };
    boletos.push(boleto);
    gastos += boletoValor;
    saldoTotal = entradas - gastos;

    salvarDados();
    atualizarListaBoletos();
    atualizarResumo();
}
function atualizarListaClientes(clientesParaExibir = clientes) {
    const clientList = document.getElementById("clientList");
    clientList.innerHTML = '';
    clientesParaExibir.forEach(cliente => {
        const clienteElement = document.createElement('div');
        clienteElement.classList.add('client');
        clienteElement.innerHTML = `
            <strong>${cliente.nome}</strong> - Perfume: ${cliente.perfume} - Total: ${formatarValor(cliente.valorTotal)} - Pago: ${formatarValor(cliente.valorPago)}
            <div class="progress-bar">
                <div class="progress" style="width: ${(cliente.valorPago / cliente.valorTotal) * 100}%"></div>
            </div>
            <div class="update-section">
                <input type="number" placeholder="Novo pagamento" id="novoPagamento-${cliente.nome}">
                <button onclick="atualizarPagamento('${cliente.nome}')">Atualizar pagamento</button>
            </div>
            <button onclick="excluirCliente('${cliente.nome}')">Excluir</button>
        `;
        clientList.appendChild(clienteElement);
    });
}

function atualizarPagamento(nome) {
    const novoPagamento = parseFloat(document.getElementById(`novoPagamento-${nome}`).value);
    const cliente = clientes.find(cliente => cliente.nome === nome);

    if (isNaN(novoPagamento) || novoPagamento <= 0 || novoPagamento > cliente.valorTotal - cliente.valorPago) {
        alert("Valor inválido para pagamento");
        return;
    }

    cliente.valorPago += novoPagamento;
    entradas += novoPagamento;
    saldoTotal = entradas - gastos;
    salvarDados();
    atualizarListaClientes();
    atualizarResumo();
}
function atualizarListaBoletos() {
    const boletoList = document.getElementById("boletoList");
    boletoList.innerHTML = '';
    boletos.forEach(boleto => {
        const boletoElement = document.createElement('div');
        boletoElement.classList.add('boleto');
        boletoElement.innerHTML = `
            <strong>${boleto.descricao}</strong> - ${formatarValor(boleto.valor)}
        `;
        boletoList.appendChild(boletoElement);
    });
}
function atualizarResumo() {
    document.getElementById("entradas").innerText = `Entradas: ${formatarValor(entradas)}`;
    document.getElementById("gastos").innerText = `Gastos: ${formatarValor(gastos)}`;
    document.getElementById("saldoTotal").innerText = `Saldo Total: ${formatarValor(saldoTotal)}`;
}
function salvarDados() {
    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("boletos", JSON.stringify(boletos));
    localStorage.setItem("saldoTotal", saldoTotal.toFixed(2));
    localStorage.setItem("entradas", entradas.toFixed(2));
    localStorage.setItem("gastos", gastos.toFixed(2));
}
function limparCampos() {
    document.getElementById("nome").value = '';
    document.getElementById("perfume").value = '';
    document.getElementById("valorTotal").value = '';
    document.getElementById("valorPago").value = '';
    document.getElementById("boletoDescricao").value = '';
    document.getElementById("boleto").value = '';
}
function toggleSection(section) {
    const sections = ['clientes', 'boletos', 'resumo'];
    sections.forEach(sec => {
        document.getElementById(sec).classList.add('hidden');
    });
    document.getElementById(section).classList.remove('hidden');
}

document.getElementById("btnClientes").addEventListener("click", function() {
    toggleSection('clientes');
});

document.getElementById("btnBoletos").addEventListener("click", function() {
    toggleSection('boletos');
});

document.getElementById("btnResumo").addEventListener("click", function() {
    toggleSection('resumo');
});

toggleSection('resumo');

atualizarListaClientes();
atualizarListaBoletos();
atualizarResumo();

function pesquisarClientes() {
    const pesquisa = document.getElementById("searchCliente").value.toLowerCase();
    const clientesFiltrados = clientes.filter(cliente => cliente.nome.toLowerCase().includes(pesquisa));
    atualizarListaClientes(clientesFiltrados);
}

function resetarValores() {
    localStorage.removeItem("clientes");
    localStorage.removeItem("boletos");
    localStorage.removeItem("saldoTotal");
    localStorage.removeItem("entradas");
    localStorage.removeItem("gastos");

    clientes = [];
    boletos = [];
    saldoTotal = 0;
    entradas = 0;
    gastos = 0;

    atualizarResumo();
    atualizarListaClientes();
}

function recalcularResumo() {
    saldoTotal = 0;
    entradas = 0;
    gastos = 0;

    clientes.forEach(cliente => {
        saldoTotal += cliente.valorTotal;
        entradas += cliente.valorPago;
        gastos += (cliente.valorTotal - cliente.valorPago);
    });

    saldoTotal = entradas - gastos;
    localStorage.setItem("saldoTotal", saldoTotal.toFixed(2));
    localStorage.setItem("entradas", entradas.toFixed(2));
    localStorage.setItem("gastos", gastos.toFixed(2));

    atualizarResumo();
}
document.getElementById("excluirBoletos").addEventListener("click", function() {
    // Exclui os boletos do localStorage
    localStorage.removeItem('boletos');

    alert("Os boletos foram excluídos.");
});

