# 🌿 VERDIPLAN MVP

Protótipo funcional (frontend) de sistema de gestão de tarefas para paisagismo.

## 📋 Sobre o Projeto

MVP desenvolvido para validação de layouts e navegação do sistema Verdiplan. Este é um protótipo **apenas frontend** com dados mockados, sem backend ou persistência de dados.

## 🎯 Funcionalidades

### 4 Telas Principais:

1. **Login** (`/`)
   - Aceita qualquer email/senha
   - Redirecionamento para dashboard

2. **Dashboard** (`/dashboard`)
   - 4 cards de estatísticas (Tarefas Hoje, Pendentes, Concluídas, Áreas)
   - Botões de navegação

3. **Nova Tarefa** (`/tasks/new`) ⭐ Principal
   - Select de Cliente (2 opções)
   - Select de Área (26 áreas, filtradas por cliente)
   - Select de Serviço (8 opções)
   - Date/Time picker
   - Textarea de observações
   - Simulação de upload de fotos

4. **Lista de Tarefas** (`/tasks`)
   - Cards com tarefas mockadas
   - Filtros visuais (não funcionais)

## 🎨 Tecnologias

- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Lucide React (ícones)
- Componentes UI customizados

### Cores do Tema:
- Verde Escuro: `#125A2B`
- Verde Médio: `#27AE60`
- Laranja: `#DF8F04`

## 🚀 Como Executar

### Desenvolvimento Local:

```bash
npm install
npm run dev
```

Acesse: `http://localhost:5173`

### Build de Produção:

```bash
npm run build
npm run preview
```

## 📦 Deploy GitHub Pages

```bash
npm run deploy
```

O site será publicado em: `https://rodrigobezerra.github.io/verdiplan-mvp`

## 📊 Dados Mockados

- **2 Clientes**: TerrasAlpha Resende 1 e 2
- **26 Áreas**: 15 do Resende 1, 11 do Resende 2
- **8 Serviços**: Roçada, Poda, Rega, Adubação, Limpeza, Coroamento, Manutenção, Plantio
- **3 Tarefas exemplo** para visualização

## 📱 Mobile-First

O projeto foi desenvolvido com foco em **mobile-first**. Todas as telas são responsivas e otimizadas para uso em smartphones.

## ⚠️ Limitações (por design)

Este é um **MVP apenas frontend**. Não possui:

- ❌ Backend/API
- ❌ Autenticação real
- ❌ Persistência de dados
- ❌ Upload de fotos real
- ❌ LocalStorage
- ❌ Service Worker/PWA
- ❌ Validações complexas

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes base (button, input, etc)
│   ├── Layout.jsx       # Header + container
│   └── TaskCard.jsx     # Card de tarefa
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── NewTask.jsx
│   └── TaskList.jsx
├── data/
│   └── mock.js          # Dados mockados
├── lib/
│   └── utils.js         # Utilitários
└── App.jsx              # Rotas
```

## ✅ Checklist de Funcionalidades

- [x] 4 telas navegáveis
- [x] Form "Nova Tarefa" completo
- [x] Select de área filtra por cliente
- [x] Responsivo mobile-first
- [x] Cores tema Verdiplan
- [x] Dados mockados (2 clientes, 26 áreas)
- [x] Navegação fluida
- [x] Build funcional
- [x] Configuração para deploy GitHub Pages

## 👤 Cliente

**Verdiplan** - Urbanização e Paisagismo
Desenvolvido para validação com Murillo Rodrigues

---

**Data de Teste**: 14/11/2025
**Objetivo**: Validar layouts antes do desenvolvimento completo
