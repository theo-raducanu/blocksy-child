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
    var SelectControl = wp.components.SelectControl;

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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-cta')) return;

    try {
        registerBlockType('myloft/dormer-cta', {
            apiVersion: 2,
            title: 'Dormer – CTA Section',
            icon: 'megaphone',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                mode: { type: 'string', default: 'dark' },
                eyebrow: { type: 'string', default: 'Ready When You Are' },
                h2: { type: 'string', default: 'Start Your Dormer Loft Conversion Today' },
                intro: { type: 'string', default: '' },
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

                var isDark = attrs.mode !== 'light';
                var sectionClass = 'section ' + (isDark ? 'section--dark' : 'section--light');
                var headingStyle = { color: isDark ? '#fff' : '#1e1e1e' };
                var introStyle = {
                    color: isDark ? 'rgba(255,255,255,0.7)' : '#3a3a3a',
                    maxWidth: '720px', margin: '16px auto 0', fontSize: '1rem', lineHeight: '1.6'
                };
                var cta2Class = isDark ? 'btn btn--white' : 'btn btn--dark';

                // A CTA shows only when its text is non-empty — mirrors the frontend.
                // Cleared CTAs vanish here; re-add them via the sidebar "CTA Buttons" fields.
                var hasCta1 = (attrs.cta1Text || '').trim() !== '';
                var hasCta2 = (attrs.cta2Text || '').trim() !== '';
                var ctaButtons = [];
                if (hasCta1) {
                    ctaButtons.push(rt('a', attrs.cta1Text, set('cta1Text'), { plain: true, href: attrs.cta1Url || '#', className: 'btn-cta btn-cta--solid', placeholder: 'CTA 1', key: 'cta1' }));
                }
                if (hasCta2) {
                    ctaButtons.push(rt('a', attrs.cta2Text, set('cta2Text'), { plain: true, href: attrs.cta2Url || '#', className: cta2Class, placeholder: 'CTA 2', key: 'cta2' }));
                }

                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Appearance', initialOpen: true },
                            el(SelectControl, {
                                label: 'Colour Mode',
                                value: attrs.mode || 'dark',
                                options: [
                                    { label: 'Dark', value: 'dark' },
                                    { label: 'Light', value: 'light' }
                                ],
                                onChange: set('mode')
                            })
                        ),
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: attrs.eyebrow || '', onChange: set('eyebrow') }),
                            el(TextControl, { label: 'Heading', value: attrs.h2 || '', onChange: set('h2') }),
                            el(TextareaControl, { label: 'Intro Paragraph (optional)', value: attrs.intro || '', rows: 3, onChange: set('intro') })
                        ),
                        el(PanelBody, { title: 'CTA Buttons', initialOpen: false },
                            el(TextControl, { label: 'CTA 1 Text', value: attrs.cta1Text || '', onChange: set('cta1Text') }),
                            el(TextControl, { label: 'CTA 1 URL', value: attrs.cta1Url, onChange: set('cta1Url') }),
                            el(TextControl, { label: 'CTA 2 Text', value: attrs.cta2Text || '', onChange: set('cta2Text') }),
                            el(TextControl, { label: 'CTA 2 URL', value: attrs.cta2Url, onChange: set('cta2Url') })
                        )
                    ),
                    el('section', { className: sectionClass, id: 'cta-section' },
                        el('div', { className: 'wrap' },
                            el('div', { style: { textAlign: 'center' } },
                                rt('span', attrs.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                rt('h2', attrs.h2, set('h2'), { plain: true, style: headingStyle, placeholder: 'Heading' }),
                                rt('p', attrs.intro, set('intro'), { className: 'section-intro', style: introStyle, placeholder: 'Intro paragraph (optional)' })
                            ),
                            ctaButtons.length ? el('div', { style: { marginTop: '44px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' } }, ctaButtons) : null
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-cta block error', e); }
}(window.wp));
