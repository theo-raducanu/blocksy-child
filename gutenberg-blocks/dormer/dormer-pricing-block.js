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
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });
                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Pricing — preview requires ServerSideRender'));
                }

                function makeRowPanel(i) {
                    return el(PanelBody, { key: 'row-' + i, title: 'Cost Row ' + i, initialOpen: false },
                        el(TextControl, { label: 'Name', value: a['row' + i + 'Name'] || '', onChange: function (v) { var u = {}; u['row' + i + 'Name'] = v; setAttributes(u); } }),
                        el(TextControl, { label: 'Range', value: a['row' + i + 'Range'] || '', onChange: function (v) { var u = {}; u['row' + i + 'Range'] = v; setAttributes(u); } })
                    );
                }

                var rowPanels = [];
                for (var i = 1; i <= 7; i++) { rowPanels.push(makeRowPanel(i)); }

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
                    el(SSR, { block: 'myloft/dormer-pricing', attributes: a })
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-pricing block error', e); }
}(window.wp));
