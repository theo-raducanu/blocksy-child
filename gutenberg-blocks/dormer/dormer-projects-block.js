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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-projects')) return;

    var projects = [
        { prefix: 'proj1', defaultTitle: 'Serene Collection, Richmond', defaultDetail: 'Victorian terrace · 7 weeks · £78,000' },
        { prefix: 'proj2', defaultTitle: 'Bold Collection, Islington', defaultDetail: 'Edwardian semi · 8 weeks · £92,000' },
        { prefix: 'proj3', defaultTitle: 'Family Collection, Chiswick', defaultDetail: 'Victorian terrace · 6 weeks · £72,000' },
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
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });
                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Projects — preview requires ServerSideRender'));
                }
                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: a.eyebrow || '', onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextControl, { label: 'Heading', value: a.h2 || '', onChange: function (v) { setAttributes({ h2: v }); } })
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
                                    el(TextControl, { label: 'Alt', value: a[p.prefix + 'ImageAlt'], onChange: function (v) { var u = {}; u[p.prefix + 'ImageAlt'] = v; setAttributes(u); } })
                                );
                            })
                        ),
                        projects.map(function (p, idx) {
                            return el(PanelBody, { key: 'panel-' + p.prefix, title: 'Project ' + (idx + 1) + ' Text', initialOpen: false },
                                el(TextControl, { label: 'Title', value: a[p.prefix + 'Title'] || '', onChange: function (v) { var u = {}; u[p.prefix + 'Title'] = v; setAttributes(u); } }),
                                el(TextControl, { label: 'Detail', value: a[p.prefix + 'Detail'] || '', onChange: function (v) { var u = {}; u[p.prefix + 'Detail'] = v; setAttributes(u); } })
                            );
                        }),
                        testimonials.map(function (t, idx) {
                            return el(PanelBody, { key: 'panel-' + t.prefix, title: 'Testimonial ' + (idx + 1), initialOpen: false },
                                el(TextareaControl, { label: 'Quote', value: a[t.prefix + 'Quote'] || '', rows: 3, onChange: function (v) { var u = {}; u[t.prefix + 'Quote'] = v; setAttributes(u); } }),
                                el(TextControl, { label: 'Name', value: a[t.prefix + 'Name'] || '', onChange: function (v) { var u = {}; u[t.prefix + 'Name'] = v; setAttributes(u); } }),
                                el(TextControl, { label: 'Location / Collection', value: a[t.prefix + 'Loc'] || '', onChange: function (v) { var u = {}; u[t.prefix + 'Loc'] = v; setAttributes(u); } })
                            );
                        }),
                        el(PanelBody, { title: 'View All Link', initialOpen: false },
                            el(TextControl, { label: 'Link Text', value: a.viewAllText || '', onChange: function (v) { setAttributes({ viewAllText: v }); } }),
                            el(TextControl, { label: 'URL', value: a.viewAllUrl || '', onChange: function (v) { setAttributes({ viewAllUrl: v }); } })
                        )
                    ),
                    el(SSR, { block: 'myloft/dormer-projects', attributes: a })
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-projects block error', e); }
}(window.wp));
