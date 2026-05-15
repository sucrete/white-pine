const query = encodeURIComponent(
  `{'seasonPasses':*[_type=='seasonPasses'][0],'punchCardsWP':*[_type=='punchCardsWP'][0],'thirtyDayCards':*[_type=='thirtyDayCards'][0],'yearlyTrailFees':*[_type=='yearlyTrailFees'][0],'cartShedRental':*[_type=='cartShedRental'][0]}`
);
const API = `https://5vgxmbfr.api.sanity.io/v2025-06-26/data/query/production?query=${query}&perspective=published`;

const row = (label, def, ...prices) => `
  <tr>
    <th scope="row">
      <div class="th-wrap">${label}</div>
      ${def ? `<div class="note">${def}</div>` : ''}
    </th>
    ${prices.map(p => `<td>${p || '--'}</td>`).join('')}
  </tr>`;

document.addEventListener('DOMContentLoaded', () => {
  fetch(API)
    .then(r => r.json())
    .then(({ result }) => {
      const { seasonPasses: sp, punchCardsWP: pc, thirtyDayCards: tdc, yearlyTrailFees: ytf, cartShedRental: csr } = result;
      const wrappers = document.querySelectorAll('.table-wrapper-basic-fees');

      // — Season Passes — [0]
      const spEl = wrappers[0];
      if (sp?.heading) spEl.querySelector('h3').textContent = sp.heading;
      if (sp?.description) { const p = spEl.querySelector('p'); if (p) p.textContent = sp.description; }
      spEl.querySelector('tbody').innerHTML = [
        row(sp?.adultLabel        || 'Adult',        sp?.adultDef,        sp?.adult),
        row(sp?.pairLabel         || 'Pair',          sp?.pairDef,         sp?.pair),
        row(sp?.familyLabel       || 'Family',        sp?.familyDef,       sp?.family),
        row(sp?.youngAdultLabel   || 'Young Adult',   sp?.youngAdultDef,   sp?.youngAdult),
        row(sp?.juniorLabel       || 'Junior',        sp?.juniorDef,       sp?.junior),
        row(sp?.seniorSingleLabel || 'Senior Single', sp?.seniorSingleDef, sp?.seniorSingle),
        row(sp?.seniorDoubleLabel || 'Senior Double', sp?.seniorDoubleDef, sp?.seniorDouble),
      ].join('');

      // — Punch Cards — [1]
      const pcEl = wrappers[1];
      if (pc?.heading) pcEl.querySelector('h3').textContent = pc.heading;
      if (pc?.description) { const p = pcEl.querySelector('p'); if (p) p.textContent = pc.description; }
      pcEl.querySelector('tbody').innerHTML = [
        row(pc?.adultLabel  || 'Adult',  pc?.adultDef,  pc?.adult),
        row(pc?.juniorLabel || 'Junior', pc?.juniorDef, pc?.junior),
      ].join('');

      // — 30 Day Cards — [2]
      const tdcEl = wrappers[2];
      if (tdc?.heading) tdcEl.querySelector('h3').textContent = tdc.heading;
      if (tdc?.description) { const p = tdcEl.querySelector('p'); if (p) p.textContent = tdc.description; }
      tdcEl.querySelector('tbody').innerHTML = [
        row(tdc?.adultLabel  || 'Adult',  tdc?.adultDef,  tdc?.adult),
        row(tdc?.pairLabel   || 'Pair',   tdc?.pairDef,   tdc?.pair),
        row(tdc?.familyLabel || 'Family', tdc?.familyDef, tdc?.family),
        row(tdc?.juniorLabel || 'Junior', tdc?.juniorDef, tdc?.junior),
      ].join('');

      // — Yearly Trail Fees — [3]
      const ytfEl = wrappers[3];
      if (ytf?.heading) ytfEl.querySelector('h3').textContent = ytf.heading;
      if (ytf?.description) { const p = ytfEl.querySelector('p'); if (p) p.textContent = ytf.description; }
      ytfEl.querySelector('tbody').innerHTML = [
        row(ytf?.yearlyTrailFeeLabel        || 'Yearly Trail Fee',         ytf?.yearlyTrailFeeDef,        ytf?.yearlyTrailFee),
        row(ytf?.yearlyNonCartOwnerFeeLabel || 'Yearly Non-Cart Owner Fee', ytf?.yearlyNonCartOwnerFeeDef, ytf?.yearlyNonCartOwnerFee),
      ].join('');

      // — Cart Shed Rental — [4]
      const csrEl = wrappers[4];
      if (csr?.heading) csrEl.querySelector('h3').textContent = csr.heading;
      if (csr?.description) { const p = csrEl.querySelector('p'); if (p) p.textContent = csr.description; }
      csrEl.querySelector('tbody').innerHTML = [
        row(csr?.gasCartLabel      || 'Gas Cart',      csr?.gasCartDef,      csr?.gasCart),
        row(csr?.electricCartLabel || 'Electric Cart', csr?.electricCartDef, csr?.electricCart),
      ].join('');
    });
});
