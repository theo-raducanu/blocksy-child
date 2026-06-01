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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-trust-bar')) return;

    try {
        registerBlockType('myloft/dormer-trust-bar', {
            apiVersion: 2,
            title: 'Trust Bar',
            icon: 'awards',
            category: 'myloft',
            supports: { html: false, align: ['full'] },
            attributes: {
                stat1Label: { type: 'string', default: 'Fixed Price' },
                stat1Value: { type: 'string', default: 'Guaranteed' },
                stat2Label: { type: 'string', default: 'Delivery' },
                stat2Value: { type: 'string', default: '6–10 Weeks' },
                stat3Label: { type: 'string', default: 'Designer Collections' },
                stat3Value: { type: 'string', default: 'Included' },
                stat4Label: { type: 'string', default: 'Design Fees' },
                stat4Value: { type: 'string', default: '£0' },
                stat5Label: { type: 'string', default: 'Workmanship' },
                stat5Value: { type: 'string', default: '6-Year Guarantee' },
                stat6Label: { type: 'string', default: 'By' },
                stat6Value: { type: 'string', default: 'Masterpiece Construction' },
            },
            edit: function (props) {
                var a = props.attributes;
                var setAttributes = props.setAttributes;
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks alignfull', style: { margin: 0, padding: 0 } });
                function set(key) { return function (v) { var u = {}; u[key] = v; setAttributes(u); }; }

                function statPanel(i, initialOpen) {
                    var labelKey = 'stat' + i + 'Label';
                    var valueKey = 'stat' + i + 'Value';
                    return el(PanelBody, { title: 'Stat ' + i, initialOpen: !!initialOpen },
                        el(TextControl, {
                            label: 'Label',
                            value: a[labelKey] || '',
                            onChange: function (v) { var o = {}; o[labelKey] = v; setAttributes(o); }
                        }),
                        el(TextControl, {
                            label: 'Value',
                            value: a[valueKey] || '',
                            onChange: function (v) { var o = {}; o[valueKey] = v; setAttributes(o); }
                        })
                    );
                }

                var stats = [];
                for (var i = 1; i <= 6; i++) {
                    stats.push(
                        el('div', { key: 'stat-' + i, style: { textAlign: 'center' } },
                            rt('div', a['stat' + i + 'Label'], set('stat' + i + 'Label'), { plain: true, style: { fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-grey-icon)', marginBottom: '3px' }, placeholder: 'Label ' + i }),
                            rt('div', a['stat' + i + 'Value'], set('stat' + i + 'Value'), { plain: true, style: { fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-grey-icon)' }, placeholder: 'Value ' + i })
                        )
                    );
                }

                return el('div', blockProps,
                    el(InspectorControls, {},
                        statPanel(1, true),
                        statPanel(2, false),
                        statPanel(3, false),
                        statPanel(4, false),
                        statPanel(5, false),
                        statPanel(6, false)
                    ),
                    el('section', { className: 'section--dark info-bar', style: { padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.07)' } },
                        el('div', { className: 'wrap', style: { width: 'var(--theme-container-width,1200px)', maxWidth: 'var(--theme-normal-container-max-width,1200px)' } },
                            el('div', { className: 'info-bar__grid', style: { display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '16px', alignItems: 'center', justifyItems: 'center' } },
                                stats
                            )
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-trust-bar block registration error', e); }
}(window.wp));
