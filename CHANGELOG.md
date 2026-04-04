# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.3.0] - 2026-04-04

### Corrigido

- Dose por peso na UI: ao trocar para fármacos com `mgkg`, a dose inicial agora respeita o peso atual do paciente.
- Infusão contínua-like: a duração de infusão acompanha corretamente a mudança de intervalo.
- Testes unitários do engine: a suíte passou a importar o código de produção em vez de manter uma implementação duplicada.
- Helper de AUC24: `calcAUC24()` agora usa a regra trapezoidal conforme a documentação.
- Metadados e docs: manifesto, README e changelog alinhados com a versão e capacidades atuais do projeto.

## [1.2.0] - 2026-03-15

### Adicionado

- 23 antimicrobianos de 11 classes: Carbapenens (meropenem, imipenem, ertapenem), Cefalosporinas (cefepima, ceftazidima, ceftazidima-avibactam, ceftriaxona), Penicilinas (piperacilina-tazobactam, ampicilina-sulbactam, oxacilina), Glicopeptídeos (vancomicina, teicoplanina), Aminoglicosídeos (amicacina, gentamicina), Lipopeptídeo (daptomicina), Oxazolidinona (linezolida), Polimixina (polimixina B), Nitroimidazol (metronidazol), Fluoroquinolonas (levofloxacino, ciprofloxacino) e Antifúngicos (anfotericina B lipossomal, fluconazol, voriconazol).
- Cenários clínicos predefinidos: Mero IE 3h, Mero IC 24h, Vanco ataque, Pipe/Tazo IE, Amika ODD, Sepse + ARC, DRC G4, Teico loading, PoliB loading, Levo 750, Cipro Pseudo, Fluco 800 D1 e Vori loading.
- Dose de ataque: seção colapsável com número de doses, intervalo e dose configuráveis.
- Painel educacional por classe PK/PD.
- Efeitos adversos e limitações do modelo por antimicrobiano.
- Comparação de regimes.
- Ajuste renal automático.
- Dose por peso para drogas selecionadas.
- PWA offline.
- Tema claro/escuro com alternância manual.
- Testes automatizados com Vitest para engine e integração.
- GitHub Actions para testes, build e deploy no GitHub Pages.

### Modelo farmacocinético

- Monocompartimental de infusão IV intermitente.
- Fase de infusão: `C(t) = (R0 / ke·Vd) × (1 - e^(-ke·t))`.
- Fase pós-infusão: `C(t) = C_end × e^(-ke·(t - tInf))`.
- Ajuste renal: `t1/2adj = ln2 / (ke × (fr × GFR/120 + (1 - fr)))`.
- Simulação: `dt = 0.05h` para curvas padrão e `0.25h` para horizontes longos.

## [1.0.0] - 2026-01-01

### Adicionado

- Versão inicial com 18 antimicrobianos de 9 classes.
- Modelo monocompartimental IV com ajuste renal.
- Gráfico interativo com Chart.js.
- Interface responsiva.
- PWA com suporte offline.

[1.3.0]: https://github.com/RodrigoPLCosta/PKPD_simulator/releases/tag/v1.3.0
[1.2.0]: https://github.com/RodrigoPLCosta/PKPD_simulator/releases/tag/v1.2.0
[1.0.0]: https://github.com/RodrigoPLCosta/PKPD_simulator/releases/tag/v1.0.0
