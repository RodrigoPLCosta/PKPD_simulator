// @ts-check

/**
 * Drug database — assembles all drug class JSONs into a single map.
 * Also exports SCENARIOS, ADV (adverse effects), and EDU (educational content).
 */

import carbapenems from './carbapenems.json';
import cephalosporins from './cephalosporins.json';
import penicillins from './penicillins.json';
import glycopeptides from './glycopeptides.json';
import aminoglycosides from './aminoglycosides.json';
import lipopeptides from './lipopeptides.json';
import oxazolidinones from './oxazolidinones.json';
import polymyxins from './polymyxins.json';
import nitroimidazoles from './nitroimidazoles.json';
import fluoroquinolones from './fluoroquinolones.json';
import antifungals from './antifungals.json';

/**
 * @typedef {import('../types/contracts.js').Drug} Drug
 * @typedef {import('../types/contracts.js').Scenario} Scenario
 */

export const D = /** @type {Record<string, Drug>} */ ({
  ...carbapenems,
  ...cephalosporins,
  ...penicillins,
  ...glycopeptides,
  ...aminoglycosides,
  ...lipopeptides,
  ...oxazolidinones,
  ...polymyxins,
  ...nitroimidazoles,
  ...fluoroquinolones,
  ...antifungals
});

/** @type {Scenario[]} */
export const SCENARIOS = [
  { l: 'Mero IE 3h', d: 'meropenem', p: { inf: 180 }, desc: 'Meropenem infusão estendida 3h' },
  { l: 'Mero IC-like q8h', d: 'meropenem', p: { inf: 480, int: 8 }, desc: 'Meropenem com infusão contínua-like ao longo do intervalo de 8h' },
  { l: 'Vanco ataque', d: 'vancomycin', p: { ld: 2000, dose: 1000, int: 12 }, desc: 'Vancomicina 2g de ataque + 1g q12h (25-30mg/kg)' },
  { l: 'Pipe/Tazo IE', d: 'piptazo', p: { inf: 240 }, desc: 'Piperacilina-tazobactam infusão estendida 4h' },
  { l: 'Amika ODD', d: 'amikacin', p: { dose: 1500, int: 24 }, desc: 'Amicacina 1500mg q24h em dose única diária' },
  { l: 'Sepse + ARC', d: 'meropenem', p: { gfr: 160, dose: 2000, inf: 180 }, desc: 'Sepse com ARC: meropenem 2g IE 3h' },
  { l: 'DRC G4', d: 'vancomycin', p: { gfr: 20, dose: 1000, int: 24 }, desc: 'Vancomicina 1g q24h em DRC estágio 4' },
  { l: 'Teico loading', d: 'teicoplanin', p: { ld: 840, ldc: 5, ldi: 12, dose: 400, int: 24 }, desc: 'Teicoplanina 12mg/kg q12h × 5 doses + 6mg/kg q24h (Hanai 2022)' },
  { l: 'PoliB loading', d: 'polymyxinB', p: { ld: 175, ldc: 1, ldi: 12, dose: 100, int: 12, inf: 60 }, desc: 'Polimixina B loading 2-2.5mg/kg + 1.25mg/kg q12h em 1h (Tsuji, Pharmacotherapy 2019)' },
  { l: 'Levo 750 q24h', d: 'levofloxacin', p: { dose: 750, int: 24, inf: 60 }, desc: 'Levofloxacino 750mg q24h em 1h — dose alta padrão' },
  { l: 'Cipro Pseudo', d: 'ciprofloxacin', p: { dose: 400, int: 8, inf: 60 }, desc: 'Ciprofloxacino 400mg q8h em 1h para Pseudomonas' },
  { l: 'Fluco 800 D1', d: 'fluconazole', p: { ld: 800, ldc: 1, ldi: 24, dose: 400, int: 24 }, desc: 'Fluconazol 800mg D1 + 400mg q24h (candidemia)' },
  { l: 'Vori loading', d: 'voriconazole', p: { ld: 420, ldc: 2, ldi: 12, dose: 280, int: 12 }, desc: 'Voriconazol 6mg/kg q12h D1 + 4mg/kg q12h' }
];

