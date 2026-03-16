/**
 * PK/PD target evaluation — alerts and adverse effects logic.
 */

/**
 * Get clinical alerts based on simulation results.
 * @param {string} sel - Selected drug key
 * @param {object} drug - Drug parameters from D
 * @param {object} r - Simulation result
 * @param {number} gfr - Current GFR
 * @param {object} ADV - Adverse effects database
 * @returns {{ ms: string[], lv: string }}
 */
export function getAlerts(sel, drug, r, gfr, ADV) {
  const ms = [];
  let lv = 'warn';
  const adv = ADV[sel];
  if (adv) {
    ms.push(adv.adv);
    ms.push(adv.model);
    ms.push('<span style="font-size:10px;font-style:italic;color:var(--tx3)">Ref: ' + adv.advRef + '</span>');
  }
  if (gfr < 30 && drug.fr > 0.3) {
    ms.push('<b>⚠ TFG < 30 mL/min:</b> t½ ajustada = ' + r.adjHL + 'h (' + Math.round(r.adjHL / drug.hl * 100) + '% do normal). Verificar ajuste de dose na seção "Ajuste renal".');
    lv = 'danger';
  }
  if (gfr >= 130 && drug.fr > 0.5) {
    ms.push('<b>⚠ ARC (Augmented Renal Clearance):</b> clearance aumentado pode reduzir exposição em 20-50%. Considerar doses maiores ou infusão prolongada. Comum em: sepse precoce, trauma, queimados, jovens (<50 anos).');
  }
  if (sel === 'vancomycin' && r.aucMic > 600) {
    ms.push('<b>⚠ AUC/MIC = ' + r.aucMic + ' (>600):</b> risco aumentado de nefrotoxicidade. Se associado a pipe/tazo, risco potencializado (Luther, CID 2018).');
    lv = 'danger';
  }
  if (sel === 'voriconazole' && r.cmin > 5.5) {
    ms.push('<b>⚠ Vale estimado = ' + r.cmin + ' mg/L (>5.5):</b> risco de neurotoxicidade e hepatotoxicidade. Considerar ↓dose.');
    lv = 'danger';
  }
  if (sel === 'voriconazole' && r.cmin < 2) {
    ms.push('<b>⚠ Vale estimado = ' + r.cmin + ' mg/L (<2):</b> risco de falha terapêutica. Mortalidade 2× maior com vale subterapêutico (Pascual 2008).');
    lv = 'danger';
  }
  if (sel === 'teicoplanin' && r.cmin < 15) {
    ms.push('<b>⚠ Vale estimado = ' + r.cmin + ' mg/L (<15):</b> risco de falha terapêutica em infecções graves. Verificar se loading dose foi administrada corretamente.');
    lv = 'danger';
  }
  if ((sel === 'amikacin' || sel === 'gentamicin') && r.cmin > 5) {
    ms.push('<b>⚠ Vale = ' + r.cmin + ' mg/L (>5):</b> risco de nefro/ototoxicidade. Considerar prolongar intervalo.');
    lv = 'danger';
  }
  if (sel === 'linezolid' && r.cmin > 10) {
    ms.push('<b>⚠ Vale estimado = ' + r.cmin + ' mg/L (>10):</b> risco elevado de trombocitopenia. Monitorar plaquetas a cada 48-72h.');
    lv = 'danger';
  }
  if (sel === 'polymyxinB' && r.auc24 > 100) {
    ms.push('<b>⚠ AUC₂₄ = ' + r.auc24 + ' mg·h/L (>100):</b> risco elevado de nefrotoxicidade.');
    lv = 'danger';
  }
  return { ms, lv };
}

/**
 * Uncertainty bands configuration for imprecise monocompartmental drugs.
 */
export const UNCERTAINTY_DRUGS = {
  teicoplanin: { lo: 0.6, hi: 1.5, reason: 'tricompartimental' },
  voriconazole: { lo: 0.5, hi: 2.0, reason: 'cinética não-linear' },
  amphoB_lipo: { lo: 0.5, hi: 1.8, reason: 'multicompartimental' }
};
