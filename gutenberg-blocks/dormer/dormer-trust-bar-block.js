(function (wp) {
    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) return;
    var registerBlockType = wp.blocks.registerBlockType;
    var getBlockType = wp.blocks.getBlockType;
    var el = wp.element.createElement;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var RichText = wp.blockEditor.RichText;

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
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks alignfull', style: { margin: 0, padding: 0 } });
                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Trust Bar — preview requires ServerSideRender'));
                }
                return el('div', blockProps, el(SSR, { block: 'myloft/dormer-trust-bar', attributes: props.attributes }));
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-trust-bar block registration error', e); }
}(window.wp));
