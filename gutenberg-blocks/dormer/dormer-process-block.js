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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-process')) return;

    try {
        registerBlockType('myloft/dormer-process', {
            apiVersion: 2,
            title: 'Dormer – Process',
            icon: 'clock',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                eyebrow: { type: 'string', default: 'Timeline & Process' },
                h2: { type: 'string', default: 'Building a Dormer Loft Conversion: What to Expect' },
                tl1Weeks: { type: 'string', default: 'Wks 1–2' },
                tl1Phase: { type: 'string', default: 'Structural Phase' },
                tl1Desc: { type: 'string', default: 'Scaffold, roof opening, steelwork, dormer frame construction.' },
                tl2Weeks: { type: 'string', default: 'Wks 3–4' },
                tl2Phase: { type: 'string', default: 'Weathertight' },
                tl2Desc: { type: 'string', default: 'Dormer roof completed, windows installed, fully weatherproofed.' },
                tl3Weeks: { type: 'string', default: 'Wks 5–7' },
                tl3Phase: { type: 'string', default: 'First Fix Interior' },
                tl3Desc: { type: 'string', default: 'Insulation, plasterwork, electrics, heating, staircase.' },
                tl4Weeks: { type: 'string', default: 'Wks 8–10' },
                tl4Phase: { type: 'string', default: 'Fit-Out & Handover' },
                tl4Desc: { type: 'string', default: 'Fitted furniture, en-suite, decorating, lighting, snagging, handover.' },
                whyFasterTitle: { type: 'string', default: 'Why We\'re Faster' },
                whyFasterBody: { type: 'string', default: 'Pre-designed collections eliminate the design phase. Materials pre-ordered before day one. Dedicated teams, strong building control relationships, fixed scope — no mid-project changes.' },
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
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Process — preview requires ServerSideRender'));
                }
                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'CTA Links', initialOpen: false },
                            el(TextControl, { label: 'CTA 1 URL', value: a.cta1Url, onChange: function (v) { setAttributes({ cta1Url: v }); } }),
                            el(TextControl, { label: 'CTA 2 URL', value: a.cta2Url, onChange: function (v) { setAttributes({ cta2Url: v }); } })
                        )
                    ),
                    el(SSR, { block: 'myloft/dormer-process', attributes: a })
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-process block error', e); }
}(window.wp));
