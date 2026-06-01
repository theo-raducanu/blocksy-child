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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-contact')) return;

    try {
        registerBlockType('myloft/dormer-contact', {
            apiVersion: 2,
            title: 'Dormer – Contact CTA',
            icon: 'email',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                eyebrow: { type: 'string', default: 'Get Started' },
                h2: { type: 'string', default: 'Choose Your Style. Know Your Price. Love Your Loft.' },
                bgImageId: { type: 'number', default: 0 },
                bgImageUrl: { type: 'string', default: '' },
                bgImageAlt: { type: 'string', default: '' },
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
                var bgImg = attrs.bgImageUrl || 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/03/Hartington-5-scaled-1.jpg';
                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: attrs.eyebrow || '', onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextareaControl, { label: 'Heading (H2)', value: attrs.h2 || '', rows: 3, onChange: function (v) { setAttributes({ h2: v }); } })
                        ),
                        el(PanelBody, { title: 'Background Image', initialOpen: false },
                            el(MediaUploadCheck, {},
                                el(MediaUpload, {
                                    onSelect: function (media) { setAttributes({ bgImageId: media.id, bgImageUrl: media.url, bgImageAlt: media.alt || '' }); },
                                    allowedTypes: ['image'],
                                    value: attrs.bgImageId,
                                    render: function (ref) { return el(Button, { onClick: ref.open, isSecondary: true }, attrs.bgImageUrl ? 'Change Background' : 'Select Background'); }
                                })
                            ),
                            attrs.bgImageUrl && el('img', { src: attrs.bgImageUrl, style: { width: '100%', marginTop: '8px', borderRadius: '6px' } }),
                            el(TextControl, { label: 'Alt Text', value: attrs.bgImageAlt, onChange: function (v) { setAttributes({ bgImageAlt: v }); } })
                        ),
                        el(PanelBody, { title: 'CTA Links', initialOpen: false },
                            el(TextControl, { label: 'CTA 1 Text', value: attrs.cta1Text || '', onChange: function (v) { setAttributes({ cta1Text: v }); } }),
                            el(TextControl, { label: 'CTA 1 URL', value: attrs.cta1Url, onChange: function (v) { setAttributes({ cta1Url: v }); } }),
                            el(TextControl, { label: 'CTA 2 Text', value: attrs.cta2Text || '', onChange: function (v) { setAttributes({ cta2Text: v }); } }),
                            el(TextControl, { label: 'CTA 2 URL', value: attrs.cta2Url, onChange: function (v) { setAttributes({ cta2Url: v }); } })
                        )
                    ),
                    el('section', { className: 'section section--dark', id: 'contact', style: { position: 'relative' } },
                        el('div', { className: 'img-ph', style: { position: 'absolute', inset: 0, borderRadius: 0, backgroundImage: "url('" + bgImg + "')", backgroundSize: 'cover', backgroundPosition: 'center' }, 'aria-hidden': 'true' }),
                        el('div', { style: { position: 'absolute', inset: 0, background: 'rgba(4,4,4,0.88)' } }),
                        el('div', { className: 'wrap', style: { position: 'relative', zIndex: 2 } },
                            el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '28px' } },
                                el('div', null,
                                    rt('span', attrs.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                    rt('h2', attrs.h2, set('h2'), { plain: true, style: { color: '#fff', maxWidth: '520px' }, placeholder: 'Heading (H2)' })
                                ),
                                el('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'anchor-center' } },
                                    rt('a', attrs.cta1Text, set('cta1Text'), { plain: true, href: attrs.cta1Url || '#', className: 'btn-cta btn-cta--solid', placeholder: 'CTA 1' }),
                                    rt('a', attrs.cta2Text, set('cta2Text'), { plain: true, href: attrs.cta2Url || '#', className: 'btn btn--white', style: { fontSize: '0.875rem' }, placeholder: 'CTA 2' })
                                )
                            )
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-contact block error', e); }
}(window.wp));
