# 📇 Agenda de Contatos Web

Aplicação construída para fins acadêmicos para gerenciamento de contatos, desenvolvida em JavaScript puro (Vanilla JS) aplicando a arquitetura **MVC (Model-View-Controller)**. O projeto utiliza módulos nativos do ES6 e integra-se ao **Supabase** como BaaS (Backend as a Service) para persistência de dados em tempo real.

🚀 **Link do Projeto:** [(https://agendas-contato-web.vercel.app/)](https://agendas-contato-web.vercel.app/)

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5 semântico, CSS3 (Variáveis nativas e layout responsivo) e JavaScript (ES6+ Modules).
* **Backend & Banco de Dados:** [Supabase](https://supabase.com/) (Autenticação e PostgreSQL Client).
* **Deploy & Hospedagem:** [Vercel](https://vercel.com/).

---

## 📐 Arquitetura do Projeto (MVC)

O projeto foi reestruturado para seguir o padrão **MVC (Model-View-Controller)**, encapsulando toda a lógica de negócio na pasta `src/`. Isso separa claramente as responsabilidades de dados, interface e controle, facilitando a manutenção e a escalabilidade do software.

```text
meu-projeto/
│
├── index.html                  # Ponto de entrada da aplicação
└── src/
    ├── css/
    │   └── style.css           # Estilização global e variáveis visuais
    ├── config.js               # Inicialização e exportação do Supabase Client
    ├── app.js                  # Inicializador dos módulos (Entrypoint JS)
    ├── models/
    │   └── ContatoModel.js     # Regras de negócio e comunicação com o banco de dados
    ├── views/
    │   └── ContatoView.js      # Manipulação do DOM e renderização da interface
    └── controllers/
        └── ContatoController.js # Intermediário que escuta os eventos e dita o fluxo
```
## 🔒 Segurança e Proteção de Dados (Row Level Security - RLS)

Como esta é uma aplicação que roda inteiramente no lado do cliente (Frontend), a chave do Supabase (`SUPABASE_KEY`) fica inevitavelmente exposta no código. Para garantir a integridade e a segurança dos dados contra acessos maliciosos diretamente pela API, o banco de dados PostgreSQL do Supabase foi protegido utilizando **RLS (Row Level Security)**.

Sem o RLS ativado, qualquer usuário mal-intencionado poderia utilizar a chave pública através do console do navegador para ler, alterar ou deletar registros de outros usuários.

## 🧠 Contextualização e Objetivo

### O Papel do Desenvolvedor Full Stack Moderno e as Tecnologias BaaS
Historicamente, construir uma aplicação web exigia a separação estrita de duas frentes de trabalho: o desenvolvimento da interface (Frontend) e a construção manual de um servidor de API, rotas e conexões com o banco de dados (Backend). 

Como desenvolvedor Full Stack, o objetivo deste projeto foi adotar uma abordagem moderna de desenvolvimento ágil utilizando **BaaS (Backend as a Service)** com o **Supabase**. 

A escolha por uma infraestrutura BaaS permite que o foco total seja direcionado para a experiência do usuário e arquitetura de software no Frontend (utilizando o padrão **MVC**), delegando a manutenção de servidores, escalabilidade do banco de dados PostgreSQL e APIs REST automáticas para uma infraestrutura robusta na nuvem. Isso otimiza o tempo de entrega sem abrir mão de um ecossistema de banco de dados relacional profissional.

---

## 🛡️ Requisitos de Segurança e Boas Práticas

### A Importância do RLS (Row Level Security) vs. Security Rules
Em arquiteturas tradicionais, o backend atua como um "porteiro", validando quem pode ler ou escrever no banco de dados. Em uma arquitetura Serverless/BaaS com Supabase, o frontend se conecta **diretamente** ao banco de dados utilizando uma chave de API pública (`anon key`). 

Se o banco de dados não for configurado corretamente, qualquer usuário poderia inspecionar o código do navegador, copiar a chave e disparar requisições maliciosas para apagar ou vazar registros. 

Para mitigar esse risco de segurança, foram aplicadas regras rígidas de **RLS (Row Level Security)**. O RLS move a camada de segurança do servidor de aplicação diretamente para a engine do banco de dados (PostgreSQL).

#### Regras de Segurança Aplicadas no Supabase:
* **Isolamento de Operações:** A tabela foi configurada com o RLS ativado (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`), o que significa que, por padrão, **todo acesso é negado** até que uma política explícita permita o contrário.
* **Políticas Nomeadas (Policies):** Configuração de permissões granulares onde o acesso de leitura (`SELECT`) e escrita (`INSERT`) é controlado estritamente por regras que validam a origem da requisição, impedindo injeções de scripts e acessos não autorizados a dados de terceiros.

---
