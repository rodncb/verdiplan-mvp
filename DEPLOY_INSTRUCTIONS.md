# 📦 INSTRUÇÕES DE DEPLOY - VERDIPLAN MVP

## 🚀 Deploy no GitHub Pages

### Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `verdiplan-mvp`
3. Descrição: "MVP Verdiplan - Sistema de Gestão de Paisagismo"
4. Escolha: **Public** (para GitHub Pages funcionar gratuitamente)
5. NÃO inicialize com README (já temos um)
6. Clique em "Create repository"

### Passo 2: Subir o Código

No terminal, dentro da pasta `verdiplan-mvp`:

```bash
# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "feat: MVP Verdiplan - Sistema de Gestão de Paisagismo"

# Adicionar remote (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/verdiplan-mvp.git

# Push para o GitHub
git branch -M main
git push -u origin main
```

### Passo 3: Deploy Automático

Após o push, rode:

```bash
npm run deploy
```

Este comando irá:
1. Fazer build do projeto (`npm run build`)
2. Publicar a pasta `dist/` no branch `gh-pages`
3. Disponibilizar o site automaticamente

### Passo 4: Configurar GitHub Pages (se necessário)

1. Vá no repositório do GitHub
2. Clique em **Settings**
3. No menu lateral, clique em **Pages**
4. Em "Source", selecione:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Clique em **Save**

### Passo 5: Acessar o Site

Aguarde 1-2 minutos e acesse:

```
https://SEU_USUARIO.github.io/verdiplan-mvp
```

---

## 🔄 Atualizações Futuras

Sempre que fizer alterações no código:

```bash
# 1. Adicionar mudanças
git add .

# 2. Commit
git commit -m "descrição da mudança"

# 3. Push para o GitHub
git push

# 4. Deploy atualizado
npm run deploy
```

---

## ⚠️ Troubleshooting

### Erro 404 no GitHub Pages

Se o site mostrar erro 404:
1. Verifique se o repositório é **público**
2. Verifique se o branch `gh-pages` foi criado
3. Aguarde 2-5 minutos (propagação pode demorar)

### Página em branco

Se a página abrir em branco:
1. Verifique o console do navegador (F12)
2. Confirme que o `basename` no `App.jsx` está correto
3. Confirme que o `base` no `vite.config.js` está correto

### Build falha

```bash
# Limpe a pasta dist e node_modules
rm -rf dist node_modules

# Reinstale dependências
npm install

# Tente o build novamente
npm run build
```

---

## 📱 Testar no Celular

Para que o cliente teste no celular:

1. Envie o link: `https://SEU_USUARIO.github.io/verdiplan-mvp`
2. O site é responsivo e funciona perfeitamente em mobile
3. Ele pode adicionar à tela inicial do celular para testar como PWA

---

## 🎯 Checklist Pré-Deploy

Antes de fazer deploy, verifique:

- [ ] `npm run build` funciona sem erros
- [ ] Todas as rotas navegam corretamente
- [ ] Form de Nova Tarefa funciona
- [ ] Select de área filtra por cliente
- [ ] Mobile responsivo
- [ ] README.md atualizado
- [ ] Repositório criado no GitHub

---

## 📞 Contato

Qualquer dúvida, entre em contato!

**Data de entrega para teste**: 14/11/2025 (Quinta-feira)
