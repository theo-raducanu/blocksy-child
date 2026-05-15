(function (wp) {
    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) return;
    var registerBlockType = wp.blocks.registerBlockType;
    var getBlockType = wp.blocks.getBlockType;
    var el = wp.element.createElement;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var RichText = wp.blockEditor.RichText;

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-pricing')) return;

    try {
        registerBlockType('myloft/dormer-pricing', {
            apiVersion: 2,
            title: 'Dormer – Pricing',
            icon: 'money',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                eyebrow: { type: 'string', default: 'Transparent Pricing' },
                h2: { type: 'string', default: 'Dormer Loft Conversion Cost: £70,000–£100,000' },
                intro: { type: 'string', default: 'Fixed pricing means the quote confirmed after your survey is the price you pay. No hidden costs, no provisional sums.' },
                tableCaption: { type: 'string', default: 'Example Cost Breakdown — £80,000 Project' },
                row1Name: { type: 'string', default: 'Structural work & dormer build' },
                row1Range: { type: 'string', default: '£28k–£32k' },
                row2Name: { type: 'string', default: 'Fitted furniture & storage' },
                row2Range: { type: 'string', default: '£8k–£12k' },
                row3Name: { type: 'string', default: 'En-suite (standard specification)' },
                row3Range: { type: 'string', default: '£10k–£15k' },
                row4Name: { type: 'string', default: 'Services — electrics & heating' },
                row4Range: { type: 'string', default: '£6k–£8k' },
                row5Name: { type: 'string', default: 'Staircase' },
                row5Range: { type: 'string', default: '£4k–£6k' },
                row6Name: { type: 'string', default: 'Plasterwork & flooring' },
                row6Range: { type: 'string', default: '£5k–£7k' },
                row7Name: { type: 'string', default: 'Building control, PM & guarantees' },
                row7Range: { type: 'string', default: '£8k–£11k' },
                tableFootnote: { type: 'string', default: 'All costs include building regulations fees (£800–£1,200) and project management. Updated February 2026.' },
                roiPropVal: { type: 'string', default: '£800,000' },
                roiCost: { type: 'string', default: '£85,000' },
                roiAfter: { type: 'string', default: '£920k–£960k' },
                roiNetGain: { type: 'string', default: '£35,000–£75,000' },
                fin1Title: { type: 'string', default: 'Remortgage / Equity Release' },
                fin1Sub: { type: 'string', default: 'Most common · Lowest rates · 2–5% APR' },
                fin1Badge: { type: 'string', default: 'Popular' },
                fin2Title: { type: 'string', default: 'Home Improvement Loan' },
                fin2Sub: { type: 'string', default: 'Faster approval · 4–9% APR · Up to £100k' },
                fin2Badge: { type: 'string', default: 'Flexible' },
                fin3Title: { type: 'string', default: 'Milestone Payment Plan' },
                fin3Sub: { type: 'string', default: '10% deposit → 30% Wk 2 → 30% Wk 5 → 25% Wk 7 → 5% on handover' },
            },
            edit: function (props) {
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });
                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Pricing — preview requires ServerSideRender'));
                }
                return el('div', blockProps, el(SSR, { block: 'myloft/dormer-pricing', attributes: props.attributes }));
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-pricing block error', e); }
}(window.wp));
