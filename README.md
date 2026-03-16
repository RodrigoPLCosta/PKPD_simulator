<p align="center">
  <img src="icons/icon-192.png" alt="PKPD Simulator Logo" width="96">
</p>

<h1 align="center">Simulador PK/PD de Antimicrobianos</h1>

<p align="center">
  <strong>Ferramenta educacional interativa para simulação farmacocinética de antimicrobianos hospitalares</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.2-blue?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/antimicrobianos-18-orange?style=flat-square" alt="Drugs">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/PWA-offline--ready-blueviolet?style=flat-square" alt="PWA">
  <img src="https://img.shields.io/badge/demo-live-brightgreen?style=flat-square" alt="Live Demo">
</p>

<p align="center">
  <a href="https://rodrigoplcosta.github.io/PKPD_simulator/"><strong>🔗 Acessar o Simulador (Live Demo)</strong></a>
</p>

---

<!--
  📸 SCREENSHOT: Para adicionar um screenshot, abra o simulador no navegador,
  selecione Meropenem com IE 3h, tire um print da tela inteira, salve como
  "screenshot.png" na raiz do repo e descomente a tag <img> abaixo.
-->
<!-- <p align="center"><img src="screenshot.png" alt="Screenshot do Simulador PK/PD" width="800"></p> -->
<p align="center"><em>📸 Screenshot em breve — contribuições são bem-vindas! Veja <a href="CONTRIBUTING.md">CONTRIBUTING.md</a>.</em></p>

---

## Sobre o projeto

Simulador farmacocinético interativo de antimicrobianos hospitalares, desenvolvido como ferramenta educacional para médicos, farmacêuticos, residentes e estudantes da área de saúde.

Calcula e exibe graficamente a curva de concentração sérica ao longo do tempo para **18 antimicrobianos** de **9 classes**, usando um modelo farmacocinético monocompartimental IV. Permite visualizar em tempo real como alterações na dose, intervalo, tempo de infusão e função renal impactam os parâmetros PK/PD preditores de eficácia clínica.

**Autor:** Rodrigo Pinheiro Leal Costa · 2026

---

## Modelo farmacocinético

O motor de simulação utiliza um modelo monocompartimental de infusão IV intermitente:

- **Fase de infusão:** C(t) = (R₀ / ke·Vd) × (1 - e^(-ke·t)), onde R₀ = dose/tempo de infusão
- **Fase pós-infusão:** C(t) = C(end) × e^(-ke·(t - tInf))
- **Ajuste renal:** a meia-vida é recalculada pela fração de eliminação renal e a TFG do paciente: t½adj = ln2 / (ke × (fr × GFR/120 + (1 - fr)))

A simulação gera pontos de concentração total e livre (fração não-ligada = 1 - ligação proteica) a cada 0.05h (ou 0.25h para teicoplanina), ao longo de 48h (168h para teicoplanina).

### Parâmetros PK/PD calculados

| Parâmetro | Descrição | Alvo clínico |
|-----------|-----------|---------------|
| **fT > MIC (SS)** | Fração do intervalo posológico no steady-state em que a concentração livre supera o MIC | Alvo primário para beta-lactâmicos |
| **AUC₂₄/MIC** | Razão da área sob a curva em 24h pelo MIC | Vancomicina 400–600 (IDSA 2020), linezolida, polimixina B |
| **fCmax/MIC** | Razão do pico de concentração livre pelo MIC | Aminoglicosídeos ≥8–10 |
| **Cmin (vale)** | Concentração mínima no steady-state | Teicoplanina 15–30 mg/L |

---

## Antimicrobianos disponíveis (18 drogas, 9 classes)

| Classe | Fármacos |
|--------|----------|
| Carbapenens | Meropenem, Imipenem, Ertapenem |
| Cefalosporinas | Cefepima, Ceftazidima, Ceftazidima-Avibactam, Ceftriaxona |
| Penicilinas | Piperacilina-Tazobactam, Ampicilina-Sulbactam, Oxacilina |
| Glicopeptídeos | Vancomicina, Teicoplanina |
| Aminoglicosídeos | Amicacina, Gentamicina |
| Lipopeptídeo | Daptomicina |
| Oxazolidinona | Linezolida |
| Polimixina | Polimixina B |
| Nitroimidazol | Metronidazol |

---

## Funcionalidades

