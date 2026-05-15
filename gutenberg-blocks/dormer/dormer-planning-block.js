(function (wp) {
    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) return;
    var registerBlockType = wp.blocks.registerBlockType;
    var getBlockType = wp.blocks.getBlockType;
    var el = wp.element.createElement;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var RichText = wp.blockEditor.RichText;

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
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });
                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Planning — preview requires ServerSideRender'));
                }
                return el('div', blockProps, el(SSR, { block: 'myloft/dormer-planning', attributes: props.attributes }));
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-planning block error', e); }
}(window.wp));
