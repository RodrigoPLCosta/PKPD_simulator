# Planejamento de Migração para Material Design 3

## Escopo escolhido

Este plano assume a adoção integral das opções selecionadas:

1. `1a` Top app bar + navigation rail/drawer + conteúdo principal em superfícies tonais distintas.
2. `2a` Sistema de superfícies completo em tokens MD3.
3. `3a` Escala tipográfica MD3.
4. `4a` Controles no padrão MD3 com moléculas consistentes.
5. `5a` Classes e cenários em chips; antimicrobianos em lista selecionável.
6. `6a` Métrica-alvo em destaque como card principal.
7. `7a` Narrativa principal fora do canvas para limpar o gráfico.
8. `8a` Feedback clínico unificado em componentes MD3.
9. `9a` Mobile com modal bottom sheet MD3.
10. `10a` Tema Material You com tokens tonais e seed color.

## Status de execução

- Sprint 0 concluido no codigo: harness de UI com vitest + jsdom, fixture do shell real e smoke tests de app shell, tema e navegacao mobile.
- Sprint 1 concluido no codigo: tokens MD3, tipografia base, contrato de tema claro/escuro por tokens e integracao do grafico ao tema.
- Porte adicional vindo de main: caminhos relativos de assets, correcao do yMax do grafico para comparacao/incerteza/alvos e resincronizacao visual ao aplicar cenarios clinicos.

## Premissas

- Não alterar cálculo PK/PD nem contrato clínico do simulador.
- A migração é prioritariamente de design system, shell, UX e semântica de componentes.
- O gráfico continua em `Chart.js`.
- O estado continua inicialmente em JS imperativo; refatoração de framework não faz parte deste plano.
- A suíte atual cobre motor e helpers, mas praticamente não cobre DOM/UI. Isso precisa ser corrigido antes da mudança visual pesada.

## Estratégia geral

### Ordem de implementação

A ordem mais segura é:

1. Congelar baseline funcional e criar infraestrutura de testes de UI.
2. Introduzir tokens MD3 e tema sem trocar layout inteiro de uma vez.
3. Migrar o shell da aplicação.
4. Migrar controles e padrões de seleção.
5. Migrar leitura clínica e componentes de feedback.
6. Refatorar o gráfico para o novo modelo de leitura.
7. Fechar mobile, integração e regressão visual.

### Motivo da ordem

- `2a` e `10a` precisam vir cedo porque o resto depende de tokens, superfícies e tema.
- `1a` depende desses tokens, mas deve acontecer antes dos componentes menores para evitar retrabalho de espaçamento e hierarquia.
- `4a` e `5a` são a maior superfície de interação; devem entrar quando o shell já estiver estável.
- `6a` e `8a` dependem do novo sistema de superfícies, tipografia e componentes.
- `7a` deve vir depois, porque o gráfico precisa refletir a nova hierarquia informacional já decidida fora dele.
- `9a` fecha a experiência mobile quando a versão desktop já estiver semanticamente consolidada.

## Estratégia TDD

### Objetivo

Usar TDD para proteger comportamento, acessibilidade e contratos visuais estruturais, sem tentar testar CSS pixel a pixel cedo demais.

### Pirâmide de testes proposta

1. Testes de domínio
- Reutilizar os testes atuais de `pkEngine`, `renalAdjust`, `pkpdTargets` e `controlLogic`.
- Não misturar mudanças visuais com alterações nesses testes, salvo necessidade de cobertura adicional de contratos usados pela UI.

2. Testes de contrato de apresentação
- Validar estrutura esperada de componentes e regiões de layout.
- Validar classes/atributos semânticos, estados selecionado/expandido, presença de textos-chave e prioridade visual lógica.

3. Testes de comportamento DOM
- Validar interações de app bar, drawer, bottom sheet, chips, lista de drogas, controles, feedback e painéis expansíveis.
- Validar teclado, foco, `aria-expanded`, `aria-selected`, `aria-controls`, fechamento por `Escape`, overlay e restore de estado.

4. Testes de integração
- Validar que uma sequência clínica relevante continua possível fim a fim.
- Validar que trocar droga, cenário, parâmetros e tema continua atualizando métricas, feedback e gráfico corretamente.

5. Testes de regressão visual
- Adicionar por último, quando a estrutura estabilizar.
- Foco em snapshots de shell, controles, métricas e mobile sheet.

### Infraestrutura de testes a introduzir

Antes da migração visual, planejar a introdução de:

- `vitest` com ambiente `jsdom`.
- Helpers de render DOM com fixtures do `index.html`.
- Biblioteca de queries e eventos para DOM.
- Matchers de acessibilidade/semântica.
- Opcional na fase final: snapshots visuais ou screenshots automatizadas.

### Convenções TDD

Para cada item de UI:

1. Escrever teste de contrato/uso.
2. Implementar a menor mudança para passar.
3. Refatorar CSS/JS/tokens mantendo os testes verdes.
4. Só então mover para o próximo componente.

Regra de corte:

- Não misturar shell, componentes e gráfico no mesmo commit lógico.
- Cada sprint termina com suíte verde e sem regressões manuais críticas.