- **Seleção rápida de dose:** botões com apresentações comerciais (ex: Pipe/Tazo 2.25g, 3.375g, 4.5g)
- **Intervalos discretos:** botões de intervalo posológico relevantes para cada droga (ex: q4h, q6h, q8h)
- **Presets de infusão:** bolus, infusão estendida e contínua, contextuais por fármaco
- **Dose por peso:** drogas dosadas por mg/kg (vancomicina, aminoglicosídeos, daptomicina, polimixina B, teicoplanina) recalculam automaticamente ao alterar o peso
- **Dose de ataque:** seção colapsável (opcional), expande automaticamente para drogas que usam loading dose
- **Ajuste renal:** classificação automática da TFG (ARC, Normal, DRC G2–G5, Diálise) com recomendações contextuais
- **Cenários clínicos:** presets rápidos (ex: Mero IE 3h, Vanco ataque, Sepse + ARC)
- **Comparação de regimes:** salve uma curva como referência e compare visualmente com o regime atual
- **Gráfico interativo:** Chart.js com labels de Cmax/Cmin, destaque fT>MIC, AUC shading, dose markers
- **Card PK:** parâmetros farmacocinéticos (Vd, t½, ligação proteica, eliminação renal) e referências
- **Painel educacional:** informações clínicas, efeitos adversos e limitações do modelo por droga
- **Tema claro/escuro:** alternância de tema com um clique

---

## Tecnologia

| Componente | Detalhes |
|------------|----------|
| **Arquitetura** | Single-file app (HTML + CSS + JS) |
| **Gráficos** | Chart.js 4.4.1 (CDN) |
| **Tipografia** | Google Fonts — DM Sans + JetBrains Mono |
| **PWA** | Service Worker para uso offline |
| **Responsivo** | Desktop (sidebar + gráfico) e mobile (stacked) |
| **Acessibilidade** | Modo de fonte ampliada |

## Estrutura de arquivos

```
PKPD_simulator/
├── index.html          ← App principal (HTML + CSS + JS)
├── manifest.json       ← Metadados da PWA
├── sw.js               ← Service Worker (cache offline)
├── README.md           ← Este arquivo
├── LICENSE             ← Licença MIT
├── screenshot.png      ← Screenshot para o README (a ser adicionado)
└── icons/
    ├── apple-touch-icon.png
    ├── favicon-32.png
    └── icon-{72,96,128,144,152,180,192,384,512}.png
```

---

## Instalação como PWA

**iPhone (Safari):** Abra o site → botão Compartilhar → "Adicionar à Tela de Início"

**Android (Chrome):** Abra o site → banner automático ou menu ⋮ → "Instalar aplicativo"

Após instalação, o app funciona offline.

---

## Referências bibliográficas

Parâmetros farmacocinéticos populacionais validados contra literatura:

- Craig WA. Pharmacokinetic/pharmacodynamic parameters: rationale for antibacterial dosing of mice and men. *Clin Infect Dis*. 1998;26(1):1-10.
- Drusano GL. Antimicrobial pharmacodynamics: critical interactions of 'bug and drug'. *Nat Rev Microbiol*. 2004;2(4):289-300.
- Roberts JA, Lipman J. Pharmacokinetic issues for antibiotics in the critically ill patient. *Clin Pharmacokinet*. 2009;48(2):89-124.
- Mouton JW, Vinks AA. Pharmacokinetic/pharmacodynamic modelling of antibacterials in vitro and in vivo using bacterial growth and kill kinetics. *Clin Pharmacokinet*. 2005;44(2):201-210.
- Nicolau DP. Optimizing outcomes with antimicrobial therapy through pharmacodynamic profiling. *J Infect Chemother*. 2003;9(4):292-296.
- Rybak MJ et al. Therapeutic monitoring of vancomycin for serious methicillin-resistant *Staphylococcus aureus* infections: a revised consensus guideline. *Am J Health-Syst Pharm*. 2020;77(11):835-864.
- Hanai Y et al. Optimal trough concentration of teicoplanin for the treatment of MRSA infections. *J Antimicrob Chemother*. 2022.
- Wilson AP. Clinical pharmacokinetics of teicoplanin. *Clin Pharmacokinet*. 2000;39(3):167-183.
- Pais GM et al. Polymyxin B dosing in renal impairment. *Pharmacotherapy*. 2022.
- Sandri AM et al. Population pharmacokinetics of intravenous polymyxin B. *Clin Infect Dis*. 2013;57(4):524-531.
- Dvorchik B et al. Daptomycin pharmacokinetics and safety following administration of escalating doses once daily. *J Clin Pharmacol*. 2003;43(6):612-620.
- Stalker DJ, Jungbluth GL. Clinical pharmacokinetics of linezolid. *Clin Pharmacokinet*. 2003;42(13):1129-1140.
- Barclay ML et al. Adaptive resistance to tobramycin in *Pseudomonas aeruginosa*. *J Antimicrob Chemother*. 1996;37(2):253-263.
- Taccone FS et al. Revisiting the loading dose of amikacin for patients with severe sepsis and septic shock. *Crit Care*. 2010;14(2):R53.

