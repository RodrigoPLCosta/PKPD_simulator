# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.2.0] — 2026-03-15

### Adicionado

- **21 antimicrobianos de 9 classes:** Carbapenens (meropenem, imipenem, ertapenem), Cefalosporinas (cefepima, ceftazidima, ceftazidima-avibactam, ceftriaxona), Penicilinas (piperacilina-tazobactam, ampicilina-sulbactam, oxacilina), Glicopeptídeos (vancomicina, teicoplanina), Aminoglicosídeos (amicacina, gentamicina), Lipopeptídeo (daptomicina), Oxazolidinona (linezolida), Polimixina (polimixina B), Nitroimidazol (metronidazol), Fluoroquinolonas (levofloxacino, ciprofloxacino), Antifúngicos (anfotericina B lipossomal, fluconazol, voriconazol)
- **Cenários clínicos predefinidos:** Mero IE 3h, Mero IC 24h, Vanco ataque, Pipe/Tazo IE, Amika ODD, Sepse + ARC, DRC G4, Teico loading, PoliB loading, Levo 750, Cipro Pseudo, Fluco 800 D1, Vori loading
- **Dose de ataque (loading dose):** Seção colapsável com número de doses, intervalo e dose configuráveis. Expansão automática para drogas que tipicamente requerem loading (teicoplanina, voriconazol)
- **Painel educacional por classe PK/PD:** fT>MIC (beta-lactâmicos), AUC/MIC (vancomicina, linezolida, polimixina B, fluoroquinolonas, fluconazol), fCmax/MIC (aminoglicosídeos, daptomicina, metronidazol, anfotericina B), Vale (teicoplanina, voriconazol)
- **Efeitos adversos e limitações do modelo:** Database completa para cada antimicrobiano com referências bibliográficas
- **Comparação de regimes:** Salvar curva como referência e sobrepor visualmente para comparar regimes posológicos
- **Ajuste renal automático:** Classificação da TFG (ARC, Normal, DRC G2–G5, Diálise) com recomendações de ajuste por droga
- **Alertas clínicos contextuais:** AUC/MIC > 600 para vancomicina (nefrotoxicidade), AUCss > 100 para polimixina B, vale alto para aminoglicosídeos
- **Dose por peso (mg/kg):** Recálculo automático para vancomicina, aminoglicosídeos, daptomicina, polimixina B, teicoplanina, anfotericina B lipossomal, voriconazol
- **Botões de dose comercial:** Apresentações padrão por fármaco (ex: Pipe/Tazo 2.25g, 3.375g, 4.5g)
- **Presets de infusão:** Bolus, infusão estendida e contínua contextuais por fármaco
- **Card PK:** Parâmetros farmacocinéticos (Vd, t½, ligação proteica, eliminação renal) e referências por droga
- **MIC em escala log₂:** Slider com steps de 0.0625 a 256 mg/L
- **PWA offline:** Service Worker com cache de assets para uso sem internet
- **Tema claro/escuro:** Alternância de tema com persistência
- **Modo de fonte ampliada:** Acessibilidade para visualização em projetor/apresentação
- **Testes unitários:** Suite com Vitest validando equações PK (Cmax, Cmin, AUC₂₄) para meropenem, vancomicina, amicacina, cefepima e piperacilina-tazobactam
- **GitHub Actions CI/CD:** Lint de HTML e deploy automático para GitHub Pages
- **CONTRIBUTING.md:** Guia para contribuição com template de Pull Request
- **SRI (Subresource Integrity):** Hash SHA-384 no CDN do Chart.js

### Modelo farmacocinético

- Monocompartimental de infusão IV intermitente
- Fase de infusão: C(t) = (R₀ / ke·Vd) × (1 − e^(−ke·t))
- Fase pós-infusão: C(t) = C_end × e^(−ke·(t − tInf))
- Ajuste renal: t½adj = ln2 / (ke × (fr × GFR/120 + (1 − fr)))
- Simulação: dt = 0.05h (0.25h para teicoplanina), 48h (168h para teicoplanina, 96h para fluconazol)

---

## [1.0.0] — 2026-01-01

### Adicionado

- Versão inicial com 18 antimicrobianos de 9 classes
- Modelo monocompartimental IV com ajuste renal
- Gráfico interativo com Chart.js
- Interface responsiva (desktop + mobile)
- PWA com suporte offline

[1.2.0]: https://github.com/RodrigoPLCosta/PKPD_simulator/releases/tag/v1.2.0
[1.0.0]: https://github.com/RodrigoPLCosta/PKPD_simulator/releases/tag/v1.0.0