## Sprints

### Sprint 0 - Baseline e Harness de Testes

#### Objetivo

Criar a base de proteção para a migração.

#### Entregas

- Documentar contratos atuais de UI.
- Introduzir ambiente de testes DOM.
- Criar fixtures de renderização da aplicação.
- Criar smoke tests do shell atual.

#### Testes a desenvolver primeiro

- `tests/ui/app-shell.test.js`
  - renderiza header, sidebar, área principal e canvas.
  - garante que os controles essenciais existem.
- `tests/ui/theme.test.js`
  - garante toggle de tema, classe no `body` e atualização de `meta[name="theme-color"]`.
- `tests/ui/navigation-smoke.test.js`
  - garante abertura/fechamento do drawer mobile atual.

#### Gate de saída

- Suíte existente continua verde.
- Nova suíte de UI consegue montar a app sem browser real.
- Existe baseline para comparar mudanças subsequentes.

### Sprint 1 - Fundação MD3: Tokens, Tema e Tipografia

#### Itens cobertos

- `2a`
- `3a`
- `10a`

#### Objetivo

Criar o design system base antes de trocar layout ou componentes.

#### Entregas

- Arquivo de tokens MD3 com papéis tonais.
- Seed color e derivação de superfícies.
- Nova escala tipográfica.
- Mapeamento de estados (`primary`, `secondary`, `tertiary`, `error`, `outline`, `surface-container-*`).
- Tema claro/escuro estruturado por tokens, não por overrides pontuais.

#### Testes TDD

- `tests/ui/tokens.test.js`
  - garante presença dos tokens obrigatórios.
  - garante coerência entre tema claro e escuro.
- `tests/ui/typography.test.js`
  - garante aplicação das classes ou tokens tipográficos principais nas regiões críticas.
- `tests/ui/theme-contract.test.js`
  - garante que a troca de tema altera tokens esperados sem quebrar shell.

#### Gate de saída

- Nenhum componente novo ainda.
- App visualmente consistente com novo tema base.
- Nenhuma quebra de comportamento.

### Sprint 2 - App Shell e Hierarquia Global

#### Itens cobertos

- `1a`
- parte estrutural de `9a`

#### Objetivo

Trocar a arquitetura visual da tela sem ainda redesenhar todos os controles.

#### Entregas

- Top app bar MD3.
- Navigation rail no desktop ou drawer persistente conforme breakpoint.
- Região principal com superfícies tonais e hierarchy zones.
- Faixa superior de contexto clínico no conteúdo principal.

#### Testes TDD

- `tests/ui/app-bar.test.js`
  - renderiza top app bar com ações e título.
  - valida semântica e acessibilidade das ações.
- `tests/ui/navigation-layout.test.js`
  - valida presença e comportamento de rail/drawer por breakpoint lógico.
- `tests/ui/layout-regions.test.js`
  - valida que classes/regiões de layout são estáveis: navegação, workspace, contexto secundário.

#### Gate de saída

- Shell pronto e estável em desktop.
- Estrutura de layout sem cards arbitrários.
- Sem refatorar ainda o miolo dos controles.

### Sprint 3 - Controles MD3 e Padrões de Seleção

#### Itens cobertos

- `4a`
- `5a`

#### Objetivo

Substituir os controles fragmentados por padrões consistentes de input e seleção.

#### Entregas

- Campos numéricos e sliders reorganizados como componentes MD3 consistentes.
- Classes e cenários em `filter chips`.
- Antimicrobianos em lista selecionável com título/subtítulo/estado.
- Estados selecionado, hover, foco, disabled e supporting text padronizados.

#### Testes TDD

- `tests/ui/filter-chips.test.js`
  - seleção de classe e cenário.
  - `aria-pressed` ou `aria-selected` consistente.
- `tests/ui/drug-list.test.js`
  - troca de droga atualiza seleção visual e contexto.
- `tests/ui/parameter-controls.test.js`
  - sincronização entre campo numérico, presets e slider.
  - dose dependente de peso continua correta.
- `tests/ui/loading-dose-panel.test.js`
  - expandir/recolher dose de ataque com atributos semânticos corretos.

#### Gate de saída

- Fluxo principal de parametrização completo no novo sistema de componentes.
- Nenhuma regressão em sincronização de estado.

### Sprint 4 - Métricas, Feedback Clínico e Painel Educacional

#### Itens cobertos

- `6a`
- `8a`

#### Objetivo

Reorganizar a leitura clínica para que o usuário entenda prioridade, interpretação e risco em um único sistema visual.

#### Entregas

- Métrica-alvo em `featured card`.
- Métricas secundárias em cards ou lista de apoio.
- Alertas, banners, supporting text e painéis educacionais unificados em linguagem MD3.
- Severidade consistente por cor tonal, ícone e copy.

#### Testes TDD

- `tests/ui/metric-cards.test.js`
  - a métrica primária correta recebe destaque conforme droga.
- `tests/ui/clinical-feedback.test.js`
  - alertas mudam conforme resultado simulado.
- `tests/ui/educational-panel.test.js`
  - painel expande, colapsa e renderiza conteúdo correto por classe/droga.

