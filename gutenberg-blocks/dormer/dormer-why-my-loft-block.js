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
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: attrs.eyebrow || '', onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextControl, { label: 'Heading', value: attrs.h2 || '', onChange: function (v) { setAttributes({ h2: v }); } }),
                            el(TextControl, { label: 'Subtitle', value: attrs.h3Subtitle || '', onChange: function (v) { setAttributes({ h3Subtitle: v }); } })
                        ),
                        el(PanelBody, { title: 'USP 1', initialOpen: false },
                            el(TextControl, { label: 'Badge', value: attrs.usp1Badge || '', onChange: function (v) { setAttributes({ usp1Badge: v }); } }),
                            el(TextControl, { label: 'Heading', value: attrs.usp1H3 || '', onChange: function (v) { setAttributes({ usp1H3: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.usp1P || '', rows: 3, onChange: function (v) { setAttributes({ usp1P: v }); } })
                        ),
                        el(PanelBody, { title: 'USP 2', initialOpen: false },
                            el(TextControl, { label: 'Badge', value: attrs.usp2Badge || '', onChange: function (v) { setAttributes({ usp2Badge: v }); } }),
                            el(TextControl, { label: 'Heading', value: attrs.usp2H3 || '', onChange: function (v) { setAttributes({ usp2H3: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.usp2P || '', rows: 3, onChange: function (v) { setAttributes({ usp2P: v }); } })
                        ),
                        el(PanelBody, { title: 'USP 3', initialOpen: false },
                            el(TextControl, { label: 'Badge', value: attrs.usp3Badge || '', onChange: function (v) { setAttributes({ usp3Badge: v }); } }),
                            el(TextControl, { label: 'Heading', value: attrs.usp3H3 || '', onChange: function (v) { setAttributes({ usp3H3: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.usp3P || '', rows: 3, onChange: function (v) { setAttributes({ usp3P: v }); } })
                        ),
                        el(PanelBody, { title: 'Dark Panel 1', initialOpen: false },
                            el(TextControl, { label: 'Heading', value: attrs.dark1H3 || '', onChange: function (v) { setAttributes({ dark1H3: v }); } }),
                            el(TextareaControl, { label: 'Body', value: attrs.dark1P || '', rows: 3, onChange: function (v) { setAttributes({ dark1P: v }); } })
                        ),
                        el(PanelBody, { title: 'Dark Panel 2', initialOpen: false },
                            el(TextControl, { label: 'Heading', value: attrs.dark2H3 || '', onChange: function (v) { setAttributes({ dark2H3: v }); } }),
                            el(TextareaControl, { label: 'Body', value: attrs.dark2P || '', rows: 3, onChange: function (v) { setAttributes({ dark2P: v }); } })
                        ),
                        el(PanelBody, { title: 'What\'s Included', initialOpen: false },
                            el(TextControl, { label: 'Section Title', value: attrs.includedTitle || '', onChange: function (v) { setAttributes({ includedTitle: v }); } }),
                            el(TextControl, { label: 'Item 1', value: attrs.inc1 || '', onChange: function (v) { setAttributes({ inc1: v }); } }),
                            el(TextControl, { label: 'Item 2', value: attrs.inc2 || '', onChange: function (v) { setAttributes({ inc2: v }); } }),
                            el(TextControl, { label: 'Item 3', value: attrs.inc3 || '', onChange: function (v) { setAttributes({ inc3: v }); } }),
                            el(TextControl, { label: 'Item 4', value: attrs.inc4 || '', onChange: function (v) { setAttributes({ inc4: v }); } }),
                            el(TextControl, { label: 'Item 5', value: attrs.inc5 || '', onChange: function (v) { setAttributes({ inc5: v }); } }),
                            el(TextControl, { label: 'Item 6', value: attrs.inc6 || '', onChange: function (v) { setAttributes({ inc6: v }); } }),
                            el(TextControl, { label: 'Item 7', value: attrs.inc7 || '', onChange: function (v) { setAttributes({ inc7: v }); } }),
                            el(TextControl, { label: 'Item 8', value: attrs.inc8 || '', onChange: function (v) { setAttributes({ inc8: v }); } }),
                            el(TextControl, { label: 'Item 9', value: attrs.inc9 || '', onChange: function (v) { setAttributes({ inc9: v }); } }),
                            el(TextControl, { label: 'Item 10', value: attrs.inc10 || '', onChange: function (v) { setAttributes({ inc10: v }); } })
                        ),
                        el(PanelBody, { title: 'CTA Buttons', initialOpen: false },
                            el(TextControl, { label: 'CTA 1 Text', value: attrs.cta1Text || '', onChange: function (v) { setAttributes({ cta1Text: v }); } }),
                            el(TextControl, { label: 'CTA 1 URL', value: attrs.cta1Url, onChange: function (v) { setAttributes({ cta1Url: v }); } }),
                            el(TextControl, { label: 'CTA 2 Text', value: attrs.cta2Text || '', onChange: function (v) { setAttributes({ cta2Text: v }); } }),
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