---

## Como citar

Se você utilizar este simulador em atividades acadêmicas ou educacionais, por favor cite:

```bibtex
@software{costa2026pkpd,
  author    = {Costa, Rodrigo Pinheiro Leal},
  title     = {Simulador PK/PD de Antimicrobianos: ferramenta interativa para simulação farmacocinética hospitalar},
  version   = {1.2},
  year      = {2026},
  url       = {https://rodrigoplcosta.github.io/PKPD_simulator/},
  note      = {Ferramenta educacional — não substitui avaliação clínica individualizada}
}
```

**ABNT:**
COSTA, Rodrigo Pinheiro Leal. **Simulador PK/PD de Antimicrobianos**: ferramenta interativa para simulação farmacocinética hospitalar. Versão 1.2. 2026. Disponível em: https://rodrigoplcosta.github.io/PKPD_simulator/

---

## Limitações do modelo

> **⚠️ Este simulador é uma ferramenta EDUCACIONAL e NÃO substitui avaliação clínica individualizada nem monitoramento terapêutico de drogas (TDM).**

O motor de simulação utiliza um **modelo monocompartimental** de infusão IV intermitente com parâmetros populacionais de adultos. Isso implica limitações relevantes:

- **Volume de distribuição (Vd) fixo:** O simulador utiliza um Vd populacional único (L/kg), mas na prática clínica o Vd varia amplamente entre pacientes. Em pacientes críticos (sepse, queimados, cirurgia cardíaca com CEC, ECMO), o Vd pode aumentar 50–100% devido a expansão do terceiro espaço, ressuscitação volêmica agressiva e aumento da permeabilidade capilar (Roberts JA, Lipman J. *Clin Pharmacokinet*. 2009;48(2):89-124). Isso resulta em concentrações séricas reais **significativamente menores** que as estimadas pelo simulador, especialmente para drogas hidrofílicas (beta-lactâmicos, aminoglicosídeos, vancomicina, polimixina B).

- **Fase de distribuição (α) não modelada:** Para drogas bicompartimentais (vancomicina, teicoplanina, aminoglicosídeos), o Cmax pós-infusão pode ser superestimado em 30–50%. O AUC e o vale são mais confiáveis neste simulador que o Cmax.

- **Ligação proteica constante:** O modelo assume ligação proteica fixa, mas em hipoalbuminemia (comum em UTI, cirrose, síndrome nefrótica) a fração livre de drogas altamente ligadas (ertapenem, ceftriaxona, oxacilina, daptomicina, teicoplanina) pode aumentar 2–4×, alterando eficácia e toxicidade reais.

- **Clearance aumentado (ARC):** Pacientes jovens, politraumatizados ou com sepse hiperdinâmica podem apresentar ARC (Augmented Renal Clearance, TFG > 130 mL/min), levando a subdosagem de antimicrobianos com eliminação renal predominante. O simulador permite ajuste de GFR, mas não modela a variabilidade intra-individual ao longo do tempo.

- **Obesidade:** O simulador não calcula peso ajustado (ABW = IBW + 0.4 × [TBW − IBW]) para aminoglicosídeos nem peso ideal para outras classes. Em obesos mórbidos, o Vd por kg de peso total é diferente do Vd por kg de peso ideal, e as curvas simuladas podem divergir significativamente da realidade.

- **Populações especiais:** Não validado para neonatos, crianças, gestantes, pacientes em ECMO, CRRT (hemodiafiltração contínua) ou diálise intermitente. A farmacocinética dessas populações difere substancialmente dos parâmetros populacionais adultos utilizados.

Para decisões clínicas, recomenda-se **TDM com software Bayesiano** (PrecisePK, DoseMeRx, InsightRx) e avaliação individualizada por farmacêutico clínico ou equipe de stewardship.

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

<p align="center">
  <strong>⚠️ Aviso:</strong> Simulador educacional — não substitui avaliação clínica individualizada e monitoramento terapêutico de drogas (TDM).
</p>
