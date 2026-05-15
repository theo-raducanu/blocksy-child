(function (wp) {
    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) return;
    var registerBlockType = wp.blocks.registerBlockType;
    var getBlockType = wp.blocks.getBlockType;
    var el = wp.element.createElement;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var TextControl = wp.components.TextControl;
    var TextareaControl = wp.components.TextareaControl;
    var ToggleControl = wp.components.ToggleControl;
    var Button = wp.components.Button;

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-types')) return;

    var defaultTypes = [
        { name: 'Dormer', desc: 'Vertical extension from roof slope. Maximum headroom and floor area. Suits most London terraces.', price: 'From £70,000', url: '', linkText: 'Current page', featured: true, badgeText: 'Most Popular' },
        { name: 'Hip-to-Gable', desc: 'Extends hipped roof to a vertical gable wall. Significant space gain for semi-detached properties.', price: 'From £75,000', url: '/hip-to-gable-loft-conversion', linkText: 'Learn more →', featured: false, badgeText: '' },
        { name: 'Velux / Roof Light', desc: 'Adds roof windows without altering the roofline. Most affordable option where headroom is sufficient.', price: 'From £55,000', url: '/velux-loft-conversion', linkText: 'Learn more →', featured: false, badgeText: '' },
        { name: 'Mansard', desc: 'Near-vertical rear walls and flat roof. Maximum volume — common in central and inner London.', price: 'From £80,000', url: '/mansard-loft-conversion', linkText: 'Learn more →', featured: false, badgeText: '' },
        { name: 'L-Shaped Dormer', desc: 'Rear dormer over a rear extension. Maximum space on Victorian terraces with rear additions.', price: 'From £85,000', url: '/l-shaped-dormer-loft-conversion', linkText: 'Learn more →', featured: false, badgeText: '' },
    ];

    var attrs = {
        eyebrow: { type: 'string', default: 'All Loft Conversion Types' },
        h2: { type: 'string', default: 'Not Sure Which Conversion Is Right for You?' },
        description: { type: 'string', default: 'We\'ll confirm the best solution for your property during your free survey. Browse all conversion types below.' },
        types: { type: 'array', default: [] },
    };
    defaultTypes.forEach(function (t, index) {
        var i = index + 1;
        attrs['type' + i + 'Name'] = { type: 'string', default: t.name };
        attrs['type' + i + 'Desc'] = { type: 'string', default: t.desc };
        attrs['type' + i + 'Price'] = { type: 'string', default: t.price };
        attrs['type' + i + 'Url'] = { type: 'string', default: t.url };
    });

    try {
        registerBlockType('myloft/dormer-types', {
            apiVersion: 2,
            title: 'Dormer – Types',
            icon: 'grid-view',
            category: 'myloft',
            supports: { html: false },
            attributes: attrs,
            edit: function (props) {
                var a = props.attributes;
                var setAttributes = props.setAttributes;
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });

                function getLegacyTypes() {
                    var rows = [];
                    for (var i = 1; i <= 5; i++) {
                        var fallback = defaultTypes[i - 1] || { name: '', desc: '', price: '', url: '', linkText: 'Learn more →', featured: false, badgeText: '' };
                        rows.push({
                            name: a['type' + i + 'Name'] || fallback.name,
                            desc: a['type' + i + 'Desc'] || fallback.desc,
                            price: a['type' + i + 'Price'] || fallback.price,
                            url: a['type' + i + 'Url'] || fallback.url,
                            linkText: i === 1 ? 'Current page' : 'Learn more →',
                            featured: i === 1,
                            badgeText: i === 1 ? 'Most Popular' : ''
                        });
                    }
                    return rows;
                }

                var types = Array.isArray(a.types) && a.types.length ? a.types : getLegacyTypes();

                function updateType(index, key, value) {
                    var next = types.slice();
                    next[index] = Object.assign({}, next[index], {});
                    next[index][key] = value;
                    setAttributes({ types: next });
                }

                function removeType(index) {
                    var next = types.slice();
                    next.splice(index, 1);
                    setAttributes({ types: next });
                }

                function addType() {
                    var next = types.slice();
                    next.push({ name: '', desc: '', price: '', url: '', linkText: 'Learn more →', featured: false, badgeText: '' });
                    setAttributes({ types: next });
                }

                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Types — preview requires ServerSideRender'));
                }
                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: false },
                            el(TextControl, { label: 'Eyebrow', value: a.eyebrow || '', onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextControl, { label: 'Heading', value: a.h2 || '', onChange: function (v) { setAttributes({ h2: v }); } }),
                            el(TextareaControl, { label: 'Description', value: a.description || '', rows: 4, onChange: function (v) { setAttributes({ description: v }); } })
                        ),
                        el(PanelBody, { title: 'Type Cards', initialOpen: true },
                            types.map(function (t, i) {
                                return el('div', { key: 'type-' + i, style: { marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e2e2' } },
                                    el(TextControl, { label: 'Name', value: t.name || '', onChange: function (v) { updateType(i, 'name', v); } }),
                                    el(TextareaControl, { label: 'Description', value: t.desc || '', rows: 4, onChange: function (v) { updateType(i, 'desc', v); } }),
                                    el(TextControl, { label: 'Price', value: t.price || '', onChange: function (v) { updateType(i, 'price', v); } }),
                                    el(TextControl, { label: 'URL', value: t.url || '', onChange: function (v) { updateType(i, 'url', v); } }),
                                    el(TextControl, { label: 'Link Text', value: t.linkText || '', onChange: function (v) { updateType(i, 'linkText', v); } }),
                                    el(ToggleControl, { label: 'Featured Card', checked: !!t.featured, onChange: function (v) { updateType(i, 'featured', v); } }),
                                    !!t.featured && el(TextControl, { label: 'Badge Text', value: t.badgeText || '', onChange: function (v) { updateType(i, 'badgeText', v); } }),
                                    el(Button, { isDestructive: true, isSmall: true, onClick: function () { removeType(i); } }, 'Remove Type')
                                );
                            }),
                            el(Button, { isSecondary: true, onClick: addType }, 'Add Type')
                        )
                    ),
                    el(SSR, { block: 'myloft/dormer-types', attributes: a })
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-types block error', e); }
}(window.wp));
