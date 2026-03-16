/**
 * Educational content database — contextual PK/PD teaching per drug and per class.
 */
const EDU = {
// ── TIME-DEPENDENT (beta-lactams) ──
_tmic: {
  title: 'fT > MIC',
  why: '<p>Os <strong>beta-lactâmicos</strong> exercem atividade bactericida de forma <strong>tempo-dependente</strong>: a morte bacteriana depende de quanto tempo a concentração livre do antibiótico permanece acima do MIC, e não de quão alto é o pico.</p><p>Isso acontece porque os beta-lactâmicos se ligam às PBPs (proteínas ligadoras de penicilina) de forma saturável — acima de ~4× o MIC, aumentar a concentração não melhora a velocidade de killing.</p><p><strong>Implicação prática:</strong> se o fT>MIC está baixo, a melhor estratégia é aumentar a frequência das doses (ex: q6h em vez de q8h) ou prolongar a infusão (ex: infusão estendida de 3-4h), e não simplesmente aumentar a dose unitária.</p>',
  ref: 'Craig WA. Pharmacokinetic/pharmacodynamic parameters: rationale for antibacterial dosing. Clin Infect Dis 1998;26:1-10. · Nicolau DP. Pharmacodynamic optimization of beta-lactams. Crit Care 2008.'
},
meropenem: {
  extra: '<p class="edu-tip"><strong>Meropenem:</strong> alvo fT>MIC ≥40% para organismos susceptíveis, mas <strong>≥100% com concentração ≥4-5×MIC</strong> (chamado fT>4×MIC ou "carbapenem kill target") é recomendado para infecções graves por Gram-negativos MDR. Infusão estendida de 3h aumenta significativamente o fT>MIC vs. bolus de 30min — especialmente para MICs de 4-8 mg/L.</p>'
},
imipenem: {
  extra: '<p class="edu-tip"><strong>Imipenem:</strong> diferente dos outros carbapenêmicos, tem risco de convulsão dose-dependente. O limiar convulsivo diminui em DRC e patologias do SNC — prefira meropenem nestes cenários. Alvo fT>MIC ≥40%.</p>'
},
cefepime: {
  extra: '<p class="edu-tip"><strong>Cefepima:</strong> alvo fT>MIC ≥60-70% para eficácia máxima. Risco de <strong>neurotoxicidade</strong> (status epilepticus não-convulsivo — NCSE) quando vale >20 mg/L, especialmente em DRC. Infusão estendida 3-4h é estratégia preferida em sepse grave.</p>'
},
piptazo: {
  extra: '<p class="edu-tip"><strong>Piperacilina/Tazobactam:</strong> MICs de Pseudomonas são frequentemente altos (8-16 mg/L). Infusão estendida de 4h demonstrou redução de mortalidade em pacientes graves no estudo BLING III (Lancet 2022). Alvo fT>MIC ≥50% mínimo.</p>'
},
oxacillin: {
  extra: '<p class="edu-tip"><strong>Oxacilina:</strong> meia-vida ultracurta (~30min) com ligação proteica de 93%. Em pacientes com hipoalbuminemia (queimados, cirróticos, sépticos), a fração livre aumenta drasticamente, alterando a exposição efetiva. Infusão contínua é uma alternativa para manter fT>MIC ≥50%.</p>'
},
ceftriaxone: {
  extra: '<p class="edu-tip"><strong>Ceftriaxona:</strong> exceção entre os beta-lactâmicos — meia-vida longa (6-9h) e alta ligação proteica (~90%) permitem dosagem q24h. Em hipoalbuminemia, a fração livre aumenta e pode até melhorar a eficácia, mas a meia-vida também se reduz.</p>'
},
// ── AUC-DEPENDENT ──
_auc: {
  title: 'AUC/MIC',
  why: '<p>Para antimicrobianos <strong>AUC-dependentes</strong>, a eficácia bactericida correlaciona-se com a <strong>exposição total</strong> do fármaco ao longo de 24h em relação ao MIC do patógeno. Não importa se a concentração é alta por pouco tempo ou moderada por muito tempo — o que importa é a "área acumulada" de exposição.</p><p>Isso torna a AUC/MIC um parâmetro mais robusto que Cmax ou vale isolado, pois integra dose, intervalo e clearance em um único número.</p>',
  ref: 'Ambrose PG et al. Pharmacokinetics-pharmacodynamics of antimicrobial therapy. Clin Infect Dis 2007;44:79-86.'
},
vancomycin: {
  extra: '<p class="edu-tip"><strong>Vancomicina — alvo AUC/MIC 400-600 (IDSA/ASHP 2020):</strong> o guideline de 2020 abandonou o vale (15-20 mg/L) como alvo primário, pois o vale é apenas um surrogate impreciso da AUC. AUC/MIC 400-600 otimiza eficácia contra MRSA enquanto minimiza nefrotoxicidade (risco aumenta >600). Cálculo por Bayesian software (ex: PrecisePK, DoseMeRx) é recomendado sobre equações de 1ª ordem.</p><p><strong>Na prática:</strong> com MIC=1, AUC 400-600 mg·h/L. Com MIC=2, AUC necessária de 800-1200 — difícil atingir sem toxicidade, questionando eficácia da vancomicina para MRSA com MIC≥2.</p>'
},
linezolid: {
  extra: '<p class="edu-tip"><strong>Linezolida — alvo AUC/MIC ≥80-120:</strong> a linezolida é bacteriostática contra a maioria dos Gram-positivos (incluindo MRSA e VRE). A AUC/MIC é o melhor preditor de sucesso clínico. Risco de trombocitopenia e neuropatia periférica aumenta com exposição prolongada (>14 dias) e AUC elevada.</p>'
},
polymyxinB: {
  extra: '<p class="edu-tip"><strong>Polimixina B — alvo AUCss 50-100 mg·h/L:</strong> diferente da colistina (pró-droga), a polimixina B tem PK previsível e <strong>não requer ajuste pela TFG</strong> (eliminação não-renal). AUCss >100 mg·h/L aumenta risco de nefrotoxicidade. Dose de ataque é essencial (t½ ~13h — demora 2-3 dias para SS sem loading). Tsuji 2019 (Pharmacotherapy) recomenda 2-2.5 mg/kg no D1.</p>'
},
levofloxacin: {
  extra: '<p class="edu-tip"><strong>Levofloxacino — AUC/MIC ≥125 (Gram−) ou ≥30 (Gram+):</strong> estudo seminal de Forrest (1993) mostrou que AUC/MIC ≥125 em Gram-negativos e Cmax/MIC ≥10 predizem erradicação bacteriana. Dose de 750mg q24h produz AUC/MIC ótimo para a maioria dos patógenos susceptíveis. Resistência às quinolonas está aumentando — atentar para antibiogramas locais.</p>'
},
ciprofloxacin: {
  extra: '<p class="edu-tip"><strong>Ciprofloxacino — AUC/MIC ≥125 + Cmax/MIC ≥10:</strong> é a fluoroquinolona com melhor atividade anti-Pseudomonas. Para infecções graves, dose de 400mg q8h IV é necessária para atingir AUC/MIC adequado com MICs de 0.25-0.5 mg/L. Com MIC ≥1 mg/L, atingir alvos torna-se difícil — considerar alternativa.</p>'
},
// ── TROUGH-DEPENDENT ──
_trough: {
  title: 'Vale (Ctrough)',
  why: '<p>Para alguns antimicrobianos, a <strong>concentração de vale</strong> (mínima pré-dose) é o parâmetro monitorado na prática clínica, como surrogate da AUC. O vale é mais fácil de medir (coleta única pré-dose) e correlaciona-se razoavelmente com eficácia/toxicidade.</p>',
  ref: 'Wilson APR. Clinical pharmacokinetics of teicoplanin. Clin Pharmacokinet 2000;39:167-183.'
},
teicoplanin: {
  extra: '<p class="edu-tip"><strong>Teicoplanina — vale 15-30 mg/L:</strong> vale <15 mg/L está associado a falha terapêutica em endocardite, osteomielite e bacteremia por MRSA (Hanai, JAC 2022). Para infecções graves, alvo de <strong>20-40 mg/L</strong>. A dose de ataque (loading) de 12 mg/kg q12h × 5 doses nos 3 primeiros dias é <strong>mandatória</strong> — sem loading, o vale terapêutico só é atingido após 7-10 dias (t½ ~70-160h). TDM no D4.</p><p><strong>Armadilha comum:</strong> prescrever teicoplanina sem loading dose adequada é a causa nº1 de falha terapêutica.</p>'
},
voriconazole: {
  extra: '<p class="edu-tip"><strong>Voriconazol — vale 2-5.5 mg/L (IDSA):</strong> cinética <strong>NÃO-LINEAR</strong> por saturação do CYP2C19 — pequenos ajustes de dose podem causar grandes variações no nível sérico. Vale <1 mg/L: risco de falha (mortalidade 2× maior). Vale >5.5 mg/L: neurotoxicidade (alucinações, encefalopatia), hepatotoxicidade. Polimorfismo CYP2C19: metabolizadores ultra-rápidos (~2% caucasianos, ~15% asiáticos) podem ter vale subterapêutico mesmo com dose padrão. <strong>TDM obrigatório a partir do D5.</strong></p>'
},
// ── CONCENTRATION-DEPENDENT ──
_cmax: {
  title: 'fCmax/MIC',
  why: '<p>Os antimicrobianos <strong>concentração-dependentes</strong> matam bactérias mais rapidamente quanto maior o pico de concentração em relação ao MIC. Acima de um limiar (geralmente Cmax/MIC ≥8-10), a velocidade de killing bactericida é máxima. Além disso, picos elevados produzem um <strong>efeito pós-antibiótico (EPA)</strong> prolongado — supressão do crescimento bacteriano mesmo após a concentração cair abaixo do MIC.</p><p><strong>Implicação prática:</strong> a melhor estratégia é administrar toda a dose diária de uma vez ("once-daily dosing" — ODD) para maximizar o pico, em vez de dividir em múltiplas doses menores.</p>',
  ref: 'Moore RD et al. Clinical response to aminoglycoside therapy: importance of peak concentration to MIC ratio. J Infect Dis 1987;155:93-99. · Barclay ML et al. AAC 1999.'
},
amikacin: {
  extra: '<p class="edu-tip"><strong>Amicacina — fCmax/MIC ≥8-10, pico 56-64 mg/L:</strong> dose única diária (15-20 mg/kg) maximiza o pico e o efeito pós-antibiótico, enquanto permite janela de concentração baixa para recuperação renal (periodo de "washout"). Monitorar: pico 30min pós-infusão e vale pré-dose (alvo <5 mg/L para minimizar nefrotoxicidade).</p>'
},
gentamicin: {
  extra: '<p class="edu-tip"><strong>Gentamicina — fCmax/MIC ≥8-10:</strong> dose de 5-7 mg/kg em dose única diária. O Hartford Nomogram pode guiar ajuste de intervalo baseado no nível de 6-14h. Vale-alvo <1 mg/L para minimizar nefro e ototoxicidade. Em endocardite por Enterococcus, usa-se dose fracionada (1-1.5 mg/kg q8h) — lógica diferente: sinergia com beta-lactâmico, não killing dependente de pico.</p>'
},
daptomycin: {
  extra: '<p class="edu-tip"><strong>Daptomicina — Cmax/MIC + AUC/MIC:</strong> combina padrão concentração-dependente com AUC-dependente. Dose de 8-10 mg/kg para bacteremia por MRSA (vs. 6 mg/kg para partes moles). <strong>INATIVADA por surfactante pulmonar</strong> — absolutamente contraindicada em pneumonia. CPK deve ser monitorada semanalmente (risco de miopatia).</p>'
},
metronidazole: {
  extra: '<p class="edu-tip"><strong>Metronidazol — Cmax/MIC + AUC/MIC:</strong> atividade bactericida concentração-dependente contra anaeróbios. Penetração excelente no SNC, abscessos e tecidos. A resistência entre Bacteroides fragilis ainda é rara (<5%), mas está aumentando em algumas regiões. Não necessita ajuste renal (metabolismo hepático >90%), mas ajustar em hepatopatas.</p>'
},
amphoB_lipo: {
  extra: '<p class="edu-tip"><strong>Anfotericina B Lipossomal — Cmax/MIC ≥2-4:</strong> fungicida com atividade concentração-dependente. A formulação lipossomal permite doses mais altas (3-5 mg/kg, até 10 mg/kg para mucormicose) com menor nefrotoxicidade vs. desoxicolato. Pré-medicação com soro fisiológico e monitoramento de K+/Mg++ são essenciais. PK multicompartimental com captação tecidual extensa — níveis séricos não refletem bem concentrações teciduais.</p>'
},
fluconazole: {
  extra: '<p class="edu-tip"><strong>Fluconazol — AUC/MIC ≥25-100:</strong> PK linear e previsível, excelente biodisponibilidade oral (~90%), boa penetração no SNC. Para candidemia, AUC/MIC ≥100 é desejável — com dose de 400-800mg e MIC ≤2, isso é facilmente atingido. Dose de ataque de 800mg (12 mg/kg) no D1 é recomendada para atingir steady-state mais rapidamente (t½ ~30h). Limitado a Candida não-krusei e não-glabrata.</p>'
}
};

export default EDU;