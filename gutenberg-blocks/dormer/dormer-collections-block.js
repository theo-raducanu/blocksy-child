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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-collections')) return;

    var collections = [
        { prefix: 'col1', defaultDesigner: 'Olivia Hart Collection', defaultName: 'Serene', defaultDesc: 'Scandi-minimal · Warm whites, pale oak, soft grey · Master bedroom retreat', defaultPrice: 'From £70,000', imgDefault: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Richmond-scaled.jpg' },
        { prefix: 'col2', defaultDesigner: 'Olivia Hart Collection', defaultName: 'Bold', defaultDesc: 'Contemporary · Charcoal, terracotta, brass · Creative office / guest room', defaultPrice: 'From £75,000', imgDefault: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Chelsea.jpg' },
        { prefix: 'col3', defaultDesigner: 'James Chen Collection', defaultName: 'Heritage', defaultDesc: 'Modern classic · Warm greys, deep greens, natural wood · Master bedroom + dressing', defaultPrice: 'From £78,000', imgDefault: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Putney-2-scaled.jpg' },
        { prefix: 'col4', defaultDesigner: 'James Chen Collection', defaultName: 'Urban', defaultDesc: 'Industrial-modern · Black, white, concrete grey, steel · Home office / studio', defaultPrice: 'From £72,000', imgDefault: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Putney-1-scaled.jpg' },
        { prefix: 'col5', defaultDesigner: 'Priya Sharma Collection', defaultName: 'Family', defaultDesc: 'Playful · Soft pastels, natural woods, white · Nursery / playroom', defaultPrice: 'From £70,000', imgDefault: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Chiswick-scaled.jpg' },
        { prefix: 'col6', defaultDesigner: 'Priya Sharma Collection', defaultName: 'Haven', defaultDesc: 'Calm retreat · Stone, linen, warm timber, botanical · Bedroom sanctuary', defaultPrice: 'From £74,000', imgDefault: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Putney-scaled.jpg' },
    ];

    var attrs = {};
    attrs.eyebrow = { type: 'string', default: 'Designer Collections' };
    attrs.h2 = { type: 'string', default: 'Six Signature Collections. No Design Fees. No Guesswork.' };
    attrs.intro = { type: 'string', default: 'Three interior designers have created six complete loft schemes — each covering layout, colours, materials, furniture, lighting, and every finishing detail. You choose your style. We handle everything else.' };
    attrs.cta1Text = { type: 'string', default: 'Get Instant Estimate →' };
    attrs.cta1Url = { type: 'string', default: '#calculator' };
    attrs.cta2Text = { type: 'string', default: 'Book Free Survey →' };
    attrs.cta2Url = { type: 'string', default: '#contact' };
    collections.forEach(function (c) {
        attrs[c.prefix + 'ImageId'] = { type: 'number', default: 0 };
        attrs[c.prefix + 'ImageUrl'] = { type: 'string', default: '' };
        attrs[c.prefix + 'ImageAlt'] = { type: 'string', default: '' };
        attrs[c.prefix + 'Designer'] = { type: 'string', default: c.defaultDesigner };
        attrs[c.prefix + 'Name'] = { type: 'string', default: c.defaultName };
        attrs[c.prefix + 'Desc'] = { type: 'string', default: c.defaultDesc };
        attrs[c.prefix + 'Price'] = { type: 'string', default: c.defaultPrice };
    });

    try {
        registerBlockType('myloft/dormer-collections', {
            apiVersion: 2,
            title: 'Dormer – Collections',
            icon: 'art',
            category: 'myloft',
            supports: { html: false },
            attributes: attrs,
            edit: function (props) {
                var a = props.attributes;
                var setAttributes = props.setAttributes;
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks', style: { margin: 0, padding: 0 } });
                function set(key) { return function (v) { var u = {}; u[key] = v; setAttributes(u); }; }
                function makeSetter(key) {
                    return function (v) { var u = {}; u[key] = v; setAttributes(u); };
                }
                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: a.eyebrow || '', onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextareaControl, { label: 'Heading (H2)', value: a.h2 || '', rows: 3, onChange: function (v) { setAttributes({ h2: v }); } }),
                            el(TextareaControl, { label: 'Intro', value: a.intro || '', rows: 3, onChange: function (v) { setAttributes({ intro: v }); } })
                        ),
                        collections.map(function (c, idx) {
                            return el(PanelBody, { key: 'panel-' + c.prefix, title: 'Collection ' + (idx + 1) + ' – ' + c.defaultName, initialOpen: false },
                                el(TextControl, { label: 'Designer', value: a[c.prefix + 'Designer'] || '', onChange: makeSetter(c.prefix + 'Designer') }),
                                el(TextControl, { label: 'Name', value: a[c.prefix + 'Name'] || '', onChange: makeSetter(c.prefix + 'Name') }),
                                el(TextareaControl, { label: 'Description', value: a[c.prefix + 'Desc'] || '', rows: 3, onChange: makeSetter(c.prefix + 'Desc') }),
                                el(TextControl, { label: 'Price', value: a[c.prefix + 'Price'] || '', onChange: makeSetter(c.prefix + 'Price') }),
                                el(MediaUploadCheck, {},
                                    el(MediaUpload, {
                                        onSelect: function (media) { var u = {}; u[c.prefix + 'ImageId'] = media.id; u[c.prefix + 'ImageUrl'] = media.url; u[c.prefix + 'ImageAlt'] = media.alt || ''; setAttributes(u); },
                                        allowedTypes: ['image'],
                                        value: a[c.prefix + 'ImageId'],
                                        render: function (ref) { return el(Button, { onClick: ref.open, isSecondary: true, style: { display: 'block', width: '100%', marginTop: '4px' } }, a[c.prefix + 'ImageUrl'] ? 'Change Image' : 'Select Image'); }
                                    })
                                ),
                                a[c.prefix + 'ImageUrl'] && el('img', { src: a[c.prefix + 'ImageUrl'], style: { width: '100%', marginTop: '4px', borderRadius: '4px' } }),
                                el(TextControl, { label: 'Alt', value: a[c.prefix + 'ImageAlt'], onChange: makeSetter(c.prefix + 'ImageAlt') })
                            );
                        }),
                        el(PanelBody, { title: 'CTAs', initialOpen: false },
                            el(TextControl, { label: 'CTA 1 Text', value: a.cta1Text || '', onChange: function (v) { setAttributes({ cta1Text: v }); } }),
                            el(TextControl, { label: 'CTA 1 URL', value: a.cta1Url, onChange: function (v) { setAttributes({ cta1Url: v }); } }),
                            el(TextControl, { label: 'CTA 2 Text', value: a.cta2Text || '', onChange: function (v) { setAttributes({ cta2Text: v }); } }),
                            el(TextControl, { label: 'CTA 2 URL', value: a.cta2Url, onChange: function (v) { setAttributes({ cta2Url: v }); } })
                        )
                    ),
                    el('section', { className: 'section section--light', id: 'collections' },
                        el('div', { className: 'wrap' },
                            el('div', { style: { textAlign: 'center', marginBottom: '52px' } },
                                rt('span', a.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                rt('h2', a.h2, set('h2'), { plain: true, style: { marginBottom: '14px' }, placeholder: 'Heading (H2)' }),
                                rt('p', a.intro, set('intro'), { style: { maxWidth: '580px', margin: '0 auto', color: '#5a5a5a' }, placeholder: 'Intro' })
                            ),
                            el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '32px' } },
                                collections.map(function (c, idx) {
                                    var imgUrl = a[c.prefix + 'ImageUrl'] ? a[c.prefix + 'ImageUrl'] : c.imgDefault;
                                    return el('div', { className: 'col-card', key: c.prefix },
                                        el('div', { className: 'img-ph img-ph--light', style: { aspectRatio: '4/3', borderRadius: 'var(--radius-img) var(--radius-img) 0 0', backgroundImage: "url('" + imgUrl + "')", backgroundSize: 'cover', backgroundPosition: 'center' } }),
                                        el('div', { className: 'col-card__body' },
                                            rt('div', a[c.prefix + 'Designer'], set(c.prefix + 'Designer'), { plain: true, className: 'col-card__designer', placeholder: 'Designer' }),
                                            rt('div', a[c.prefix + 'Name'], set(c.prefix + 'Name'), { plain: true, className: 'col-card__name', placeholder: 'Name' }),
                                            rt('div', a[c.prefix + 'Desc'], set(c.prefix + 'Desc'), { className: 'col-card__desc', placeholder: 'Description' }),
                                            rt('div', a[c.prefix + 'Price'], set(c.prefix + 'Price'), { plain: true, className: 'col-card__price', placeholder: 'Price' })
                                        )
                                    );
                                })
                            ),
                            el('div', { style: { textAlign: 'center' } },
                                rt('a', a.cta1Text, set('cta1Text'), { plain: true, href: a.cta1Url || '#', className: 'btn-cta btn-cta--solid', placeholder: 'CTA 1' }),
                                '  ',
                                rt('a', a.cta2Text, set('cta2Text'), { plain: true, href: a.cta2Url || '#', className: 'btn btn--dark', placeholder: 'CTA 2' })
                            )
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-collections block error', e); }
}(window.wp));
