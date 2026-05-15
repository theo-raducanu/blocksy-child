// This file has been replaced by individual block files (dormer-*-block.js).
// It is no longer enqueued. Kept as a no-op stub for safety.
(function () { })();

var registerBlockType = wp.blocks.registerBlockType;
var getBlockType = wp.blocks.getBlockType;
var el = wp.element.createElement;
var Fragment = wp.element.Fragment;
var useBlockProps = wp.blockEditor.useBlockProps;
var InspectorControls = wp.blockEditor.InspectorControls;
var PanelBody = wp.components.PanelBody;
var TextareaControl = wp.components.TextareaControl;

var sections = [
    { name: 'myloft/dormer-trust-bar', title: 'Trust Bar' },
    { name: 'myloft/dormer-what-is', title: 'Dormer What Is Section' },
    { name: 'myloft/dormer-why-my-loft', title: 'Dormer Why My Loft' },
    { name: 'myloft/dormer-collections', title: 'Dormer Collections' },
    { name: 'myloft/dormer-process', title: 'Dormer Timeline Process' },
    { name: 'myloft/dormer-pricing', title: 'Dormer Pricing' },
    { name: 'myloft/dormer-calculator', title: 'Dormer Calculator' },
    { name: 'myloft/dormer-planning', title: 'Dormer Planning' },
    { name: 'myloft/dormer-projects', title: 'Dormer Projects' },
    { name: 'myloft/dormer-types', title: 'Dormer Types' },
    { name: 'myloft/dormer-areas', title: 'Dormer Areas' },
    { name: 'myloft/dormer-faq', title: 'Dormer FAQ' },
    { name: 'myloft/dormer-contact', title: 'Dormer Contact CTA' },
];

sections.forEach(function (section) {
    if (typeof getBlockType === 'function' && getBlockType(section.name)) {
        return;
    }

    try {
        registerBlockType(section.name, {
            apiVersion: 2,
            title: section.title,
            description: 'Theme-managed Dormer section block.',
            icon: 'screenoptions',
            category: 'myloft',
            attributes: {
                sectionHtml: {
                    type: 'string',
                    default: '',
                },
            },
            supports: {
                html: false,
                reusable: true,
            },
            edit: function (props) {
                var attrs = props.attributes;
                var setAttributes = props.setAttributes;
                var blockProps = useBlockProps();

                return el(
                    Fragment,
                    null,
                    el(
                        InspectorControls,
                        null,
                        el(
                            PanelBody,
                            { title: 'Section Content', initialOpen: true },
                            el(TextareaControl, {
                                label: 'Edit Section HTML',
                                help: 'Edit text/items directly in this HTML. Leave blank to use the theme default section template.',
                                value: attrs.sectionHtml || '',
                                onChange: function (value) {
                                    setAttributes({ sectionHtml: value });
                                },
                                rows: 18,
                            })
                        )
                    ),
                    el(
                        'div',
                        blockProps,
                        el('p', {
                            style: {
                                margin: 0,
                                padding: '14px 16px',
                                background: '#f8faf7',
                                border: '1px solid #dde6d8',
                                borderRadius: '10px',
                                fontSize: '13px',
                                lineHeight: '1.5',
                            },
                        }, attrs.sectionHtml && attrs.sectionHtml.trim() !== ''
                            ? section.title + ': custom section HTML is set. Frontend will render your edited content.'
                            : section.title + ': using theme default template. Add custom HTML in the sidebar to override.'),
                        el(TextareaControl, {
                            label: 'Edit Section HTML (Quick Edit)',
                            help: 'Leave empty to keep the default theme template for this section.',
                            value: attrs.sectionHtml || '',
                            onChange: function (value) {
                                setAttributes({ sectionHtml: value });
                            },
                            rows: 12,
                        })
                    )
                );
            },
            save: function () {
                return null;
            },
        });
    } catch (error) {
        if (window && window.console && typeof window.console.error === 'function') {
            window.console.error('Failed to register block', section.name, error);
        }
    }
});
}) (window.wp);
