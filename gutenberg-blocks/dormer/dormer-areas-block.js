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
    var Button = wp.components.Button;

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-areas')) return;

    var defaultBoroughs = [
        { name: 'Richmond', url: '/loft-conversion-richmond' },
        { name: 'Islington', url: '/loft-conversion-islington' },
        { name: 'Hackney', url: '/loft-conversion-hackney' },
        { name: 'Haringey', url: '/loft-conversion-haringey' },
        { name: 'Waltham Forest', url: '/loft-conversion-waltham-forest' },
        { name: 'Lewisham', url: '/loft-conversion-lewisham' },
        { name: 'Greenwich', url: '/loft-conversion-greenwich' },
        { name: 'Wandsworth', url: '/loft-conversion-wandsworth' },
        { name: 'Lambeth', url: '/loft-conversion-lambeth' },
        { name: 'Southwark', url: '/loft-conversion-southwark' },
        { name: 'Tower Hamlets', url: '/loft-conversion-tower-hamlets' },
        { name: 'Newham', url: '/loft-conversion-newham' },
    ];
    var defaultFeatureCards = [
        { name: 'Wandsworth', desc: 'Battersea, Tooting, Balham. High-value Victorian stock — strong ROI on loft conversions.', cost: 'Typical cost: £78k–£100k', url: '/loft-conversion-wandsworth' },
        { name: 'Islington', desc: 'Multiple conservation areas — Barnsbury, Canonbury. We advise on planning status from day one.', cost: 'Typical cost: £80k–£100k', url: '/loft-conversion-islington' },
        { name: 'Haringey', desc: 'Crouch End, Muswell Hill — excellent Victorian and Edwardian terraces. Well-suited to dormer conversions.', cost: 'Typical cost: £72k–£92k', url: '/loft-conversion-haringey' },
    ];

    var attrs = {
        eyebrow: { type: 'string', default: 'Areas We Serve' },
        h2: { type: 'string', default: 'Loft Conversions Across London — Zones 2–5' },
        description: { type: 'string', default: 'We work across all London boroughs. Find your area for local pricing, planning notes, and recommended collections.' },
        boroughs: { type: 'array', default: defaultBoroughs },
        featureCards: { type: 'array', default: defaultFeatureCards },
    };

    try {
        registerBlockType('myloft/dormer-areas', {
            apiVersion: 2,
            title: 'Dormer – Areas',
            icon: 'location',
            category: 'myloft',
            supports: { html: false },
            attributes: attrs,
            edit: function (props) {
                var a = props.attributes;
                var setAttributes = props.setAttributes;
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });
                var boroughs = Array.isArray(a.boroughs) && a.boroughs.length ? a.boroughs : defaultBoroughs;
                var featureCards = Array.isArray(a.featureCards) && a.featureCards.length ? a.featureCards : defaultFeatureCards;

                function updateBorough(index, key, value) {
                    var next = boroughs.slice();
                    next[index] = Object.assign({}, next[index], {});
                    next[index][key] = value;
                    setAttributes({ boroughs: next });
                }

                function removeBorough(index) {
                    var next = boroughs.slice();
                    next.splice(index, 1);
                    setAttributes({ boroughs: next });
                }

                function addBorough() {
                    var next = boroughs.slice();
                    next.push({ name: '', url: '' });
                    setAttributes({ boroughs: next });
                }

                function updateFeatureCard(index, key, value) {
                    var next = featureCards.slice();
                    next[index] = Object.assign({}, next[index], {});
                    next[index][key] = value;
                    setAttributes({ featureCards: next });
                }

                function removeFeatureCard(index) {
                    var next = featureCards.slice();
                    next.splice(index, 1);
                    setAttributes({ featureCards: next });
                }

                function addFeatureCard() {
                    var next = featureCards.slice();
                    next.push({ name: '', desc: '', cost: '', url: '' });
                    setAttributes({ featureCards: next });
                }

                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Areas — preview requires ServerSideRender'));
                }
                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: a.eyebrow || '', onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextControl, { label: 'Heading', value: a.h2 || '', onChange: function (v) { setAttributes({ h2: v }); } }),
                            el(TextareaControl, { label: 'Description', value: a.description || '', rows: 4, onChange: function (v) { setAttributes({ description: v }); } })
                        ),
                        el(PanelBody, { title: 'Boroughs', initialOpen: false },
                            boroughs.map(function (b, i) {
                                return el('div', { key: 'borough-' + i, style: { marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e2e2' } },
                                    el(TextControl, { label: 'Name', value: b.name || '', onChange: function (v) { updateBorough(i, 'name', v); } }),
                                    el(TextControl, { label: 'URL', value: b.url || '', onChange: function (v) { updateBorough(i, 'url', v); } }),
                                    el(Button, { isDestructive: true, isSmall: true, onClick: function () { removeBorough(i); } }, 'Remove Borough')
                                );
                            }),
                            el(Button, { isSecondary: true, onClick: addBorough }, 'Add Borough')
                        ),
                        el(PanelBody, { title: 'Feature Cards', initialOpen: false },
                            featureCards.map(function (f, i) {
                                return el('div', { key: 'feature-' + i, style: { marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e2e2' } },
                                    el(TextControl, { label: 'Name', value: f.name || '', onChange: function (v) { updateFeatureCard(i, 'name', v); } }),
                                    el(TextControl, { label: 'Description', value: f.desc || '', onChange: function (v) { updateFeatureCard(i, 'desc', v); } }),
                                    el(TextControl, { label: 'Cost', value: f.cost || '', onChange: function (v) { updateFeatureCard(i, 'cost', v); } }),
                                    el(TextControl, { label: 'URL', value: f.url || '', onChange: function (v) { updateFeatureCard(i, 'url', v); } }),
                                    el(Button, { isDestructive: true, isSmall: true, onClick: function () { removeFeatureCard(i); } }, 'Remove Feature Card')
                                );
                            }),
                            el(Button, { isSecondary: true, onClick: addFeatureCard }, 'Add Feature Card')
                        )
                    ),
                    el(SSR, { block: 'myloft/dormer-areas', attributes: a })
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-areas block error', e); }
}(window.wp));
