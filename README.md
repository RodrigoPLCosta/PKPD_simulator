# Simulador PK/PD de Antimicrobianos v1.1

Simulador farmacocinético interativo de antimicrobianos hospitalares, desenvolvido como ferramenta educacional para médicos, farmacêuticos e residentes.

**Autor:** Rodrigo Pinheiro Leal Costa · 2026

---

## O que faz

O simulador calcula e exibe graficamente a curva de concentração sérica ao longo do tempo para 18 antimicrobianos hospitalares, usando um modelo farmacocinético monocompartimental IV. Permite visualizar em tempo real como alterações na dose, intervalo, tempo de infusão e função renal impactam os parâmetros PK/PD que predizem eficácia clínica.

## Como funciona

### Modelo farmacocinético

O motor de simulação utiliza um modelo monocompartimental de infusão IV intermitente:

- **Fase de infusão:** C(t) = (R₀ / ke·Vd) × (1 - e^(-ke·t)), onde R₀ = dose/tempo de infusão
- **Fase pós-infusão:** C(t) = C(end) × e^(-ke·(t - tInf))
- **Ajuste renal:** a meia-vida é recalculada pela fração de eliminação renal e a TFG do paciente: t½adj = ln2 / (ke × (fr × GFR/120 + (1 - fr)))

A simulação gera pontos de concentração total e livre (fração não-ligada = 1 - ligação proteica) a cada 0.05h (ou 0.25h para teicoplanina), ao longo de 48h (168h para teicoplanina).

### Parâmetros PK/PD calculados

- **fT > MIC (SS):** fração do intervalo posológico no steady-state em que a concentração livre supera o MIC — alvo primário para beta-lactâmicos
- **AUC₂₄/MIC:** razão da área sob a curva em 24h pelo MIC — alvo para vancomicina (400-600, IDSA 2020), linezolida e polimixina B
- **fCmax/MIC:** razão do pico de concentração livre pelo MIC — alvo para aminoglicosídeos (≥8-10)
- **Cmin (vale):** concentração mínima no steady-state — alvo primário para teicoplanina (15-30 mg/L)

### Antimicrobianos disponíveis (18 drogas, 9 classes)

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

### Funcionalidades

- **Seleção rápida de dose:** botões com apresentações comerciais (ex: Pipe/Tazo 2.25g, 3.375g, 4.5g)
- **Intervalos discretos:** botões de intervalo posológico relevantes para cada droga (ex: q4h, q6h, q8h)
- **Presets de infusão:** bolus, infusão estendida e contínua, contextuais por fármaco
- **Dose por peso:** drogas dosadas por mg/kg (vancomicina, aminoglicosídeos, daptomicina, polimixina B, teicoplanina) recalculam a dose automaticamente ao alterar o peso
- **Dose de ataque:** seção colapsável (opcional), expande automaticamente para drogas que usam loading dose (teicoplanina)
- **Ajuste renal:** classificação automática da TFG (ARC, Normal, DRC G2-G5, Diálise) com recomendações contextuais
- **Cenários clínicos:** presets rápidos por fármaco (ex: Mero IE 3h, Vanco ataque, Sepse + ARC)
- **Comparação de regimes:** salve uma curva como referência e compare visualmente com o regime atual
- **Gráfico interativo:** Chart.js com labels de Cmax/Cmin, destaque fT>MIC, AUC shading, dose markers
- **Card PK:** parâmetros farmacocinéticos (Vd, t½, ligação proteica, eliminação renal) e referências bibliográficas

### Referências bibliográficas

Parâmetros populacionais validados contra literatura: Mouton 1995, Nicolau 2008, Rybak/ASHP/IDSA 2020, Hanai 2022, Wilson 2000, Pais 2022, Sandri 2013, Dvorchik 2003, Stalker 2003, Barclay 1999, Taccone 2010, entre outras citadas no app.

---

## Tecnologia

- **Single-file app:** HTML + CSS + JS em um único arquivo (`index.html`)
- **Chart.js 4.4.1** para renderização do gráfico (CDN)
- **Google Fonts:** DM Sans + JetBrains Mono
- **PWA:** Progressive Web App com Service Worker para uso offline
- **Responsivo:** layout desktop (sidebar + gráfico) e mobile (stacked)

## Estrutura de arquivos

```
PKPD_simulator/
├── index.html          ← App principal (HTML + CSS + JS)
├── manifest.json       ← Metadados da PWA
├── sw.js               ← Service Worker (cache offline)
├── README.md           ← Este arquivo
└── icons/
    ├── apple-touch-icon.png
    ├── favicon-32.png
    └── icon-{72,96,128,144,152,180,192,384,512}.png
```

## Deploy no GitHub Pages

1. Vá em **Settings** → **Pages**
2. Source: **Deploy from a branch** → Branch: **main**, pasta: **/ (root)**
3. URL: `https://SEU-USUARIO.github.io/PKPD_simulator/`

## Instalação como PWA

### iPhone (Safari)
Abra o site → botão Compartilhar → "Adicionar à Tela de Início"

### Android (Chrome)
Abra o site → banner automático ou menu ⋮ → "Instalar aplicativo"

Após instalação, o app funciona offline.

---

**Aviso:** Simulador educacional — não substitui avaliação clínica individualizada e monitoramento terapêutico de drogas (TDM).
