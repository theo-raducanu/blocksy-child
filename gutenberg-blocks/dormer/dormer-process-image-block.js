(function (wp) {
    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) return;
    var registerBlockType = wp.blocks.registerBlockType;
    var getBlockType = wp.blocks.getBlockType;
    var el = wp.element.createElement;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var RichText = wp.blockEditor.RichText;
    var MediaUpload = wp.blockEditor.MediaUpload;
    var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var Button = wp.components.Button;
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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-process-image')) return;

    try {
        registerBlockType('myloft/dormer-process-image', {
            apiVersion: 2,
            title: 'Dormer – Process (Image)',
            icon: 'format-image',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                eyebrow: { type: 'string', default: 'Timeline & Process' },
                h2: { type: 'string', default: 'Building a Dormer Loft Conversion: What to Expect' },
                intro: { type: 'string', default: '' },
                imageId: { type: 'number', default: 0 },
                imageUrl: { type: 'string', default: '' },
                imageAlt: { type: 'string', default: '' },
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
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks', style: { margin: 0, padding: 0 } });
                function set(key) { return function (v) { var u = {}; u[key] = v; setAttributes(u); }; }
                var imageUrl = attrs.imageUrl || 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Kew.jpg';

                var stepRows = [];
                for (var i = 1; i <= 8; i++) {
                    var n = i;
                    var num = (n < 10 ? '0' : '') + n;
                    stepRows.push(
                        el('div', { key: 'step-' + n, style: { display: 'flex', gap: '16px', padding: '14px 0', borderBottom: (n < 8 ? '1px solid rgba(255,255,255,0.07)' : 'none'), alignItems: 'flex-start' } },
                            el('div', { className: 'step-num', style: { width: '32px', height: '32px', fontSize: '0.75rem' } }, num),
                            el('div', null,
                                rt('div', attrs['step' + n + 'Title'], set('step' + n + 'Title'), { plain: true, style: { color: '#fff', fontWeight: 600, fontSize: '0.9rem' }, placeholder: 'Step ' + n + ' title' }),
                                rt('div', attrs['step' + n + 'Desc'], set('step' + n + 'Desc'), { style: { color: 'var(--color-muted)', fontSize: '0.82rem' }, placeholder: 'Step ' + n + ' description' })
                            )
                        )
                    );
                }

                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: attrs.eyebrow || '', onChange: set('eyebrow') }),
                            el(TextControl, { label: 'Heading', value: attrs.h2 || '', onChange: set('h2') }),
                            el(TextareaControl, { label: 'Intro Paragraph (optional)', value: attrs.intro || '', rows: 3, onChange: set('intro') })
                        ),
                        el(PanelBody, { title: 'Image (Left Column)', initialOpen: false },
                            el(MediaUploadCheck, {},
                                el(MediaUpload, {
                                    onSelect: function (media) { setAttributes({ imageId: media.id, imageUrl: media.url, imageAlt: media.alt || '' }); },
                                    allowedTypes: ['image'],
                                    value: attrs.imageId,
                                    render: function (ref) {
                                        return el(Button, { onClick: ref.open, isSecondary: true },
                                            attrs.imageUrl ? 'Change Image' : 'Select Image'
                                        );
                                    }
                                })
                            ),
                            attrs.imageUrl && el('img', { src: attrs.imageUrl, style: { width: '100%', marginTop: '8px', borderRadius: '8px' } }),
                            el(TextControl, { label: 'Alt Text', value: attrs.imageAlt, onChange: set('imageAlt') })
                        ),
                        el(PanelBody, { title: 'Step 1', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step1Title || '', onChange: set('step1Title') }),
                            el(TextareaControl, { label: 'Description', value: attrs.step1Desc || '', rows: 3, onChange: set('step1Desc') })
                        ),
                        el(PanelBody, { title: 'Step 2', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step2Title || '', onChange: set('step2Title') }),
                            el(TextareaControl, { label: 'Description', value: attrs.step2Desc || '', rows: 3, onChange: set('step2Desc') })
                        ),
                        el(PanelBody, { title: 'Step 3', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step3Title || '', onChange: set('step3Title') }),
                            el(TextareaControl, { label: 'Description', value: attrs.step3Desc || '', rows: 3, onChange: set('step3Desc') })
                        ),
                        el(PanelBody, { title: 'Step 4', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step4Title || '', onChange: set('step4Title') }),
                            el(TextareaControl, { label: 'Description', value: attrs.step4Desc || '', rows: 3, onChange: set('step4Desc') })
                        ),
                        el(PanelBody, { title: 'Step 5', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step5Title || '', onChange: set('step5Title') }),
                            el(TextareaControl, { label: 'Description', value: attrs.step5Desc || '', rows: 3, onChange: set('step5Desc') })
                        ),
                        el(PanelBody, { title: 'Step 6', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step6Title || '', onChange: set('step6Title') }),
                            el(TextareaControl, { label: 'Description', value: attrs.step6Desc || '', rows: 3, onChange: set('step6Desc') })
                        ),
                        el(PanelBody, { title: 'Step 7', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step7Title || '', onChange: set('step7Title') }),
                            el(TextareaControl, { label: 'Description', value: attrs.step7Desc || '', rows: 3, onChange: set('step7Desc') })
                        ),
                        el(PanelBody, { title: 'Step 8', initialOpen: false },
                            el(TextControl, { label: 'Title', value: attrs.step8Title || '', onChange: set('step8Title') }),
                            el(TextareaControl, { label: 'Description', value: attrs.step8Desc || '', rows: 3, onChange: set('step8Desc') })
                        ),
                        el(PanelBody, { title: 'CTA Buttons', initialOpen: false },
                            el(TextControl, { label: 'CTA 1 Text', value: attrs.cta1Text || '', onChange: set('cta1Text') }),
                            el(TextControl, { label: 'CTA 1 URL', value: attrs.cta1Url, onChange: set('cta1Url') }),
                            el(TextControl, { label: 'CTA 2 Text', value: attrs.cta2Text || '', onChange: set('cta2Text') }),
                            el(TextControl, { label: 'CTA 2 URL', value: attrs.cta2Url, onChange: set('cta2Url') })
                        )
                    ),
                    el('section', { className: 'section section--dark', id: 'process-image' },
                        el('div', { className: 'wrap' },
                            el('div', { style: { textAlign: 'center', marginBottom: '56px' } },
                                rt('span', attrs.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                rt('h2', attrs.h2, set('h2'), { plain: true, style: { color: '#fff' }, placeholder: 'Heading' }),
                                rt('p', attrs.intro, set('intro'), { className: 'section-intro', style: { color: 'rgba(255,255,255,0.7)', maxWidth: '720px', margin: '16px auto 0', fontSize: '1rem', lineHeight: '1.6' }, placeholder: 'Intro paragraph (optional)' })
                            ),
                            el('div', { className: 'grid-2', style: { gap: '64px', alignItems: 'flex-start' } },
                                el('div', null,
                                    el('img', { src: imageUrl, alt: attrs.imageAlt || '', style: { width: '100%', height: 'auto', display: 'block', borderRadius: '16px' } })
                                ),
                                el('div', null,
                                    el('h3', { style: { color: '#fff', marginBottom: '20px', fontSize: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.5 } }, 'From Enquiry to Handover — 8 Steps'),
                                    el('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } }, stepRows)
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
    } catch (e) { console.error('dormer-process-image block error', e); }
}(window.wp));
