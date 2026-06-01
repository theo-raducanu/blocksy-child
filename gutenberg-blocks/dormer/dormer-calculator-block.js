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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-calculator')) return;

    try {
        registerBlockType('myloft/dormer-calculator', {
            apiVersion: 2,
            title: 'Dormer – Calculator',
            icon: 'calculator',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                eyebrow: { type: 'string', default: 'Instant Estimate' },
                h2: { type: 'string', default: 'How Much Will Your Loft Conversion Cost?' },
                description: { type: 'string', default: 'Configure your options for an instant budget estimate. A fixed price is confirmed after your free survey.' },
            },
            edit: function (props) {
                var attrs = props.attributes;
                var setAttributes = props.setAttributes;
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks', style: { margin: 0, padding: 0 } });
                function set(key) { return function (v) { var u = {}; u[key] = v; setAttributes(u); }; }

                var labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' };
                var radioLabelStyle = { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '0.875rem' };
                var inputAccent = { accentColor: 'var(--color-orange)' };

                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: attrs.eyebrow || '', onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextControl, { label: 'Heading', value: attrs.h2 || '', onChange: function (v) { setAttributes({ h2: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.description || '', rows: 3, onChange: function (v) { setAttributes({ description: v }); } })
                        )
                    ),
                    el('section', { className: 'section section--dark', id: 'calculator' },
                        el('div', { className: 'wrap' },
                            el('div', { style: { textAlign: 'center', marginBottom: '44px' } },
                                rt('span', attrs.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                rt('h2', attrs.h2, set('h2'), { plain: true, style: { color: '#fff' }, placeholder: 'Heading' }),
                                rt('p', attrs.description, set('description'), { style: { color: 'var(--color-muted)', maxWidth: '500px', margin: '12px auto 0', fontSize: '0.95rem' }, placeholder: 'Description' })
                            ),
                            el('div', { style: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-card)', padding: '36px', maxWidth: '840px', margin: '0 auto' } },
                                el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '36px' } },
                                    el('div', null,
                                        el('label', { style: labelStyle }, 'Property Type'),
                                        el('div', { style: { display: 'flex', flexDirection: 'column', gap: '7px' } },
                                            el('label', { style: radioLabelStyle }, el('input', { type: 'radio', name: 'prop', defaultChecked: true, style: inputAccent }), ' Victorian / Edwardian Terrace'),
                                            el('label', { style: radioLabelStyle }, el('input', { type: 'radio', name: 'prop', style: inputAccent }), ' Semi-Detached'),
                                            el('label', { style: radioLabelStyle }, el('input', { type: 'radio', name: 'prop', style: inputAccent }), ' Detached')
                                        )
                                    ),
                                    el('div', null,
                                        el('label', { style: labelStyle }, 'Designer Collection'),
                                        el('select', { style: { width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' } },
                                            el('option', null, 'Serene — from £70,000'),
                                            el('option', null, 'Bold — from £75,000'),
                                            el('option', null, 'Heritage — from £78,000'),
                                            el('option', null, 'Urban — from £72,000'),
                                            el('option', null, 'Family — from £70,000'),
                                            el('option', null, 'Haven — from £74,000')
                                        )
                                    ),
                                    el('div', null,
                                        el('label', { style: labelStyle }, 'En-Suite Specification'),
                                        el('div', { style: { display: 'flex', flexDirection: 'column', gap: '7px' } },
                                            el('label', { style: radioLabelStyle }, el('input', { type: 'radio', name: 'ensuite', defaultChecked: true, style: inputAccent }), ' Standard (included)'),
                                            el('label', { style: radioLabelStyle }, el('input', { type: 'radio', name: 'ensuite', style: inputAccent }), ' Premium (+£8,000)')
                                        )
                                    ),
                                    el('div', null,
                                        el('label', { style: labelStyle }, 'Optional Upgrades'),
                                        el('div', { style: { display: 'flex', flexDirection: 'column', gap: '7px' } },
                                            el('label', { style: radioLabelStyle }, el('input', { type: 'checkbox', style: inputAccent }), ' Extended wardrobes (+£2–5k)'),
                                            el('label', { style: radioLabelStyle }, el('input', { type: 'checkbox', style: inputAccent }), ' Smart lighting (+£1.5–3k)'),
                                            el('label', { style: radioLabelStyle }, el('input', { type: 'checkbox', style: inputAccent }), ' Underfloor heating (+£2–3.5k)')
                                        )
                                    )
                                ),
                                el('div', { style: { borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' } },
                                    el('div', null,
                                        el('div', { style: { fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', marginBottom: '5px' } }, 'Your Budget Estimate'),
                                        el('div', { style: { fontSize: '2.2rem', fontWeight: 900, color: '#fff', lineHeight: 1 } }, '£70,000', el('span', { style: { fontSize: '1rem', opacity: 0.45, fontWeight: 400 } }, ' – £78,000')),
                                        el('div', { style: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: '4px' } }, 'Fixed price confirmed after free survey')
                                    ),
                                    el('div', { style: { display: 'flex', gap: '14px', flexWrap: 'wrap' } },
                                        el('a', { href: '#contact', className: 'btn-cta btn-cta--solid' }, 'Book My Free Survey'),
                                        el('a', { href: '#', className: 'btn-cta btn-cta--ghost' }, 'Download Pricing Guide')
                                    )
                                )
                            )
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-calculator block error', e); }
}(window.wp));
