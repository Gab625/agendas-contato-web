// Substitua com as credenciais reais obtidas no painel do seu Supabase
const SUPABASE_URL = "https://ngtsyzkodhotrrfxdmq.supabase.co";
const SUPABASE_KEY = "sb_publishable_cEyYLMapCXGgbbfj1he9SA_Rw_ImZ2T";

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
        // Operação de UPDATE
        const { error } = await _supabase.from("contato").update(payload).eq("id", id);
        if (error) alert("Erro ao atualizar contato");
    } else {
        // Operação de INSERT
        const { error } = await _supabase.from("contato").insert([payload]);
        if (error) alert("Erro ao inserir contato");
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