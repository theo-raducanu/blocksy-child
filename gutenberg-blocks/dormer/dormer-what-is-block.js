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
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });
                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer What Is — preview requires ServerSideRender'));
                }
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
                    el(SSR, { block: 'myloft/dormer-what-is', attributes: attrs })
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-what-is block error', e); }
}(window.wp));
