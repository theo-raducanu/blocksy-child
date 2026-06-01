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
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks', style: { margin: 0, padding: 0 } });
                function set(key) { return function (v) { var u = {}; u[key] = v; setAttributes(u); }; }

                var uspIcons = [
                    el('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' }),
                    el('path', { d: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z' }),
                    el('path', { d: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' })
                ];
                var usps = [
                    { badgeKey: 'usp1Badge', h3Key: 'usp1H3', pKey: 'usp1P' },
                    { badgeKey: 'usp2Badge', h3Key: 'usp2H3', pKey: 'usp2P' },
                    { badgeKey: 'usp3Badge', h3Key: 'usp3H3', pKey: 'usp3P' }
                ];
                var included = ['inc1', 'inc2', 'inc3', 'inc4', 'inc5', 'inc6', 'inc7', 'inc8', 'inc9', 'inc10'];

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
                    el('section', { className: 'section section--dark', id: 'why-my-loft' },
                        el('div', { className: 'wrap' },
                            el('div', { style: { textAlign: 'center', marginBottom: '56px' } },
                                rt('span', attrs.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                rt('h2', attrs.h2, set('h2'), { plain: true, style: { color: '#fff', marginBottom: '12px' }, placeholder: 'Heading' }),
                                rt('h3', attrs.h3Subtitle, set('h3Subtitle'), { plain: true, style: { color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: '400', lineHeight: '1.6', letterSpacing: 'normal', textTransform: 'none', maxWidth: '720px', margin: '16px auto 0', fontFamily: 'inherit' }, placeholder: 'Subtitle' })
                            ),
                            el('div', { className: 'grid-3', style: { marginBottom: '32px' } },
                                usps.map(function (usp, idx) {
                                    return el('div', { className: 'card', style: { textAlign: 'center' }, key: 'usp-' + idx },
                                        el('div', { className: 'icon-wrap', style: { margin: '0 auto 18px' } },
                                            el('svg', { className: 'icon', viewBox: '0 0 24 24' }, uspIcons[idx])
                                        ),
                                        rt('span', attrs[usp.badgeKey], set(usp.badgeKey), { plain: true, className: 'badge badge--light', style: { marginBottom: '12px' }, placeholder: 'Badge' }),
                                        rt('h3', attrs[usp.h3Key], set(usp.h3Key), { plain: true, style: { marginBottom: '10px' }, placeholder: 'Heading' }),
                                        rt('p', attrs[usp.pKey], set(usp.pKey), { style: { color: '#5a5a5a', fontSize: '0.875rem' }, placeholder: 'Description' })
                                    );
                                })
                            ),
                            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '48px' } },
                                el('div', { className: 'card--dark' },
                                    el('div', { className: 'icon-wrap icon-wrap--white', style: { marginBottom: '16px' } },
                                        el('svg', { className: 'icon icon--white', viewBox: '0 0 24 24' }, el('path', { d: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' }))
                                    ),
                                    rt('h3', attrs.dark1H3, set('dark1H3'), { plain: true, style: { color: '#fff', marginBottom: '8px' }, placeholder: 'Heading' }),
                                    rt('p', attrs.dark1P, set('dark1P'), { style: { color: 'var(--color-muted)', fontSize: '0.875rem' }, placeholder: 'Dark panel 1 body' })
                                ),
                                el('div', { className: 'card--dark' },
                                    el('div', { className: 'icon-wrap icon-wrap--white', style: { marginBottom: '16px' } },
                                        el('svg', { className: 'icon icon--white', viewBox: '0 0 24 24' }, el('path', { d: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z' }))
                                    ),
                                    rt('h3', attrs.dark2H3, set('dark2H3'), { plain: true, style: { color: '#fff', marginBottom: '8px' }, placeholder: 'Heading' }),
                                    rt('p', attrs.dark2P, set('dark2P'), { style: { color: 'var(--color-muted)', fontSize: '0.875rem' }, placeholder: 'Dark panel 2 body' })
                                )
                            ),
                            el('div', { style: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-card)', padding: '36px' } },
                                rt('h3', attrs.includedTitle, set('includedTitle'), { plain: true, style: { color: '#fff', marginBottom: '24px', textAlign: 'center' }, placeholder: 'Section Title' }),
                                el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 48px' } },
                                    included.map(function (key, idx) {
                                        var isLastPair = (idx >= 8);
                                        var itemStyle = { display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-muted)', fontSize: '0.875rem', padding: '6px 0' };
                                        if (!isLastPair) { itemStyle.borderBottom = '1px solid rgba(255,255,255,0.06)'; }
                                        return el('div', { style: itemStyle, key: 'inc-' + idx },
                                            el('span', { style: { color: 'var(--color-orange)', fontWeight: '800', fontSize: '0.8rem' } }, '✓'),
                                            rt('span', attrs[key], set(key), { plain: true, placeholder: 'Item ' + (idx + 1) })
                                        );
                                    })
                                )
                            ),
                            el('div', { style: { marginTop: '36px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' } },
                                rt('a', attrs.cta1Text, set('cta1Text'), { plain: true, href: attrs.cta1Url || '#', className: 'btn-cta btn-cta--solid', placeholder: 'CTA 1' }),
                                rt('a', attrs.cta2Text, set('cta2Text'), { plain: true, href: attrs.cta2Url || '#', className: 'btn btn--white', placeholder: 'CTA 2' })
                            )
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-why-my-loft block error', e); }
}(window.wp));
