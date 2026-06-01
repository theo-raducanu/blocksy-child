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

    if (typeof getBlockType === 'function' && getBlockType('myloft/dormer-faq')) return;

    var defaultFaqs = [
        { question: 'How much does a dormer loft conversion cost?', answer: '£70,000–£100,000 all-in with My Loft. Fixed price confirmed after free survey. Includes structural work, designer collection, en-suite, fitted furniture, project management, and a 6-year workmanship guarantee. No hidden costs.' },
        { question: 'How much value does a dormer add to my home?', answer: 'Typically 15–20% in London. A £800k property with an £85k conversion often reaches £920k–£960k, creating a net gain of £35k–£75k — plus years of enjoyment before any sale.' },
        { question: 'Can I finance a dormer loft conversion?', answer: 'Yes. Options include remortgage or equity release (2–5% APR), home improvement loans (4–9% APR, up to £100k), or our milestone payment plan.' },
        { question: 'Do I need to hire an interior designer separately?', answer: 'No. Every My Loft project includes a complete signature collection by a named interior designer — at no extra cost.' },
        { question: 'Can I customise a designer collection?', answer: 'Collections are pre-designed systems. Choose from 6 styles, select en-suite specification, and add optional upgrades. Minor palette adjustments are possible.' },
        { question: 'Do I need planning permission for a dormer extension?', answer: 'Most rear dormers don\'t — they qualify under permitted development. Planning is required for front or side dormers, conservation areas, listed buildings, and Article 4 direction areas.' },
        { question: 'What about party walls in a terraced house?', answer: 'The Party Wall Act 1996 applies where work affects shared walls. We serve all notices, handle agreements, and appoint surveyors if needed.' },
        { question: 'How long does a dormer loft conversion take?', answer: '6–10 weeks from contract to handover. We\'re faster because pre-designed collections eliminate the design phase, materials are pre-ordered, and dedicated teams know our workflow inside out.' },
        { question: 'Will I need to move out?', answer: 'No — 95% of our clients stay throughout the build. Your home remains fully functional throughout.' },
        { question: 'Which properties cannot be converted?', answer: 'Properties with insufficient headroom (below 2.2m ridge height), modern truss roofs (unless modified), or poor structural condition. We assess honestly at survey — 95% of London Victorian and Edwardian terraces are suitable.' },
        { question: 'What guarantees do you provide?', answer: '6-year workmanship guarantee, manufacturer warranties on all products, building regulations completion certificate, fixed-price guarantee, and a 4-week post-completion check-in call.' },
    ];

    try {
        registerBlockType('myloft/dormer-faq', {
            apiVersion: 2,
            title: 'Dormer – FAQ',
            icon: 'editor-help',
            category: 'myloft',
            supports: { html: false },
            attributes: {
                eyebrow: { type: 'string', default: 'FAQs' },
                h2: { type: 'string', default: 'Dormer Loft Conversion: Common Questions' },
                faqs: { type: 'array', default: [] },
                q1: { type: 'string', default: 'How much does a dormer loft conversion cost?' },
                a1: { type: 'string', default: '£70,000–£100,000 all-in with My Loft. Fixed price confirmed after free survey. Includes structural work, designer collection, en-suite, fitted furniture, project management, and a 6-year workmanship guarantee. No hidden costs.' },
                q2: { type: 'string', default: 'How much value does a dormer add to my home?' },
                a2: { type: 'string', default: 'Typically 15–20% in London. A £800k property with an £85k conversion often reaches £920k–£960k, creating a net gain of £35k–£75k — plus years of enjoyment before any sale.' },
                q3: { type: 'string', default: 'Can I finance a dormer loft conversion?' },
                a3: { type: 'string', default: 'Yes. Options include remortgage or equity release (2–5% APR), home improvement loans (4–9% APR, up to £100k), or our milestone payment plan.' },
                q4: { type: 'string', default: 'Do I need to hire an interior designer separately?' },
                a4: { type: 'string', default: 'No. Every My Loft project includes a complete signature collection by a named interior designer — at no extra cost.' },
                q5: { type: 'string', default: 'Can I customise a designer collection?' },
                a5: { type: 'string', default: 'Collections are pre-designed systems. Choose from 6 styles, select en-suite specification, and add optional upgrades. Minor palette adjustments are possible.' },
                q6: { type: 'string', default: 'Do I need planning permission for a dormer extension?' },
                a6: { type: 'string', default: 'Most rear dormers don\'t — they qualify under permitted development. Planning is required for front or side dormers, conservation areas, listed buildings, and Article 4 direction areas.' },
                q7: { type: 'string', default: 'What about party walls in a terraced house?' },
                a7: { type: 'string', default: 'The Party Wall Act 1996 applies where work affects shared walls. We serve all notices, handle agreements, and appoint surveyors if needed.' },
                q8: { type: 'string', default: 'How long does a dormer loft conversion take?' },
                a8: { type: 'string', default: '6–10 weeks from contract to handover. We\'re faster because pre-designed collections eliminate the design phase, materials are pre-ordered, and dedicated teams know our workflow inside out.' },
                q9: { type: 'string', default: 'Will I need to move out?' },
                a9: { type: 'string', default: 'No — 95% of our clients stay throughout the build. Your home remains fully functional throughout.' },
                q10: { type: 'string', default: 'Which properties cannot be converted?' },
                a10: { type: 'string', default: 'Properties with insufficient headroom (below 2.2m ridge height), modern truss roofs (unless modified), or poor structural condition. We assess honestly at survey — 95% of London Victorian and Edwardian terraces are suitable.' },
                q11: { type: 'string', default: 'What guarantees do you provide?' },
                a11: { type: 'string', default: '6-year workmanship guarantee, manufacturer warranties on all products, building regulations completion certificate, fixed-price guarantee, and a 4-week post-completion check-in call.' },
                ctaImageId: { type: 'number', default: 0 },
                ctaImageUrl: { type: 'string', default: '' },
                ctaImageAlt: { type: 'string', default: '' },
                ctaTitle: { type: 'string', default: 'Ready to Get Started?' },
                ctaBody: { type: 'string', default: 'We visit your property, confirm feasibility, and deliver a fixed price within 48 hours. No surprises — ever.' },
                ctaBtn1Text: { type: 'string', default: 'Book Free Survey →' },
                ctaBtn1Url: { type: 'string', default: '#contact' },
                ctaBtn2Text: { type: 'string', default: 'Get Instant Estimate →' },
                ctaBtn2Url: { type: 'string', default: '#calculator' },
            },
            edit: function (props) {
                var a = props.attributes;
                var setAttributes = props.setAttributes;
                var blockProps = useBlockProps({ className: 'dormer-loft-blocks', style: { margin: 0, padding: 0 } });
                function set(key) { return function (v) { var u = {}; u[key] = v; setAttributes(u); }; }
                var ctaImg = a.ctaImageUrl || 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-8-scaled-1.jpg';

                function getLegacyFaqs() {
                    var rows = [];
                    for (var i = 1; i <= 11; i++) {
                        rows.push({
                            question: a['q' + i] || '',
                            answer: a['a' + i] || ''
                        });
                    }
                    rows = rows.filter(function (row) {
                        return (row.question && row.question.trim() !== '') || (row.answer && row.answer.trim() !== '');
                    });
                    if (!rows.length) {
                        return defaultFaqs.map(function (row) {
                            return { question: row.question, answer: row.answer };
                        });
                    }
                    return rows;
                }

                var faqs = Array.isArray(a.faqs) && a.faqs.length ? a.faqs : getLegacyFaqs();

                function updateFaq(index, key, value) {
                    var next = faqs.slice();
                    next[index] = Object.assign({}, next[index], {});
                    next[index][key] = value;
                    setAttributes({ faqs: next });
                }

                function removeFaq(index) {
                    var next = faqs.slice();
                    next.splice(index, 1);
                    setAttributes({ faqs: next });
                }

                function addFaq() {
                    var next = faqs.slice();
                    next.push({ question: '', answer: '' });
                    setAttributes({ faqs: next });
                }

                return el('div', blockProps,
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Section Content', initialOpen: false },
                            el(TextControl, { label: 'Eyebrow', value: a.eyebrow, onChange: function (v) { setAttributes({ eyebrow: v }); } }),
                            el(TextControl, { label: 'Heading', value: a.h2, onChange: function (v) { setAttributes({ h2: v }); } })
                        ),
                        el(PanelBody, { title: 'Questions', initialOpen: true },
                            faqs.map(function (row, i) {
                                return el('div', { key: 'faq-' + i, style: { marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e2e2' } },
                                    el(TextControl, { label: 'Question ' + (i + 1), value: row.question || '', onChange: function (v) { updateFaq(i, 'question', v); } }),
                                    el(TextareaControl, { label: 'Answer ' + (i + 1), value: row.answer || '', rows: 4, onChange: function (v) { updateFaq(i, 'answer', v); } }),
                                    el(Button, { isDestructive: true, isSmall: true, onClick: function () { removeFaq(i); } }, 'Remove Question')
                                );
                            }),
                            el(Button, { isSecondary: true, onClick: addFaq }, 'Add Question')
                        ),
                        el(PanelBody, { title: 'CTA Card', initialOpen: true },
                            el(MediaUploadCheck, {},
                                el(MediaUpload, {
                                    onSelect: function (media) { setAttributes({ ctaImageId: media.id, ctaImageUrl: media.url, ctaImageAlt: media.alt || '' }); },
                                    allowedTypes: ['image'],
                                    value: a.ctaImageId,
                                    render: function (ref) { return el(Button, { onClick: ref.open, isSecondary: true }, a.ctaImageUrl ? 'Change CTA Image' : 'Select CTA Image'); }
                                })
                            ),
                            a.ctaImageUrl && el('img', { src: a.ctaImageUrl, style: { width: '100%', marginTop: '8px', borderRadius: '6px' } }),
                            el(TextControl, { label: 'Alt Text', value: a.ctaImageAlt, onChange: function (v) { setAttributes({ ctaImageAlt: v }); } }),
                            el(TextControl, { label: 'CTA Title', value: a.ctaTitle, onChange: function (v) { setAttributes({ ctaTitle: v }); } }),
                            el(TextareaControl, { label: 'CTA Body', value: a.ctaBody, rows: 3, onChange: function (v) { setAttributes({ ctaBody: v }); } }),
                            el(TextControl, { label: 'CTA Button 1 Text', value: a.ctaBtn1Text, onChange: function (v) { setAttributes({ ctaBtn1Text: v }); } }),
                            el(TextControl, { label: 'CTA Button 1 URL', value: a.ctaBtn1Url, onChange: function (v) { setAttributes({ ctaBtn1Url: v }); } }),
                            el(TextControl, { label: 'CTA Button 2 Text', value: a.ctaBtn2Text, onChange: function (v) { setAttributes({ ctaBtn2Text: v }); } }),
                            el(TextControl, { label: 'CTA Button 2 URL', value: a.ctaBtn2Url, onChange: function (v) { setAttributes({ ctaBtn2Url: v }); } })
                        )
                    ),
                    el('section', { className: 'section section--dark', id: 'faq' },
                        el('div', { className: 'wrap' },
                            el('div', { className: 'grid-2', style: { gap: '64px', alignItems: 'flex-start' } },
                                el('div', null,
                                    rt('span', a.eyebrow, set('eyebrow'), { plain: true, className: 'eyebrow', placeholder: 'Eyebrow' }),
                                    rt('h2', a.h2, set('h2'), { plain: true, style: { color: '#fff', marginBottom: '36px' }, placeholder: 'Heading' }),
                                    faqs.map(function (row, index) {
                                        return el('div', { key: 'faq-item-' + index, className: 'faq-item open' },
                                            el('h3', { className: 'faq-q' },
                                                rt('span', row.question, function (v) { updateFaq(index, 'question', v); }, { plain: true, placeholder: 'Question ' + (index + 1) }),
                                                el('span', { className: 'faq-toggle' })
                                            ),
                                            rt('div', row.answer, function (v) { updateFaq(index, 'answer', v); }, { className: 'faq-a', placeholder: 'Answer ' + (index + 1) })
                                        );
                                    })
                                ),
                                el('div', { style: { position: 'sticky', top: '90px' } },
                                    el('div', { style: { position: 'relative', borderRadius: 'var(--radius-img)', overflow: 'hidden', minHeight: '480px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' } },
                                        el('div', { className: 'img-ph', style: { position: 'absolute', inset: 0, borderRadius: 0, backgroundImage: "url('" + ctaImg + "')", backgroundSize: 'cover', backgroundPosition: 'center' } }),
                                        el('div', { style: { position: 'relative', zIndex: 2, margin: '20px', padding: '28px', background: 'rgba(0,0,0,0.55)', borderRadius: '16px', backdropFilter: 'blur(12px)' } },
                                            rt('h3', a.ctaTitle, set('ctaTitle'), { plain: true, style: { color: '#fff', marginBottom: '10px', fontSize: '1.1rem' }, placeholder: 'CTA title' }),
                                            rt('p', a.ctaBody, set('ctaBody'), { style: { color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginBottom: '22px' }, placeholder: 'CTA body' }),
                                            rt('a', a.ctaBtn1Text, set('ctaBtn1Text'), { plain: true, href: a.ctaBtn1Url || '#', className: 'btn-cta btn-cta--solid', style: { width: '100%', justifyContent: 'center', marginBottom: '12px' }, placeholder: 'Button 1' }),
                                            el('div', { style: { textAlign: 'center' } },
                                                rt('a', a.ctaBtn2Text, set('ctaBtn2Text'), { plain: true, href: a.ctaBtn2Url || '#', className: 'btn btn--white', style: { fontSize: '0.85rem', justifyContent: 'center' }, placeholder: 'Button 2' })
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                );
            },
            save: function () { return null; },
        });
    } catch (e) { console.error('dormer-faq block error', e); }
}(window.wp));
