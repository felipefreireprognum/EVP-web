# 02 — Design System do EVP Web

> Este documento define **os tokens visuais**, a paleta de cores, tipografia, espaçamento e padrões de componentes da Prognum. Leia depois do `01-ARCHITECTURE.md` e antes do `03-FEATURES.md`.

---

## Identidade visual da Prognum

O sistema usa três camadas de cor:

| Camada | Papel | Não usar para |
|---|---|---|
| **Marca** (branco + azul + amarelo) | Chrome, header, sidebar, ações primárias | Status de tarefas |
| **Neutros** (cinza 50–900) | Texto, bordas, fundos secundários | Nada específico |
| **Semânticos** (status) | Badges, colunas do kanban, ícones de estado | Elementos de marca |

A paleta semântica é **deliberadamente separada** da paleta de marca — misturar as duas causa confusão visual (ex.: "concluída" em azul da marca parece item selecionado, não status).

---

## Paleta de marca — Prognum

```css
/* Primário — azul corporativo */
--color-brand-blue-900: #0D2B6B;   /* texto/ícone sobre fundo claro */
--color-brand-blue-700: #1A4BAD;   /* hover de elementos de marca */
--color-brand-blue:     #2563EB;   /* cor principal da Prognum */
--color-brand-blue-400: #60A5FA;   /* destaques suaves, ícones secundários */
--color-brand-blue-100: #DBEAFE;   /* fundos de seleção/hover em sidebar */
--color-brand-blue-50:  #EFF6FF;   /* fundo de página alternativo */

/* Acento — amarelo */
--color-brand-yellow:     #F59E0B; /* ação secundária, destaques, alertas de marca */
--color-brand-yellow-400: #FCD34D; /* hover do amarelo */
--color-brand-yellow-100: #FEF3C7; /* fundo de chip/badge amarelo */

/* Base */
--color-brand-white: #FFFFFF;      /* fundo principal */
```

### Uso de marca por elemento

| Elemento | Cor |
|---|---|
| Header background | `--color-brand-blue` |
| Header texto/ícones | `--color-brand-white` |
| Sidebar background | `--color-brand-blue-900` |
| Sidebar item ativo (fundo) | `--color-brand-blue-700` |
| Sidebar item ativo (borda esq.) | `--color-brand-yellow` |
| Sidebar item hover | `--color-brand-blue-700` |
| Sidebar texto | `--color-brand-blue-100` |
| Botão primary | `--color-brand-blue` |
| Botão primary hover | `--color-brand-blue-700` |
| Botão secondary | `--color-brand-yellow` |
| Logo mark | SVG em `public/logo-prognum.svg` |

---

## Paleta semântica — Status de tarefas

Cada status tem 3 tokens: `bg` (fundo do badge), `text` (texto), `border` (borda/indicador).

```css
/* Disponível — azul informativo */
--color-status-disponivel-bg:     #DBEAFE;
--color-status-disponivel-text:   #1D4ED8;
--color-status-disponivel-border: #93C5FD;

/* Em Andamento — âmbar */
--color-status-em-andamento-bg:     #FEF3C7;
--color-status-em-andamento-text:   #D97706;
--color-status-em-andamento-border: #FCD34D;

/* Em Pausa — roxo */
--color-status-em-pausa-bg:     #EDE9FE;
--color-status-em-pausa-text:   #7C3AED;
--color-status-em-pausa-border: #C4B5FD;

/* Vencida — vermelho */
--color-status-vencida-bg:     #FEE2E2;
--color-status-vencida-text:   #DC2626;
--color-status-vencida-border: #FCA5A5;

/* Concluída — verde */
--color-status-concluida-bg:     #DCFCE7;
--color-status-concluida-text:   #16A34A;
--color-status-concluida-border: #86EFAC;
```

### Tokens de status no TypeScript

