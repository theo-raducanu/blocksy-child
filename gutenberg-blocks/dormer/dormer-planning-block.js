(function (wp) {
    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) return;
    var registerBlockType = wp.blocks.registerBlockType;
    var getBlockType = wp.blocks.getBlockType;
    var el = wp.element.createElement;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var RichText = wp.blockEditor.RichText;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var TextControl = wp.components.TextControl;
    var TextareaControl = wp.components.TextareaControl;

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-planning')) return;

    try {
        registerBlockType('myloft/dormer-planning', {
            apiVersion: 2,
            title: 'Dormer – Planning',
            icon: 'admin-site',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                eyebrow: { type: 'string', default: 'Planning & Compliance' },
                h2: { type: 'string', default: 'Planning Permission & Building Regulations' },
                intro: { type: 'string', default: 'Most loft conversions in London fall under permitted development — no planning permission required. We manage the entire building control process, from submission to final sign-off.' },
                noPlan1: { type: 'string', default: 'Rear roof slope only' },
                noPlan2: { type: 'string', default: 'Materials match existing house' },
                noPlan3: { type: 'string', default: 'Within 40m³ volume (terrace)' },
                noPlan4: { type: 'string', default: 'Property not listed' },
                noPlan5: { type: 'string', default: 'Not in Article 4 direction area' },
                planReq1: { type: 'string', default: 'Front or side dormers' },
                planReq2: { type: 'string', default: 'Conservation area properties' },
                planReq3: { type: 'string', default: 'Listed buildings' },
                planReq4: { type: 'string', default: 'Article 4 direction areas' },
                planReq5: { type: 'string', default: 'Exceeds permitted development limits' },
                footnote: { type: 'string', default: 'Building control fees (£800–£1,200) are included in your fixed quote. We handle everything — submission to sign-off. Updated February 2026.' },
                reg1Badge: { type: 'string', default: 'S' },
                reg1Title: { type: 'string', default: 'Structural Integrity' },
                reg1Desc: { type: 'string', default: 'Load-bearing calcs, steel beam specs, floor joist strengthening.' },
                reg2Badge: { type: 'string', default: 'F' },
                reg2Title: { type: 'string', default: 'Fire Safety' },
                reg2Desc: { type: 'string', default: 'Escape routes, 30-min fire-rated doors, smoke alarms, window specification.' },
                reg3Badge: { type: 'string', default: 'I' },
                reg3Title: { type: 'string', default: 'Insulation' },
                reg3Desc: { type: 'string', default: 'U-value 0.15 W/m²K or better. Airtightness, condensation control.' },
                reg4Badge: { type: 'string', default: 'A' },
                reg4Title: { type: 'string', default: 'Staircase & Acoustics' },
                reg4Desc: { type: 'string', default: 'Max 42° pitch, 2m headroom, acoustic insulation in floors and party walls.' },
            },
            edit: function (props) {
                var a = props.attributes;
                var setAttributes = props.setAttributes;
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });
                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Planning — preview requires ServerSideRender'));
                }

                function setAttr(key, v) { var o = {}; o[key] = v; setAttributes(o); }

                function textItem(key) {
                    return el(TextControl, {
                        label: key,
                        value: a[key] || '',
                        onChange: function (v) { setAttr(key, v); }
                    });
                }

                function regPanel(i, initialOpen) {
                    var badgeKey = 'reg' + i + 'Badge';
                    var titleKey = 'reg' + i + 'Title';
                    var descKey = 'reg' + i + 'Desc';
                    return el(PanelBody, { title: 'Regulation ' + i, initialOpen: !!initialOpen },
                        el(TextControl, { label: 'Badge', value: a[badgeKey] || '', onChange: function (v) { setAttr(badgeKey, v); } }),
                        el(TextControl, { label: 'Title', value: a[titleKey] || '', onChange: function (v) { setAttr(titleKey, v); } }),
                        el(TextareaControl, { label: 'Description', value: a[descKey] || '', rows: 3, onChange: function (v) { setAttr(descKey, v); } })
                    );
                }

                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: true },
                            el(TextControl, { label: 'Eyebrow', value: a.eyebrow || '', onChange: function (v) { setAttr('eyebrow', v); } }),
                            el(TextControl, { label: 'Heading', value: a.h2 || '', onChange: function (v) { setAttr('h2', v); } }),
                            el(TextareaControl, { label: 'Intro', value: a.intro || '', rows: 3, onChange: function (v) { setAttr('intro', v); } }),
                            el(TextareaControl, { label: 'Footnote', value: a.footnote || '', rows: 3, onChange: function (v) { setAttr('footnote', v); } })
                        ),
                        el(PanelBody, { title: 'Permitted Development (No Planning)', initialOpen: false },
                            el(TextControl, { label: 'Item 1', value: a.noPlan1 || '', onChange: function (v) { setAttr('noPlan1', v); } }),
                            el(TextControl, { label: 'Item 2', value: a.noPlan2 || '', onChange: function (v) { setAttr('noPlan2', v); } }),
                            el(TextControl, { label: 'Item 3', value: a.noPlan3 || '', onChange: function (v) { setAttr('noPlan3', v); } }),
                            el(TextControl, { label: 'Item 4', value: a.noPlan4 || '', onChange: function (v) { setAttr('noPlan4', v); } }),
                            el(TextControl, { label: 'Item 5', value: a.noPlan5 || '', onChange: function (v) { setAttr('noPlan5', v); } })
                        ),
                        el(PanelBody, { title: 'Planning Required', initialOpen: false },
                            el(TextControl, { label: 'Item 1', value: a.planReq1 || '', onChange: function (v) { setAttr('planReq1', v); } }),
                            el(TextControl, { label: 'Item 2', value: a.planReq2 || '', onChange: function (v) { setAttr('planReq2', v); } }),
                            el(TextControl, { label: 'Item 3', value: a.planReq3 || '', onChange: function (v) { setAttr('planReq3', v); } }),
                            el(TextControl, { label: 'Item 4', value: a.planReq4 || '', onChange: function (v) { setAttr('planReq4', v); } }),
                            el(TextControl, { label: 'Item 5', value: a.planReq5 || '', onChange: function (v) { setAttr('planReq5', v); } })
                        ),
                        regPanel(1, false),
                        regPanel(2, false),
                        regPanel(3, false),
                        regPanel(4, false)
                    ),
                    el(SSR, { block: 'myloft/dormer-planning', attributes: a })
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-planning block error', e); }
}(window.wp));
