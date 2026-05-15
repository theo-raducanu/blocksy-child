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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-collections')) return;

    var collections = [
        { prefix: 'col1', defaultDesigner: 'Olivia Hart Collection', defaultName: 'Serene', defaultDesc: 'Scandi-minimal · Warm whites, pale oak, soft grey · Master bedroom retreat', defaultPrice: 'From £70,000' },
        { prefix: 'col2', defaultDesigner: 'Olivia Hart Collection', defaultName: 'Bold', defaultDesc: 'Contemporary · Charcoal, terracotta, brass · Creative office / guest room', defaultPrice: 'From £75,000' },
        { prefix: 'col3', defaultDesigner: 'James Chen Collection', defaultName: 'Heritage', defaultDesc: 'Modern classic · Warm greys, deep greens, natural wood · Master bedroom + dressing', defaultPrice: 'From £78,000' },
        { prefix: 'col4', defaultDesigner: 'James Chen Collection', defaultName: 'Urban', defaultDesc: 'Industrial-modern · Black, white, concrete grey, steel · Home office / studio', defaultPrice: 'From £72,000' },
        { prefix: 'col5', defaultDesigner: 'Priya Sharma Collection', defaultName: 'Family', defaultDesc: 'Playful · Soft pastels, natural woods, white · Nursery / playroom', defaultPrice: 'From £70,000' },
        { prefix: 'col6', defaultDesigner: 'Priya Sharma Collection', defaultName: 'Haven', defaultDesc: 'Calm retreat · Stone, linen, warm timber, botanical · Bedroom sanctuary', defaultPrice: 'From £74,000' },
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
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });
                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Collections — preview requires ServerSideRender'));
                }
                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Collection Images', initialOpen: true },
                            collections.map(function (c) {
                                return el('div', { key: c.prefix, style: { marginBottom: '16px' } },
                                    el('strong', {}, c.defaultName),
                                    el(MediaUploadCheck, {},
                                        el(MediaUpload, {
                                            onSelect: function (media) { var u = {}; u[c.prefix + 'ImageId'] = media.id; u[c.prefix + 'ImageUrl'] = media.url; u[c.prefix + 'ImageAlt'] = media.alt || ''; setAttributes(u); },
                                            allowedTypes: ['image'],
                                            value: a[c.prefix + 'ImageId'],
                                            render: function (ref) { return el(Button, { onClick: ref.open, isSecondary: true, style: { display: 'block', width: '100%', marginTop: '4px' } }, a[c.prefix + 'ImageUrl'] ? 'Change Image' : 'Select Image'); }
                                        })
                                    ),
                                    a[c.prefix + 'ImageUrl'] && el('img', { src: a[c.prefix + 'ImageUrl'], style: { width: '100%', marginTop: '4px', borderRadius: '4px' } }),
                                    el(TextControl, { label: 'Alt', value: a[c.prefix + 'ImageAlt'], onChange: function (v) { var u = {}; u[c.prefix + 'ImageAlt'] = v; setAttributes(u); } })
                                );
                            })
                        ),
                        el(PanelBody, { title: 'CTAs', initialOpen: false },
                            el(TextControl, { label: 'CTA 1 URL', value: a.cta1Url, onChange: function (v) { setAttributes({ cta1Url: v }); } }),
                            el(TextControl, { label: 'CTA 2 URL', value: a.cta2Url, onChange: function (v) { setAttributes({ cta2Url: v }); } })
                        )
                    ),
                    el(SSR, { block: 'myloft/dormer-collections', attributes: a })
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-collections block error', e); }
}(window.wp));
