(function (wp) {
    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) {
        return;
    }

    var registerBlockType = wp.blocks.registerBlockType;
    var getBlockType = wp.blocks.getBlockType;
    var el = wp.element.createElement;
    var Fragment = wp.element.Fragment;
    var RichText = wp.blockEditor.RichText;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var MediaUpload = wp.blockEditor.MediaUpload;
    var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var PanelBody = wp.components.PanelBody;
    var TextControl = wp.components.TextControl;
    var ToggleControl = wp.components.ToggleControl;
    var Button = wp.components.Button;

    var DEFAULTS = {
        title: 'Dormer Loft Conversion London',
        subtitle: 'Transform your loft with signature designer collections. Fixed pricing, 6-10 week delivery, zero stress.',
        primaryCtaText: 'Get Instant Estimate',
        primaryCtaUrl: '#calculator',
        showPrimaryCta: true,
        secondaryCtaText: 'Explore Designer Collections ->',
        secondaryCtaUrl: '#collections',
        showSecondaryCta: true,
        heroImageId: 0,
        heroImageUrl: '',
        heroImageAlt: '',
    };

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-hero')) {
        return;
    }

    registerBlockType('myloft/dormer-hero', {
        apiVersion: 2,
        title: 'Hero',
        description: 'Editable hero section for the Dormer page.',
        icon: 'cover-image',
        category: 'myloft',
        attributes: {
            title: { type: 'string', default: DEFAULTS.title },
            subtitle: { type: 'string', default: DEFAULTS.subtitle },
            primaryCtaText: { type: 'string', default: DEFAULTS.primaryCtaText },
            primaryCtaUrl: { type: 'string', default: DEFAULTS.primaryCtaUrl },
            showPrimaryCta: { type: 'boolean', default: DEFAULTS.showPrimaryCta },
            secondaryCtaText: { type: 'string', default: DEFAULTS.secondaryCtaText },
            secondaryCtaUrl: { type: 'string', default: DEFAULTS.secondaryCtaUrl },
            showSecondaryCta: { type: 'boolean', default: DEFAULTS.showSecondaryCta },
            heroImageId: { type: 'number', default: DEFAULTS.heroImageId },
            heroImageUrl: { type: 'string', default: DEFAULTS.heroImageUrl },
            heroImageAlt: { type: 'string', default: DEFAULTS.heroImageAlt },
        },
        supports: {
            html: false,
            reusable: true,
        },
        edit: function (props) {
            var attrs = props.attributes;
            var setAttributes = props.setAttributes;
            var blockProps = useBlockProps({ className: 'myloft-dormer-hero-editor dormer-loft-blocks alignfull' });
            var heroImageUrl = attrs.heroImageUrl || '';
            var showPrimaryCta = attrs.showPrimaryCta !== false;
            var showSecondaryCta = attrs.showSecondaryCta !== false;

            return el(
                Fragment,
                null,
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: 'Hero Settings', initialOpen: true },
                        el(ToggleControl, {
                            label: 'Show Primary Button',
                            checked: showPrimaryCta,
                            onChange: function (value) {
                                setAttributes({ showPrimaryCta: value });
                            },
                        }),
                        el(TextControl, {
                            label: 'Primary Button URL',
                            value: attrs.primaryCtaUrl || '',
                            disabled: !showPrimaryCta,
                            onChange: function (value) {
                                setAttributes({ primaryCtaUrl: value });
                            },
                        }),
                        el(ToggleControl, {
                            label: 'Show Secondary Button',
                            checked: showSecondaryCta,
                            onChange: function (value) {
                                setAttributes({ showSecondaryCta: value });
                            },
                        }),
                        el(TextControl, {
                            label: 'Secondary Button URL',
                            value: attrs.secondaryCtaUrl || '',
                            disabled: !showSecondaryCta,
                            onChange: function (value) {
                                setAttributes({ secondaryCtaUrl: value });
                            },
                        }),
                        el(TextControl, {
                            label: 'Hero Image Alt Text',
                            value: attrs.heroImageAlt || '',
                            onChange: function (value) {
                                setAttributes({ heroImageAlt: value });
                            },
                        }),
                        el(
                            MediaUploadCheck,
                            null,
                            el(MediaUpload, {
                                onSelect: function (media) {
                                    setAttributes({
                                        heroImageId: media && media.id ? media.id : 0,
                                        heroImageUrl: media && media.url ? media.url : '',
                                        heroImageAlt: media && media.alt ? media.alt : attrs.heroImageAlt || '',
                                    });
                                },
                                allowedTypes: ['image'],
                                value: attrs.heroImageId || 0,
                                render: function (obj) {
                                    return el(Button, {
                                        variant: 'secondary',
                                        onClick: obj.open,
                                    }, heroImageUrl ? 'Replace Hero Image' : 'Select Hero Image');
                                },
                            })
                        ),
                        heroImageUrl ? el(Button, {
                            variant: 'link',
                            isDestructive: true,
                            onClick: function () {
                                setAttributes({ heroImageId: 0, heroImageUrl: '', heroImageAlt: '' });
                            },
                        }, 'Remove Hero Image') : null
                    )
                ),
                el(
                    'div',
                    blockProps,
                    el(
                        'section',
                        { className: 'section section--dark', style: { padding: '240px 0 80px', position: 'relative', overflow: 'hidden' } },
                        el('div', {
                            style: {
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: '#0d0d0d',
                                backgroundImage: heroImageUrl ? 'url(' + heroImageUrl + ')' : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            },
                        }),
                        el('div', {
                            style: {
                                position: 'absolute',
                                inset: 0,
                                // background: 'linear-gradient(110deg,rgba(4,4,4,0.88) 0%,rgba(4,4,4,0.55) 70%,rgba(4,4,4,0.3) 100%)',
                                backgroundColor: 'var(--wp--preset--color--palette-color-3, var(--theme-palette-color-3, #1e1e1e))',
                                opacity: 0.66,
                            },
                        }),
                        el(
                            'div',
                            { className: 'wrap', style: { position: 'relative', zIndex: 2, width: 'var(--theme-container-width,1200px)', maxWidth: 'var(--theme-normal-container-max-width,1200px)' } },
                            el(RichText, {
                                tagName: 'h1',
                                value: attrs.title,
                                onChange: function (value) {
                                    setAttributes({ title: value });
                                },
                                style: { color: '#fff', maxWidth: '680px', marginBottom: '20px' },
                                placeholder: 'Dormer Loft Conversion London',
                            }),
                            el(RichText, {
                                tagName: 'p',
                                value: attrs.subtitle,
                                onChange: function (value) {
                                    setAttributes({ subtitle: value });
                                },
                                style: {
                                    color: 'rgba(255,255,255,0.82)',
                                    fontSize: '1.1rem',
                                    maxWidth: '540px',
                                    marginBottom: '40px',
                                    lineHeight: '1.7',
                                },
                                placeholder: 'Transform your loft with signature designer collections.',
                            }),
                            (showPrimaryCta || showSecondaryCta) ? el(
                                'div',
                                { style: { display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' } },
                                showPrimaryCta ? el(RichText, {
                                    tagName: 'a',
                                    className: 'btn-cta btn-cta--solid',
                                    value: attrs.primaryCtaText,
                                    onChange: function (value) {
                                        setAttributes({ primaryCtaText: value });
                                    },
                                    href: attrs.primaryCtaUrl || '#',
                                    placeholder: 'Get Instant Estimate',
                                }) : null,
                                showSecondaryCta ? el(RichText, {
                                    tagName: 'a',
                                    className: 'btn btn--white',
                                    value: attrs.secondaryCtaText,
                                    onChange: function (value) {
                                        setAttributes({ secondaryCtaText: value });
                                    },
                                    href: attrs.secondaryCtaUrl || '#',
                                    placeholder: 'Explore Designer Collections ->',
                                }) : null
                            ) : null
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
