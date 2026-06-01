(function (wp) {
    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) return;
    var registerBlockType = wp.blocks.registerBlockType;
    var getBlockType = wp.blocks.getBlockType;
    var el = wp.element.createElement;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var RichText = wp.blockEditor.RichText;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var TextControl = wp.components.TextControl;
    var TextareaControl = wp.components.TextareaControl;

    // Inline editable RichText rendered on the canvas. Restrictive by design:
    // the editor can only change text, never the layout/structure. opts.plain
    // (headings, labels, buttons) allows no formatting; otherwise links + bold/italic.
    function rt(tagName, value, onChange, opts) {
        opts = opts || {};
        var props = {
            tagName: tagName,
            value: typeof value === 'string' ? value : '',
            onChange: onChange,
            allowedFormats: opts.plain ? [] : ['core/bold', 'core/italic', 'core/link']
        };
        if (opts.className) { props.className = opts.className; }
        if (opts.style) { props.style = opts.style; }
        if (opts.placeholder) { props.placeholder = opts.placeholder; }
        if (opts.key) { props.key = opts.key; }
        if (opts.href) { props.href = opts.href; }
        return el(RichText, props);
    }

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
                var a = props.attributes;
                var setAttributes = props.setAttributes;
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks', style: { margin: 0, padding: 0 } });
                function set(key) { return function (v) { var u = {}; u[key] = v; setAttributes(u); }; }

                function makeRowPanel(i) {
                    return el(PanelBody, { key: 'row-' + i, title: 'Cost Row ' + i, initialOpen: false },
                        el(TextControl, { label: 'Name', value: a['row' + i + 'Name'] || '', onChange: function (v) { var u = {}; u['row' + i + 'Name'] = v; setAttributes(u); } }),
                        el(TextControl, { label: 'Range', value: a['row' + i + 'Range'] || '', onChange: function (v) { var u = {}; u['row' + i + 'Range'] = v; setAttributes(u); } })
                    );
                }

                var rowPanels = [];
                for (var i = 1; i <= 7; i++) { rowPanels.push(makeRowPanel(i)); }

                // Table body rows mirroring the PHP for-loop.
                var tableRows = [];
                for (var r = 1; r <= 7; r++) {
                    tableRows.push(
                        el('tr', { key: 'trow-' + r },
                            el('td', null, rt('span', a['row' + r + 'Name'], set('row' + r + 'Name'), { placeholder: 'Element ' + r })),
                            el('td', null, rt('span', a['row' + r + 'Range'], set('row' + r + 'Range'), { plain: true, placeholder: 'Range ' + r }))
                        )
                    );
                }

                // ROI rows mirroring the PHP foreach loop.
                var roiData = [
                    ['Property value (example)', 'roiPropVal', false],
                    ['Conversion cost', 'roiCost', false],
                    ['Value after conversion', 'roiAfter', false],
                    ['Net gain', 'roiNetGain', true]
                ];
                var roiRows = roiData.map(function (row, idx) {
                    var rowStyle = { display: 'flex', justifyContent: 'space-between', padding: '8px 0' };
                    if (idx < 3) { rowStyle.borderBottom = '1px solid rgba(253,83,32,0.12)'; }
                    rowStyle.fontSize = row[2] ? '0.95rem' : '0.9rem';
                    var strongStyle = row[2] ? { color: 'var(--color-orange)', fontSize: '1rem' } : null;
                    return el('div', { key: 'roi-' + idx, style: rowStyle },
                        el('span', { style: { color: '#5a5a5a' } }, row[0]),
                        rt('strong', a[row[1]], set(row[1]), { plain: true, style: strongStyle, placeholder: row[0] })
                    );
                });

                // Financing options mirroring the PHP foreach loop.
                var finKeys = ['fin1', 'fin2', 'fin3'];
                var finCards = finKeys.map(function (fin) {
                    if (fin !== 'fin3') {
                        return el('div', { key: 'fin-' + fin, className: 'card', style: { padding: '16px 20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                            el('div', null,
                                rt('h4', a[fin + 'Title'], set(fin + 'Title'), { plain: true, style: { fontSize: '0.9rem', marginBottom: '2px' }, placeholder: 'Title' }),
                                rt('p', a[fin + 'Sub'], set(fin + 'Sub'), { style: { fontSize: '0.8rem', color: '#888' }, placeholder: 'Subtitle' })
                            ),
                            rt('span', a[fin + 'Badge'], set(fin + 'Badge'), { plain: true, className: 'badge badge--light', placeholder: 'Badge' })
                        );
                    }
                    return el('div', { key: 'fin-' + fin, className: 'card', style: { padding: '16px 20px', borderRadius: '16px' } },
                        rt('h4', a[fin + 'Title'], set(fin + 'Title'), { plain: true, style: { fontSize: '0.9rem', marginBottom: '2px' }, placeholder: 'Title' }),
                        rt('p', a[fin + 'Sub'], set(fin + 'Sub'), { style: { fontSize: '0.8rem', color: '#888' }, placeholder: 'Subtitle' })
                    );
                });

                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: a.eyebrow || '', onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextControl, { label: 'Heading', value: a.h2 || '', onChange: function (v) { setAttributes({ h2: v }); } }),
                            el(TextareaControl, { label: 'Intro', value: a.intro || '', rows: 3, onChange: function (v) { setAttributes({ intro: v }); } })
                        ),
                        el(PanelBody, { title: 'Cost Table', initialOpen: false },
                            el(TextControl, { label: 'Table Caption', value: a.tableCaption || '', onChange: function (v) { setAttributes({ tableCaption: v }); } }),
                            el(TextareaControl, { label: 'Table Footnote', value: a.tableFootnote || '', rows: 3, onChange: function (v) { setAttributes({ tableFootnote: v }); } })
                        ),
                        rowPanels,
                        el(PanelBody, { title: 'ROI Numbers', initialOpen: false },
                            el(TextControl, { label: 'Property Value', value: a.roiPropVal || '', onChange: function (v) { setAttributes({ roiPropVal: v }); } }),
                            el(TextControl, { label: 'Cost', value: a.roiCost || '', onChange: function (v) { setAttributes({ roiCost: v }); } }),
                            el(TextControl, { label: 'Value After', value: a.roiAfter || '', onChange: function (v) { setAttributes({ roiAfter: v }); } }),
                            el(TextControl, { label: 'Net Gain', value: a.roiNetGain || '', onChange: function (v) { setAttributes({ roiNetGain: v }); } })
                        ),
                        el(PanelBody, { title: 'Finance Option 1', initialOpen: false },
                            el(TextControl, { label: 'Title', value: a.fin1Title || '', onChange: function (v) { setAttributes({ fin1Title: v }); } }),
                            el(TextareaControl, { label: 'Subtitle', value: a.fin1Sub || '', rows: 2, onChange: function (v) { setAttributes({ fin1Sub: v }); } }),
                            el(TextControl, { label: 'Badge', value: a.fin1Badge || '', onChange: function (v) { setAttributes({ fin1Badge: v }); } })
                        ),
                        el(PanelBody, { title: 'Finance Option 2', initialOpen: false },
                            el(TextControl, { label: 'Title', value: a.fin2Title || '', onChange: function (v) { setAttributes({ fin2Title: v }); } }),
                            el(TextareaControl, { label: 'Subtitle', value: a.fin2Sub || '', rows: 2, onChange: function (v) { setAttributes({ fin2Sub: v }); } }),
                            el(TextControl, { label: 'Badge', value: a.fin2Badge || '', onChange: function (v) { setAttributes({ fin2Badge: v }); } })
                        ),
                        el(PanelBody, { title: 'Finance Option 3', initialOpen: false },
                            el(TextControl, { label: 'Title', value: a.fin3Title || '', onChange: function (v) { setAttributes({ fin3Title: v }); } }),
                            el(TextareaControl, { label: 'Subtitle', value: a.fin3Sub || '', rows: 2, onChange: function (v) { setAttributes({ fin3Sub: v }); } })
                        )
                    ),
                    el('section', { className: 'section section--light', id: 'pricing' },
                        el('div', { className: 'wrap' },
                            el('div', { style: { textAlign: 'center', marginBottom: '52px' } },
                                rt('span', a.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                rt('h2', a.h2, set('h2'), { plain: true, style: { marginBottom: '12px' }, placeholder: 'Heading' }),
                                rt('p', a.intro, set('intro'), { style: { maxWidth: '560px', margin: '0 auto', color: '#5a5a5a' }, placeholder: 'Intro' })
                            ),
                            el('div', { className: 'grid-2', style: { gap: '36px', alignItems: 'flex-start' } },
                                el('div', { style: { background: 'var(--color-black)', borderRadius: 'var(--radius-card)', padding: '36px' } },
                                    rt('p', a.tableCaption, set('tableCaption'), { plain: true, style: { color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }, placeholder: 'Table caption' }),
                                    el('table', { className: 'price-table' },
                                        el('thead', null,
                                            el('tr', null,
                                                el('th', null, 'Element'),
                                                el('th', null, 'Typical Range')
                                            )
                                        ),
                                        el('tbody', null, tableRows)
                                    ),
                                    rt('p', a.tableFootnote, set('tableFootnote'), { style: { color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: '18px' }, placeholder: 'Table footnote' })
                                ),
                                el('div', { style: { display: 'flex', flexDirection: 'column', gap: '24px' } },
                                    el('div', null,
                                        el('h3', { style: { marginBottom: '16px' } }, 'Return on Investment'),
                                        el('div', { style: { background: '#ffffff', border: '1px solid rgba(253,83,32,0.2)', borderRadius: '16px', padding: '22px 24px' } }, roiRows)
                                    ),
                                    el('div', null,
                                        el('h3', { style: { marginBottom: '14px' } }, 'Financing Options'),
                                        el('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } }, finCards)
                                    )
                                )
                            )
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-pricing block error', e); }
}(window.wp));
