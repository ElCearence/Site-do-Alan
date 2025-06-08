
# Projeto Full Stack - Cadastro de Usuários

Este projeto é composto por três principais partes: banco de dados, API backend e frontend web. Abaixo estão todas as informações detalhadas sobre o funcionamento e as tecnologias utilizadas.

---

## 🔗 Acessos

- **API Backend**: [https://site-alan-back.onrender.com/](https://site-alan-back.onrender.com/)
- **Frontend (Site)**: [https://site-do-alan.vercel.app/](https://site-do-alan.vercel.app/)

---

## 🗃️ Banco de Dados - Supabase

O banco de dados do projeto está hospedado na [Supabase](https://supabase.com/), uma plataforma open source que fornece serviços como banco de dados PostgreSQL, autenticação, armazenamento de arquivos e muito mais, de forma fácil e escalável.

### 🔐 String de Conexão

```txt
postgresql://postgres.ysrtgtczvjowdjvbakii:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

> **Nota**: Substitua `[YOUR-PASSWORD]` pela sua senha real de acesso ao banco.

### 📄 Estrutura da Tabela

Atualmente, o banco contém uma tabela chamada `usuario` com os seguintes campos:

- `id` (identificador único)
- `nome` (nome do usuário)
- `email` (email do usuário)
- `senha` (armazenada de forma criptografada)

---

## ⚙️ API Backend - Render

A API está hospedada na [Render](https://render.com/), uma plataforma de cloud moderna que permite o deploy automático de aplicações web, APIs, serviços de background e bancos de dados.

A API foi desenvolvida para lidar com requisições relacionadas ao cadastro e autenticação dos usuários, se comunicando diretamente com o banco da Supabase.

---

## 🌐 Frontend - Vercel

O site (interface do usuário) está hospedado na [Vercel](https://vercel.com/), uma plataforma focada em deploy de aplicações front-end, especialmente aquelas criadas com frameworks como React, Next.js, Vue, entre outros. A Vercel oferece CI/CD (integração e entrega contínua) com GitHub, facilitando o deploy a cada atualização de código.

---

## 🔄 Integração com GitHub

Tanto o projeto da API (Render) quanto o projeto do site (Vercel) estão conectados diretamente aos repositórios correspondentes no GitHub. Isso significa que:

- Sempre que uma alteração é feita e enviada ao GitHub (`git push`), a **API** é automaticamente redeployada na Render.
- Da mesma forma, o **site** também é automaticamente atualizado e publicado na Vercel.

Essa integração permite um fluxo de trabalho moderno, rápido e confiável para desenvolvimento contínuo.

---

## ✅ Tecnologias Usadas

- **Frontend**: HTML/CSS/JavaScript (ou framework usado, se houver)
- **Backend**: Node.js / Flask (ou outro, se aplicável)
- **Banco de Dados**: PostgreSQL (via Supabase)
- **Hospedagem Backend**: Render
- **Hospedagem Frontend**: Vercel

---

## 📌 Observações

Esse projeto é ideal para aprender conceitos de desenvolvimento full stack moderno, incluindo:

- Deploy automático
- Gerenciamento de banco de dados em nuvem
- Criptografia de senhas
- Integração entre diferentes serviços na nuvem

---

Feito com 💻 por **Alan**
