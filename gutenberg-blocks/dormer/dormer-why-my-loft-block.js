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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-why-my-loft')) return;

    try {
        registerBlockType('myloft/dormer-why-my-loft', {
            apiVersion: 2,
            title: 'Dormer – Why My Loft',
            icon: 'star-filled',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                eyebrow: { type: 'string', default: 'Why My Loft' },
                h2: { type: 'string', default: 'Why Choose My Loft for Your Dormer Conversion?' },
                h3Subtitle: { type: 'string', default: 'Design-Led Lofts, Fixed Price, Zero Stress' },
                usp1Badge: { type: 'string', default: 'No Design Fees' },
                usp1H3: { type: 'string', default: 'Designer Collections Included' },
                usp1P: { type: 'string', default: 'Six signature collections by named interior designers — complete schemes covering layout, materials, furniture, lighting, and finishing touches. Included in every project at no extra cost.' },
                usp2Badge: { type: 'string', default: 'Price Guarantee' },
                usp2H3: { type: 'string', default: 'Fixed Pricing from Day One' },
                usp2P: { type: 'string', default: 'The price we quote is the price you pay. No hidden costs, no provisional sums, no surprises.' },
                usp3Badge: { type: 'string', default: 'Fast Build' },
                usp3H3: { type: 'string', default: '6–10 Week Delivery' },
                usp3P: { type: 'string', default: 'Systematised processes, pre-designed collections, materials ordered in advance. Dedicated teams who know our workflow.' },
                dark1H3: { type: 'string', default: 'Masterpiece Construction Quality' },
                dark1P: { type: 'string', default: 'My Loft is part of the Masterpiece Construction family. The same commitment to craftsmanship and quality — applied to a streamlined, fixed-price loft conversion service.' },
                dark2H3: { type: 'string', default: 'Everything Managed for You' },
                dark2P: { type: 'string', default: 'Named project manager from survey to handover. Building regulations, party wall notices, and all trades coordination handled. Weekly photo updates. 6-year workmanship guarantee.' },
                includedTitle: { type: 'string', default: 'Everything Included in Your Fixed Price' },
                inc1: { type: 'string', default: 'Structural design by chartered engineer' },
                inc2: { type: 'string', default: 'Your chosen designer collection' },
                inc3: { type: 'string', default: 'Building regulations approval & sign-off' },
                inc4: { type: 'string', default: 'Bespoke fitted under-eaves storage' },
                inc5: { type: 'string', default: 'Party wall agreements handled' },
                inc6: { type: 'string', default: 'En-suite or shower room — complete spec' },
                inc7: { type: 'string', default: 'Complete electrics, heating & ventilation' },
                inc8: { type: 'string', default: 'Staircase design & installation' },
                inc9: { type: 'string', default: 'Named PM, weekly updates & coordination' },
                inc10: { type: 'string', default: '6-year workmanship guarantee' },
                cta1Text: { type: 'string', default: 'Get Instant Estimate →' },
                cta1Url: { type: 'string', default: '#calculator' },
                cta2Text: { type: 'string', default: 'Book Free Survey →' },
                cta2Url: { type: 'string', default: '#contact' },
            },
            edit: function (props) {
                var attrs = props.attributes;
                var setAttributes = props.setAttributes;
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });
                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Why My Loft — preview requires ServerSideRender'));
                }
                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'CTA Links', initialOpen: false },
                            el(TextControl, { label: 'CTA 1 URL', value: attrs.cta1Url, onChange: function (v) { setAttributes({ cta1Url: v }); } }),
                            el(TextControl, { label: 'CTA 2 URL', value: attrs.cta2Url, onChange: function (v) { setAttributes({ cta2Url: v }); } })
                        )
                    ),
                    el(SSR, { block: 'myloft/dormer-why-my-loft', attributes: attrs })
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-why-my-loft block error', e); }
}(window.wp));
