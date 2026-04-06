# Contribuindo para o Simulador PK/PD

Obrigado pelo interesse em contribuir. Este projeto é uma ferramenta educacional e toda ajuda é bem-vinda, seja propondo novos fármacos, corrigindo parâmetros PK, melhorando a interface, expandindo a suíte de testes ou reportando bugs.

## Como contribuir

### 1. Propor um novo antimicrobiano

Para adicionar um novo fármaco ao simulador, reúna parâmetros farmacocinéticos populacionais de adultos com função hepática normal:

| Parâmetro | Descrição | Exemplo (meropenem) |
|-----------|-----------|---------------------|
| `vdkg` | Volume de distribuição (L/kg) | 0.3 |
| `hl` | Meia-vida de eliminação (horas) | 1 |
| `fr` | Fração de eliminação renal (0–1) | 0.70 |
| `pb` | Ligação proteica (0–1) | 0.02 |
| `dose` | Dose padrão (mg) | 1000 |
| `int` | Intervalo posológico padrão (h) | 8 |
| `inf` | Tempo de infusão padrão (min) | 30 |
| `mic` | MIC de referência (mg/L) | 2 |
| `tt` | Tipo de alvo PK/PD: `tmic`, `auc`, `cmax`, `trough` | `tmic` |

**Fontes aceitas:** artigos indexados no PubMed, bulas aprovadas por agências reguladoras (ANVISA, FDA, EMA) ou guidelines de sociedades médicas (IDSA, ESCMID, ASHP).

#### Passo a passo

1. Faça um fork do repositório.
2. Crie uma branch: `git checkout -b feat/novo-farmaco-nome`.
3. Adicione os dados do fármaco nas fontes de `src/drugs/` e atualize `src/drugs/index.js` se necessário.
4. Adicione conteúdo educacional ou referências em `src/drugs/educContent.js` quando fizer sentido.
5. Se o fármaco usa dosagem por `mg/kg`, garanta que a UI continue sincronizando dose, presets e badge de peso.
6. Adicione pelo menos um cenário clínico relevante ao array `SCENARIOS`.
7. Atualize testes de domínio em `tests/pkpd.test.js` e, se houver efeito de interface, os testes em `tests/ui/`.
8. Atualize a documentação relevante (`README.md`, `CHANGELOG.md`) ao abrir o PR.

### 2. Corrigir parâmetros PK existentes

Se encontrou um parâmetro incorreto ou desatualizado:

1. Identifique o fármaco e o parâmetro a ser corrigido.
2. Apresente a referência bibliográfica que suporta a correção.
3. Abra um Pull Request com a justificativa.
4. Atualize ou adicione testes que cubram o comportamento impactado.

### 3. Melhorar a interface

A interface está em migração incremental para Material Design 3.

1. Preserve o shell e os contratos semânticos já existentes, a menos que o trabalho faça parte explícita de um sprint posterior.
2. Reutilize os tokens de `src/styles/tokens.css` e aliases de `src/styles/theme.css` em vez de introduzir novas cores hardcoded.
3. Sempre que mudar comportamento de UI, atualize ou adicione testes em `tests/ui/`.
4. Não altere cálculo PK/PD como efeito colateral de mudança visual.

### 4. Reportar um bug

Abra uma [Issue](https://github.com/RodrigoPLCosta/PKPD_simulator/issues/new) incluindo:

- Descrição do comportamento observado vs. esperado.
- Fármaco e parâmetros utilizados (dose, intervalo, GFR, peso).
- Navegador e sistema operacional.
- Screenshot, se aplicável.
- Se o bug é visual, informe também o tema usado e se ocorreu em desktop ou mobile.

## Template de Pull Request

Ao abrir um PR, use o seguinte template no corpo:

```markdown
## Tipo de mudança

- [ ] Novo antimicrobiano
- [ ] Correção de parâmetro PK
- [ ] Correção de bug
- [ ] Melhoria de interface
- [ ] Testes
- [ ] Documentação
- [ ] Outro: ___________

## Descrição

[Descreva brevemente a mudança e a motivação]

## Referências bibliográficas

- [Cite as referências que suportam os parâmetros ou a correção]
- Formato: Autor et al. Título. *Revista*. Ano;vol(num):pags. DOI/PMID.

## Parâmetros PK (se aplicável)

| Parâmetro | Valor | Fonte |
|-----------|-------|-------|
| Vd (L/kg) | | |
| t1/2 (h) | | |
| Fração renal | | |
| Ligação proteica | | |

## Checklist

- [ ] Rodei `npm test`
- [ ] Rodei `npm run build`
- [ ] Atualizei testes de domínio e/ou UI quando necessário
- [ ] Atualizei a documentação afetada
- [ ] Não quebrei funcionalidades existentes
- [ ] Não alterei o motor PK/PD sem justificativa explícita
```

## Ambiente de desenvolvimento

O projeto usa Vite e módulos ES.

```bash
# Clone o repositório
git clone https://github.com/RodrigoPLCosta/PKPD_simulator.git
cd PKPD_simulator

# Instale dependências
npm install

# Servidor local
npm run dev

# Testes
npm test

# Build de produção
npm run build
```

## Estrutura relevante para contribuições

- `src/drugs/`: dados farmacológicos, cenários e conteúdo educacional.
- `src/engine/`: motor PK, alvos PK/PD e ajuste renal.
- `src/ui/`: lógica de binding dos controles, gráfico e tema.
- `src/styles/`: tokens MD3, tema semântico e estilos do shell atual.
- `tests/ui/`: smoke tests e contratos de UI em `jsdom`.

## Padrões de código

- O app usa arquitetura modular com ES Modules; não adicione JavaScript inline ao `index.html`.
- Reutilize tokens e aliases de tema existentes antes de criar novas variáveis CSS.
- Mantenha nomes e arredondamentos consistentes com o código existente.
- Ao mexer em comportamento visual, prefira primeiro escrever ou ajustar o teste correspondente.
- Não misture refatoração visual ampla com alteração de lógica clínica no mesmo PR.

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a [MIT License](LICENSE).