```typescript
// src/constants/taskStatus.ts
export const TASK_STATUS_CONFIG = {
  disponivel: {
    label:  'Disponível',
    bg:     'var(--color-status-disponivel-bg)',
    text:   'var(--color-status-disponivel-text)',
    border: 'var(--color-status-disponivel-border)',
  },
  em_andamento: {
    label:  'Em Andamento',
    bg:     'var(--color-status-em-andamento-bg)',
    text:   'var(--color-status-em-andamento-text)',
    border: 'var(--color-status-em-andamento-border)',
  },
  em_pausa: {
    label:  'Em Pausa',
    bg:     'var(--color-status-em-pausa-bg)',
    text:   'var(--color-status-em-pausa-text)',
    border: 'var(--color-status-em-pausa-border)',
  },
  vencida: {
    label:  'Vencida',
    bg:     'var(--color-status-vencida-bg)',
    text:   'var(--color-status-vencida-text)',
    border: 'var(--color-status-vencida-border)',
  },
  concluida: {
    label:  'Concluída',
    bg:     'var(--color-status-concluida-bg)',
    text:   'var(--color-status-concluida-text)',
    border: 'var(--color-status-concluida-border)',
  },
} as const satisfies Record<string, { label: string; bg: string; text: string; border: string }>;

export type TaskStatus = keyof typeof TASK_STATUS_CONFIG;
export const TASK_STATUS_ORDER: TaskStatus[] = [
  'disponivel', 'em_andamento', 'em_pausa', 'vencida', 'concluida',
];
```

---

## Paleta de neutros

```css
--color-gray-50:  #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;
```

### Usos de neutros

| Elemento | Token |
|---|---|
| Fundo de página | `--color-brand-white` |
| Fundo de seção/card | `--color-gray-50` |
| Bordas de input | `--color-gray-300` |
| Bordas de card | `--color-gray-200` |
| Texto primário | `--color-gray-900` |
| Texto secundário | `--color-gray-600` |
| Texto desabilitado/placeholder | `--color-gray-400` |
| Divisor (`<hr>`) | `--color-gray-200` |
| Fundo de linha hover na tabela | `--color-gray-50` |
| Fundo de header da tabela | `--color-gray-100` |

---

## Tipografia

Fonte: **Inter** (Google Fonts). Carregada em `app/layout.tsx` via `next/font/google`.

```css
/* Escala */
--font-size-xs:   11px;
--font-size-sm:   12px;
--font-size-base: 14px;   /* tamanho padrão da UI (compacto — sistema interno) */
--font-size-md:   15px;
--font-size-lg:   16px;
--font-size-xl:   18px;
--font-size-2xl:  20px;
--font-size-3xl:  24px;

/* Pesos */
--font-weight-regular:  400;
--font-weight-medium:   500;
--font-weight-semibold: 600;
--font-weight-bold:     700;

/* Line-height */
--line-height-tight:   1.25;
--line-height-normal:  1.5;
--line-height-relaxed: 1.75;
```

### Padrões tipográficos por elemento

| Elemento | Size | Weight | Color |
|---|---|---|---|
| Título de página | `--font-size-xl` | semibold | `--color-gray-900` |
| Título de seção | `--font-size-lg` | semibold | `--color-gray-800` |
| Label de campo | `--font-size-sm` | medium | `--color-gray-700` |
| Texto de tabela | `--font-size-base` | regular | `--color-gray-800` |
| Texto de card | `--font-size-base` | regular | `--color-gray-700` |
| Texto secundário/meta | `--font-size-sm` | regular | `--color-gray-500` |
| Badge/chip | `--font-size-xs` | medium | varia por tipo |
| Tooltip | `--font-size-xs` | regular | `--color-gray-700` |
| Botão | `--font-size-base` | medium | varia |

---

## Espaçamento — grid de 4px

```css
--spacing-1:  4px;
--spacing-2:  8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;
```

### Uso convencional

| Contexto | Token |
|---|---|
| Gap entre ícone e texto | `--spacing-2` |
| Padding interno de botão (horizontal) | `--spacing-4` |
| Padding interno de botão (vertical) | `--spacing-2` |
| Padding de card | `--spacing-4` ou `--spacing-6` |
| Gap entre cards | `--spacing-4` |
| Padding de modal | `--spacing-6` |
| Padding de drawer | `--spacing-6` |
| Gap entre itens de formulário | `--spacing-4` |
| Padding de linha de tabela (vertical) | `--spacing-3` |
| Padding de célula de tabela (horizontal) | `--spacing-4` |
| Margem da página (lateral) | `--spacing-8` |