#### Gate de saída

- Leitura de prioridade clínica clara sem depender do gráfico.
- Feedback padronizado e semanticamente coerente.

### Sprint 5 - Refatoração do Gráfico e Narrativa Fora do Canvas

#### Itens cobertos

- `7a`

#### Objetivo

Limpar o gráfico e mover explicação de alto nível para uma faixa contextual externa.

#### Entregas

- Resumo narrativo principal fora do canvas.
- Canvas reduzido a dados, linhas-alvo e marcações indispensáveis.
- Legenda e anotações revisadas com prioridade por informação.
- Ajustes de contraste para o sistema tonal MD3.

#### Testes TDD

- `tests/ui/chart-summary.test.js`
  - faixa narrativa externa reflete o estado PK/PD correto.
- `tests/ui/chart-contract.test.js`
  - datasets essenciais continuam presentes.
  - comparação, incerteza e alvos continuam acionando os elementos certos.
- `tests/ui/chart-legend.test.js`
  - legenda reage corretamente a comparação salva e incerteza.

#### Gate de saída

- O gráfico volta a ser o workspace principal, não um painel sobrecarregado.
- A narrativa clínica principal não depende mais de texto desenhado no canvas.

### Sprint 6 - Mobile MD3 com Modal Bottom Sheet

#### Itens cobertos

- conclusão de `9a`

#### Objetivo

Fazer o mobile parecer desenhado para mobile, não apenas adaptado.

#### Entregas

- Modal bottom sheet MD3 para parâmetros.
- Estados fechada/aberta/drag/overlay/escape consistentes.
- Ajuste de densidade tipográfica e de touch targets.
- Revisão de ordem visual das informações no viewport pequeno.

#### Testes TDD

- `tests/ui/mobile-sheet.test.js`
  - abre, fecha, mantém foco e fecha por overlay/escape.
- `tests/ui/mobile-layout.test.js`
  - regiões críticas continuam acessíveis em viewport pequeno.
- `tests/ui/mobile-actions.test.js`
  - ações principais continuam acessíveis com sheet aberta e fechada.

#### Gate de saída

- Mobile utilizável com uma mão.
- Sem colisão entre sheet, gráfico e ações principais.

### Sprint 7 - Integração, Regressão Visual e Hardening

#### Objetivo

Consolidar a migração e reduzir regressão acumulada.

#### Entregas

- Limpeza de CSS legado e regras duplicadas.
- Revisão de nomes de classes e contratos de componentes.
- Regressão visual para desktop e mobile.
- Checklist final de acessibilidade e consistência.

#### Testes TDD

- `tests/ui/user-flows.test.js`
  - fluxo beta-lactâmico.
  - fluxo vancomicina.
  - fluxo aminoglicosídeo.
  - fluxo com comparação salva.
- snapshots estruturais ou screenshots para:
  - shell desktop.
  - formulário de parâmetros.
  - cards de métricas.
  - gráfico com comparação.
  - mobile bottom sheet.

#### Gate de saída

- Suíte de domínio verde.
- Suíte DOM verde.
- Regressão visual aprovada.
- Sem divergência grave entre desktop e mobile.

## Ordem de arquivos sugerida por sprint

### Sprint 0

- `tests/*`
- configuração de `vitest`

### Sprint 1

- `src/styles/theme.css`
- possível novo `src/styles/tokens.css`
- `src/ui/theme.js`

### Sprint 2

- `index.html`
- `src/styles/base.css`
- `src/main.js`

### Sprint 3

- `src/styles/controls.css`
- `src/ui/controls.js`
- `src/ui/controlLogic.js` se necessário

### Sprint 4

- `src/styles/chart.css`
- `src/ui/educPanel.js`
- `src/ui/controls.js`

### Sprint 5

- `src/ui/chart.js`
- `src/styles/chart.css`
- regiões do `index.html` ligadas ao resumo externo

### Sprint 6

- `src/styles/controls.css`
- `src/styles/base.css`
- `src/ui/controls.js`

### Sprint 7

- limpeza transversal e testes finais

## Regras para evitar erros cumulativos

1. Não começar um sprint com falhas herdadas do sprint anterior.
2. Não trocar shell e controles profundos no mesmo bloco de trabalho sem testes intermediários.
3. Não introduzir regressão visual sem snapshot ou checklist manual correspondente.
4. Não mover o gráfico antes de estabilizar métricas e feedback externo.
5. Não fechar mobile antes do desktop estar semanticamente consolidado.
6. Não apagar CSS legado até existir cobertura suficiente para o novo contrato visual.

## Critérios de aceite finais

- A interface expressa Material Design 3 de forma clara, não apenas cosmética.
- Existe hierarquia visual inequívoca entre navegação, parâmetros, interpretação e workspace gráfico.
- O tema usa tokens tonais coerentes em claro e escuro.
- Os componentes principais têm cobertura de teste de comportamento.
- O fluxo clínico principal permanece intacto.
- O app continua leve e legível em desktop e mobile.

## Próximo passo após aprovação deste plano

Executar o Sprint 0 primeiro. Não começar a migração visual antes de fechar o harness de testes de UI.

