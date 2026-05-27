(function (wp) {
    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) return;
    var registerBlockType = wp.blocks.registerBlockType;
    var getBlockType = wp.blocks.getBlockType;
    var el = wp.element.createElement;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var MediaUpload = wp.blockEditor.MediaUpload;
    var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var Button = wp.components.Button;
    var TextControl = wp.components.TextControl;
    var TextareaControl = wp.components.TextareaControl;

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
                var a = props.attributes;
                var setAttributes = props.setAttributes;
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });
                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Process (Image) — preview requires ServerSideRender'));
                }
                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: a.eyebrow || '', onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextControl, { label: 'Heading', value: a.h2 || '', onChange: function (v) { setAttributes({ h2: v }); } })
                        ),
                        el(PanelBody, { title: 'Image (Left Column)', initialOpen: false },
                            el(MediaUploadCheck, {},
                                el(MediaUpload, {
                                    onSelect: function (media) { setAttributes({ imageId: media.id, imageUrl: media.url, imageAlt: media.alt || '' }); },
                                    allowedTypes: ['image'],
                                    value: a.imageId,
                                    render: function (ref) {
                                        return el(Button, { onClick: ref.open, isSecondary: true },
                                            a.imageUrl ? 'Change Image' : 'Select Image'
                                        );
                                    }
                                })
                            ),
                            a.imageUrl && el('img', { src: a.imageUrl, style: { width: '100%', marginTop: '8px', borderRadius: '8px' } }),
                            el(TextControl, { label: 'Alt Text', value: a.imageAlt, onChange: function (v) { setAttributes({ imageAlt: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 1', initialOpen: false },
                            el(TextControl, { label: 'Title', value: a.step1Title || '', onChange: function (v) { setAttributes({ step1Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: a.step1Desc || '', rows: 3, onChange: function (v) { setAttributes({ step1Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 2', initialOpen: false },
                            el(TextControl, { label: 'Title', value: a.step2Title || '', onChange: function (v) { setAttributes({ step2Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: a.step2Desc || '', rows: 3, onChange: function (v) { setAttributes({ step2Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 3', initialOpen: false },
                            el(TextControl, { label: 'Title', value: a.step3Title || '', onChange: function (v) { setAttributes({ step3Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: a.step3Desc || '', rows: 3, onChange: function (v) { setAttributes({ step3Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 4', initialOpen: false },
                            el(TextControl, { label: 'Title', value: a.step4Title || '', onChange: function (v) { setAttributes({ step4Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: a.step4Desc || '', rows: 3, onChange: function (v) { setAttributes({ step4Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 5', initialOpen: false },
                            el(TextControl, { label: 'Title', value: a.step5Title || '', onChange: function (v) { setAttributes({ step5Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: a.step5Desc || '', rows: 3, onChange: function (v) { setAttributes({ step5Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 6', initialOpen: false },
                            el(TextControl, { label: 'Title', value: a.step6Title || '', onChange: function (v) { setAttributes({ step6Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: a.step6Desc || '', rows: 3, onChange: function (v) { setAttributes({ step6Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 7', initialOpen: false },
                            el(TextControl, { label: 'Title', value: a.step7Title || '', onChange: function (v) { setAttributes({ step7Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: a.step7Desc || '', rows: 3, onChange: function (v) { setAttributes({ step7Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'Step 8', initialOpen: false },
                            el(TextControl, { label: 'Title', value: a.step8Title || '', onChange: function (v) { setAttributes({ step8Title: v }); } }),
                            el(TextareaControl, { label: 'Description', value: a.step8Desc || '', rows: 3, onChange: function (v) { setAttributes({ step8Desc: v }); } })
                        ),
                        el(PanelBody, { title: 'CTA Buttons', initialOpen: false },
                            el(TextControl, { label: 'CTA 1 Text', value: a.cta1Text || '', onChange: function (v) { setAttributes({ cta1Text: v }); } }),
                            el(TextControl, { label: 'CTA 1 URL', value: a.cta1Url, onChange: function (v) { setAttributes({ cta1Url: v }); } }),
                            el(TextControl, { label: 'CTA 2 Text', value: a.cta2Text || '', onChange: function (v) { setAttributes({ cta2Text: v }); } }),
                            el(TextControl, { label: 'CTA 2 URL', value: a.cta2Url, onChange: function (v) { setAttributes({ cta2Url: v }); } })
                        )
                    ),
                    el(SSR, { block: 'myloft/dormer-process-image', attributes: a })
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-process-image block error', e); }
}(window.wp));