---

## Bordas e raios

```css
--radius-sm:   4px;
--radius-md:   6px;
--radius-lg:   8px;
--radius-xl:  12px;
--radius-2xl: 16px;
--radius-full: 9999px;

--border-width: 1px;
--border-color: var(--color-gray-200);
--border-color-strong: var(--color-gray-300);
--border-color-focus: var(--color-brand-blue);
```

### Uso de raios por elemento

| Elemento | Raio |
|---|---|
| Botão | `--radius-md` |
| Input/Select | `--radius-md` |
| Card | `--radius-lg` |
| Badge/Chip | `--radius-full` |
| Modal | `--radius-xl` |
| Tooltip | `--radius-sm` |
| Coluna Kanban | `--radius-lg` |
| Card Kanban | `--radius-md` |
| Toast | `--radius-lg` |

---

## Sombras

```css
--shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
--shadow-sm: 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04);
```

| Elemento | Sombra |
|---|---|
| Card hover | `--shadow-sm` |
| Card Kanban | `--shadow-xs` |
| Card Kanban dragging | `--shadow-lg` |
| Modal | `--shadow-xl` |
| Drawer | `--shadow-xl` |
| Dropdown | `--shadow-lg` |
| Toast | `--shadow-md` |
| Header | `--shadow-sm` |

---

## Z-Index

```css
--z-dropdown:  100;
--z-sticky:    200;
--z-overlay:   250;
--z-modal:     300;
--z-drawer:    350;
--z-toast:     400;
--z-tooltip:   500;
```

---

## Layout — dimensões fixas

```css
--header-height:   56px;
--sidebar-width:  240px;
--sidebar-width-collapsed: 64px;

/* Conteúdo principal */
--content-padding-x: var(--spacing-8);
--content-padding-y: var(--spacing-6);
--content-max-width: 1440px;

/* Drawer de detalhe de tarefa */
--drawer-width: 480px;

/* Modal de filtros */
--filters-modal-width: 640px;
--filters-modal-max-height: 90vh;
```

---

## Arquivo `globals.css` completo

Crie em `frontend/app/globals.css`:

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* === MARCA === */
  --color-brand-blue-900: #0D2B6B;
  --color-brand-blue-700: #1A4BAD;
  --color-brand-blue:     #2563EB;
  --color-brand-blue-400: #60A5FA;
  --color-brand-blue-100: #DBEAFE;
  --color-brand-blue-50:  #EFF6FF;
  --color-brand-yellow:     #F59E0B;
  --color-brand-yellow-400: #FCD34D;
  --color-brand-yellow-100: #FEF3C7;
  --color-brand-white: #FFFFFF;

  /* === STATUS === */
  --color-status-disponivel-bg:       #DBEAFE;
  --color-status-disponivel-text:     #1D4ED8;
  --color-status-disponivel-border:   #93C5FD;

  --color-status-em-andamento-bg:     #FEF3C7;
  --color-status-em-andamento-text:   #D97706;
  --color-status-em-andamento-border: #FCD34D;

  --color-status-em-pausa-bg:         #EDE9FE;
  --color-status-em-pausa-text:       #7C3AED;
  --color-status-em-pausa-border:     #C4B5FD;

  --color-status-vencida-bg:          #FEE2E2;
  --color-status-vencida-text:        #DC2626;
  --color-status-vencida-border:      #FCA5A5;

  --color-status-concluida-bg:        #DCFCE7;
  --color-status-concluida-text:      #16A34A;
  --color-status-concluida-border:    #86EFAC;

  /* === NEUTROS === */
  --color-gray-50:  #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;

  /* === FEEDBACK === */
  --color-success:     #16A34A;
  --color-success-bg:  #DCFCE7;
  --color-error:       #DC2626;
  --color-error-bg:    #FEE2E2;
  --color-warning:     #D97706;
  --color-warning-bg:  #FEF3C7;
  --color-info:        #1D4ED8;
  --color-info-bg:     #DBEAFE;

  /* === TIPOGRAFIA === */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs:   11px;
  --font-size-sm:   12px;
  --font-size-base: 14px;
  --font-size-md:   15px;
  --font-size-lg:   16px;
  --font-size-xl:   18px;
  --font-size-2xl:  20px;
  --font-size-3xl:  24px;
  --font-weight-regular:  400;
  --font-weight-medium:   500;
  --font-weight-semibold: 600;
  --font-weight-bold:     700;
  --line-height-tight:   1.25;
  --line-height-normal:  1.5;
  --line-height-relaxed: 1.75;

  /* === ESPAÇAMENTO === */
  --spacing-1:   4px;
  --spacing-2:   8px;
  --spacing-3:  12px;
  --spacing-4:  16px;
  --spacing-5:  20px;
  --spacing-6:  24px;
  --spacing-8:  32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;

  /* === BORDAS === */
  --radius-sm:   4px;
  --radius-md:   6px;
  --radius-lg:   8px;
  --radius-xl:  12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
  --border-color:        var(--color-gray-200);
  --border-color-strong: var(--color-gray-300);
  --border-color-focus:  var(--color-brand-blue);

  /* === SOMBRAS === */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04);

  /* === Z-INDEX === */
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-overlay:  250;
  --z-modal:    300;
  --z-drawer:   350;
  --z-toast:    400;
  --z-tooltip:  500;

  /* === LAYOUT === */
  --header-height:           56px;
  --sidebar-width:          240px;
  --sidebar-width-collapsed: 64px;
  --content-padding-x:      var(--spacing-8);
  --content-padding-y:      var(--spacing-6);
  --drawer-width:           480px;
  --filters-modal-width:    640px;
  --filters-modal-max-height: 90vh;
}

