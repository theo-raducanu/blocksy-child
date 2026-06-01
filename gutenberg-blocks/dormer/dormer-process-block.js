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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-process')) return;

    try {
        registerBlockType('myloft/dormer-process', {
            apiVersion: 2,
            title: 'Dormer – Process',
            icon: 'clock',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                eyebrow: { type: 'string', default: 'Timeline & Process' },
                h2: { type: 'string', default: 'Building a Dormer Loft Conversion: What to Expect' },
                intro: { type: 'string', default: '' },
                tl1Weeks: { type: 'string', default: 'Wks 1–2' },
                tl1Phase: { type: 'string', default: 'Structural Phase' },
                tl1Desc: { type: 'string', default: 'Scaffold, roof opening, steelwork, dormer frame construction.' },
                tl2Weeks: { type: 'string', default: 'Wks 3–4' },
                tl2Phase: { type: 'string', default: 'Weathertight' },
                tl2Desc: { type: 'string', default: 'Dormer roof completed, windows installed, fully weatherproofed.' },
                tl3Weeks: { type: 'string', default: 'Wks 5–7' },
                tl3Phase: { type: 'string', default: 'First Fix Interior' },
                tl3Desc: { type: 'string', default: 'Insulation, plasterwork, electrics, heating, staircase.' },
                tl4Weeks: { type: 'string', default: 'Wks 8–10' },
                tl4Phase: { type: 'string', default: 'Fit-Out & Handover' },
                tl4Desc: { type: 'string', default: 'Fitted furniture, en-suite, decorating, lighting, snagging, handover.' },
                whyFasterTitle: { type: 'string', default: 'Why We\'re Faster' },
                whyFasterBody: { type: 'string', default: 'Pre-designed collections eliminate the design phase. Materials pre-ordered before day one. Dedicated teams, strong building control relationships, fixed scope — no mid-project changes.' },
                step1Title: { type: 'string', default: 'Online Discovery' },
                step1Desc: { type: 'string', default: 'Browse collections, use pricing calculator. No pressure.' },
                step2Title: { type: 'string', default: 'Consultation Call' },
                step2Desc: { type: 'string', default: '20-minute call within 24 hours. Confirm suitability, book survey.' },
                step3Title: { type: 'string', default: 'Free Property Survey' },
                step3Desc: { type: 'string', default: 'Within 7 days. We measure, assess, confirm planning. 45–60 min.' },
                step4Title: { type: 'string', default: 'Fixed Price Proposal' },
                step4Desc: { type: 'string', default: 'Within 48 hours. Full spec, visualisations, payment schedule. Guaranteed.' },
                step5Title: { type: 'string', default: 'Pre-Construction' },
                step5Desc: { type: 'string', default: 'Building control, party wall notices, materials ordering — all handled by us.' },
                step6Title: { type: 'string', default: 'Structural Build' },
                step6Desc: { type: 'string', default: 'Weeks 1–5: scaffold, steelwork, dormer frame, roofing, weatherproofing.' },
                step7Title: { type: 'string', default: 'Interior Fit-Out' },
                step7Desc: { type: 'string', default: 'Weeks 6–10: plastering, flooring, fitted furniture, en-suite, decorating.' },
                step8Title: { type: 'string', default: 'Handover & Aftercare' },
                step8Desc: { type: 'string', default: 'Final walkthrough, all warranties, building regs certificate. 4-week check-in call.' },
                cta1Text: { type: 'string', default: 'Book Free Survey →' },
                cta1Url: { type: 'string', default: '#contact' },
                cta2Text: { type: 'string', default: 'Get Instant Estimate →' },
                cta2Url: { type: 'string', default: '#calculator' },
            },
            edit: function (props) {
                var attrs = props.attributes;
                var setAttributes = props.setAttributes;
                function set(key) { return function (v) { var u = {}; u[key] = v; setAttributes(u); }; }
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks', style: { margin: 0, padding: 0 } });

                function pad2(n) { return n < 10 ? '0' + n : '' + n; }

                var tlRows = [];
                var ti;
                for (ti = 1; ti <= 4; ti++) {
                    tlRows.push({
                        i: ti,
                        weeks: 'tl' + ti + 'Weeks',
                        phase: 'tl' + ti + 'Phase',
                        desc: 'tl' + ti + 'Desc',
                        last: (ti === 4)
                    });
                }

                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: attrs.eyebrow || '', onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextControl, { label: 'Heading', value: attrs.h2 || '', onChange: function (v) { setAttributes({ h2: v }); } }),
                            el(TextareaControl, { label: 'Intro Paragraph (optional)', value: attrs.intro || '', rows: 3, onChange: function (v) { setAttributes({ intro: v }); } })
                        ),
                        el(PanelBody, { title: 'Timeline Item 1', initialOpen: false },
                            el(TextControl, { label: 'Weeks', value: attrs.tl1Weeks || '', onChange: function (v) { setAttributes({ tl1Weeks: v }); } }),
                            el(TextControl, { label: 'Phase', value: attrs.tl1Phase || '', onChange: function (v) { setAttributes({ tl1Phase: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.tl1Desc || '', rows: 3, onChange: function (v) { setAttributes({ tl1Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Timeline Item 2', initialOpen: false },
                            el(TextControl, { label: 'Weeks', value: attrs.tl2Weeks || '', onChange: function (v) { setAttributes({ tl2Weeks: v }); } }),
                            el(TextControl, { label: 'Phase', value: attrs.tl2Phase || '', onChange: function (v) { setAttributes({ tl2Phase: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.tl2Desc || '', rows: 3, onChange: function (v) { setAttributes({ tl2Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Timeline Item 3', initialOpen: false },
                            el(TextControl, { label: 'Weeks', value: attrs.tl3Weeks || '', onChange: function (v) { setAttributes({ tl3Weeks: v }); } }),
                            el(TextControl, { label: 'Phase', value: attrs.tl3Phase || '', onChange: function (v) { setAttributes({ tl3Phase: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.tl3Desc || '', rows: 3, onChange: function (v) { setAttributes({ tl3Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Timeline Item 4', initialOpen: false },
                            el(TextControl, { label: 'Weeks', value: attrs.tl4Weeks || '', onChange: function (v) { setAttributes({ tl4Weeks: v }); } }),
                            el(TextControl, { label: 'Phase', value: attrs.tl4Phase || '', onChange: function (v) { setAttributes({ tl4Phase: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.tl4Desc || '', rows: 3, onChange: function (v) { setAttributes({ tl4Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Why We\'re Faster', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.whyFasterTitle || '', onChange: function (v) { setAttributes({ whyFasterTitle: v }); } }),
                            el(TextareaControl, { label: 'Body', value: attrs.whyFasterBody || '', rows: 3, onChange: function (v) { setAttributes({ whyFasterBody: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 1', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step1Title || '', onChange: function (v) { setAttributes({ step1Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.step1Desc || '', rows: 3, onChange: function (v) { setAttributes({ step1Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 2', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step2Title || '', onChange: function (v) { setAttributes({ step2Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.step2Desc || '', rows: 3, onChange: function (v) { setAttributes({ step2Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 3', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step3Title || '', onChange: function (v) { setAttributes({ step3Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.step3Desc || '', rows: 3, onChange: function (v) { setAttributes({ step3Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 4', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step4Title || '', onChange: function (v) { setAttributes({ step4Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.step4Desc || '', rows: 3, onChange: function (v) { setAttributes({ step4Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 5', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step5Title || '', onChange: function (v) { setAttributes({ step5Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.step5Desc || '', rows: 3, onChange: function (v) { setAttributes({ step5Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 6', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step6Title || '', onChange: function (v) { setAttributes({ step6Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.step6Desc || '', rows: 3, onChange: function (v) { setAttributes({ step6Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 7', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step7Title || '', onChange: function (v) { setAttributes({ step7Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.step7Desc || '', rows: 3, onChange: function (v) { setAttributes({ step7Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 8', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step8Title || '', onChange: function (v) { setAttributes({ step8Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: attrs.step8Desc || '', rows: 3, onChange: function (v) { setAttributes({ step8Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'CTA Buttons', initialOpen: false },
                            el(TextControl, { label: 'CTA 1 Text', value: attrs.cta1Text || '', onChange: function (v) { setAttributes({ cta1Text: v }); } }),
                            el(TextControl, { label: 'CTA 1 URL', value: attrs.cta1Url, onChange: function (v) { setAttributes({ cta1Url: v }); } }),
                            el(TextControl, { label: 'CTA 2 Text', value: attrs.cta2Text || '', onChange: function (v) { setAttributes({ cta2Text: v }); } }),
                            el(TextControl, { label: 'CTA 2 URL', value: attrs.cta2Url, onChange: function (v) { setAttributes({ cta2Url: v }); } })
                        )
                    ),
                    el('section', { className: 'section section--dark', id: 'process' },
                        el('div', { className: 'wrap' },
                            el('div', { style: { textAlign: 'center', marginBottom: '56px' } },
                                rt('span', attrs.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                rt('h2', attrs.h2, set('h2'), { plain: true, style: { color: '#fff' }, placeholder: 'Heading' }),
                                rt('p', attrs.intro, set('intro'), { className: 'section-intro', style: { color: 'rgba(255,255,255,0.7)', maxWidth: '720px', margin: '16px auto 0', fontSize: '1rem', lineHeight: '1.6' }, placeholder: 'Intro paragraph (optional)' })
                            ),
                            el('div', { className: 'grid-2', style: { gap: '64px', alignItems: 'flex-start' } },
                                el('div', null,
                                    el('h3', { style: { color: '#fff', marginBottom: '20px', fontSize: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.5 } }, 'Build Timeline — 6–10 Weeks'),
                                    tlRows.map(function (row) {
                                        return el('div', { key: 'tl-' + row.i, className: 'timeline-row', style: row.last ? { borderBottom: 'none' } : null },
                                            rt('div', attrs[row.weeks], set(row.weeks), { plain: true, className: 'timeline-weeks', placeholder: 'Weeks' }),
                                            el('div', null,
                                                rt('div', attrs[row.phase], set(row.phase), { plain: true, style: { fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '3px' }, placeholder: 'Phase' }),
                                                rt('div', attrs[row.desc], set(row.desc), { style: { fontSize: '0.875rem', color: 'var(--color-muted)' }, placeholder: 'Description' })
                                            )
                                        );
                                    }),
                                    el('div', { style: { marginTop: '28px', background: '#efece6', border: '1px solid rgba(253,83,32,0.2)', borderRadius: '16px', padding: '20px 24px' } },
                                        rt('p', attrs.whyFasterTitle, set('whyFasterTitle'), { plain: true, style: { color: '#5a5a5a', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }, placeholder: 'Why we\'re faster title' }),
                                        rt('p', attrs.whyFasterBody, set('whyFasterBody'), { style: { color: '#5a5a5a', fontSize: '0.82rem' }, placeholder: 'Why we\'re faster body' })
                                    )
                                ),
                                el('div', null,
                                    el('h3', { style: { color: '#fff', marginBottom: '20px', fontSize: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.5 } }, 'From Enquiry to Handover — 8 Steps'),
                                    el('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } },
                                        [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
                                            return el('div', { key: 'step-' + n, style: { display: 'flex', gap: '16px', padding: '14px 0', borderBottom: (n < 8 ? '1px solid rgba(255,255,255,0.07)' : 'none'), alignItems: 'flex-start' } },
                                                el('div', { className: 'step-num', style: { width: '32px', height: '32px', fontSize: '0.75rem' } }, pad2(n)),
                                                el('div', null,
                                                    rt('div', attrs['step' + n + 'Title'], set('step' + n + 'Title'), { plain: true, style: { color: '#fff', fontWeight: 600, fontSize: '0.9rem' }, placeholder: 'Step title' }),
                                                    rt('div', attrs['step' + n + 'Desc'], set('step' + n + 'Desc'), { style: { color: 'var(--color-muted)', fontSize: '0.82rem' }, placeholder: 'Step description' })
                                                )
                                            );
                                        })
                                    )
                                )
                            ),
                            el('div', { style: { marginTop: '44px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' } },
                                rt('a', attrs.cta1Text, set('cta1Text'), { plain: true, href: attrs.cta1Url || '#', className: 'btn-cta btn-cta--solid', placeholder: 'CTA 1' }),
                                rt('a', attrs.cta2Text, set('cta2Text'), { plain: true, href: attrs.cta2Url || '#', className: 'btn btn--white', placeholder: 'CTA 2' })
                            )
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-process block error', e); }
}(window.wp));
