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
    var ToggleControl = wp.components.ToggleControl;
    var Button = wp.components.Button;

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
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks', style: { margin: 0, padding: 0 } });
                function set(key) { return function (v) { var u = {}; u[key] = v; setAttributes(u); }; }

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
                    var base = Array.isArray(a.types) && a.types.length ? a.types : types;
                    var next = base.slice();
                    next[index] = Object.assign({}, next[index], {});
                    next[index][key] = value;
                    setAttributes({ types: next });
                }

                function setType(index, key) {
                    return function (v) { updateType(index, key, v); };
                }

                function setTypeDesc(index) {
                    return function (v) { updateType(index, 'desc', v); };
                }

                function removeType(index) {
                    var base = Array.isArray(a.types) && a.types.length ? a.types : types;
                    var next = base.slice();
                    next.splice(index, 1);
                    setAttributes({ types: next });
                }

                function addType() {
                    var base = Array.isArray(a.types) && a.types.length ? a.types : types;
                    var next = base.slice();
                    next.push({ name: '', desc: '', price: '', url: '', linkText: 'Learn more →', featured: false, badgeText: '' });
                    setAttributes({ types: next });
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
                    el('section', { className: 'section section--light', id: 'types' },
                        el('div', { className: 'wrap' },
                            el('div', { style: { textAlign: 'center', marginBottom: '44px' } },
                                rt('span', a.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                rt('h2', a.h2, set('h2'), { plain: true, style: { marginBottom: '12px' }, placeholder: 'Heading' }),
                                rt('p', a.description, set('description'), { style: { maxWidth: '520px', margin: '0 auto', color: '#5a5a5a', fontSize: '0.95rem' }, placeholder: 'Description' })
                            ),
                            el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '14px' } },
                                types.map(function (t, i) {
                                    var typeName = t.name || '';
                                    var typePrice = t.price || '';
                                    var typeUrl = t.url || '';
                                    var typeLinkText = t.linkText || 'Learn more →';
                                    var typeFeatured = !!t.featured;
                                    var typeBadgeText = t.badgeText || '';
                                    if (typeFeatured) {
                                        return el('div', { key: 'card-' + i, style: { background: 'var(--color-black)', borderRadius: 'var(--radius-card)', padding: '24px 20px', border: '2px solid var(--color-orange)', position: 'relative' } },
                                            ('' !== typeBadgeText.replace(/^\s+|\s+$/g, '')) && el('div', { style: { position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)' } },
                                                rt('span', typeBadgeText, setType(i, 'badgeText'), { plain: true, className: 'badge', style: { fontSize: '0.62rem', padding: '3px 7px' }, placeholder: 'Badge' })
                                            ),
                                            rt('h4', typeName, setType(i, 'name'), { plain: true, style: { color: '#fff', marginBottom: '6px', fontSize: '0.95rem' }, placeholder: 'Name' }),
                                            rt('p', t.desc, setTypeDesc(i), { style: { color: 'var(--color-muted)', fontSize: '0.78rem', marginBottom: '10px' }, placeholder: 'Description' }),
                                            rt('div', typePrice, setType(i, 'price'), { plain: true, style: { fontSize: '0.78rem', color: 'var(--color-orange)', fontWeight: '700', marginBottom: '10px' }, placeholder: 'Price' }),
                                            ('' !== typeUrl.replace(/^\s+|\s+$/g, ''))
                                                ? rt('a', typeLinkText, setType(i, 'linkText'), { plain: true, href: typeUrl || '#', className: 'btn btn--white', style: { fontSize: '0.78rem' }, placeholder: 'Link text' })
                                                : rt('span', typeLinkText, setType(i, 'linkText'), { plain: true, style: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }, placeholder: 'Link text' })
                                        );
                                    }
                                    return el('div', { key: 'card-' + i, style: { background: 'var(--color-white)', borderRadius: 'var(--radius-card)', padding: '24px 20px' } },
                                        rt('h4', typeName, setType(i, 'name'), { plain: true, style: { marginBottom: '6px', fontSize: '0.95rem' }, placeholder: 'Name' }),
                                        rt('p', t.desc, setTypeDesc(i), { style: { color: '#777', fontSize: '0.78rem', marginBottom: '10px' }, placeholder: 'Description' }),
                                        rt('div', typePrice, setType(i, 'price'), { plain: true, style: { fontSize: '0.78rem', color: 'var(--color-orange)', fontWeight: '700', marginBottom: '10px' }, placeholder: 'Price' }),
                                        ('' !== typeUrl.replace(/^\s+|\s+$/g, ''))
                                            ? rt('a', typeLinkText, setType(i, 'linkText'), { plain: true, href: typeUrl || '#', className: 'btn btn--dark', style: { fontSize: '0.78rem' }, placeholder: 'Link text' })
                                            : rt('span', typeLinkText, setType(i, 'linkText'), { plain: true, style: { fontSize: '0.78rem', color: '#666', fontWeight: '600' }, placeholder: 'Link text' })
                                    );
                                })
                            )
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-types block error', e); }
}(window.wp));
