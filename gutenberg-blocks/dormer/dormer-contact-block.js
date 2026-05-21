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
                var a = props.attributes;
                var setAttributes = props.setAttributes;
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });
                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Contact — preview requires ServerSideRender'));
                }
                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: a.eyebrow || '', onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextareaControl, { label: 'Heading (H2)', value: a.h2 || '', rows: 3, onChange: function (v) { setAttributes({ h2: v }); } })
                        ),
                        el(PanelBody, { title: 'Background Image', initialOpen: false },
                            el(MediaUploadCheck, {},
                                el(MediaUpload, {
                                    onSelect: function (media) { setAttributes({ bgImageId: media.id, bgImageUrl: media.url, bgImageAlt: media.alt || '' }); },
                                    allowedTypes: ['image'],
                                    value: a.bgImageId,
                                    render: function (ref) { return el(Button, { onClick: ref.open, isSecondary: true }, a.bgImageUrl ? 'Change Background' : 'Select Background'); }
                                })
                            ),
                            a.bgImageUrl && el('img', { src: a.bgImageUrl, style: { width: '100%', marginTop: '8px', borderRadius: '6px' } }),
                            el(TextControl, { label: 'Alt Text', value: a.bgImageAlt, onChange: function (v) { setAttributes({ bgImageAlt: v }); } })
                        ),
                        el(PanelBody, { title: 'CTA Links', initialOpen: false },
                            el(TextControl, { label: 'CTA 1 Text', value: a.cta1Text || '', onChange: function (v) { setAttributes({ cta1Text: v }); } }),
                            el(TextControl, { label: 'CTA 1 URL', value: a.cta1Url, onChange: function (v) { setAttributes({ cta1Url: v }); } }),
                            el(TextControl, { label: 'CTA 2 Text', value: a.cta2Text || '', onChange: function (v) { setAttributes({ cta2Text: v }); } }),
                            el(TextControl, { label: 'CTA 2 URL', value: a.cta2Url, onChange: function (v) { setAttributes({ cta2Url: v }); } })
                        )
                    ),
                    el(SSR, { block: 'myloft/dormer-contact', attributes: a })
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-contact block error', e); }
}(window.wp));