html, body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--color-gray-900);
  background-color: var(--color-gray-50);
  line-height: var(--line-height-normal);
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  font-family: inherit;
}

input, textarea, select {
  font-family: inherit;
}
```

---

## Componentes primitivos — especificação visual

### Button

Variantes e estados:

| Variante | Fundo | Texto | Borda | Hover fundo |
|---|---|---|---|---|
| `primary` | `--color-brand-blue` | branco | — | `--color-brand-blue-700` |
| `secondary` | `--color-gray-100` | `--color-gray-700` | `--border-color` | `--color-gray-200` |
| `danger` | `--color-error-bg` | `--color-error` | `var(--color-error)` | `#FCA5A5` |
| `ghost` | transparent | `--color-gray-600` | — | `--color-gray-100` |
| `link` | transparent | `--color-brand-blue` | — | transparent |

Tamanhos:

| Tamanho | Height | Padding H | Font |
|---|---|---|---|
| `sm` | 28px | `--spacing-3` | `--font-size-sm` |
| `md` (default) | 36px | `--spacing-4` | `--font-size-base` |
| `lg` | 44px | `--spacing-6` | `--font-size-lg` |

Estado `disabled`: `opacity: 0.5; cursor: not-allowed;`

### Input / Textarea

```css
height: 36px;                          /* Input; Textarea sem height fixo */
padding: var(--spacing-2) var(--spacing-3);
border: 1px solid var(--border-color-strong);
border-radius: var(--radius-md);
font-size: var(--font-size-base);
color: var(--color-gray-900);
background: var(--color-brand-white);
transition: border-color 0.15s;

/* Focus */
border-color: var(--border-color-focus);
outline: 2px solid var(--color-brand-blue-100);
outline-offset: 0;

/* Placeholder */
color: var(--color-gray-400);
```

### Badge (StatusBadge)

```css
display: inline-flex;
align-items: center;
gap: var(--spacing-1);
padding: 2px var(--spacing-2);
border-radius: var(--radius-full);
font-size: var(--font-size-xs);
font-weight: var(--font-weight-medium);
border: 1px solid;
white-space: nowrap;
/* cores via TASK_STATUS_CONFIG */
```

### Card (base)

```css
background: var(--color-brand-white);
border: 1px solid var(--border-color);
border-radius: var(--radius-lg);
padding: var(--spacing-4);
box-shadow: var(--shadow-xs);
```

