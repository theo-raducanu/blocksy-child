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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-projects')) return;

    var projects = [
        { prefix: 'proj1', defaultTitle: 'Serene Collection, Richmond', defaultDetail: 'Victorian terrace · 7 weeks · £78,000', imgDefault: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-11-scaled-1.jpg' },
        { prefix: 'proj2', defaultTitle: 'Bold Collection, Islington', defaultDetail: 'Edwardian semi · 8 weeks · £92,000', imgDefault: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-10-scaled-1.jpg' },
        { prefix: 'proj3', defaultTitle: 'Family Collection, Chiswick', defaultDetail: 'Victorian terrace · 6 weeks · £72,000', imgDefault: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-9-scaled-1.jpg' },
    ];
    var testimonials = [
        { prefix: 'test1', defaultQuote: '"We couldn\'t afford a designer and a builder separately. My Loft meant we got a beautifully designed space at the same price we\'d budgeted for a basic conversion."', defaultName: 'Sarah & James', defaultLoc: 'Richmond · Serene Collection' },
        { prefix: 'test2', defaultQuote: '"The fixed pricing gave us total peace of mind. Weekly photo updates, on budget, on time. The Bold collection has so much personality."', defaultName: 'Priya & Michael', defaultLoc: 'Islington · Bold Collection' },
        { prefix: 'test3', defaultQuote: '"Three months before our due date, My Loft delivered on time and created a nursery more beautiful than we could have designed ourselves."', defaultName: 'Emma & Tom', defaultLoc: 'Chiswick · Family Collection' },
    ];

    var attrs = {
        eyebrow: { type: 'string', default: 'Completed Projects' },
        h2: { type: 'string', default: 'Design-Led Loft Conversions Across London' },
        viewAllText: { type: 'string', default: 'View All Projects →' },
        viewAllUrl: { type: 'string', default: '/projects' },
    };
    projects.forEach(function (p) {
        attrs[p.prefix + 'ImageId'] = { type: 'number', default: 0 };
        attrs[p.prefix + 'ImageUrl'] = { type: 'string', default: '' };
        attrs[p.prefix + 'ImageAlt'] = { type: 'string', default: '' };
        attrs[p.prefix + 'Title'] = { type: 'string', default: p.defaultTitle };
        attrs[p.prefix + 'Detail'] = { type: 'string', default: p.defaultDetail };
    });
    testimonials.forEach(function (t) {
        attrs[t.prefix + 'Quote'] = { type: 'string', default: t.defaultQuote };
        attrs[t.prefix + 'Name'] = { type: 'string', default: t.defaultName };
        attrs[t.prefix + 'Loc'] = { type: 'string', default: t.defaultLoc };
    });

    try {
        registerBlockType('myloft/dormer-projects', {
            apiVersion: 2,
            title: 'Dormer – Projects',
            icon: 'images-alt2',
            category: 'myloft',
            supports: { html: false },
            attributes: attrs,
            edit: function (props) {
                var a = props.attributes;
                var setAttributes = props.setAttributes;
                function set(key) { return function (v) { var u = {}; u[key] = v; setAttributes(u); }; }
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks', style: { margin: 0, padding: 0 } });
                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: a.eyebrow || '', onChange: set('eyebrow') }),
                            el(TextControl, { label: 'Heading', value: a.h2 || '', onChange: set('h2') })
                        ),
                        el(PanelBody, { title: 'Project Images', initialOpen: false },
                            projects.map(function (p) {
                                return el('div', { key: p.prefix, style: { marginBottom: '16px' } },
                                    el('strong', {}, p.defaultTitle),
                                    el(MediaUploadCheck, {},
                                        el(MediaUpload, {
                                            onSelect: function (media) { var u = {}; u[p.prefix + 'ImageId'] = media.id; u[p.prefix + 'ImageUrl'] = media.url; u[p.prefix + 'ImageAlt'] = media.alt || ''; setAttributes(u); },
                                            allowedTypes: ['image'],
                                            value: a[p.prefix + 'ImageId'],
                                            render: function (ref) { return el(Button, { onClick: ref.open, isSecondary: true, style: { display: 'block', width: '100%', marginTop: '4px' } }, a[p.prefix + 'ImageUrl'] ? 'Change Image' : 'Select Image'); }
                                        })
                                    ),
                                    a[p.prefix + 'ImageUrl'] && el('img', { src: a[p.prefix + 'ImageUrl'], style: { width: '100%', marginTop: '4px', borderRadius: '4px' } }),
                                    el(TextControl, { label: 'Alt', value: a[p.prefix + 'ImageAlt'], onChange: set(p.prefix + 'ImageAlt') })
                                );
                            })
                        ),
                        projects.map(function (p, idx) {
                            return el(PanelBody, { key: 'panel-' + p.prefix, title: 'Project ' + (idx + 1) + ' Text', initialOpen: false },
                                el(TextControl, { label: 'Title', value: a[p.prefix + 'Title'] || '', onChange: set(p.prefix + 'Title') }),
                                el(TextControl, { label: 'Detail', value: a[p.prefix + 'Detail'] || '', onChange: set(p.prefix + 'Detail') })
                            );
                        }),
                        testimonials.map(function (t, idx) {
                            return el(PanelBody, { key: 'panel-' + t.prefix, title: 'Testimonial ' + (idx + 1), initialOpen: false },
                                el(TextareaControl, { label: 'Quote', value: a[t.prefix + 'Quote'] || '', rows: 3, onChange: set(t.prefix + 'Quote') }),
                                el(TextControl, { label: 'Name', value: a[t.prefix + 'Name'] || '', onChange: set(t.prefix + 'Name') }),
                                el(TextControl, { label: 'Location / Collection', value: a[t.prefix + 'Loc'] || '', onChange: set(t.prefix + 'Loc') })
                            );
                        }),
                        el(PanelBody, { title: 'View All Link', initialOpen: false },
                            el(TextControl, { label: 'Link Text', value: a.viewAllText || '', onChange: set('viewAllText') }),
                            el(TextControl, { label: 'URL', value: a.viewAllUrl || '', onChange: set('viewAllUrl') })
                        )
                    ),
                    el('section', { className: 'section section--dark', id: 'projects' },
                        el('div', { className: 'wrap' },
                            el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '44px', flexWrap: 'wrap', gap: '16px' } },
                                el('div', null,
                                    rt('span', a.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                    rt('h2', a.h2, set('h2'), { plain: true, style: { color: '#fff' }, placeholder: 'Heading' })
                                ),
                                rt('a', a.viewAllText, set('viewAllText'), { plain: true, href: a.viewAllUrl || '#', className: 'btn btn--white', placeholder: 'Link Text' })
                            ),
                            el('div', { className: 'grid-3', style: { marginBottom: '36px' } },
                                projects.map(function (p) {
                                    var imgUrl = a[p.prefix + 'ImageUrl'] ? a[p.prefix + 'ImageUrl'] : p.imgDefault;
                                    return el('div', { key: p.prefix },
                                        el('div', { className: 'img-ph', style: { aspectRatio: '4/3', backgroundImage: "url('" + imgUrl + "')", backgroundSize: 'cover', backgroundPosition: 'center' } }),
                                        rt('p', a[p.prefix + 'Title'], set(p.prefix + 'Title'), { plain: true, style: { color: '#fff', fontWeight: '600', fontSize: '0.9rem', marginTop: '10px' }, placeholder: 'Title' }),
                                        rt('p', a[p.prefix + 'Detail'], set(p.prefix + 'Detail'), { plain: true, style: { color: 'var(--color-grey-icon)', fontSize: '0.8rem' }, placeholder: 'Detail' })
                                    );
                                })
                            ),
                            el('div', { className: 'grid-3' },
                                testimonials.map(function (t) {
                                    return el('div', { key: t.prefix, style: { background: 'var(--color-white)', borderRadius: 'var(--radius-card)', padding: '28px 32px' } },
                                        rt('p', a[t.prefix + 'Quote'], set(t.prefix + 'Quote'), { style: { fontSize: '0.9rem', lineHeight: '1.75', color: '#3a3a3a', fontStyle: 'italic', marginBottom: '16px' }, placeholder: 'Quote' }),
                                        rt('div', a[t.prefix + 'Name'], set(t.prefix + 'Name'), { plain: true, style: { fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-black)' }, placeholder: 'Name' }),
                                        rt('div', a[t.prefix + 'Loc'], set(t.prefix + 'Loc'), { plain: true, style: { fontSize: '0.78rem', color: '#999', marginTop: '2px' }, placeholder: 'Location / Collection' })
                                    );
                                })
                            )
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-projects block error', e); }
}(window.wp));
