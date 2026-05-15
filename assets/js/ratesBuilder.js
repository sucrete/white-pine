const query = encodeURIComponent(
  `{'playGolfPromo':*[_type=='playGolfPromo'][0],'inSeasonRates':*[_type=='inSeasonRates'][0],'par3Rates':*[_type=='par3Rates'][0],'trailFees':*[_type=='trailFees'][0]}`
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
      const { playGolfPromo: pgp, inSeasonRates: isr, par3Rates: p3r, trailFees: tf } = result;

      // — Play Golf Promo —
      const promoEl = document.querySelector('.table-wrapper-promo');
      if (pgp?.visible === false) {
        promoEl.style.display = 'none';
        document.querySelector('.table-wrapper-seasonal-rates hr')?.style.setProperty('display', 'none');
      } else {
        if (pgp?.heading) promoEl.querySelector('h3').textContent = pgp.heading;
        promoEl.querySelector('tbody').innerHTML = [
          row(pgp?.adultLabel  || 'Adult',  pgp?.adultDef,  pgp?.adult),
          row(pgp?.juniorLabel || 'Junior', pgp?.juniorDef, pgp?.junior),
          row(pgp?.cartLabel   || 'Cart',   pgp?.cartDef,   pgp?.cart),
        ].join('');
      }

      // — In-Season Rates —
      const isrEl = document.querySelector('.table-wrapper-seasonal-rates');
      if (isr?.heading) isrEl.querySelector('h3').textContent = isr.heading;
      if (isr?.description) { const p = isrEl.querySelector('p'); if (p) p.textContent = isr.description; }
      isrEl.querySelector('tbody').innerHTML = [
        row(isr?.adultLabel       || 'Adult',                   isr?.adultDef,       isr?.adult9,       isr?.adult18),
        row(isr?.juniorLabel      || 'Junior',                  isr?.juniorDef,      isr?.junior9,      isr?.junior18),
        row(isr?.nonResidentLabel || 'Non-Resident',            isr?.nonResidentDef, isr?.nonResident9, isr?.nonResident18),
        row(isr?.cartsLabel       || 'Carts',                   isr?.cartsDef,       isr?.carts9,       isr?.carts18),
        row(isr?.additional9Label || 'Additional 9 Hole Round', isr?.additional9Def, isr?.additional9,  '--'),
      ].join('');

      // — Par 3 Rates —
      const p3El = document.querySelector('.table-wrapper-par-3-rates');
      if (p3r?.heading) p3El.querySelector('h3').textContent = p3r.heading;
      if (p3r?.description) { const p = p3El.querySelector('p'); if (p) p.textContent = p3r.description; }
      p3El.querySelector('tbody').innerHTML = [
        row(p3r?.adultLabel  || 'Adult',  p3r?.adultDef,  p3r?.adult),
        row(p3r?.juniorLabel || 'Junior', p3r?.juniorDef, p3r?.junior),
      ].join('');

      // — Trail Fees —
      const tfEl = document.querySelector('.table-wrapper-trail-fees');
      if (tf?.heading) tfEl.querySelector('h3').textContent = tf.heading;
      if (tf?.description) { const p = tfEl.querySelector('p'); if (p) p.textContent = tf.description; }
      tfEl.querySelector('tbody').innerHTML = [
        row(tf?.dailyTrailFeeLabel || 'Daily Trail Fee', tf?.dailyTrailFeeDef, tf?.dailyTrailFee),
      ].join('');
    });
});