### Modal

```css
/* Overlay */
position: fixed; inset: 0;
background: rgba(0,0,0,0.5);
z-index: var(--z-overlay);
display: flex; align-items: center; justify-content: center;

/* Dialog */
background: var(--color-brand-white);
border-radius: var(--radius-xl);
box-shadow: var(--shadow-xl);
width: min(var(--filters-modal-width), 90vw);
max-height: var(--filters-modal-max-height);
overflow: hidden;
display: flex; flex-direction: column;
z-index: var(--z-modal);
```

### Drawer

```css
position: fixed;
top: var(--header-height);
right: 0;
bottom: 0;
width: var(--drawer-width);
background: var(--color-brand-white);
border-left: 1px solid var(--border-color);
box-shadow: var(--shadow-xl);
z-index: var(--z-drawer);
display: flex; flex-direction: column;
overflow: hidden;
transform: translateX(100%);
transition: transform 0.25s ease;

/* quando open */
transform: translateX(0);
```

### Toast

```css
position: fixed;
bottom: var(--spacing-6);
right: var(--spacing-6);
min-width: 280px;
max-width: 400px;
background: var(--color-gray-900);
color: var(--color-brand-white);
border-radius: var(--radius-lg);
padding: var(--spacing-3) var(--spacing-4);
box-shadow: var(--shadow-md);
z-index: var(--z-toast);
font-size: var(--font-size-sm);
```

---

## Layout — Header

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  EVP                          [Avatar] [Nome]   │
└─────────────────────────────────────────────────────────┘
height: 56px
background: --color-brand-blue
padding: 0 --spacing-6
display: flex; align-items: center; justify-content: space-between;
```

- Logo: `logo-prognum.svg` branca, 28px de altura
- Nome do sistema: "EVP" em `--font-size-lg`, `--font-weight-semibold`, branco
- Avatar do usuário: 32px, `--radius-full`, iniciais em `--color-brand-blue`

## Layout — Sidebar

```
┌──────────┐
│ Tarefas  │  ← item ativo: fundo brand-blue-700, borda esq. yellow
│ SCATs    │  ← item hover: fundo brand-blue-700
│          │
└──────────┘
width: 240px
background: --color-brand-blue-900
padding-top: --spacing-4
```

Cada item:
```css
display: flex; align-items: center; gap: var(--spacing-3);
padding: var(--spacing-3) var(--spacing-4);
color: var(--color-brand-blue-100);
font-size: var(--font-size-base);
font-weight: var(--font-weight-medium);
border-left: 3px solid transparent;
transition: background 0.15s, border-color 0.15s;

/* Ativo */
background: var(--color-brand-blue-700);
border-left-color: var(--color-brand-yellow);
color: var(--color-brand-white);

/* Hover */
background: var(--color-brand-blue-700);
```

---

## Tabela de Tarefas — visual

```
┌─────────────────────────────────────────────────────────────────────────┐
│ #  │ SCAT │ Descrição        │ Status     │ Responsável │ ... │ Ações   │
├─────────────────────────────────────────────────────────────────────────┤
│    │      │                  │ [badge]    │ [avatar+nome]│    │ [menu]  │
└─────────────────────────────────────────────────────────────────────────┘
```

- Header da tabela: `--color-gray-100`, `--font-size-sm`, `--font-weight-semibold`, `--color-gray-600`
- Linha normal: `--color-brand-white`
- Linha hover: `--color-gray-50`
- Linha com erro (`com_erro = true`): borda esquerda `2px solid --color-error`
- Linha de tarefa excluída: `opacity: 0.5; text-decoration: line-through;`
- Altura de linha: 44px
- Cursor: `pointer` (toda linha é clicável)

---

## Kanban — visual

```
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ...
│ DISPONÍVEL    │ │ EM ANDAMENTO  │ │ EM PAUSA      │
│ 12 tarefas    │ │ 8 tarefas     │ │ 3 tarefas     │
├───────────────┤ ├───────────────┤ ├───────────────┤
│ [TaskCard]    │ │ [TaskCard]    │ │ [TaskCard]    │
│ [TaskCard]    │ │               │ │               │
└───────────────┘ └───────────────┘ └───────────────┘
```

Coluna:
```css
min-width: 280px;
max-width: 320px;
background: var(--color-gray-100);
border-radius: var(--radius-lg);
padding: var(--spacing-3);
display: flex; flex-direction: column; gap: var(--spacing-2);
```

Header da coluna:
```css
display: flex; align-items: center; justify-content: space-between;
padding: var(--spacing-2) var(--spacing-1);
border-bottom: 2px solid; /* cor do status */
margin-bottom: var(--spacing-2);
font-weight: var(--font-weight-semibold);
font-size: var(--font-size-sm);
```

Card Kanban:
```css
background: var(--color-brand-white);
border: 1px solid var(--border-color);
border-radius: var(--radius-md);
padding: var(--spacing-3);
cursor: grab;
box-shadow: var(--shadow-xs);
transition: box-shadow 0.15s, transform 0.1s;

