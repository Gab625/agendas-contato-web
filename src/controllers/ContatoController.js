import { ContatoModel } from '../models/ContatoModel.js';
import { ContatoView } from '../views/ContatoView.js';

export class ContatoController {
    constructor() {
        this.view = new ContatoView();
        this.init();
    }

    async init() {
        document.getElementById("btnBuscar").addEventListener("click", () => this.listarContatos());
        document.getElementById("btnNovo").addEventListener("click", () => { this.view.limparFormulario(); });
        document.getElementById("btnCancelar").addEventListener("click", () => this.view.limparFormulario());
        this.view.contatoForm.addEventListener("submit", (e) => this.salvarContato(e));

        await this.listarContatos();
    }

    async listarContatos() {
        try {
            const termo = this.view.getSearchTerm();
            const contatos = await ContatoModel.getAll(termo);
            
            this.view.render(
                contatos, 
                (id, nome, fone, email) => this.view.preencherFormulario(id, nome, fone, email),
                (id) => this.excluirContato(id)
            );
        } catch (error) {
            console.error(error);
            alert("Erro ao listar contatos.");
        }
    }

    async salvarContato(e) {
        e.preventDefault();
        try {
            const { id, nome, telefone, email } = this.view.getFormData();
            const payload = { nome, telefone, email };

            if (id) {
                await ContatoModel.update(id, payload);
            } else {
                await ContatoModel.create(payload);
            }

            this.view.limparFormulario();
            await this.listarContatos();
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar contato: " + error.message);
        }
    }

    async excluirContato(id) {
        if (confirm("Deseja mesmo excluir este contato?")) {
            try {
                await ContatoModel.delete(id);
                await this.listarContatos();
            } catch (error) {
                console.error(error);
                alert("Erro ao deletar contato.");
            }
        }
    }
}