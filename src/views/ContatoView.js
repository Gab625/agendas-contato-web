export class ContatoView {
    constructor() {
        this.tabelaCorpo = document.getElementById("tabelaCorpo");
        this.contatoForm = document.getElementById("contatoForm");
        this.contatoIdInput = document.getElementById("contatoId");
        this.nomeInput = document.getElementById("nome");
        this.telefoneInput = document.getElementById("telefone");
        this.emailInput = document.getElementById("email");
        this.searchNomeInput = document.getElementById("searchNome");
        this.formTitle = document.getElementById("formTitle");
    }

    getFormData() {
        return {
            id: this.contatoIdInput.value,
            nome: this.nomeInput.value,
            telefone: this.telefoneInput.value,
            email: this.emailInput.value
        };
    }

    getSearchTerm() {
        return this.searchNomeInput.value;
    }

    preencherFormulario(id, nome, telefone, email) {
        this.formTitle.innerText = "Editar Contato";
        this.contatoIdInput.value = id;
        this.nomeInput.value = nome;
        this.telefoneInput.value = telefone;
        this.emailInput.value = email;
        this.nomeInput.focus();
    }

    limparFormulario() {
        this.formTitle.innerText = "Novo Contato";
        this.contatoIdInput.value = "";
        this.contatoForm.reset();
    }

    render(contatos, onEditClick, onDeleteClick) {
        this.tabelaCorpo.innerHTML = "";
        
        contatos.forEach(contato => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${contato.id}</td>
                <td>${contato.nome}</td>
                <td>${contato.telefone}</td>
                <td>${contato.email}</td>
                <td class="actions">
                    <button class="btn-editar" data-id="${contato.id}">🖊️</button>
                    <button class="btn-excluir" data-id="${contato.id}">🗑️</button>
                </td>
            `;

            tr.querySelector(".btn-editar").addEventListener("click", () => {
                onEditClick(contato.id, contato.nome, contato.telefone, contato.email);
            });
            tr.querySelector(".btn-excluir").addEventListener("click", () => {
                onDeleteClick(contato.id);
            });

            this.tabelaCorpo.appendChild(tr);
        });
    }
}