/* Dragging */
box-shadow: var(--shadow-lg);
transform: rotate(1.5deg);
cursor: grabbing;
```

---

## Ícones do domínio EVP

```typescript
// src/constants/icons.ts — extensão para o EVP
import {
  LayoutList, Columns3, Filter, SlidersHorizontal,
  ChevronDown, ChevronRight, ChevronLeft,
  X, Plus, Search, MoreHorizontal,
  CheckCircle2, Circle, PauseCircle, Clock, AlertCircle,
  User, Users, Building2, Cpu, Calendar, Clock3,
  AlertTriangle, Trash2, ExternalLink,
  GripVertical, ArrowUpDown, Eye, EyeOff,
  LayoutDashboard, FileText,
} from 'lucide-react';

export const ICONS = {
  // Views
  viewList:    LayoutList,
  viewKanban:  Columns3,

  // Actions
  filter:      Filter,
  settings:    SlidersHorizontal,
  search:      Search,
  close:       X,
  add:         Plus,
  more:        MoreHorizontal,
  drag:        GripVertical,
  sort:        ArrowUpDown,
  show:        Eye,
  hide:        EyeOff,
  external:    ExternalLink,
  delete:      Trash2,

  // Navigation
  chevronDown:  ChevronDown,
  chevronRight: ChevronRight,
  chevronLeft:  ChevronLeft,

  // Status de tarefa
  statusDisponivel:   Circle,
  statusEmAndamento:  Clock,
  statusEmPausa:      PauseCircle,
  statusVencida:      AlertCircle,
  statusConcluida:    CheckCircle2,

  // Domínio EVP
  task:        FileText,
  scat:        LayoutDashboard,
  user:        User,
  users:       Users,
  sector:      Building2,
  system:      Cpu,
  client:      Building2,
  calendar:    Calendar,
  time:        Clock3,
  warning:     AlertTriangle,
} as const;
```

---

## Skeleton loaders

Padrão de animação:

```css
/* Usado em todos os skeletons */
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.skeleton {
  background: var(--color-gray-200);
  border-radius: var(--radius-sm);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
```

Duração do skeleton: **600ms** de latência simulada no `mockApi` (os primeiros 400ms o skeleton aparece; nos últimos 200ms o conteúdo já é visível).

Skeleton da tabela: 8 linhas com células em shimmer.
Skeleton do kanban: 3 colunas × 3 cards cada.
Skeleton do drawer: título + 6 campos de info.
Skeleton de SCAT card: título + 3 linhas de meta.

---

## Responsividade

O sistema é **desktop-first** (uso interno corporativo). Breakpoints:

```css
/* Mobile */
@media (max-width: 768px) {
  --sidebar-width: 0;         /* sidebar some, burger menu aparece */
  --content-padding-x: var(--spacing-4);
  --drawer-width: 100vw;
}

/* Tablet */
@media (max-width: 1024px) {
  --sidebar-width: var(--sidebar-width-collapsed);  /* só ícones */
  --drawer-width: 360px;
}
```

No mobile, o Kanban rola horizontalmente (`overflow-x: auto`).
Na tabela mobile, mostrar apenas as 5 colunas mais importantes (ID, Descrição, Status, Responsável, Prazo).
