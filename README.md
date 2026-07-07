# Presenteísmo T&D-R&S — Manual de Implantação e Operação

Este documento foi elaborado para fornecer instruções claras e detalhadas para a configuração, publicação e manutenção do sistema **Presenteísmo T&D-R&S**.

---

## 1. PASSO A PASSO PARA PUBLICAÇÃO (PARA INICIANTES)

### Passo 1: Criar sua conta no GitHub
1. Acesse [github.com](https://github.com/) e clique em **Sign Up**.
2. Siga as instruções inserindo seu e-mail e criando uma senha segura.
3. Confirme seu e-mail através do código enviado pela plataforma.

### Passo 2: Criar conta e projeto no Supabase
1. Acesse [supabase.com](https://supabase.com/) e faça login utilizando sua conta recém-criada do GitHub.
2. No painel inicial, clique em **New Project**.
3. Defina um nome para o seu projeto (ex: `presenteismo-db`).
4. Crie uma senha forte para o banco de dados e guarde-a em um local seguro.
5. Selecione a região geográfica mais próxima da sua operação (ex: *South America - São Paulo*) e clique em **Create New Project**. Aguarde alguns minutos até que o banco de dados seja provisionado.

### Passo 3: Executar a Estrutura de Tabelas (SQL)
1. No menu lateral esquerdo do painel do Supabase, clique no ícone de engrenagem com código chamado **SQL Editor**.
2. Clique em **New Query**.
3. Copie integralmente o script SQL contido na **Parte 1** deste documento, cole-o no campo de texto e clique no botão **Run** (localizado no canto inferior direito).
4. Verifique se a mensagem `"Success. No rows returned"` apareceu, confirmando a criação das tabelas e políticas de segurança.

### Passo 4: Configurar o Armazenamento de Fotos (Supabase Storage)
1. No menu lateral do Supabase, clique em **Storage**.
2. Clique em **New Bucket**.
3. Defina o nome do bucket estritamente como `fotos-turmas`.
4. Deixe a opção **Public** ativada para que as imagens carregadas via sistema fiquem visíveis na aplicação, e clique em **Save**.

### Passo 5: Criar o Primeiro Usuário Gerente
Como o login utiliza matrícula em vez de e-mail comum, use o próprio painel do Supabase para criar o primeiro administrador:
1. Vá em **Authentication** no menu lateral do Supabase.
2. Clique em **Add User** -> **Create User**.
3. No campo de e-mail, digite a matrícula desejada seguida do domínio virtual do sistema. Exemplo: `admin123@presenteismo.local`.
4. Defina uma senha de acesso forte.
5. Desmarque a caixa *Auto-confirm User* (caso queira pular validações) ou mantenha ativada para fins de homologação rápida e salve.
6. Vá até a tabela `usuarios` no **Table Editor**, localize a linha recém-criada e altere a coluna `perfil` para `Gerente` para garantir o acesso total à plataforma.

### Passo 6: Enviar o Projeto para o GitHub
1. Abra o terminal na pasta local onde os arquivos do sistema estão salvos.
2. Execute os comandos sequencialmente:
   ```bash
   git init
   git add .
   git commit -m "feat: estrutura inicial de produção"
   git branch -M main