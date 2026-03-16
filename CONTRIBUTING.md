# Contribuindo para o Simulador PK/PD

Obrigado pelo interesse em contribuir! Este projeto é uma ferramenta educacional e toda ajuda é bem-vinda, seja propondo novos fármacos, corrigindo parâmetros PK, melhorando a interface ou reportando bugs.

## Como contribuir

### 1. Propor um novo antimicrobiano

Para adicionar um novo fármaco ao simulador, você precisará reunir os seguintes parâmetros farmacocinéticos populacionais de adultos com função hepática normal:

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

**Fontes aceitas:** artigos indexados no PubMed, bulas aprovadas por agências reguladoras (ANVISA, FDA, EMA), ou guidelines de sociedades médicas (IDSA, ESCMID, ASHP).

#### Passo a passo

1. Faça um fork do repositório
2. Crie uma branch: `git checkout -b feat/novo-farmaco-nome`
3. Adicione o objeto do fármaco no dicionário `D` dentro de `index.html` (siga o padrão dos existentes)
4. Adicione os dados de efeitos adversos no objeto `ADV`
5. Se o fármaco usa dosagem por mg/kg, adicione o campo `mgkg`
6. Adicione pelo menos um cenário clínico relevante ao array `SCENARIOS`
7. Adicione testes unitários para o novo fármaco em `tests/pkpd.test.js`
8. Abra um Pull Request seguindo o template abaixo

### 2. Corrigir parâmetros PK existentes

Se encontrou um parâmetro incorreto ou desatualizado:

1. Identifique o fármaco e o parâmetro a ser corrigido
2. Apresente a referência bibliográfica que suporta a correção
3. Abra um Pull Request com a justificativa

### 3. Reportar um bug

Abra uma [Issue](https://github.com/RodrigoPLCosta/PKPD_simulator/issues/new) incluindo:

- Descrição do comportamento observado vs. esperado
- Fármaco e parâmetros utilizados (dose, intervalo, GFR, peso)
- Navegador e sistema operacional
- Screenshot, se aplicável

### 4. Adicionar screenshot

O repositório ainda não tem um `screenshot.png`. Para contribuir:

1. Abra o simulador no navegador (preferencialmente desktop, tema escuro)
2. Selecione Meropenem com infusão estendida de 3h
3. Tire um print da tela inteira (1200×800px ou maior)
4. Salve como `screenshot.png` na raiz do repositório
5. Abra um Pull Request

## Template de Pull Request

Ao abrir um PR, use o seguinte template no corpo:

```markdown
## Tipo de mudança

- [ ] Novo antimicrobiano
- [ ] Correção de parâmetro PK
- [ ] Correção de bug
- [ ] Melhoria de interface
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
| t½ (h) | | |
| Fração renal | | |
| Ligação proteica | | |

## Checklist

- [ ] Testei localmente (abri o `index.html` e verifiquei o gráfico)
- [ ] Adicionei/atualizei testes em `tests/pkpd.test.js`
- [ ] Os testes passam (`npm test`)
- [ ] Parâmetros baseados em artigo indexado no PubMed
- [ ] Adicionei efeitos adversos e limitações do modelo (objeto `ADV`)
- [ ] Não quebrei funcionalidades existentes
```

## Ambiente de desenvolvimento

O simulador é um single-file app (`index.html`), sem build necessário. Para desenvolver:

```bash
# Clone o repositório
git clone https://github.com/RodrigoPLCosta/PKPD_simulator.git
cd PKPD_simulator

# Instale dependências de teste
npm install

# Abra o simulador no navegador
open index.html   # macOS
xdg-open index.html  # Linux

# Execute os testes
npm test
```

## Padrões de código

- O JavaScript está inline no `index.html` (single-file architecture)
- Nomes de variáveis seguem o padrão do código existente (abreviados por concisão)
- Novos fármacos devem seguir exatamente a mesma estrutura do objeto `D`
- Valores de parâmetros PK devem ser arredondados de forma consistente com os existentes

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a [MIT License](LICENSE).