export const ADV = {
  meropenem: {
    adv: '<b>Efeitos adversos:</b> Diarreia (4-5%), náusea/vômito (1-4%), cefaleia (2-3%), rash (1-3%). <i>C. difficile</i> em uso prolongado. Convulsões são raras (<0.5%) — menor risco vs. imipenem. Hepatotoxicidade transitória (↑ALT) em ~4%.',
    model: '<b>Limitações do modelo:</b> Modelo monocompartimental adequado para meropenem (Vd pequeno, distribuição rápida). Em sepse grave com aumento de Vd e ARC, concentrações reais podem ser 20-40% menores que estimadas.',
    advRef: 'Linden, Drug Saf 2007; Baldwin, J Antimicrob Chemother 2008.'
  },
  imipenem: {
    adv: '<b>Efeitos adversos:</b> <span style="color:var(--rd)">Convulsões (0.4-1.5%)</span> — risco dose-dependente, maior em DRC (TFG<30), lesão SNC e doses >500mg. Náusea/vômito (3-6%), diarreia (3-4%). <i>C. difficile</i>. Não ultrapassar 4g/dia ou 500mg por infusão em pacientes com fatores de risco para convulsão.',
    model: '<b>Limitações do modelo:</b> Modelo adequado. A cilastatina (inibidor da DHP-1) não é modelada separadamente mas não altera significativamente a PK do imipenem.',
    advRef: 'Calandra, Am J Med 1988; Norrby, J Antimicrob Chemother 1999.'
  },
  ertapenem: {
    adv: '<b>Efeitos adversos:</b> Diarreia (5-10%), infusional (3-5%), cefaleia (5-7%). Convulsões raras (<0.5%). <span style="color:var(--am)">Ligação proteica ~92% — em hipoalbuminemia a fração livre ↑↑, aumentando risco de efeitos adversos e alterando toda a curva PK/PD.</span>',
    model: '<b>Limitações do modelo:</b> A ligação proteica concentração-dependente (85-95%) não é modelada — em hipoalbuminemia grave (albumina <2.5 g/dL), a fração livre pode dobrar, e a curva real desviará significativamente da simulada.',
    advRef: 'Majumdar, AAC 2002; Nix, AAC 2004.'
  },
  cefepime: {
    adv: '<b>Efeitos adversos:</b> <span style="color:var(--rd)">Neurotoxicidade (3-15%): encefalopatia, mioclonias, status epilepticus não-convulsivo (NCSE)</span> — correlaciona-se com vale >20 mg/L e acúmulo por DRC. Rash (1-4%), diarreia (2%), <i>C. difficile</i>. EEG é o padrão-ouro para diagnóstico de NCSE por cefepima.',
    model: '<b>Limitações do modelo:</b> Modelo monocompartimental razoável. Em pacientes críticos com Vd aumentado e clearance alterado, os níveis reais podem ser significativamente diferentes dos estimados.',
    advRef: 'Payne, Clin Infect Dis 2017 (neurotoxicidade); Fugate, Neurology 2013.'
  },
  ceftazidime: {
    adv: '<b>Efeitos adversos:</b> Rash e prurido (2%), diarreia (1-2%), náusea (<1%). Neurotoxicidade rara em doses muito altas ou DRC grave. Eosinofilia transitória (5%). <i>C. difficile</i> em uso prolongado.',
    model: '<b>Limitações do modelo:</b> Modelo monocompartimental adequado. Distribuição é rápida e uniforme na maioria dos compartimentos.',
    advRef: 'Richards, J Antimicrob Chemother 1985.'
  },
  ceftazAvi: {
    adv: '<b>Efeitos adversos:</b> Semelhantes à ceftazidima isolada. Diarreia (3-8%), náusea (5-7%), vômito (2-4%), cefaleia (3%). O avibactam não adiciona toxicidade significativa. Vigilância para <i>C. difficile</i>. Seroconversão de Coombs direto positivo em até 11% (sem hemólise clínica).',
    model: '<b>Limitações do modelo:</b> O modelo simula a PK combinada assumindo perfil similar ao da ceftazidima. O avibactam tem t½ ligeiramente diferente (~2.7h vs ~2h) — as concentrações individuais de cada componente podem diferir.',
    advRef: 'Shields, AAC 2017; Mazuski, Clin Infect Dis 2016.'
  },
  ceftriaxone: {
    adv: '<b>Efeitos adversos:</b> Lama biliar/colelitíase (pseudolitíase) por precipitação de sal de cálcio (até 25% em doses altas por >14 dias). <span style="color:var(--rd)">NUNCA coadministrar com soluções contendo cálcio IV em neonatos (precipitação fatal).</span> Diarreia (3%), rash (1-2%), eosinofilia. Anemia hemolítica imunomediada rara.',
    model: '<b>Limitações do modelo:</b> <span style="color:var(--am)">Ligação proteica altamente concentração-dependente (83-96%)</span> — o modelo usa PB fixo, mas na realidade a fração livre aumenta desproporcionalmente em doses altas e em hipoalbuminemia, alterando a eficácia real vs. simulada.',
    advRef: 'Schaad, Pediatr Infect Dis J 1990; Ito, Int J Clin Pharm 2021.'
  },
  piptazo: {
    adv: '<b>Efeitos adversos:</b> Diarreia (7-11%), <i>C. difficile</i>, náusea (3%). <span style="color:var(--am)">Nefrotoxicidade quando associada a vancomicina</span> — risco ~3× maior de IRA vs. vancomicina isolada ou vancomicina + cefepima (Luther, Clin Infect Dis 2018). Hipocalemia (1-3%), trombocitopenia rara. Reação de Jarisch-Herxheimer em sífilis.',
    model: '<b>Limitações do modelo:</b> Modelo adequado para piperacilina. O tazobactam tem PK ligeiramente diferente mas é modelado junto. Em sepse com Vd aumentado, considerar que concentrações reais podem ser menores.',
    advRef: 'Luther, Clin Infect Dis 2018; Hayashi, Int J Antimicrob Agents 2020.'
  },
  ampicSulb: {
    adv: '<b>Efeitos adversos:</b> Diarreia (6-9%), rash (2-5%), dor no local de infusão. Nefrite intersticial rara. Em doses altas, convulsões são possíveis (classe penicilina). Reação alérgica cruzada com outras penicilinas.',
    model: '<b>Limitações do modelo:</b> Modelo monocompartimental adequado. O sulbactam tem PK similar à ampicilina e é modelado junto. Para infecções por <i>Acinetobacter baumannii</i>, o sulbactam é o componente ativo — considerar doses de sulbactam 6-9g/dia (dados Oliveira, AAC 2020).',
    advRef: 'Betrosian, Intensive Care Med 2008; Oliveira, AAC 2020.'
  },
  oxacillin: {
    adv: '<b>Efeitos adversos:</b> <span style="color:var(--am)">Hepatotoxicidade (↑ALT/AST em 1-5%)</span> — mais frequente que outras penicilinas. Nefrite intersticial (rara mas dose-dependente). Flebite no local de infusão. Neutropenia em uso prolongado (>14 dias). Reação alérgica cruzada com penicilinas.',
    model: '<b>Limitações do modelo:</b> <span style="color:var(--am)">Ligação proteica ~93%</span> — em hipoalbuminemia a fração livre pode triplicar (de 7% para >20%), alterando drasticamente a eficácia e toxicidade reais vs. simuladas. Meia-vida ultracurta (30min) exige infusão contínua ou doses muito frequentes.',
    advRef: 'Marik, Drug Saf 1998; Nauta, Clin Pharmacol Ther 1974.'
  },
  vancomycin: {
    adv: '<b>Efeitos adversos:</b> <span style="color:var(--rd)">Nefrotoxicidade (5-25%)</span> — correlaciona-se com AUC/MIC >600, vale >20 mg/L e uso concomitante com pipe/tazo ou aminoglicosídeos. Síndrome do Homem Vermelho (infusão rápida <60min — libera histamina, não é alergia). Ototoxicidade rara. Neutropenia em uso >14 dias (2%). Trombocitopenia imunomediada.',
    model: '<b>Limitações do modelo:</b> <span style="color:var(--rd)">Vancomicina é BICOMPARTIMENTAL</span> — o modelo monocompartimental superestima o Cmax pós-infusão em 30-50% (fase α de distribuição ~1h). O vale e a AUC são mais confiáveis que o Cmax neste simulador. Para cálculos precisos de AUC, prefira software Bayesiano (PrecisePK, DoseMeRx).',
    advRef: 'Rybak, Am J Health-Syst Pharm 2020; Lodise, Clin Infect Dis 2009; Luther, Clin Infect Dis 2018.'
  },
  teicoplanin: {
    adv: '<b>Efeitos adversos:</b> Nefrotoxicidade menor que vancomicina (<5%). Ototoxicidade rara. Rash (3-5%), febre (3%), trombocitopenia (2%). Elevação de aminotransferases (2-3%). Não causa Síndrome do Homem Vermelho (diferente da vancomicina).',
    model: '<b>Limitações do modelo:</b> <span style="color:var(--rd)">Teicoplanina é TRICOMPARTIMENTAL (3 fases de distribuição)</span> — o modelo monocompartimental é uma aproximação grosseira. Os níveis de vale calculados divergem significativamente da realidade nos primeiros 3-5 dias. A faixa de incerteza no gráfico reflete esta imprecisão. A t½ efetiva usada (~70h) é um compromisso entre a t½α (~0.5h), t½β (~10h) e t½γ (~83-163h). <b>TDM real no D4 é mandatório.</b>',
    advRef: 'Wilson, Clin Pharmacokinet 2000; Hanai, J Antimicrob Chemother 2022.'
  },
  amikacin: {
    adv: '<b>Efeitos adversos:</b> <span style="color:var(--rd)">Nefrotoxicidade (5-15%)</span> — correlaciona-se com vale >5 mg/L e duração >7 dias. Reversível na maioria dos casos. <span style="color:var(--rd)">Ototoxicidade vestibular e coclear</span> — pode ser irreversível, correlaciona-se com AUC cumulativa. Bloqueio neuromuscular em doses muito altas (raro). Monitorar creatinina e audiometria.',
    model: '<b>Limitações do modelo:</b> Modelo monocompartimental é razoável para aminoglicosídeos (Vd ~volume extracelular). <span style="color:var(--am)">Em obesos, usar peso ajustado (ABW = IBW + 0.4×[TBW−IBW])</span> — o simulador não calcula ABW. Em pacientes com grandes expansões de volume (queimados, sepse), o Vd aumenta e o pico real pode ser menor que o simulado.',
    advRef: 'Taccone, Crit Care Med 2010; Bartal, J Antimicrob Chemother 2003.'
  },
  gentamicin: {
    adv: '<b>Efeitos adversos:</b> <span style="color:var(--rd)">Nefrotoxicidade (5-15%)</span> e <span style="color:var(--rd)">ototoxicidade (vestibular > coclear)</span> — mesmos mecanismos que amicacina. Vale-alvo <1 mg/L. Risco aumenta com duração >5-7 dias, uso concomitante de furosemida ou AINE. Bloqueio neuromuscular (raro, agravado por miastenia gravis).',
    model: '<b>Limitações do modelo:</b> Semelhante à amicacina — modelo monocompartimental adequado. <span style="color:var(--am)">Usar peso ajustado em obesos.</span> Em endocardite por <i>Enterococcus</i>, a dose fracionada (1-1.5 mg/kg q8h) tem lógica PK/PD diferente (sinergia, não killing concentração-dependente) — este simulador não é adequado para esse cenário.',
    advRef: 'Barclay, AAC 1999; Cosgrove, Clin Infect Dis 2009.'
  },
  daptomycin: {
    adv: '<b>Efeitos adversos:</b> <span style="color:var(--am)">Rabdomiólise/miopatia (2-7%)</span> — monitorar CPK semanalmente, suspender se CPK >5-10× LSN ou sintomático. Neuropatia periférica (rara). Pneumonia eosinofílica (rara, <1%). <span style="color:var(--rd)">ABSOLUTAMENTE CONTRAINDICADA em pneumonia</span> — inativada por surfactante pulmonar.',
    model: '<b>Limitações do modelo:</b> Daptomicina tem alta ligação proteica (~92%) — em hipoalbuminemia, a fração livre aumenta significativamente. O Vd pequeno (0.1 L/kg) indica distribuição predominantemente intravascular. Modelo monocompartimental é razoável.',
    advRef: 'Dvorchik, J Clin Pharmacol 2003; Dare, Ann Pharmacother 2018 (eosinofílica).'
  },
  linezolid: {
    adv: '<b>Efeitos adversos:</b> <span style="color:var(--am)">Trombocitopenia (2-10%)</span> — dose e tempo-dependente, risco aumenta após 14 dias e com vale >7-10 mg/L. Neuropatia periférica e óptica em uso >28 dias. Acidose láctica (rara, inibição mitocondrial). <span style="color:var(--am)">Síndrome serotoninérgica com ISRS/IMAO</span> — contraindicação relativa com ISRS.',
    model: '<b>Limitações do modelo:</b> PK linear e bem previsível — modelo monocompartimental é adequado. Em pacientes críticos e obesos, o Vd pode aumentar e o clearance alterar, mas em geral a biodisponibilidade oral ~100% permite transição IV→VO sem ajuste de dose.',
    advRef: 'Brier, Antimicrob Agents Chemother 2003; Cattaneo, J Antimicrob Chemother 2013.'
  },
  polymyxinB: {
    adv: '<b>Efeitos adversos:</b> <span style="color:var(--rd)">Nefrotoxicidade (20-60%)</span> — principal limitante, mecanismo: lesão tubular direta. Correlaciona-se com AUCss >100 mg·h/L e uso >14 dias. Neurotoxicidade: parestesias faciais/periorais (25-30%), bloqueio neuromuscular (raro). Broncoespasmo e pigmentação cutânea em uso prolongado.',
    model: '<b>Limitações do modelo:</b> A eliminação é NÃO-RENAL (metabolismo/captação tubular) — o ajuste por TFG NÃO se aplica. O modelo reflete isso corretamente (fr=0.10). Em pacientes em CRRT/HD, a polimixina B não é removida significativamente.',
    advRef: 'Rigatto, Crit Care 2015 (nefrotoxicidade); Tsuji, Pharmacotherapy 2019.'
  },
  metronidazole: {
    adv: '<b>Efeitos adversos:</b> Neuropatia periférica (em uso >4 semanas). Gosto metálico (12%), náusea (5-10%). <span style="color:var(--am)">Reação dissulfiram-like com álcool</span> — evitar álcool durante e até 48h após. Neurotoxicidade central (convulsões, encefalopatia cerebelar) em doses altas ou uso prolongado — geralmente reversível. Neutropenia rara.',
    model: '<b>Limitações do modelo:</b> PK predominantemente hepática (>90%) — modelo monocompartimental é adequado. Em hepatopatia grave, o clearance reduz significativamente (t½ pode dobrar). O simulador não ajusta por função hepática.',
    advRef: 'Lamp, Clin Pharmacokinet 1999; Kuriyama, J Antimicrob Chemother 2011.'
  },
  levofloxacin: {
    adv: '<b>Efeitos adversos:</b> <span style="color:var(--am)">Tendinopatia/ruptura de tendão de Aquiles</span> (0.1-0.4% — risco 3-4× maior com corticoides, idade >60 anos, transplantados). Prolongamento QTc dose-dependente — evitar com outros prolongadores de QTc. Neuropatia periférica (pode ser irreversível). Disglicemia (hipo e hiperglicemia). Distúrbios psiquiátricos (insônia, confusão). Fotossensibilidade. <span style="color:var(--am)">FDA black box warning (2016): efeitos adversos incapacitantes e potencialmente irreversíveis.</span>',
    model: '<b>Limitações do modelo:</b> PK linear e previsível — modelo monocompartimental é adequado. Boa correlação com dados populacionais. A biodisponibilidade oral é ~99%, permitindo transição IV→VO 1:1.',
    advRef: 'Fish, Pharmacotherapy 2001; Bidell, Expert Opin Drug Saf 2016 (tendão).'
  },
  ciprofloxacin: {
    adv: '<b>Efeitos adversos:</b> Semelhantes ao levofloxacino: <span style="color:var(--am)">tendinopatia, neuropatia periférica, prolongamento QTc</span>. Adicionalmente: cristalúria em pH urinário alcalino (manter hidratação). Fotossensibilidade (maior que levofloxacino). <span style="color:var(--am)">Não usar em crianças/adolescentes</span> (lesão cartilagem de crescimento) exceto fibrose cística e infecções graves sem alternativa.',
    model: '<b>Limitações do modelo:</b> PK com Vd alto (~2.5 L/kg) indica ampla distribuição tecidual. Modelo monocompartimental é uma simplificação razoável. A biodisponibilidade oral é ~70-80% (menor que levofloxacino) — a dose IV e oral NÃO são equivalentes 1:1 (400mg IV ≈ 500mg VO, 400mg IV q8h ≈ 750mg VO q12h).',
    advRef: 'Forrest, AAC 1993; Lipman, Clin Pharmacokinet 1999.'
  },
  amphoB_lipo: {
    adv: '<b>Efeitos adversos:</b> <span style="color:var(--am)">Nefrotoxicidade (10-25%)</span> — menor que desoxicolato, mas ainda significativa em cursos prolongados. Pre-hidratar com NaCl 0.9% 500mL. Reações infusionais: febre, calafrios, hipotensão (15-20%) — pré-medicar com paracetamol/difenidramina. Hipocalemia (30-40%), hipomagnesemia (15-20%). Hepatotoxicidade rara.',
    model: '<b>Limitações do modelo:</b> <span style="color:var(--rd)">PK MULTICOMPARTIMENTAL COMPLEXA</span> — anfotericina B lipossomal tem captação massiva pelo sistema reticuloendotelial (fígado, baço). Os níveis séricos NÃO refletem concentrações teciduais. O modelo monocompartimental é uma APROXIMAÇÃO GROSSEIRA. A faixa de incerteza no gráfico reflete esta limitação.',
    advRef: 'Walsh, AAC 1998; Hamill, Clin Infect Dis 2013; Laniado-Laborín, Rev Iberoam Micol 2009.'
  },
  fluconazole: {
    adv: '<b>Efeitos adversos:</b> Hepatotoxicidade (1-7% — ↑ALT/AST), rara hepatite fulminante. Náusea (4-7%), cefaleia (2-5%), rash (2%). Prolongamento QTc (dose-dependente, principalmente >800mg/dia). <span style="color:var(--am)">Potente inibidor de CYP2C9 e CYP3A4</span> — interage com varfarina (↑INR), fenitoína, ciclosporina, tacrolimus, opioides, e dezenas de outros fármacos. Embriotoxicidade — contraindicado no 1º trimestre.',
    model: '<b>Limitações do modelo:</b> PK linear e previsível — modelo monocompartimental é ADEQUADO para fluconazol. Boa correlação com dados clínicos. A meia-vida longa (~30h) permite q24h e facilita a modelagem.',
    advRef: 'Brammer, Eur J Clin Microbiol 1990; Andes, AAC 2003; Rex, CID 1997.'
  },
  voriconazole: {
    adv: '<b>Efeitos adversos:</b> <span style="color:var(--rd)">Distúrbios visuais (30%)</span> — fotopsia, visão turva, percepção alterada de cores (transitório, dose-dependente). Hepatotoxicidade (10-15% — ↑ALT, raro fulminante) — monitorar provas hepáticas. <span style="color:var(--rd)">Neurotoxicidade com vale >5.5 mg/L</span> — alucinações, encefalopatia, ataxia. Fotossensibilidade intensa (uso >6 meses: risco de carcinoma espinocelular). Periostite com fluorose em uso >12 meses. Prolongamento QTc.',
    model: '<b>Limitações do modelo:</b> <span style="color:var(--rd)">CINÉTICA NÃO-LINEAR POR SATURAÇÃO DO CYP2C19</span> — este modelo assume cinética linear, o que é uma APROXIMAÇÃO GROSSEIRA. Pequenos ajustes de dose podem causar variações desproporcionais nos níveis séricos. Polimorfismo CYP2C19: metabolizadores ultra-rápidos (~15% asiáticos) → vale subterapêutico; metabolizadores lentos (~2% caucasianos) → acúmulo tóxico. A faixa de incerteza no gráfico tenta capturar esta imprevisibilidade. <b>TDM é INDISPENSÁVEL — nunca prescreva voriconazol sem monitorar nível sérico.</b> Veículo IV (SBECD) acumula em CrCl <50 — preferir VO.',
    advRef: 'Pascual, Clin Infect Dis 2008; Patterson, Clin Infect Dis 2016; Dolton, Antimicrob Agents Chemother 2012.'
  }
};

export { default as EDU } from './educContent.js';
