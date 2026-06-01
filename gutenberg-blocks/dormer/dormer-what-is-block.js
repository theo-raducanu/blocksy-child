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
    // (headings, labels) allows no formatting; otherwise links + bold/italic.
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
        return el(RichText, props);
    }

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-what-is')) return;

    try {
        registerBlockType('myloft/dormer-what-is', {
            apiVersion: 2,
            title: 'Dormer – What Is',
            icon: 'info',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                eyebrow: { type: 'string', default: 'Dormer Loft Conversions' },
                h2: { type: 'string', default: 'What Is a Dormer Loft Conversion?' },
                para1: { type: 'string', default: 'A dormer loft conversion adds a vertical extension — a dormer roof extension — to your existing roof slope, creating full-height walls, a proper floor, and significantly more natural light.' },
                para2: { type: 'string', default: 'This type of loft conversion with dormer windows is London\'s most popular choice, particularly on Victorian and Edwardian terraces across Zones 2–5.' },
                h3: { type: 'string', default: 'Is a Dormer Right for Your Property?' },
                check1: { type: 'string', default: 'At least 2.2m headroom at the ridge (highest point of roof)' },
                check2: { type: 'string', default: 'Victorian or Edwardian terrace, semi-detached, or detached house' },
                check3: { type: 'string', default: 'Traditional timber-framed roof structure' },
                check4: { type: 'string', default: 'Rear elevation — not in a conservation area (or willing to apply)' },
                note: { type: 'string', default: 'We confirm feasibility during your free survey — no commitment required.' },
                imageId: { type: 'number', default: 0 },
                imageUrl: { type: 'string', default: '' },
                imageAlt: { type: 'string', default: '' },
            },
            edit: function (props) {
                var attrs = props.attributes;
                var setAttributes = props.setAttributes;
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks', style: { margin: 0, padding: 0 } });
                function set(key) { return function (v) { var u = {}; u[key] = v; setAttributes(u); }; }
                var imageUrl = attrs.imageUrl || 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Kew.jpg';
                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: attrs.eyebrow || '', onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextControl, { label: 'Heading (H2)', value: attrs.h2 || '', onChange: function (v) { setAttributes({ h2: v }); } }),
                            el(TextareaControl, { label: 'Paragraph 1', value: attrs.para1 || '', rows: 3, onChange: function (v) { setAttributes({ para1: v }); } }),
                            el(TextareaControl, { label: 'Paragraph 2', value: attrs.para2 || '', rows: 3, onChange: function (v) { setAttributes({ para2: v }); } }),
                            el(TextControl, { label: 'Subheading (H3)', value: attrs.h3 || '', onChange: function (v) { setAttributes({ h3: v }); } }),
                            el(TextareaControl, { label: 'Note', value: attrs.note || '', rows: 3, onChange: function (v) { setAttributes({ note: v }); } })
                        ),
                        el(PanelBody, { title: 'Checklist', initialOpen: false },
                            el(TextareaControl, { label: 'Check 1', value: attrs.check1 || '', rows: 3, onChange: function (v) { setAttributes({ check1: v }); } }),
                            el(TextareaControl, { label: 'Check 2', value: attrs.check2 || '', rows: 3, onChange: function (v) { setAttributes({ check2: v }); } }),
                            el(TextareaControl, { label: 'Check 3', value: attrs.check3 || '', rows: 3, onChange: function (v) { setAttributes({ check3: v }); } }),
                            el(TextareaControl, { label: 'Check 4', value: attrs.check4 || '', rows: 3, onChange: function (v) { setAttributes({ check4: v }); } })
                        ),
                        el(PanelBody, { title: 'Image', initialOpen: false },
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
                            el(TextControl, { label: 'Alt Text', value: attrs.imageAlt, onChange: function (v) { setAttributes({ imageAlt: v }); } })
                        )
                    ),
                    el('section', { className: 'section section--light', id: 'what-is-dormer' },
                        el('div', { className: 'wrap' },
                            el('div', { className: 'grid-2', style: { gap: '64px' } },
                                el('div', null,
                                    rt('span', attrs.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                    rt('h2', attrs.h2, set('h2'), { plain: true, style: { marginBottom: '20px' }, placeholder: 'Heading' }),
                                    rt('p', attrs.para1, set('para1'), { style: { color: '#3a3a3a', marginBottom: '16px' }, placeholder: 'Paragraph 1' }),
                                    rt('p', attrs.para2, set('para2'), { style: { color: '#5a5a5a', marginBottom: '24px' }, placeholder: 'Paragraph 2' }),
                                    rt('h3', attrs.h3, set('h3'), { plain: true, style: { marginBottom: '14px', fontSize: '1rem' }, placeholder: 'Subheading' }),
                                    el('ul', { className: 'checklist checklist--light' },
                                        [1, 2, 3, 4].map(function (n) {
                                            return el('li', { key: 'chk-' + n },
                                                el('span', { className: 'chk' }, '✓'),
                                                rt('span', attrs['check' + n], set('check' + n), { placeholder: 'Check ' + n })
                                            );
                                        })
                                    ),
                                    rt('p', attrs.note, set('note'), { style: { color: '#999', fontSize: '0.85rem', marginTop: '14px' }, placeholder: 'Note' })
                                ),
                                el('div', null,
                                    el('div', { className: 'img-ph img-ph--light', style: { width: '100%', aspectRatio: '4/3', backgroundImage: "url('" + imageUrl + "')", backgroundSize: 'cover', backgroundPosition: 'center' } })
                                )
                            )
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-what-is block error', e); }
}(window.wp));
