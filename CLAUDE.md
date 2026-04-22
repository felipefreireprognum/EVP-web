# EVP Web — Frontend (Prognum)

> **Para o próximo Claude:** este arquivo é o seu ponto de entrada. Leia ele inteiro antes de começar. Depois leia, **em ordem**, os 3 documentos em `docs/`. Só então comece a implementar.

---

## O que é este projeto

**EVP Web** é a versão web do sistema **EVP** da **Prognum** — um sistema de gestão de tarefas e solicitações que hoje só existe em desktop. A missão é portar para web usando tecnologias modernas, mantendo o mesmo modelo de dados do banco padrão do EVP.

**Domínio em uma frase:** o sistema gira em torno de **SCATs** (Solicitações), que se desdobram em **Tarefas** atribuídas a responsáveis dentro de setores.

## Estado atual do repositório

```
EVP-web/
├── CLAUDE.md                    ← você está aqui
├── docs/
│   ├── ARQUITETURA.MD           ← guia genérico de arquitetura Next.js (referência)
│   ├── EVP WEB.pdf              ← especificação original (tem trechos truncados)
│   ├── 01-ARCHITECTURE.md       ← LEIA PRIMEIRO
│   ├── 02-DESIGN-SYSTEM.md      ← LEIA SEGUNDO
│   └── 03-FEATURES.md           ← LEIA TERCEIRO
└── frontend/                    ← AINDA NÃO EXISTE — você vai criar
```

A pasta `frontend/` **não existe ainda**. Sua missão é criá-la do zero, do `package.json` até as telas funcionando, com mock data, prontas para `npm run dev`.

## Sua missão

Implementar **todo o frontend Next.js** descrito nos 3 docs em `docs/`, de forma que o usuário consiga rodar:

```bash
cd frontend
npm install
npm run dev
```

E ter **um aplicativo funcional**, navegável, com dados mockados realistas, mostrando:

1. **Tela de Tarefas** com toggle entre **Lista** (tabela com 14 colunas) e **Kanban** (5 colunas por status).
2. **Modal de Filtros** completo (15+ filtros) compartilhado entre Lista e Kanban.
3. **Drawer de Detalhe** ao clicar em uma tarefa.
4. **Tela de SCATs** (lista de solicitações) com drill-down para a SCAT individual mostrando suas tarefas.
5. **Layout completo** com Header, Sidebar e navegação entre telas.

Sem backend. Sem login (por enquanto). Sem deploy. Só o frontend rodando local.

## Stack obrigatório

| Categoria | Escolha | Por quê |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | SSR/SSG ready quando precisar |
| Linguagem | **TypeScript (strict)** | Sem `any` — types em tudo |
| Estilo | **CSS Modules** | Conforme `docs/ARQUITETURA.MD` |
| Tabela | **@tanstack/react-table v8** | 14 colunas com sort/filter/visibility |
| Kanban | **@dnd-kit/core + @dnd-kit/sortable** | Acessível, leve |
| Datas | **date-fns** | Tree-shakeable, locale pt-BR |
| Mock data | **@faker-js/faker** | Gerar volume realista |
| Ícones | **lucide-react** | Tree-shakeable, design coerente |
| Utilitário className | **clsx** | Combinar classes condicionais |
| HTTP (placeholder) | **axios** | Pronto pra quando vier API |

**Não use:**
- Tailwind (vai conflitar com CSS Modules e a arquitetura definida).
- Redux/Zustand (Context é suficiente — escopo de estado é pequeno).
- React Query/SWR (overkill com mocks; quando vier API, adicione).
- Chakra/MUI/Mantine (componentes UI são feitos à mão seguindo o design system).

## Decisões já tomadas — não pergunte ao usuário

| Decisão | Valor |
|---|---|
| Idioma da UI | **PT-BR fixo** (sem i18n por agora) |
| Mock strategy | **Simples** — `mockApi.ts` com `setTimeout`, lendo de JSONs em `mocks/` |
| SCAT tem tela própria? | **Sim** — entidade de primeira classe |
| Estilização | **CSS Modules** + tokens via CSS variables |
| Editar tarefa pela web? | **Não nessa primeira versão** — read-only, só drag-and-drop muda status |
| Mobile responsivo? | **Sim, mas desktop-first** (uso interno corporativo) |
| Auth? | **Não nessa versão** — telas livres |

## Comandos

Tudo roda dentro de `frontend/`:

```bash
npm install          # primeira vez
npm run dev          # http://localhost:3000
npm run build        # validação de build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run mock:seed    # regenera mocks/data/*.json com faker (script opcional)
```

## Princípios invioláveis

