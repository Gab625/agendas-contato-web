// Substitua com as credenciais reais obtidas no painel do seu Supabase
const SUPABASE_URL = "https://ngtsyzkodhotrrfxdmq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ndHN5emtvZGhvdHJycmZ4ZG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMDM1NzksImV4cCI6MjA5NzY3OTU3OX0.Z58A5aKwZ_2hoS_cH5tlh9wJuzjm1hjm7xpnLtE5qPk";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elementos da DOM
const tabelaCorpo = document.getElementById("tabelaCorpo");
const contatoForm = document.getElementById("contatoForm");
const contatoIdInput = document.getElementById("contatoId");
const nomeInput = document.getElementById("nome");
const telefoneInput = document.getElementById("telefone");
const emailInput = document.getElementById("email");
const searchNomeInput = document.getElementById("searchNome");
const formTitle = document.getElementById("formTitle");

// Carregar dados ao iniciar a página
document.addEventListener("DOMContentLoaded", () => fetchContatos());

// Função para buscar contatos (com ou sem filtro de nome)
async function fetchContatos(searchTerm = "") {
    let query = _supabase.from("contato").select("*");
    
    if (searchTerm.trim() !== "") {
        // Usa ilike do Postgres para busca sem diferenciar maiúsculas/minúsculas
        query = query.ilike("nome", `%${searchTerm}%`);
    }

    const { data, error } = await query.order("id", { ascending: true });

    if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
    }

    renderContatos(data);
}

// Renderizar linhas na tabela
function renderContatos(contatos) {
    tabelaCorpo.innerHTML = "";
    
    contatos.forEach(contato => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${contato.id}</td>
            <td>${contato.nome}</td>
            <td>${contato.telefone}</td>
            <td>${contato.email}</td>
            <td class="actions">
                <button class="btn-icon" onclick="editContato(${contato.id}, '${contato.nome}', '${contato.telefone}', '${contato.email}')">🖊️</button>
                <button class="btn-icon" onclick="deleteContato(${contato.id})">🗑️</button>
            </td>
        `;
        tabelaCorpo.appendChild(tr);
    });
}

// Gatilho do Botão Buscar
document.getElementById("btnBuscar").addEventListener("click", () => {
    fetchContatos(searchNomeInput.value);
});

// Evento de Salvar (Inserir ou Atualizar)
contatoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = contatoIdInput.value;
    const payload = {
        nome: nomeInput.value,
        telefone: telefoneInput.value,
        email: emailInput.value
    };

    if (id) {
        const { error } = await _supabase.from("contato").update(payload).eq("id", id);
        if (error) {
            console.error(error);
            alert("Erro ao atualizar: " + error.message); // Mostra o erro real
        }
    } else {
        const { error } = await _supabase.from("contato").insert([payload]);
        if (error) {
            console.error(error);
            alert("Erro ao inserir: " + error.message); // Mostra o erro real
        }
    }

    clearForm();
    fetchContatos();
});

// Preparar formulário para edição
function editContato(id, nome, telefone, email) {
    formTitle.innerText = "Editar Contato";
    contatoIdInput.value = id;
    nomeInput.value = nome;
    telefoneInput.value = telefone;
    emailInput.value = email;
    nomeInput.focus();
}

// Operação de DELETE baseado no ID
async function deleteContato(id) {
    if (confirm("Deseja mesmo excluir este contato?")) {
        const { error } = await _supabase.from("contato").delete().eq("id", id);
        if (error) {
            alert("Erro ao deletar contato");
        } else {
            fetchContatos();
        }
    }
}

// Botão Novo e Cancelar limpam o fluxo
document.getElementById("btnCancelar").addEventListener("click", clearForm);
document.getElementById("btnNovo").addEventListener("click", () => {
    clearForm();
    nomeInput.focus();
});

function clearForm() {
    formTitle.innerText = "Novo Contato";
    contatoIdInput.value = "";
    contatoForm.reset();
}