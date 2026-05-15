(function (wp) {
    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) return;
    var registerBlockType = wp.blocks.registerBlockType;
    var getBlockType = wp.blocks.getBlockType;
    var el = wp.element.createElement;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var RichText = wp.blockEditor.RichText;

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-calculator')) return;

    try {
        registerBlockType('myloft/dormer-calculator', {
            apiVersion: 2,
            title: 'Dormer – Calculator',
            icon: 'calculator',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                eyebrow: { type: 'string', default: 'Instant Estimate' },
                h2: { type: 'string', default: 'How Much Will Your Loft Conversion Cost?' },
                description: { type: 'string', default: 'Configure your options for an instant budget estimate. A fixed price is confirmed after your free survey.' },
            },
            edit: function (props) {
                var SSR = wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });
                if (!SSR) {
                    return el('div', blockProps, el('p', { style: { padding: '1em', color: '#666' } }, 'Dormer Calculator — preview requires ServerSideRender'));
                }
                return el('div', blockProps, el(SSR, { block: 'myloft/dormer-calculator', attributes: props.attributes }));
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-calculator block error', e); }
}(window.wp));