Estes princípios vêm do `docs/ARQUITETURA.MD` e são **regra**, não sugestão:

1. **Componente não pensa.** Componente recebe props, renderiza JSX. Toda lógica vai em hook.
2. **Hook é o cérebro.** `useState`, `useEffect`, transformações, validação, handlers — tudo em hooks.
3. **Service é o canal.** Nenhum `fetch()` nem `axios` direto em componente ou hook. Sempre via service.
4. **Strings são constantes.** Zero string literal em JSX. Tudo em `STRINGS.dominio.chave` em `src/constants/strings.ts`.
5. **Tokens são lei.** Nenhum `16px`, `#abc123`, `border-radius: 8px` hardcoded. Tudo via CSS variables.
6. **Types por domínio em 3 níveis:** `XxxAPI` (snake_case do backend) → `Xxx` (camelCase interno) → `XxxCardData` (display).
7. **Barrel exports em tudo.** Toda pasta de componente tem `index.ts`.
8. **Hierarquia de 3 camadas:** `app/page.tsx` → `screens/XxxScreen` → `components/features/XxxView`.

Se você se pegar quebrando uma dessas regras, **pare e refatore**. Não acumule dívida.

## Como abordar o trabalho

1. **Leia os 3 docs em `docs/` em ordem** (01 → 02 → 03). Não pule.
2. **Use TaskList/TaskCreate** para quebrar a implementação em fases (estão sugeridas em `03-FEATURES.md`). Marque como `in_progress` ao começar e `completed` ao terminar cada fase.
3. **Implemente fase por fase.** Cada fase deve resultar em algo navegável no `npm run dev`. Não trabalhe em 5 fases ao mesmo tempo.
4. **Quando uma decisão NÃO estiver coberta nos docs**, escolha o caminho mais simples e siga em frente — registre a decisão num comentário curto no código se for não-óbvia.
5. **Não invente features além do que está nos docs.** Se algo não está especificado, é porque não é necessário agora.
6. **Não crie documentação extra** (READMEs, ARCHITECTURE.md adicionais, etc.) — os docs atuais são suficientes.

## Quando parar e perguntar

A maioria das decisões já está nos docs. Você só deve pedir input do usuário se:

- Os mocks gerados não baterem com algum campo do banco real do EVP que o usuário precise específico.
- Você descobrir uma incompatibilidade real entre dois docs (raro — me avise).
- Você bater num bloqueio técnico que não tem caminho óbvio.

Em geral: **prefira decidir e seguir** sobre travar pedindo confirmação.

## Critérios de "está pronto"

Você terminou quando:

- [ ] `npm install && npm run dev` sobe sem erros.
- [ ] `npm run build` passa.
- [ ] `npm run typecheck` passa sem erros (sem `any`, sem `@ts-ignore`).
- [ ] `npm run lint` passa.
- [ ] Tela `/tarefas` mostra Lista e Kanban com toggle, filtros funcionando, drawer de detalhe abrindo.
- [ ] Tela `/scats` lista solicitações; clicar em uma vai para `/scats/[id]` mostrando suas tarefas.
- [ ] Header e Sidebar presentes em todas as telas.
- [ ] Cores da Prognum (branco/azul/amarelo) aplicadas, status com paleta semântica separada.
- [ ] Drag-and-drop no Kanban move o card entre colunas (atualiza estado em memória, mostra toast).
- [ ] Sort/columnVisibility/pagination funcionam na Lista.
- [ ] Filtros do modal são aplicados a Lista E Kanban (mesmo state).
- [ ] Mocks têm volume realista (~50 tarefas, ~20 SCATs, ~10 clientes, etc.).
- [ ] Skeleton loaders aparecem nos primeiros ~600ms (latência simulada).

## Dicas finais

- **Ordem de imports** em todo arquivo: React → libs externas → `@/src/components/ui` → contexts → hooks → types (`import type`) → arquivos locais (styles, etc.).
- **Path alias:** configure `@/` apontando para `frontend/` (não para `frontend/src/`). Imports ficam `@/src/components/...`.
- **`'use client'`** só onde precisa (componentes com state, effect, event handler). Screens, layouts e features quase sempre são client. Páginas em `app/` são server por padrão.
- **Mantenha PRs mentais pequenos** — se uma fase ficou com 30+ arquivos, provavelmente você juntou duas fases. Quebre.
- **Não economize na qualidade dos mocks** — dados feios = telas feias = tudo parece quebrado. Use o faker bem.

---

**Próximo passo:** abra `docs/01-ARCHITECTURE.md` e leia até o fim. Depois `02`, depois `03`. Só então comece a criar a pasta `frontend/`.
