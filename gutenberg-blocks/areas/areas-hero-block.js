(function (wp) {
    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) {
        return;
    }

    var registerBlockType = wp.blocks.registerBlockType;
    var el = wp.element.createElement;
    var Fragment = wp.element.Fragment;
    var RichText = wp.blockEditor.RichText;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var PanelBody = wp.components.PanelBody;
    var TextControl = wp.components.TextControl;

    var DEFAULTS = {
        eyebrow: 'Main Areas',
        title: 'Loft Conversion Areas Across London & Surrey',
        subtitle: 'Browse our primary service regions below. Each yellow region is a main area, with linked green sub-areas listed under it.',
        pillOne: 'Primary regions structured by area cluster',
        pillTwo: 'Sub-areas linked directly to local pages',
        pillThree: 'Consistent designer-led service model',
        backgroundImageUrl: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-1-scaled-1.jpg',
    };

    registerBlockType('myloft/areas-hero', {
        apiVersion: 2,
        title: 'Areas Hero',
        description: 'Theme-managed editable hero section for the Areas page.',
        icon: 'cover-image',
        category: 'myloft',
        attributes: {
            eyebrow: { type: 'string', default: DEFAULTS.eyebrow },
            title: { type: 'string', default: DEFAULTS.title },
            subtitle: { type: 'string', default: DEFAULTS.subtitle },
            pillOne: { type: 'string', default: DEFAULTS.pillOne },
            pillTwo: { type: 'string', default: DEFAULTS.pillTwo },
            pillThree: { type: 'string', default: DEFAULTS.pillThree },
            backgroundImageUrl: { type: 'string', default: DEFAULTS.backgroundImageUrl },
        },
        supports: {
            html: false,
            reusable: false,
        },
        edit: function (props) {
            var attrs = props.attributes;
            var setAttributes = props.setAttributes;
            var blockProps = useBlockProps({ className: 'myloft-areas-hero-editor' });

            return el(
                Fragment,
                null,
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: 'Hero Settings', initialOpen: true },
                        el(TextControl, {
                            label: 'Background Image URL',
                            value: attrs.backgroundImageUrl || '',
                            onChange: function (value) {
                                setAttributes({ backgroundImageUrl: value });
                            },
                        })
                    )
                ),
                el(
                    'div',
                    blockProps,
                    el(
                        'section',
                        { className: 'section section--dark', style: { padding: '190px 0 80px', position: 'relative', overflow: 'hidden', background: '#040404' } },
                        el('div', {
                            style: {
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: 'url(' + (attrs.backgroundImageUrl || DEFAULTS.backgroundImageUrl) + ')',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            },
                        }),
                        el('div', {
                            style: {
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(100deg,rgba(4,4,4,.88) 0%,rgba(4,4,4,.58) 65%,rgba(4,4,4,.35) 100%)',
                            },
                        }),
                        el(
                            'div',
                            { className: 'wrap', style: { position: 'relative', zIndex: 2 } },
                            el(RichText, {
                                tagName: 'span',
                                className: 'eyebrow',
                                value: attrs.eyebrow,
                                onChange: function (value) {
                                    setAttributes({ eyebrow: value });
                                },
                                placeholder: 'Main Areas',
                            }),
                            el(RichText, {
                                tagName: 'h1',
                                value: attrs.title,
                                onChange: function (value) {
                                    setAttributes({ title: value });
                                },
                                style: {
                                    color: '#fff',
                                    maxWidth: '780px',
                                    marginTop: '0',
                                    marginBottom: '16px',
                                    fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                                    lineHeight: '1.15',
                                    fontWeight: '800'
                                },
                                placeholder: 'Loft Conversion Areas Across London & Surrey',
                            }),
                            el(RichText, {
                                tagName: 'p',
                                value: attrs.subtitle,
                                onChange: function (value) {
                                    setAttributes({ subtitle: value });
                                },
                                style: { color: 'rgba(255,255,255,.84)', maxWidth: '820px' },
                                placeholder: 'Browse our primary service regions below...',
                            }),
                            el(
                                'div',
                                { className: 'intro-grid' },
                                el(RichText, {
                                    tagName: 'div',
                                    className: 'intro-pill',
                                    value: attrs.pillOne,
                                    onChange: function (value) {
                                        setAttributes({ pillOne: value });
                                    },
                                }),
                                el(RichText, {
                                    tagName: 'div',
                                    className: 'intro-pill',
                                    value: attrs.pillTwo,
                                    onChange: function (value) {
                                        setAttributes({ pillTwo: value });
                                    },
                                }),
                                el(RichText, {
                                    tagName: 'div',
                                    className: 'intro-pill',
                                    value: attrs.pillThree,
                                    onChange: function (value) {
                                        setAttributes({ pillThree: value });
                                    },
                                })
                            )
                        )
                    )
                )
            );
        },
        save: function () {
            return null;
        },
    });
})(window.wp);
