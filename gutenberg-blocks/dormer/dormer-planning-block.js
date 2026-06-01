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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-planning')) return;

    try {
        registerBlockType('myloft/dormer-planning', {
            apiVersion: 2,
            title: 'Dormer – Planning',
            icon: 'admin-site',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                eyebrow: { type: 'string', default: 'Planning & Compliance' },
                h2: { type: 'string', default: 'Planning Permission & Building Regulations' },
                intro: { type: 'string', default: 'Most loft conversions in London fall under permitted development — no planning permission required. We manage the entire building control process, from submission to final sign-off.' },
                noPlan1: { type: 'string', default: 'Rear roof slope only' },
                noPlan2: { type: 'string', default: 'Materials match existing house' },
                noPlan3: { type: 'string', default: 'Within 40m³ volume (terrace)' },
                noPlan4: { type: 'string', default: 'Property not listed' },
                noPlan5: { type: 'string', default: 'Not in Article 4 direction area' },
                planReq1: { type: 'string', default: 'Front or side dormers' },
                planReq2: { type: 'string', default: 'Conservation area properties' },
                planReq3: { type: 'string', default: 'Listed buildings' },
                planReq4: { type: 'string', default: 'Article 4 direction areas' },
                planReq5: { type: 'string', default: 'Exceeds permitted development limits' },
                footnote: { type: 'string', default: 'Building control fees (£800–£1,200) are included in your fixed quote. We handle everything — submission to sign-off. Updated February 2026.' },
                reg1Badge: { type: 'string', default: 'S' },
                reg1Title: { type: 'string', default: 'Structural Integrity' },
                reg1Desc: { type: 'string', default: 'Load-bearing calcs, steel beam specs, floor joist strengthening.' },
                reg2Badge: { type: 'string', default: 'F' },
                reg2Title: { type: 'string', default: 'Fire Safety' },
                reg2Desc: { type: 'string', default: 'Escape routes, 30-min fire-rated doors, smoke alarms, window specification.' },
                reg3Badge: { type: 'string', default: 'I' },
                reg3Title: { type: 'string', default: 'Insulation' },
                reg3Desc: { type: 'string', default: 'U-value 0.15 W/m²K or better. Airtightness, condensation control.' },
                reg4Badge: { type: 'string', default: 'A' },
                reg4Title: { type: 'string', default: 'Staircase & Acoustics' },
                reg4Desc: { type: 'string', default: 'Max 42° pitch, 2m headroom, acoustic insulation in floors and party walls.' },
            },
            edit: function (props) {
                var a = props.attributes;
                var setAttributes = props.setAttributes;
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks', style: { margin: 0, padding: 0 } });
                function set(key) { return function (v) { var u = {}; u[key] = v; setAttributes(u); }; }

                // Sidebar helpers (from the original InspectorControls).
                function setAttr(key, v) { var o = {}; o[key] = v; setAttributes(o); }

                function textItem(key) {
                    return el(TextControl, {
                        label: key,
                        value: a[key] || '',
                        onChange: function (v) { setAttr(key, v); }
                    });
                }

                function regPanel(i, initialOpen) {
                    var badgeKey = 'reg' + i + 'Badge';
                    var titleKey = 'reg' + i + 'Title';
                    var descKey = 'reg' + i + 'Desc';
                    return el(PanelBody, { title: 'Regulation ' + i, initialOpen: !!initialOpen },
                        el(TextControl, { label: 'Badge', value: a[badgeKey] || '', onChange: function (v) { setAttr(badgeKey, v); } }),
                        el(TextControl, { label: 'Title', value: a[titleKey] || '', onChange: function (v) { setAttr(titleKey, v); } }),
                        el(TextareaControl, { label: 'Description', value: a[descKey] || '', rows: 3, onChange: function (v) { setAttr(descKey, v); } })
                    );
                }

                // Build the table rows (mirrors the PHP for loop $i = 1..5).
                var tableRows = [];
                tableRows.push(el('div', { key: 'th-no', style: { background: '#1e1e1e', padding: '12px 16px', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(255,255,255,0.45)' } }, 'No Planning Needed ✓'));
                tableRows.push(el('div', { key: 'th-req', style: { background: '#1e1e1e', padding: '12px 16px', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(255,255,255,0.45)' } }, 'Planning Required ✗'));
                for (var i = 1; i <= 5; i++) {
                    (function (i) {
                        tableRows.push(rt('div', a['noPlan' + i], set('noPlan' + i), { key: 'no-' + i, plain: true, style: { background: 'rgba(255,255,255,0.03)', padding: '10px 16px', fontSize: '0.83rem', color: 'var(--color-muted)', borderTop: '1px solid rgba(255,255,255,0.06)' }, placeholder: 'No-planning item ' + i }));
                        tableRows.push(rt('div', a['planReq' + i], set('planReq' + i), { key: 'req-' + i, plain: true, style: { background: 'rgba(255,255,255,0.03)', padding: '10px 16px', fontSize: '0.83rem', color: 'var(--color-muted)', borderTop: '1px solid rgba(255,255,255,0.06)' }, placeholder: 'Planning-required item ' + i }));
                    })(i);
                }

                // Build the regulation cards (mirrors the PHP foreach reg1..reg4).
                var regCards = ['reg1', 'reg2', 'reg3', 'reg4'].map(function (r) {
                    return el('div', { key: r, className: 'card', style: { padding: '16px 20px', borderRadius: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' } },
                        rt('div', a[r + 'Badge'], set(r + 'Badge'), { plain: true, style: { flexShrink: 0, width: '32px', height: '32px', background: 'rgba(253,83,32,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-orange)' }, placeholder: 'Badge' }),
                        el('div', null,
                            rt('h4', a[r + 'Title'], set(r + 'Title'), { plain: true, style: { fontSize: '0.875rem', marginBottom: '2px' }, placeholder: 'Title' }),
                            rt('p', a[r + 'Desc'], set(r + 'Desc'), { style: { fontSize: '0.8rem', color: '#777' }, placeholder: 'Description' })
                        )
                    );
                });

                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: a.eyebrow || '', onChange: function (v) { setAttr('eyebrow', v); } }),
                            el(TextControl, { label: 'Heading', value: a.h2 || '', onChange: function (v) { setAttr('h2', v); } }),
                            el(TextareaControl, { label: 'Intro', value: a.intro || '', rows: 3, onChange: function (v) { setAttr('intro', v); } }),
                            el(TextareaControl, { label: 'Footnote', value: a.footnote || '', rows: 3, onChange: function (v) { setAttr('footnote', v); } })
                        ),
                        el(PanelBody, { title: 'Permitted Development (No Planning)', initialOpen: false },
                            el(TextControl, { label: 'Item 1', value: a.noPlan1 || '', onChange: function (v) { setAttr('noPlan1', v); } }),
                            el(TextControl, { label: 'Item 2', value: a.noPlan2 || '', onChange: function (v) { setAttr('noPlan2', v); } }),
                            el(TextControl, { label: 'Item 3', value: a.noPlan3 || '', onChange: function (v) { setAttr('noPlan3', v); } }),
                            el(TextControl, { label: 'Item 4', value: a.noPlan4 || '', onChange: function (v) { setAttr('noPlan4', v); } }),
                            el(TextControl, { label: 'Item 5', value: a.noPlan5 || '', onChange: function (v) { setAttr('noPlan5', v); } })
                        ),
                        el(PanelBody, { title: 'Planning Required', initialOpen: false },
                            el(TextControl, { label: 'Item 1', value: a.planReq1 || '', onChange: function (v) { setAttr('planReq1', v); } }),
                            el(TextControl, { label: 'Item 2', value: a.planReq2 || '', onChange: function (v) { setAttr('planReq2', v); } }),
                            el(TextControl, { label: 'Item 3', value: a.planReq3 || '', onChange: function (v) { setAttr('planReq3', v); } }),
                            el(TextControl, { label: 'Item 4', value: a.planReq4 || '', onChange: function (v) { setAttr('planReq4', v); } }),
                            el(TextControl, { label: 'Item 5', value: a.planReq5 || '', onChange: function (v) { setAttr('planReq5', v); } })
                        ),
                        regPanel(1, false),
                        regPanel(2, false),
                        regPanel(3, false),
                        regPanel(4, false)
                    ),
                    el('section', { className: 'section section--light', id: 'planning' },
                        el('div', { className: 'wrap' },
                            el('div', { style: { textAlign: 'center', marginBottom: '52px' } },
                                rt('span', a.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                rt('h2', a.h2, set('h2'), { plain: true, style: { marginBottom: '12px' }, placeholder: 'Heading' }),
                                rt('p', a.intro, set('intro'), { style: { maxWidth: '560px', margin: '0 auto', color: '#5a5a5a' }, placeholder: 'Intro' })
                            ),
                            el('div', { className: 'grid-2', style: { gap: '36px', alignItems: 'flex-start' } },
                                el('div', { style: { background: 'var(--color-black)', borderRadius: 'var(--radius-card)', padding: '32px', overflow: 'hidden' } },
                                    el('h3', { style: { color: '#fff', marginBottom: '20px', fontSize: '1rem' } }, 'Permitted Development vs Planning Permission'),
                                    el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' } },
                                        tableRows
                                    ),
                                    rt('p', a.footnote, set('footnote'), { style: { color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: '16px' }, placeholder: 'Footnote' })
                                ),
                                el('div', null,
                                    el('h3', { style: { marginBottom: '18px', fontSize: '1rem' } }, 'Building Regulations — What We Cover'),
                                    el('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
                                        regCards
                                    )
                                )
                            )
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-planning block error', e); }
}(window.wp));
