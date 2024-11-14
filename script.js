// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAm93CDQuHJplGRwJ1Lw39AnJBTe00CtJ8",
    authDomain: "gestor-931ba.firebaseapp.com",
    projectId: "gestor-931ba",
    storageBucket: "gestor-931ba.firebasestorage.app",
    messagingSenderId: "886496160480",
    appId: "1:886496160480:web:d436fa33ba00331e273e85",
    measurementId: "G-P1GLLDHF99"
  };
  
  // Inicialize o Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Função para mostrar a seção de clientes
  function mostrarClientes() {
      document.getElementById("clientes").classList.remove("hidden");
      document.getElementById("boletos").classList.add("hidden");
      document.getElementById("resumo").classList.add("hidden");
  }
  
  // Função para mostrar a seção de boletos
  function mostrarBoletos() {
      document.getElementById("clientes").classList.add("hidden");
      document.getElementById("boletos").classList.remove("hidden");
      document.getElementById("resumo").classList.add("hidden");
  }
  
  // Função para mostrar a seção de resumo
  function mostrarResumo() {
      document.getElementById("clientes").classList.add("hidden");
      document.getElementById("boletos").classList.add("hidden");
      document.getElementById("resumo").classList.remove("hidden");
  }
  
  // Função para adicionar um cliente
  async function adicionarCliente() {
      const nome = document.getElementById("nome").value;
      const perfume = document.getElementById("perfume").value;
      const valorTotal = document.getElementById("valorTotal").value;
      const valorPago = document.getElementById("valorPago").value;
  
      try {
          await db.collection("clientes").add({
              nome: nome,
              perfume: perfume,
              valorTotal: parseFloat(valorTotal),
              valorPago: parseFloat(valorPago)
          });
          alert("Cliente adicionado com sucesso!");
          listarClientes();  // Atualiza a lista de clientes
      } catch (e) {
          console.error("Erro ao adicionar cliente: ", e);
      }
  }
  
  // Função para listar os clientes
  async function listarClientes() {
      const querySnapshot = await db.collection("clientes").get();
      const clientList = document.getElementById("clientList");
      clientList.innerHTML = '';  // Limpa a lista antes de adicionar novos dados
  
      querySnapshot.forEach((doc) => {
          const cliente = doc.data();
          const div = document.createElement("div");
          div.textContent = `Nome: ${cliente.nome}, Perfume: ${cliente.perfume}, Total: R$ ${cliente.valorTotal}, Pago: R$ ${cliente.valorPago}`;
          clientList.appendChild(div);
      });
  }
  
  // Função para pesquisar clientes
  async function pesquisarClientes() {
      const queryText = document.getElementById("searchCliente").value;
      const querySnapshot = await db.collection("clientes")
          .where("nome", "==", queryText)
          .get();
  
      const clientList = document.getElementById("clientList");
      clientList.innerHTML = '';
  
      querySnapshot.forEach((doc) => {
          const cliente = doc.data();
          const div = document.createElement("div");
          div.textContent = `Nome: ${cliente.nome}, Perfume: ${cliente.perfume}, Total: R$ ${cliente.valorTotal}, Pago: R$ ${cliente.valorPago}`;
          clientList.appendChild(div);
      });
  }
  
  // Função para adicionar boleto
  async function adicionarBoleto() {
      const descricao = document.getElementById("boletoDescricao").value;
      const valor = document.getElementById("boleto").value;
  
      try {
          await db.collection("boletos").add({
              descricao: descricao,
              valor: parseFloat(valor)
          });
          alert("Boleto adicionado com sucesso!");
          listarBoletos();  // Atualiza a lista de boletos
      } catch (e) {
          console.error("Erro ao adicionar boleto: ", e);
      }
  }
  
  // Função para listar boletos
  async function listarBoletos() {
      const querySnapshot = await db.collection("boletos").get();
      const boletoList = document.getElementById("boletoList");
      boletoList.innerHTML = '';  // Limpa a lista antes de adicionar novos dados
  
      querySnapshot.forEach((doc) => {
          const boleto = doc.data();
          const div = document.createElement("div");
          div.textContent = `Descrição: ${boleto.descricao}, Valor: R$ ${boleto.valor}`;
          boletoList.appendChild(div);
      });
  }
  
  // Função para excluir todos os boletos
  async function excluirBoletos() {
      const querySnapshot = await db.collection("boletos").get();
      querySnapshot.forEach(async (doc) => {
          await db.collection("boletos").doc(doc.id).delete();
      });
      alert("Todos os boletos foram excluídos.");
      listarBoletos();  // Atualiza a lista de boletos após exclusão
  }
  
  // Função para calcular o resumo
  async function calcularResumo() {
      const clientesSnapshot = await db.collection("clientes").get();
      let entradas = 0;
      let gastos = 0;
  
      // Calculando as entradas e gastos
      clientesSnapshot.forEach((doc) => {
          const cliente = doc.data();
          entradas += cliente.valorTotal;
          gastos += cliente.valorPago;
      });
  
      const boletosSnapshot = await db.collection("boletos").get();
      boletosSnapshot.forEach((doc) => {
          const boleto = doc.data();
          gastos += boleto.valor;
      });
  
      // Atualizando os valores no HTML
      document.getElementById("entradas").textContent = `R$ ${entradas.toFixed(2)}`;
      document.getElementById("gastos").textContent = `R$ ${gastos.toFixed(2)}`;
      document.getElementById("saldoTotal").textContent = `R$ ${(entradas - gastos).toFixed(2)}`;
  }
  
  // Chama a função para calcular o resumo quando a página carregar
  calcularResumo();
  