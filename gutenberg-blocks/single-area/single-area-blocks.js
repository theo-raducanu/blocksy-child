(function (wp) {
    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) {
        return;
    }

    var registerBlockType = wp.blocks.registerBlockType;
    var getBlockType = wp.blocks.getBlockType;
    var el = wp.element.createElement;
    var Fragment = wp.element.Fragment;
    var useEffect = wp.element.useEffect;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var RichText = wp.blockEditor.RichText;
    var PlainText = wp.blockEditor.PlainText;
    var URLInput = wp.blockEditor.URLInput;
    var MediaUpload = wp.blockEditor.MediaUpload;
    var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
    var PanelBody = wp.components.PanelBody;
    var BaseControl = wp.components.BaseControl;
    var ToggleControl = wp.components.ToggleControl;
    var SelectControl = wp.components.SelectControl;
    var Button = wp.components.Button;

    function cloneValue(value) {
        if (typeof value === 'undefined') {
            return undefined;
        }

        try {
            return JSON.parse(JSON.stringify(value));
        } catch (e) {
            return value;
        }
    }

    function mergeDefaults(defaults, source) {
        if (Array.isArray(defaults)) {
            if (Array.isArray(source)) {
                return source.map(function (item) {
                    return cloneValue(item);
                });
            }

            return defaults.map(function (item) {
                return cloneValue(item);
            });
        }

        if (defaults && typeof defaults === 'object') {
            var result = {};
            var safeSource = source && typeof source === 'object' ? source : {};

            Object.keys(defaults).forEach(function (key) {
                result[key] = mergeDefaults(defaults[key], safeSource[key]);
            });

            Object.keys(safeSource).forEach(function (key) {
                if (!Object.prototype.hasOwnProperty.call(result, key)) {
                    result[key] = cloneValue(safeSource[key]);
                }
            });

            return result;
        }

        if (typeof source === 'undefined' || source === null) {
            return cloneValue(defaults);
        }

        return source;
    }

    function escapeHtml(value) {
        return String(typeof value === 'undefined' || value === null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function escapeAttr(value) {
        return escapeHtml(value);
    }

    // Content fields are edited with RichText (see renderFieldControl), so their
    // value is already sanitized inline HTML. Output it as-is rather than
    // escaping it, so editor links and line breaks render instead of showing
    // raw markup (e.g. a literal <br>) on the page.
    function richValue(value) {
        return String(typeof value === 'undefined' || value === null ? '' : value);
    }

    // Helpers passed to each section's inline editRender, so they can update the
    // stored `data` (which keeps the frontend `html` in sync via setData).
    function makeEditHelpers(data, setData) {
        return {
            setField: function (key, value) {
                var next = Object.assign({}, data);
                next[key] = value;
                setData(next);
            },
            setItem: function (key, index, value) {
                var list = Array.isArray(data[key]) ? data[key].slice() : [];
                list[index] = value;
                var next = Object.assign({}, data);
                next[key] = list;
                setData(next);
            },
            setItemField: function (key, index, field, value) {
                var list = Array.isArray(data[key]) ? data[key].slice() : [];
                var item = Object.assign({}, (list[index] && typeof list[index] === 'object') ? list[index] : {});
                item[field] = value;
                list[index] = item;
                var next = Object.assign({}, data);
                next[key] = list;
                setData(next);
            }
        };
    }

    // Inline editable RichText on the canvas. Restrictive by design: the editor
    // can only change text, never the layout/structure. opts.plain (headings,
    // labels) allows no formatting; otherwise links + bold/italic.
    function rt(tagName, value, onChange, opts) {
        opts = opts || {};
        var props = {
            tagName: tagName,
            value: typeof value === 'string' ? value : '',
            onChange: onChange,
            allowedFormats: opts.plain ? [] : ['core/bold', 'core/italic', 'core/link']
        };
        if (opts.className) props.className = opts.className;
        if (opts.style) props.style = opts.style;
        if (opts.placeholder) props.placeholder = opts.placeholder;
        if (opts.key) props.key = opts.key;
        if (opts.href) props.href = opts.href;
        return el(RichText, props);
    }

    function chunkArray(items, size) {
        var chunks = [];
        var safeItems = Array.isArray(items) ? items : [];
        var safeSize = size > 0 ? size : 1;

        for (var i = 0; i < safeItems.length; i += safeSize) {
            chunks.push(safeItems.slice(i, i + safeSize));
        }

        return chunks;
    }

    function createDefaultItem(repeater) {
        if (typeof repeater.defaultItem === 'undefined') {
            return repeater.itemType === 'object' ? {} : '';
        }

        return cloneValue(repeater.defaultItem);
    }

    function renderFieldControl(field, value, onChange, key, options) {
        var type = field.type;
        var fieldKey = field.key || '';

        if (!type) {
            if (/imageurl$/i.test(fieldKey)) {
                type = 'image';
            } else if (/url$/i.test(fieldKey)) {
                type = 'url';
            } else {
                type = 'text';
            }
        }

        // Every field stays available in the sidebar (so repeaters can be
        // managed and nothing is ever uneditable) in addition to being editable
        // inline on the canvas.

        if (type === 'textarea' || type === 'richtext') {
            return el(
                BaseControl,
                {
                    key: key,
                    label: field.label
                },
                el(RichText, {
                    tagName: 'div',
                    value: typeof value === 'string' ? value : '',
                    placeholder: field.label || '',
                    onChange: onChange,
                    style: {
                        minHeight: (field.rows || 3) * 20 + 'px',
                        border: '1px solid #dcdcde',
                        borderRadius: '4px',
                        padding: '8px 10px',
                        background: '#fff'
                    }
                })
            );
        }

        if (type === 'toggle') {
            return el(ToggleControl, {
                key: key,
                label: field.label,
                checked: !!value,
                onChange: onChange
            });
        }

        if (type === 'select') {
            return el(SelectControl, {
                key: key,
                label: field.label,
                value: typeof value === 'string' ? value : '',
                options: Array.isArray(field.options) ? field.options : [],
                onChange: onChange
            });
        }

        if (type === 'url') {
            if (URLInput) {
                return el(
                    BaseControl,
                    {
                        key: key,
                        label: field.label
                    },
                    el(URLInput, {
                        value: typeof value === 'string' ? value : '',
                        onChange: onChange
                    })
                );
            }

            return el(
                BaseControl,
                {
                    key: key,
                    label: field.label
                },
                el(PlainText, {
                    value: typeof value === 'string' ? value : '',
                    placeholder: field.label || '',
                    onChange: onChange,
                    style: {
                        border: '1px solid #dcdcde',
                        borderRadius: '4px',
                        padding: '8px 10px',
                        background: '#fff'
                    }
                })
            );
        }

        if (type === 'image') {
            var imageUrl = typeof value === 'string' ? value : '';

            return el(
                BaseControl,
                {
                    key: key,
                    label: field.label
                },
                imageUrl
                    ? el('div', { style: { marginBottom: '8px' } },
                        el('img', {
                            src: imageUrl,
                            alt: '',
                            style: {
                                width: '100%',
                                maxHeight: '140px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                border: '1px solid #dcdcde'
                            }
                        })
                    )
                    : null,
                MediaUpload && MediaUploadCheck
                    ? el(
                        MediaUploadCheck,
                        null,
                        el(MediaUpload, {
                            onSelect: function (media) {
                                onChange(media && media.url ? media.url : '');
                            },
                            allowedTypes: ['image'],
                            render: function (mediaProps) {
                                return el(
                                    Button,
                                    {
                                        isSecondary: true,
                                        onClick: mediaProps.open
                                    },
                                    imageUrl ? 'Replace Image' : 'Select Image'
                                );
                            }
                        })
                    )
                    : el(
                        PlainText,
                        {
                            value: imageUrl,
                            placeholder: 'Image URL',
                            onChange: onChange,
                            style: {
                                border: '1px solid #dcdcde',
                                borderRadius: '4px',
                                padding: '8px 10px',
                                background: '#fff'
                            }
                        }
                    ),
                imageUrl
                    ? el(
                        Button,
                        {
                            isLink: true,
                            isDestructive: true,
                            onClick: function () {
                                onChange('');
                            }
                        },
                        'Remove Image'
                    )
                    : null
            );
        }

        return el(
            BaseControl,
            {
                key: key,
                label: field.label
            },
            el(PlainText, {
                value: typeof value === 'string' ? value : '',
                placeholder: field.label || '',
                onChange: onChange,
                style: {
                    border: '1px solid #dcdcde',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    background: '#fff'
                }
            })
        );
    }

    function renderRepeaterPanel(repeater, data, setData, options) {
        var items = Array.isArray(data[repeater.key]) ? data[repeater.key] : [];

        function commit(nextItems) {
            var nextData = Object.assign({}, data);
            nextData[repeater.key] = nextItems;
            setData(nextData);
        }

        function moveItem(fromIndex, toIndex) {
            if (toIndex < 0 || toIndex >= items.length) {
                return;
            }

            var copy = items.slice();
            var moved = copy.splice(fromIndex, 1)[0];
            copy.splice(toIndex, 0, moved);
            commit(copy);
        }

        var content = [];

        items.forEach(function (item, index) {
            var itemKey = repeater.key + '-item-' + index;
            var controls = [];

            controls.push(
                el(
                    'div',
                    {
                        key: itemKey + '-actions',
                        style: {
                            display: 'flex',
                            gap: '8px',
                            marginBottom: '10px'
                        }
                    },
                    el(
                        Button,
                        {
                            isSmall: true,
                            isSecondary: true,
                            disabled: index === 0,
                            onClick: function () {
                                moveItem(index, index - 1);
                            }
                        },
                        'Up'
                    ),
                    el(
                        Button,
                        {
                            isSmall: true,
                            isSecondary: true,
                            disabled: index === items.length - 1,
                            onClick: function () {
                                moveItem(index, index + 1);
                            }
                        },
                        'Down'
                    ),
                    el(
                        Button,
                        {
                            isSmall: true,
                            isDestructive: true,
                            onClick: function () {
                                var next = items.slice();
                                next.splice(index, 1);
                                commit(next);
                            }
                        },
                        'Remove'
                    )
                )
            );

            if (repeater.itemType === 'object') {
                var normalizedItem = mergeDefaults(repeater.defaultItem || {}, item || {});

                (repeater.fields || []).forEach(function (field) {
                    controls.push(
                        renderFieldControl(
                            field,
                            normalizedItem[field.key],
                            function (value) {
                                var next = items.slice();
                                var nextItem = mergeDefaults(repeater.defaultItem || {}, next[index] || {});
                                nextItem[field.key] = value;
                                next[index] = nextItem;
                                commit(next);
                            },
                            itemKey + '-' + field.key,
                            options
                        )
                    );
                });
            } else {
                var itemField = repeater.itemField || { label: 'Value', type: 'text' };

                controls.push(
                    renderFieldControl(
                        itemField,
                        typeof item === 'string' ? item : '',
                        function (value) {
                            var next = items.slice();
                            next[index] = value;
                            commit(next);
                        },
                        itemKey + '-value',
                        options
                    )
                );
            }

            content.push(
                el(
                    'div',
                    {
                        key: itemKey,
                        style: {
                            marginBottom: '14px',
                            padding: '10px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px'
                        }
                    },
                    el(
                        'p',
                        {
                            style: {
                                margin: '0 0 8px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#666'
                            }
                        },
                        (repeater.itemLabel || 'Item') + ' ' + (index + 1)
                    ),
                    controls
                )
            );
        });

        content.push(
            el(
                Button,
                {
                    key: repeater.key + '-add',
                    isSecondary: true,
                    onClick: function () {
                        commit(items.concat([createDefaultItem(repeater)]));
                    }
                },
                repeater.addLabel || 'Add Item'
            )
        );

        return el(
            PanelBody,
            {
                key: 'panel-' + repeater.key,
                title: repeater.label,
                initialOpen: true
            },
            content
        );
    }

    function buildHeroSection(data) {
        var pills = (Array.isArray(data.pills) ? data.pills : []).map(function (pill) {
            return '<span class="pill">' + richValue(pill) + '</span>';
        }).join('');

        return [
            '<section class="section section--dark" style="padding:220px 0 90px;position:relative;overflow:hidden;">',
            '    <div class="img-cover" style="position:absolute;inset:0;border-radius:0;background-image:url(\'' + escapeAttr(data.heroImageUrl) + '\');"></div>',
            '    <div style="position:absolute;inset:0;background:linear-gradient(110deg,rgba(4,4,4,.88) 0%,rgba(4,4,4,.58) 65%,rgba(4,4,4,.35) 100%);"></div>',
            '    <div class="wrap" style="position:relative;z-index:2;">',
            '        <h1 style="color:#fff;max-width:760px;margin-bottom:18px;">' + richValue(data.title) + '</h1>',
            '        <p style="color:rgba(255,255,255,.83);max-width:760px;font-size:1.08rem;margin-bottom:30px;">' + richValue(data.subtitle) + '</p>',
            '        <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;margin-bottom:24px;">',
            '            <a href="' + escapeAttr(data.primaryCtaUrl || '#calculator') + '" class="btn-cta btn-cta--solid">' + richValue(data.primaryCtaText) + '</a>',
            '            <a href="' + escapeAttr(data.secondaryCtaUrl || '#collections') + '" class="btn btn--white">' + richValue(data.secondaryCtaText) + '</a>',
            '        </div>',
            '        <div class="pill-row">' + pills + '</div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function heroEditRender(data, h) {
        var pills = Array.isArray(data.pills) ? data.pills : [];
        return el('section', { className: 'section section--dark', style: { padding: '220px 0 90px', position: 'relative', overflow: 'hidden' } },
            el('div', { className: 'img-cover', style: { position: 'absolute', inset: 0, borderRadius: 0, backgroundImage: "url('" + (data.heroImageUrl || '') + "')" } }),
            el('div', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(110deg,rgba(4,4,4,.88) 0%,rgba(4,4,4,.58) 65%,rgba(4,4,4,.35) 100%)' } }),
            el('div', { className: 'wrap', style: { position: 'relative', zIndex: 2 } },
                rt('h1', data.title, function (v) { h.setField('title', v); }, {
                    plain: true,
                    style: { color: '#fff', maxWidth: '760px', marginBottom: '18px' },
                    placeholder: 'Title…'
                }),
                rt('p', data.subtitle, function (v) { h.setField('subtitle', v); }, {
                    style: { color: 'rgba(255,255,255,.83)', maxWidth: '760px', fontSize: '1.08rem', marginBottom: '30px' },
                    placeholder: 'Subtitle…'
                }),
                el('div', { style: { display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px' } },
                    rt('a', data.primaryCtaText, function (v) { h.setField('primaryCtaText', v); }, {
                        plain: true,
                        href: (data.primaryCtaUrl || '#calculator'),
                        className: 'btn-cta btn-cta--solid',
                        placeholder: 'Primary CTA…'
                    }),
                    rt('a', data.secondaryCtaText, function (v) { h.setField('secondaryCtaText', v); }, {
                        plain: true,
                        href: (data.secondaryCtaUrl || '#collections'),
                        className: 'btn btn--white',
                        placeholder: 'Secondary CTA…'
                    })
                ),
                el('div', { className: 'pill-row' },
                    pills.map(function (pill, index) {
                        return rt('span', pill, function (v) { h.setItem('pills', index, v); }, {
                            plain: true,
                            key: 'pill-' + index,
                            className: 'pill',
                            placeholder: 'Pill…'
                        });
                    })
                )
            )
        );
    }

    function buildTrustBarSection(data) {
        var metrics = (Array.isArray(data.metrics) ? data.metrics : []).map(function (metric) {
            return '<div class="hero-metric">' + richValue(metric) + '</div>';
        }).join('');

        return [
            '<section class="section--dark" style="padding:34px 0;border-top:1px solid rgba(255,255,255,.09);border-bottom:1px solid rgba(255,255,255,.09);">',
            '    <div class="wrap">',
            '        <div class="hero-metrics">' + metrics + '</div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function trustBarEditRender(data, h) {
        var metrics = Array.isArray(data.metrics) ? data.metrics : [];
        return el('section', { className: 'section--dark', style: { padding: '34px 0', borderTop: '1px solid rgba(255,255,255,.09)', borderBottom: '1px solid rgba(255,255,255,.09)' } },
            el('div', { className: 'wrap' },
                el('div', { className: 'hero-metrics' },
                    metrics.map(function (metric, index) {
                        return rt('div', metric, function (v) { h.setItem('metrics', index, v); }, {
                            plain: true,
                            key: 'metric-' + index,
                            className: 'hero-metric',
                            placeholder: 'Metric…'
                        });
                    })
                )
            )
        );
    }

    function buildIntroSection(data) {
        var paragraphs = (Array.isArray(data.paragraphs) ? data.paragraphs : []).map(function (paragraph, index, list) {
            var color = index === 0 ? '#3f3f3f' : '#555';
            var margin = index === list.length - 1 ? '' : 'margin-bottom:14px;';
            return '<p style="color:' + color + ';' + margin + '">' + richValue(paragraph) + '</p>';
        }).join('');

        return [
            '<section class="section section--light" id="intro-surrey">',
            '    <div class="wrap">',
            '        <div class="grid-2" style="align-items:center;gap:52px;">',
            '            <div>',
            '                <span class="eyebrow">' + richValue(data.eyebrow) + '</span>',
            '                <h2 style="margin-bottom:16px;">' + richValue(data.title) + '</h2>',
            '                ' + paragraphs,
            '            </div>',
            '            <div class="img-cover" style="min-height:420px;background-image:url(\'' + escapeAttr(data.imageUrl) + '\');"></div>',
            '        </div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function introEditRender(data, h) {
        var paragraphs = Array.isArray(data.paragraphs) ? data.paragraphs : [];
        return el('section', { className: 'section section--light', id: 'intro-surrey' },
            el('div', { className: 'wrap' },
                el('div', { className: 'grid-2', style: { alignItems: 'center', gap: '52px' } },
                    el('div', null,
                        rt('span', data.eyebrow, function (v) { h.setField('eyebrow', v); }, {
                            plain: true,
                            className: 'eyebrow',
                            placeholder: 'Eyebrow…'
                        }),
                        rt('h2', data.title, function (v) { h.setField('title', v); }, {
                            plain: true,
                            style: { marginBottom: '16px' },
                            placeholder: 'Title…'
                        }),
                        paragraphs.map(function (paragraph, index) {
                            return rt('p', paragraph, function (v) { h.setItem('paragraphs', index, v); }, {
                                key: 'para-' + index,
                                style: { color: index === 0 ? '#3f3f3f' : '#555', marginBottom: index === paragraphs.length - 1 ? null : '14px' },
                                placeholder: 'Paragraph text…'
                            });
                        })
                    ),
                    el('div', { className: 'img-cover', style: { minHeight: '420px', backgroundImage: "url('" + (data.imageUrl || '') + "')" } })
                )
            )
        );
    }

    function buildPropertyProfileSection(data) {
        var cards = (Array.isArray(data.cards) ? data.cards : []).map(function (card) {
            var tone = card.tone === 'excellent' || card.tone === 'unlikely' ? card.tone : 'good';
            return [
                '<article class="property-card">',
                '    <span class="property-status property-status--' + tone + '">' + richValue(card.status) + '</span>',
                '    <h3>' + richValue(card.title) + '</h3>',
                '    <p class="property-conversion">' + richValue(card.conversion) + '</p>',
                '    <p class="property-notes">' + richValue(card.notes) + '</p>',
                '</article>'
            ].join('');
        }).join('');

        return [
            '<section class="section section--dark" id="property-profile">',
            '    <div class="wrap">',
            '        <div style="text-align:center;margin-bottom:36px;">',
            '            <span class="eyebrow">' + richValue(data.eyebrow) + '</span>',
            '            <h2 style="color:#fff;">' + richValue(data.title) + '</h2>',
            '        </div>',
            '        <div class="property-cards">' + cards + '</div>',
            '        <p style="color:var(--color-muted);max-width:980px;margin:0 auto 12px;">' + richValue(data.summary) + '</p>',
            '        <p class="property-confirm">' + richValue(data.confirm) + '</p>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function propertyProfileEditRender(data, h) {
        var cards = Array.isArray(data.cards) ? data.cards : [];
        return el('section', { className: 'section section--dark', id: 'property-profile' },
            el('div', { className: 'wrap' },
                el('div', { style: { textAlign: 'center', marginBottom: '36px' } },
                    rt('span', data.eyebrow, function (v) { h.setField('eyebrow', v); }, {
                        plain: true,
                        className: 'eyebrow',
                        placeholder: 'Eyebrow…'
                    }),
                    rt('h2', data.title, function (v) { h.setField('title', v); }, {
                        plain: true,
                        style: { color: '#fff' },
                        placeholder: 'Title…'
                    })
                ),
                el('div', { className: 'property-cards' },
                    cards.map(function (card, index) {
                        var tone = card.tone === 'excellent' || card.tone === 'unlikely' ? card.tone : 'good';
                        return el('article', { key: 'card-' + index, className: 'property-card' },
                            rt('span', card.status, function (v) { h.setItemField('cards', index, 'status', v); }, {
                                plain: true,
                                key: 'x' + index,
                                className: 'property-status property-status--' + tone,
                                placeholder: 'Status…'
                            }),
                            rt('h3', card.title, function (v) { h.setItemField('cards', index, 'title', v); }, {
                                plain: true,
                                placeholder: 'Property type…'
                            }),
                            rt('p', card.conversion, function (v) { h.setItemField('cards', index, 'conversion', v); }, {
                                plain: true,
                                className: 'property-conversion',
                                placeholder: 'Conversion…'
                            }),
                            rt('p', card.notes, function (v) { h.setItemField('cards', index, 'notes', v); }, {
                                className: 'property-notes',
                                placeholder: 'Notes…'
                            })
                        );
                    })
                ),
                rt('p', data.summary, function (v) { h.setField('summary', v); }, {
                    style: { color: 'var(--color-muted)', maxWidth: '980px', margin: '0 auto 12px' },
                    placeholder: 'Summary…'
                }),
                rt('p', data.confirm, function (v) { h.setField('confirm', v); }, {
                    plain: true,
                    className: 'property-confirm',
                    placeholder: 'Confirmation…'
                })
            )
        );
    }

    function buildPlanningSection(data) {
        var authorities = (Array.isArray(data.authorities) ? data.authorities : []).map(function (row, index) {
            var openAttr = index === 0 ? ' open' : '';

            return [
                '<details class="planning-accordion-item"' + openAttr + '>',
                '    <summary class="planning-accordion-summary"><h3 class="planning-accordion-title">' + richValue(row.name) + '</h3></summary>',
                '    <div class="planning-accordion-content">',
                '        <p class="planning-accordion-meta">' + richValue(row.towns) + '</p>',
                '        <p class="planning-accordion-body">' + richValue(row.notes) + '</p>',
                '    </div>',
                '</details>'
            ].join('');
        }).join('');

        var pdItems = (Array.isArray(data.pdItems) ? data.pdItems : []).map(function (item) {
            return '<li><span class="chk">+</span>' + richValue(item) + '</li>';
        }).join('');

        var ppItems = (Array.isArray(data.ppItems) ? data.ppItems : []).map(function (item) {
            return '<li><span class="chk">-</span>' + richValue(item) + '</li>';
        }).join('');

        return [
            '<section class="section section--light" id="planning-surrey">',
            '    <div class="wrap">',
            '        <span class="eyebrow">' + richValue(data.eyebrow) + '</span>',
            '        <h2 style="margin-bottom:14px;">' + richValue(data.title) + '</h2>',
            '        <p style="color:#444;margin-bottom:14px;">' + richValue(data.intro1) + '</p>',
            '        <p style="color:#444;margin-bottom:24px;">' + richValue(data.intro2) + '</p>',
            '        <h3 style="margin-bottom:12px;">' + richValue(data.tableTitle) + '</h3>',
            '        <div class="planning-accordion" style="margin-bottom:24px;">' + authorities + '</div>',
            '        <div class="grid-2" style="gap:20px;">',
            '            <div class="card" style="border:1px solid #ddd8ce;">',
            '                <h3 style="margin-bottom:10px;">' + richValue(data.pdTitle) + '</h3>',
            '                <ul class="checklist" style="color:#444;">' + pdItems + '</ul>',
            '            </div>',
            '            <div class="card" style="border:1px solid #ddd8ce;">',
            '                <h3 style="margin-bottom:10px;">' + richValue(data.ppTitle) + '</h3>',
            '                <ul class="checklist" style="color:#444;">' + ppItems + '</ul>',
            '            </div>',
            '        </div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function planningEditRender(data, h) {
        var authorities = Array.isArray(data.authorities) ? data.authorities : [];
        var pdItems = Array.isArray(data.pdItems) ? data.pdItems : [];
        var ppItems = Array.isArray(data.ppItems) ? data.ppItems : [];
        return el('section', { className: 'section section--light', id: 'planning-surrey' },
            el('div', { className: 'wrap' },
                rt('span', data.eyebrow, function (v) { h.setField('eyebrow', v); }, {
                    plain: true,
                    className: 'eyebrow',
                    placeholder: 'Eyebrow…'
                }),
                rt('h2', data.title, function (v) { h.setField('title', v); }, {
                    plain: true,
                    style: { marginBottom: '14px' },
                    placeholder: 'Title…'
                }),
                rt('p', data.intro1, function (v) { h.setField('intro1', v); }, {
                    style: { color: '#444', marginBottom: '14px' },
                    placeholder: 'Intro paragraph 1…'
                }),
                rt('p', data.intro2, function (v) { h.setField('intro2', v); }, {
                    style: { color: '#444', marginBottom: '24px' },
                    placeholder: 'Intro paragraph 2…'
                }),
                rt('h3', data.tableTitle, function (v) { h.setField('tableTitle', v); }, {
                    plain: true,
                    style: { marginBottom: '12px' },
                    placeholder: 'Table title…'
                }),
                el('div', { className: 'planning-accordion', style: { marginBottom: '24px' } },
                    authorities.map(function (row, index) {
                        return el('details', { key: 'authority-' + index, className: 'planning-accordion-item', open: index === 0 },
                            el('summary', { className: 'planning-accordion-summary' },
                                rt('h3', row.name, function (v) { h.setItemField('authorities', index, 'name', v); }, {
                                    plain: true,
                                    className: 'planning-accordion-title',
                                    placeholder: 'Authority name…'
                                })
                            ),
                            el('div', { className: 'planning-accordion-content' },
                                rt('p', row.towns, function (v) { h.setItemField('authorities', index, 'towns', v); }, {
                                    className: 'planning-accordion-meta',
                                    placeholder: 'Key towns…'
                                }),
                                rt('p', row.notes, function (v) { h.setItemField('authorities', index, 'notes', v); }, {
                                    className: 'planning-accordion-body',
                                    placeholder: 'Considerations…'
                                })
                            )
                        );
                    })
                ),
                el('div', { className: 'grid-2', style: { gap: '20px' } },
                    el('div', { className: 'card', style: { border: '1px solid #ddd8ce' } },
                        rt('h3', data.pdTitle, function (v) { h.setField('pdTitle', v); }, {
                            plain: true,
                            style: { marginBottom: '10px' },
                            placeholder: 'Left card title…'
                        }),
                        el('ul', { className: 'checklist', style: { color: '#444' } },
                            pdItems.map(function (item, index) {
                                return el('li', { key: 'pd-' + index },
                                    el('span', { className: 'chk' }, '+'),
                                    rt('span', item, function (v) { h.setItem('pdItems', index, v); }, {
                                        placeholder: 'Checklist item…'
                                    })
                                );
                            })
                        )
                    ),
                    el('div', { className: 'card', style: { border: '1px solid #ddd8ce' } },
                        rt('h3', data.ppTitle, function (v) { h.setField('ppTitle', v); }, {
                            plain: true,
                            style: { marginBottom: '10px' },
                            placeholder: 'Right card title…'
                        }),
                        el('ul', { className: 'checklist', style: { color: '#444' } },
                            ppItems.map(function (item, index) {
                                return el('li', { key: 'pp-' + index },
                                    el('span', { className: 'chk' }, '-'),
                                    rt('span', item, function (v) { h.setItem('ppItems', index, v); }, {
                                        placeholder: 'Checklist item…'
                                    })
                                );
                            })
                        )
                    )
                )
            )
        );
    }

    function buildCollectionsSection(data) {
        var cards = Array.isArray(data.cards) ? data.cards : [];
        var rows = chunkArray(cards, 2).map(function (row, rowIndex, rowList) {
            var rowCards = row.map(function (card) {
                return [
                    '<div class="card" style="padding:0;overflow:hidden;">',
                    '    <div class="img-cover" style="min-height:220px;border-radius:0;background-image:url(\'' + escapeAttr(card.imageUrl) + '\');"></div>',
                    '    <div style="padding:22px;">',
                    '        <div class="badge" style="margin-bottom:8px;">' + richValue(card.label) + '</div>',
                    '        <h3 style="margin-bottom:6px;">' + richValue(card.title) + '</h3>',
                    '        <p style="color:#555;font-size:.9rem;">' + richValue(card.desc) + '</p>',
                    '    </div>',
                    '</div>'
                ].join('');
            }).join('');

            var margin = rowIndex === rowList.length - 1 ? '22px' : '18px';
            return '<div class="grid-2" style="margin-bottom:' + margin + ';">' + rowCards + '</div>';
        }).join('');

        return [
            '<section class="section section--dark" id="collections">',
            '    <div class="wrap">',
            '        <div style="text-align:center;margin-bottom:38px;">',
            '            <span class="eyebrow">' + richValue(data.eyebrow) + '</span>',
            '            <h2 style="color:#fff;">' + richValue(data.title) + '</h2>',
            '        </div>',
            '        ' + rows,
            '        <div style="text-align:center;"><a href="' + escapeAttr(data.viewAllUrl || '#') + '" class="btn btn--white">' + richValue(data.viewAllText) + '</a></div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function collectionsEditRender(data, h) {
        var cards = Array.isArray(data.cards) ? data.cards : [];
        var rows = chunkArray(cards, 2);
        return el('section', { className: 'section section--dark', id: 'collections' },
            el('div', { className: 'wrap' },
                el('div', { style: { textAlign: 'center', marginBottom: '38px' } },
                    rt('span', data.eyebrow, function (v) { h.setField('eyebrow', v); }, {
                        plain: true,
                        className: 'eyebrow',
                        placeholder: 'Eyebrow…'
                    }),
                    rt('h2', data.title, function (v) { h.setField('title', v); }, {
                        plain: true,
                        style: { color: '#fff' },
                        placeholder: 'Title…'
                    })
                ),
                rows.map(function (row, rowIndex) {
                    var margin = rowIndex === rows.length - 1 ? '22px' : '18px';
                    return el('div', { key: 'row-' + rowIndex, className: 'grid-2', style: { marginBottom: margin } },
                        row.map(function (card, colIndex) {
                            var cardIndex = rowIndex * 2 + colIndex;
                            return el('div', { key: 'card-' + cardIndex, className: 'card', style: { padding: 0, overflow: 'hidden' } },
                                el('div', { className: 'img-cover', style: { minHeight: '220px', borderRadius: 0, backgroundImage: "url('" + (card.imageUrl || '') + "')" } }),
                                el('div', { style: { padding: '22px' } },
                                    rt('div', card.label, function (v) { h.setItemField('cards', cardIndex, 'label', v); }, {
                                        plain: true,
                                        key: 'x' + cardIndex,
                                        className: 'badge',
                                        style: { marginBottom: '8px' },
                                        placeholder: 'Badge label…'
                                    }),
                                    rt('h3', card.title, function (v) { h.setItemField('cards', cardIndex, 'title', v); }, {
                                        plain: true,
                                        style: { marginBottom: '6px' },
                                        placeholder: 'Title…'
                                    }),
                                    rt('p', card.desc, function (v) { h.setItemField('cards', cardIndex, 'desc', v); }, {
                                        style: { color: '#555', fontSize: '.9rem' },
                                        placeholder: 'Description…'
                                    })
                                )
                            );
                        })
                    );
                }),
                el('div', { style: { textAlign: 'center' } },
                    rt('a', data.viewAllText, function (v) { h.setField('viewAllText', v); }, {
                        plain: true,
                        href: (data.viewAllUrl || '#'),
                        className: 'btn btn--white',
                        placeholder: 'View all link…'
                    })
                )
            )
        );
    }

    function buildPricingSection(data) {
        var cards = (Array.isArray(data.cards) ? data.cards : []).map(function (card) {
            var className = card.featured ? 'pricing-card pricing-card--featured' : 'pricing-card';
            return [
                '<article class="' + className + '">',
                '    <span class="pricing-badge">' + richValue(card.badge) + '</span>',
                '    <h3>' + richValue(card.title) + '</h3>',
                '    <p class="pricing-range">' + richValue(card.range) + '</p>',
                '    <p class="pricing-best">' + richValue(card.best) + '</p>',
                '</article>'
            ].join('');
        }).join('');

        return [
            '<section class="section section--light" id="pricing">',
            '    <div class="wrap">',
            '        <span class="eyebrow">' + richValue(data.eyebrow) + '</span>',
            '        <h2 style="margin-bottom:14px;">' + richValue(data.title) + '</h2>',
            '        <p style="color:#444;margin-bottom:20px;">' + richValue(data.intro) + '</p>',
            '        <div class="pricing-cards">' + cards + '</div>',
            '        <a href="' + escapeAttr(data.ctaUrl || '#calculator') + '" class="btn-cta btn-cta--solid">' + richValue(data.ctaText) + '</a>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function pricingEditRender(data, h) {
        var cards = Array.isArray(data.cards) ? data.cards : [];
        return el('section', { className: 'section section--light', id: 'pricing' },
            el('div', { className: 'wrap' },
                rt('span', data.eyebrow, function (v) { h.setField('eyebrow', v); }, {
                    plain: true,
                    className: 'eyebrow',
                    placeholder: 'Eyebrow…'
                }),
                rt('h2', data.title, function (v) { h.setField('title', v); }, {
                    plain: true,
                    style: { marginBottom: '14px' },
                    placeholder: 'Title…'
                }),
                rt('p', data.intro, function (v) { h.setField('intro', v); }, {
                    style: { color: '#444', marginBottom: '20px' },
                    placeholder: 'Intro…'
                }),
                el('div', { className: 'pricing-cards' },
                    cards.map(function (card, index) {
                        var className = card.featured ? 'pricing-card pricing-card--featured' : 'pricing-card';
                        return el('article', { key: 'card-' + index, className: className },
                            rt('span', card.badge, function (v) { h.setItemField('cards', index, 'badge', v); }, {
                                plain: true,
                                key: 'x' + index,
                                className: 'pricing-badge',
                                placeholder: 'Badge…'
                            }),
                            rt('h3', card.title, function (v) { h.setItemField('cards', index, 'title', v); }, {
                                plain: true,
                                placeholder: 'Title…'
                            }),
                            rt('p', card.range, function (v) { h.setItemField('cards', index, 'range', v); }, {
                                plain: true,
                                className: 'pricing-range',
                                placeholder: 'Price range…'
                            }),
                            rt('p', card.best, function (v) { h.setItemField('cards', index, 'best', v); }, {
                                className: 'pricing-best',
                                placeholder: 'Best for…'
                            })
                        );
                    })
                ),
                rt('a', data.ctaText, function (v) { h.setField('ctaText', v); }, {
                    plain: true,
                    href: (data.ctaUrl || '#calculator'),
                    className: 'btn-cta btn-cta--solid',
                    placeholder: 'CTA text…'
                })
            )
        );
    }

    function buildCalculatorSection(data) {
        return [
            '<section class="section section--dark" id="calculator">',
            '    <div class="wrap">',
            '        <div class="card--dark" style="text-align:center;"><span class="eyebrow">' + richValue(data.eyebrow) + '</span>',
            '            <h2 style="color:#fff;margin-bottom:10px;">' + richValue(data.title) + '</h2>',
            '            <p style="color:var(--color-muted);max-width:760px;margin:0 auto;">' + richValue(data.body) + '</p>',
            '        </div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function calculatorEditRender(data, h) {
        return el('section', { className: 'section section--dark', id: 'calculator' },
            el('div', { className: 'wrap' },
                el('div', { className: 'card--dark', style: { textAlign: 'center' } },
                    rt('span', data.eyebrow, function (v) { h.setField('eyebrow', v); }, {
                        plain: true,
                        className: 'eyebrow',
                        placeholder: 'Eyebrow…'
                    }),
                    rt('h2', data.title, function (v) { h.setField('title', v); }, {
                        plain: true,
                        style: { color: '#fff', marginBottom: '10px' },
                        placeholder: 'Title…'
                    }),
                    rt('p', data.body, function (v) { h.setField('body', v); }, {
                        style: { color: 'var(--color-muted)', maxWidth: '760px', margin: '0 auto' },
                        placeholder: 'Description…'
                    })
                )
            )
        );
    }

    function buildProjectsSection(data) {
        var cards = (Array.isArray(data.cards) ? data.cards : []).map(function (card) {
            return [
                '<div class="card">',
                '    <div class="img-cover" style="min-height:190px;background-image:url(\'' + escapeAttr(card.imageUrl) + '\');margin-bottom:14px;"></div>',
                '    <span class="badge" style="margin-bottom:10px;">' + richValue(card.badge) + '</span>',
                '    <h3 style="margin-bottom:8px;">' + richValue(card.title) + '</h3>',
                '</div>'
            ].join('');
        }).join('');

        return [
            '<section class="section section--light" id="projects">',
            '    <div class="wrap">',
            '        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:26px;">',
            '            <div><span class="eyebrow">' + richValue(data.eyebrow) + '</span><h2>' + richValue(data.title) + '</h2></div>',
            '            <a href="' + escapeAttr(data.viewAllUrl || '#') + '" class="btn btn--dark">' + richValue(data.viewAllText) + '</a>',
            '        </div>',
            '        <div class="grid-3">' + cards + '</div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function projectsEditRender(data, h) {
        var cards = Array.isArray(data.cards) ? data.cards : [];
        return el('section', { className: 'section section--light', id: 'projects' },
            el('div', { className: 'wrap' },
                el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap', marginBottom: '26px' } },
                    el('div', null,
                        rt('span', data.eyebrow, function (v) { h.setField('eyebrow', v); }, {
                            plain: true,
                            className: 'eyebrow',
                            placeholder: 'Eyebrow…'
                        }),
                        rt('h2', data.title, function (v) { h.setField('title', v); }, {
                            plain: true,
                            placeholder: 'Title…'
                        })
                    ),
                    rt('a', data.viewAllText, function (v) { h.setField('viewAllText', v); }, {
                        plain: true,
                        href: (data.viewAllUrl || '#'),
                        className: 'btn btn--dark',
                        placeholder: 'View all link…'
                    })
                ),
                el('div', { className: 'grid-3' },
                    cards.map(function (card, index) {
                        return el('div', { key: 'card-' + index, className: 'card' },
                            el('div', { className: 'img-cover', style: { minHeight: '190px', backgroundImage: "url('" + (card.imageUrl || '') + "')", marginBottom: '14px' } }),
                            rt('span', card.badge, function (v) { h.setItemField('cards', index, 'badge', v); }, {
                                plain: true,
                                key: 'x' + index,
                                className: 'badge',
                                style: { marginBottom: '10px' },
                                placeholder: 'Badge…'
                            }),
                            rt('h3', card.title, function (v) { h.setItemField('cards', index, 'title', v); }, {
                                plain: true,
                                style: { marginBottom: '8px' },
                                placeholder: 'Title…'
                            })
                        );
                    })
                )
            )
        );
    }

    function buildGlobalComponentsSection(data) {
        var cards = (Array.isArray(data.cards) ? data.cards : []).map(function (card) {
            return [
                '<div class="card--dark"><span class="eyebrow">' + richValue(card.eyebrow) + '</span>',
                '    <h3 style="color:#fff;margin-bottom:8px;">' + richValue(card.title) + '</h3>',
                '    <p style="color:var(--color-muted);font-size:.9rem;">' + richValue(card.desc) + '</p>',
                '</div>'
            ].join('');
        }).join('');

        return [
            '<section class="section section--dark" id="global-components">',
            '    <div class="wrap">',
            '        <div class="grid-3">' + cards + '</div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function globalComponentsEditRender(data, h) {
        var cards = Array.isArray(data.cards) ? data.cards : [];
        return el('section', { className: 'section section--dark', id: 'global-components' },
            el('div', { className: 'wrap' },
                el('div', { className: 'grid-3' },
                    cards.map(function (card, index) {
                        return el('div', { key: 'card-' + index, className: 'card--dark' },
                            rt('span', card.eyebrow, function (v) { h.setItemField('cards', index, 'eyebrow', v); }, {
                                plain: true,
                                key: 'x' + index,
                                className: 'eyebrow',
                                placeholder: 'Eyebrow…'
                            }),
                            rt('h3', card.title, function (v) { h.setItemField('cards', index, 'title', v); }, {
                                plain: true,
                                style: { color: '#fff', marginBottom: '8px' },
                                placeholder: 'Title…'
                            }),
                            rt('p', card.desc, function (v) { h.setItemField('cards', index, 'desc', v); }, {
                                style: { color: 'var(--color-muted)', fontSize: '.9rem' },
                                placeholder: 'Description…'
                            })
                        );
                    })
                )
            )
        );
    }

    function buildNearbyAreasSection(data) {
        var areas = (Array.isArray(data.areas) ? data.areas : []).map(function (area) {
            return '<a href="' + escapeAttr(area.url || '#') + '" class="btn-cta" style="background:#fff;border:1px solid #ddd8ce;color:#333;">' + richValue(area.text) + '</a>';
        }).join('');

        return [
            '<section class="section section--light" id="areas-nearby">',
            '    <div class="wrap" style="text-align:center;"><span class="eyebrow">' + richValue(data.eyebrow) + '</span>',
            '        <h2 style="margin-bottom:12px;">' + richValue(data.title) + '</h2>',
            '        <p style="max-width:760px;margin:0 auto 20px;color:#555;">' + richValue(data.description) + '</p>',
            '        <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">' + areas + '</div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function nearbyAreasEditRender(data, h) {
        var areas = Array.isArray(data.areas) ? data.areas : [];
        return el('section', { className: 'section section--light', id: 'areas-nearby' },
            el('div', { className: 'wrap', style: { textAlign: 'center' } },
                rt('span', data.eyebrow, function (v) { h.setField('eyebrow', v); }, {
                    plain: true,
                    className: 'eyebrow',
                    placeholder: 'Eyebrow…'
                }),
                rt('h2', data.title, function (v) { h.setField('title', v); }, {
                    plain: true,
                    style: { marginBottom: '12px' },
                    placeholder: 'Title…'
                }),
                rt('p', data.description, function (v) { h.setField('description', v); }, {
                    style: { maxWidth: '760px', margin: '0 auto 20px', color: '#555' },
                    placeholder: 'Description…'
                }),
                el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' } },
                    areas.map(function (area, index) {
                        return rt('a', area.text, function (v) { h.setItemField('areas', index, 'text', v); }, {
                            plain: true,
                            key: 'x' + index,
                            href: (area.url || '#'),
                            className: 'btn-cta',
                            style: { background: '#fff', border: '1px solid #ddd8ce', color: '#333' },
                            placeholder: 'Area…'
                        });
                    })
                )
            )
        );
    }

    function buildContactSection(data) {
        var pills = (Array.isArray(data.pills) ? data.pills : []).map(function (pill) {
            return '<span class="pill">' + richValue(pill) + '</span>';
        }).join('');

        return [
            '<section class="section section--dark" id="contact" style="position:relative;overflow:hidden;">',
            '    <div class="img-cover" style="position:absolute;inset:0;border-radius:0;background-image:url(\'' + escapeAttr(data.bgImageUrl) + '\');"></div>',
            '    <div style="position:absolute;inset:0;background:rgba(30,30,30,.66);"></div>',
            '    <div class="wrap" style="position:relative;z-index:2;"><span class="eyebrow">' + richValue(data.eyebrow) + '</span>',
            '        <h2 style="color:#fff;max-width:760px;margin-bottom:12px;">' + richValue(data.title) + '</h2>',
            '        <p style="color:var(--color-muted);max-width:820px;margin-bottom:22px;">' + richValue(data.description) + '</p>',
            '        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:18px;"><a href="' + escapeAttr(data.cta1Url || '#') + '" class="btn-cta btn-cta--solid">' + richValue(data.cta1Text) + '</a><a href="' + escapeAttr(data.cta2Url || '#calculator') + '" class="btn btn--white">' + richValue(data.cta2Text) + '</a></div>',
            '        <div class="pill-row" style="margin-bottom:16px;">' + pills + '</div>',
            '        <p style="color:#fff;font-weight:700;">' + richValue(data.footerText) + '</p>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function contactEditRender(data, h) {
        var pills = Array.isArray(data.pills) ? data.pills : [];
        return el('section', { className: 'section section--dark', id: 'contact', style: { position: 'relative', overflow: 'hidden' } },
            el('div', { className: 'img-cover', style: { position: 'absolute', inset: 0, borderRadius: 0, backgroundImage: "url('" + (data.bgImageUrl || '') + "')" } }),
            el('div', { style: { position: 'absolute', inset: 0, background: 'rgba(30,30,30,.66)' } }),
            el('div', { className: 'wrap', style: { position: 'relative', zIndex: 2 } },
                rt('span', data.eyebrow, function (v) { h.setField('eyebrow', v); }, {
                    plain: true,
                    className: 'eyebrow',
                    placeholder: 'Eyebrow…'
                }),
                rt('h2', data.title, function (v) { h.setField('title', v); }, {
                    plain: true,
                    style: { color: '#fff', maxWidth: '760px', marginBottom: '12px' },
                    placeholder: 'Title…'
                }),
                rt('p', data.description, function (v) { h.setField('description', v); }, {
                    style: { color: 'var(--color-muted)', maxWidth: '820px', marginBottom: '22px' },
                    placeholder: 'Description…'
                }),
                el('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' } },
                    rt('a', data.cta1Text, function (v) { h.setField('cta1Text', v); }, {
                        plain: true,
                        href: (data.cta1Url || '#'),
                        className: 'btn-cta btn-cta--solid',
                        placeholder: 'Primary CTA…'
                    }),
                    rt('a', data.cta2Text, function (v) { h.setField('cta2Text', v); }, {
                        plain: true,
                        href: (data.cta2Url || '#calculator'),
                        className: 'btn btn--white',
                        placeholder: 'Secondary CTA…'
                    })
                ),
                el('div', { className: 'pill-row', style: { marginBottom: '16px' } },
                    pills.map(function (pill, index) {
                        return rt('span', pill, function (v) { h.setItem('pills', index, v); }, {
                            plain: true,
                            key: 'pill-' + index,
                            className: 'pill',
                            placeholder: 'Pill…'
                        });
                    })
                ),
                rt('p', data.footerText, function (v) { h.setField('footerText', v); }, {
                    plain: true,
                    style: { color: '#fff', fontWeight: '700' },
                    placeholder: 'Footer text…'
                })
            )
        );
    }

    function buildFaqSection(data) {
        var faqs = Array.isArray(data.faqs) ? data.faqs : [];
        var hasOpen = faqs.some(function (faq) {
            return !!faq.open;
        });

        var itemsHtml = faqs.map(function (faq, index) {
            var isOpen = hasOpen ? !!faq.open : index === 0;
            var className = isOpen ? 'faq-item open' : 'faq-item';
            var extraStyle = index === faqs.length - 1 ? ' style="border-bottom:none;"' : '';

            return [
                '<div class="' + className + '"' + extraStyle + '>',
                '    <div class="faq-q">' + richValue(faq.question) + '<span class="faq-toggle"></span></div>',
                '    <div class="faq-a">' + richValue(faq.answer) + '</div>',
                '</div>'
            ].join('');
        }).join('');

        return [
            '<section class="section section--dark" id="faq-surrey">',
            '    <div class="wrap">',
            '        <span class="eyebrow">' + richValue(data.eyebrow) + '</span>',
            '        <h2 style="color:#fff;margin-bottom:24px;">' + richValue(data.title) + '</h2>',
            '        ' + itemsHtml,
            '    </div>',
            '</section>'
        ].join('');
    }

    function faqEditRender(data, h) {
        var faqs = Array.isArray(data.faqs) ? data.faqs : [];
        var hasOpen = faqs.some(function (faq) {
            return !!faq.open;
        });
        return el('section', { className: 'section section--dark', id: 'faq-surrey' },
            el('div', { className: 'wrap' },
                rt('span', data.eyebrow, function (v) { h.setField('eyebrow', v); }, {
                    plain: true,
                    className: 'eyebrow',
                    placeholder: 'Eyebrow…'
                }),
                rt('h2', data.title, function (v) { h.setField('title', v); }, {
                    plain: true,
                    style: { color: '#fff', marginBottom: '24px' },
                    placeholder: 'Title…'
                }),
                faqs.map(function (faq, index) {
                    var isOpen = hasOpen ? !!faq.open : index === 0;
                    var className = isOpen ? 'faq-item open' : 'faq-item';
                    var itemProps = { key: 'faq-' + index, className: className };
                    if (index === faqs.length - 1) {
                        itemProps.style = { borderBottom: 'none' };
                    }
                    return el('div', itemProps,
                        el('div', { className: 'faq-q' },
                            rt('span', faq.question, function (v) { h.setItemField('faqs', index, 'question', v); }, {
                                placeholder: 'Question…'
                            }),
                            el('span', { className: 'faq-toggle' })
                        ),
                        rt('div', faq.answer, function (v) { h.setItemField('faqs', index, 'answer', v); }, {
                            className: 'faq-a',
                            placeholder: 'Answer…'
                        })
                    );
                })
            )
        );
    }

    var toneOptions = [
        { label: 'Excellent', value: 'excellent' },
        { label: 'Good', value: 'good' },
        { label: 'Unlikely', value: 'unlikely' }
    ];

    var blockConfigs = {
        'myloft/single-area-hero': {
            title: 'Single Area - Hero',
            icon: 'cover-image',
            defaults: {
                title: 'Loft Conversions Surrey',
                subtitle: 'Designer loft conversions for Surrey\'s period homes and family properties. Six signature interior collections, fixed pricing, and 6-10 week delivery - from Weybridge to Kingston, Esher to Woking.',
                primaryCtaText: 'Get Instant Estimate',
                primaryCtaUrl: '#calculator',
                secondaryCtaText: 'Explore Designer Collections ->',
                secondaryCtaUrl: '#collections',
                heroImageUrl: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Richmond-construction.jpeg',
                pills: [
                    'Fixed pricing from day one',
                    'Six designer collections included',
                    '6-10 week delivery',
                    'Free survey - no commitment'
                ]
            },
            fields: [
                { key: 'title', label: 'Title' },
                { key: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 4 },
                { key: 'primaryCtaText', label: 'Primary CTA Text' },
                { key: 'primaryCtaUrl', label: 'Primary CTA URL' },
                { key: 'secondaryCtaText', label: 'Secondary CTA Text' },
                { key: 'secondaryCtaUrl', label: 'Secondary CTA URL' },
                { key: 'heroImageUrl', label: 'Background Image URL' }
            ],
            repeaters: [
                {
                    key: 'pills',
                    label: 'Hero Pills',
                    itemLabel: 'Pill',
                    addLabel: 'Add Pill',
                    itemType: 'string',
                    defaultItem: '',
                    itemField: { label: 'Pill Text' }
                }
            ],
            build: buildHeroSection,
            editRender: heroEditRender
        },
        'myloft/single-area-trust-bar': {
            title: 'Single Area - Trust Bar',
            icon: 'minus',
            defaults: {
                metrics: [
                    'Serving Surrey & South West London',
                    'Completed projects across the region',
                    '9.4/10 customer satisfaction',
                    'Fixed price guarantee - no surprises'
                ]
            },
            fields: [],
            repeaters: [
                {
                    key: 'metrics',
                    label: 'Trust Metrics',
                    itemLabel: 'Metric',
                    addLabel: 'Add Metric',
                    itemType: 'string',
                    defaultItem: '',
                    itemField: { label: 'Metric Text' }
                }
            ],
            build: buildTrustBarSection,
            editRender: trustBarEditRender
        },
        'myloft/single-area-intro': {
            title: 'Single Area - Intro',
            icon: 'text-page',
            defaults: {
                eyebrow: 'Why Surrey',
                title: 'Loft Conversions in Surrey',
                imageUrl: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Kew.jpg',
                paragraphs: [
                    'Surrey homeowners are making a straightforward calculation: the cost of moving to a larger property - stamp duty, agent fees, legal costs, disruption - often exceeds the cost of a well-executed loft conversion. With property values across the county ranging from GBP 600k in Woking to well over GBP 1.5M in Cobham and Oxshott, the financial case for converting rather than moving is compelling.',
                    'The demand for additional space has also shifted in character. Since hybrid working became the norm, the home office has become one of the most requested loft uses across Surrey. Families in Twickenham and Surbiton are adding nurseries and children\'s rooms. Couples in Weybridge and Esher are creating master suites and dressing rooms. The brief varies - but the underlying need is the same: more considered, better-designed space.',
                    'Surrey\'s housing stock is well suited to loft conversion. Victorian and Edwardian terraces dominate in Kingston, Surbiton, and the inner Surrey towns. Larger Edwardian and inter-war semis and detached properties are common across Weybridge, Esher, and Cobham. Most properties have traditional cut timber roofs, good ridge heights, and manageable rear elevations - the foundations of a straightforward conversion.',
                    'My Loft brings designer-led interiors and fixed pricing to Surrey homeowners who want the quality of a bespoke renovation without the cost, complexity, or uncertainty that typically comes with it.'
                ]
            },
            fields: [
                { key: 'eyebrow', label: 'Eyebrow' },
                { key: 'title', label: 'Title' },
                { key: 'imageUrl', label: 'Image URL' }
            ],
            repeaters: [
                {
                    key: 'paragraphs',
                    label: 'Paragraphs',
                    itemLabel: 'Paragraph',
                    addLabel: 'Add Paragraph',
                    itemType: 'string',
                    defaultItem: '',
                    itemField: { label: 'Paragraph Text', type: 'textarea', rows: 4 }
                }
            ],
            build: buildIntroSection,
            editRender: introEditRender
        },
        'myloft/single-area-property-profile': {
            title: 'Single Area - Property Profile',
            icon: 'grid-view',
            defaults: {
                eyebrow: 'Property Profile',
                title: 'Is Your Surrey Property Suitable for a Loft Conversion?',
                summary: 'The most common conversion across Surrey is the rear dormer - particularly in the Victorian and Edwardian terrace and semi stock of Kingston, Surbiton, Twickenham, and Walton on Thames. In the larger detached properties of Weybridge, Esher, and Cobham, hip-to-gable conversions with rear dormers are more typical, maximising volume and creating substantial additional floor area.',
                confirm: 'We confirm suitability at your free survey. No commitment required.',
                cards: [
                    {
                        status: 'Excellent',
                        tone: 'excellent',
                        title: 'Victorian Terrace',
                        conversion: 'Rear Dormer',
                        notes: 'Dense in Kingston, Surbiton, Walton. Good ridge heights. Traditional cut roofs.'
                    },
                    {
                        status: 'Excellent',
                        tone: 'excellent',
                        title: 'Edwardian Semi-Detached',
                        conversion: 'Dormer or Hip-to-Gable',
                        notes: 'Common across the county. Hipped roof ends suit hip-to-gable well.'
                    },
                    {
                        status: 'Good',
                        tone: 'good',
                        title: 'Inter-War Semi-Detached',
                        conversion: 'Dormer or Hip-to-Gable',
                        notes: 'Check for truss roof construction. Structural modification may be needed (+GBP 10-15k).'
                    },
                    {
                        status: 'Excellent',
                        tone: 'excellent',
                        title: 'Detached (Edwardian/Inter-War)',
                        conversion: 'Hip-to-Gable, Mansard, or L-Shaped',
                        notes: 'Most flexibility. Common in Weybridge, Esher, Cobham, and Oxshott.'
                    },
                    {
                        status: 'Good',
                        tone: 'good',
                        title: '1960s-80s Detached',
                        conversion: 'Dormer',
                        notes: 'Truss roofs are common. Structural modification is typically required.'
                    },
                    {
                        status: 'Unlikely',
                        tone: 'unlikely',
                        title: 'New-Build',
                        conversion: 'Not Typically Applicable',
                        notes: 'Modern truss roofs and restricted permitted development. Assess case by case.'
                    }
                ]
            },
            fields: [
                { key: 'eyebrow', label: 'Eyebrow' },
                { key: 'title', label: 'Title' },
                { key: 'summary', label: 'Summary Text', type: 'textarea', rows: 4 },
                { key: 'confirm', label: 'Confirmation Text' }
            ],
            repeaters: [
                {
                    key: 'cards',
                    label: 'Property Cards',
                    itemLabel: 'Card',
                    addLabel: 'Add Card',
                    itemType: 'object',
                    defaultItem: {
                        status: 'Good',
                        tone: 'good',
                        title: '',
                        conversion: '',
                        notes: ''
                    },
                    fields: [
                        { key: 'status', label: 'Status Label' },
                        { key: 'tone', label: 'Status Color', type: 'select', options: toneOptions },
                        { key: 'title', label: 'Property Type' },
                        { key: 'conversion', label: 'Most Common Conversion' },
                        { key: 'notes', label: 'Notes', type: 'textarea', rows: 3 }
                    ]
                }
            ],
            build: buildPropertyProfileSection,
            editRender: propertyProfileEditRender
        },
        'myloft/single-area-planning': {
            title: 'Single Area - Planning',
            icon: 'clipboard',
            defaults: {
                eyebrow: 'Local Planning Notes',
                title: 'Planning Permission for Loft Conversions in Surrey',
                intro1: 'The majority of Surrey loft conversions proceed under permitted development rights - no planning application required. Most rear dormers on houses that have not exhausted their permitted development allowance qualify automatically, provided they meet standard size and material conditions.',
                intro2: 'That said, Surrey covers multiple local planning authorities - each with its own policies, conservation areas, and sensitivities. Knowing which authority covers your property, and what local restrictions apply, is an important first step.',
                tableTitle: 'Surrey Planning Authorities We Work With',
                pdTitle: 'Permitted Development: When No Application Is Needed',
                ppTitle: 'Planning Permission Required When',
                authorities: [
                    {
                        name: 'Elmbridge Borough Council',
                        towns: 'Weybridge, Esher, Cobham, Walton on Thames, Thames Ditton, Molesey',
                        notes: 'Generally permissive outside Green Belt. Several riverside conservation areas.'
                    },
                    {
                        name: 'Kingston upon Thames',
                        towns: 'Kingston, Surbiton, New Malden',
                        notes: 'London Borough - different PD rules apply in some wards. Several conservation areas.'
                    },
                    {
                        name: 'Woking Borough Council',
                        towns: 'Woking, Chobham, Pyrford',
                        notes: 'Mix of urban and Green Belt. Generally supportive within existing curtilage.'
                    },
                    {
                        name: 'Runnymede Borough Council',
                        towns: 'Weybridge (parts), Chertsey, Addlestone',
                        notes: 'Green Belt boundary relevant for some outlying properties.'
                    },
                    {
                        name: 'Surrey Heath Borough Council',
                        towns: 'Camberley, Lightwater, Chobham, Ascot (parts)',
                        notes: 'Mix of suburban and semi-rural. Standard PD rules apply in most areas.'
                    },
                    {
                        name: 'Windsor & Maidenhead',
                        towns: 'Ascot, Sunningdale, Sunninghill',
                        notes: 'Royal Borough - some areas with specific character protections.'
                    }
                ],
                pdItems: [
                    'Rear dormers within volume limits (40m3 terraced, 50m3 detached)',
                    'Materials similar to existing property',
                    'Does not exceed original ridge height',
                    'Property not in a conservation area or listed',
                    'Article 4 direction not in force for your property'
                ],
                ppItems: [
                    'Property is within a designated conservation area',
                    'Property is a listed building',
                    'Front or side dormers proposed',
                    'Dormer exceeds permitted development volume limits',
                    'Green Belt designation applies (rare but worth confirming)'
                ]
            },
            fields: [
                { key: 'eyebrow', label: 'Eyebrow' },
                { key: 'title', label: 'Title' },
                { key: 'intro1', label: 'Intro Paragraph 1', type: 'textarea', rows: 4 },
                { key: 'intro2', label: 'Intro Paragraph 2', type: 'textarea', rows: 4 },
                { key: 'tableTitle', label: 'Table Title' },
                { key: 'pdTitle', label: 'Left Card Title' },
                { key: 'ppTitle', label: 'Right Card Title' }
            ],
            repeaters: [
                {
                    key: 'authorities',
                    label: 'Planning Authority Rows',
                    itemLabel: 'Authority',
                    addLabel: 'Add Authority',
                    itemType: 'object',
                    defaultItem: {
                        name: '',
                        towns: '',
                        notes: ''
                    },
                    fields: [
                        { key: 'name', label: 'Authority Name' },
                        { key: 'towns', label: 'Key Towns', type: 'textarea', rows: 3 },
                        { key: 'notes', label: 'Considerations', type: 'textarea', rows: 3 }
                    ]
                },
                {
                    key: 'pdItems',
                    label: 'Permitted Development Checklist',
                    itemLabel: 'Item',
                    addLabel: 'Add Permitted Item',
                    itemType: 'string',
                    defaultItem: '',
                    itemField: { label: 'Checklist Item', type: 'textarea', rows: 2 }
                },
                {
                    key: 'ppItems',
                    label: 'Planning Permission Checklist',
                    itemLabel: 'Item',
                    addLabel: 'Add Permission Item',
                    itemType: 'string',
                    defaultItem: '',
                    itemField: { label: 'Checklist Item', type: 'textarea', rows: 2 }
                }
            ],
            build: buildPlanningSection,
            editRender: planningEditRender
        },
        'myloft/single-area-collections': {
            title: 'Single Area - Collections',
            icon: 'images-alt2',
            defaults: {
                eyebrow: 'Recommended Collections',
                title: 'Designer Loft Conversion Collections for Surrey Homes',
                viewAllText: 'View All Six Collections ->',
                viewAllUrl: '#',
                cards: [
                    {
                        imageUrl: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Chelsea.jpg',
                        label: 'James Chen Collection',
                        title: 'Heritage',
                        desc: 'Warm greys, deep greens, natural wood. Particularly popular in Weybridge, Esher, and Cobham.'
                    },
                    {
                        imageUrl: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Putney-2-scaled.jpg',
                        label: 'Priya Sharma Collection',
                        title: 'Haven',
                        desc: 'Stone, linen, warm timber, botanical accents. A calm retreat aesthetic for Surrey homes.'
                    },
                    {
                        imageUrl: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Richmond-scaled.jpg',
                        label: 'Olivia Hart Collection',
                        title: 'Serene',
                        desc: 'Warm whites, pale oak, soft grey. A favourite in Kingston, Surbiton, and Twickenham.'
                    },
                    {
                        imageUrl: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Chiswick-scaled.jpg',
                        label: 'Priya Sharma Collection',
                        title: 'Family',
                        desc: 'Soft pastels, natural woods, white. Designed for nurseries and children\'s rooms.'
                    }
                ]
            },
            fields: [
                { key: 'eyebrow', label: 'Eyebrow' },
                { key: 'title', label: 'Title' },
                { key: 'viewAllText', label: 'View All Link Text' },
                { key: 'viewAllUrl', label: 'View All Link URL' }
            ],
            repeaters: [
                {
                    key: 'cards',
                    label: 'Collection Cards',
                    itemLabel: 'Card',
                    addLabel: 'Add Collection Card',
                    itemType: 'object',
                    defaultItem: {
                        imageUrl: '',
                        label: '',
                        title: '',
                        desc: ''
                    },
                    fields: [
                        { key: 'imageUrl', label: 'Image URL' },
                        { key: 'label', label: 'Badge Label' },
                        { key: 'title', label: 'Card Title' },
                        { key: 'desc', label: 'Card Description', type: 'textarea', rows: 3 }
                    ]
                }
            ],
            build: buildCollectionsSection,
            editRender: collectionsEditRender
        },
        'myloft/single-area-pricing': {
            title: 'Single Area - Pricing',
            icon: 'money-alt',
            defaults: {
                eyebrow: 'Local Pricing',
                title: 'Loft Conversion Costs in Surrey',
                intro: 'Our Surrey loft conversions typically range from GBP 70,000 to GBP 105,000 - fixed price, all-in, after your free survey.',
                ctaText: 'Get Instant Estimate',
                ctaUrl: '#calculator',
                cards: [
                    {
                        badge: 'Entry Level',
                        title: 'Velux / Roof Light',
                        range: 'From GBP 38,000',
                        best: 'Properties with sufficient existing headroom and minimal structural disruption.',
                        featured: false
                    },
                    {
                        badge: 'Most Popular',
                        title: 'Rear Dormer',
                        range: 'GBP 70,000-GBP 92,000',
                        best: 'Best for most Victorian and Edwardian terraces and semis across Surrey.',
                        featured: true
                    },
                    {
                        badge: 'High Volume',
                        title: 'Hip-to-Gable + Dormer',
                        range: 'GBP 82,000-GBP 100,000',
                        best: 'Ideal for Edwardian and inter-war semis and detached homes to maximize volume.',
                        featured: false
                    },
                    {
                        badge: 'Two Rooms',
                        title: 'L-Shaped Dormer',
                        range: 'GBP 88,000-GBP 105,000',
                        best: 'Works well for Victorian terraces with rear additions, often allowing two rooms.',
                        featured: false
                    },
                    {
                        badge: 'Premium',
                        title: 'Mansard',
                        range: 'GBP 95,000-GBP 115,000',
                        best: 'Maximum internal volume and a strong option where planning approval is achievable.',
                        featured: false
                    }
                ]
            },
            fields: [
                { key: 'eyebrow', label: 'Eyebrow' },
                { key: 'title', label: 'Title' },
                { key: 'intro', label: 'Intro Text', type: 'textarea', rows: 3 },
                { key: 'ctaText', label: 'CTA Text' },
                { key: 'ctaUrl', label: 'CTA URL' }
            ],
            repeaters: [
                {
                    key: 'cards',
                    label: 'Pricing Cards',
                    itemLabel: 'Card',
                    addLabel: 'Add Pricing Card',
                    itemType: 'object',
                    defaultItem: {
                        badge: '',
                        title: '',
                        range: '',
                        best: '',
                        featured: false
                    },
                    fields: [
                        { key: 'badge', label: 'Badge Label' },
                        { key: 'title', label: 'Card Title' },
                        { key: 'range', label: 'Price Range' },
                        { key: 'best', label: 'Best For', type: 'textarea', rows: 3 },
                        { key: 'featured', label: 'Featured Card', type: 'toggle' }
                    ]
                }
            ],
            build: buildPricingSection,
            editRender: pricingEditRender
        },
        'myloft/single-area-calculator': {
            title: 'Single Area - Calculator',
            icon: 'calculator',
            defaults: {
                eyebrow: 'Global Component',
                title: 'Pricing Calculator',
                body: 'Global component - pull in from shared block.'
            },
            fields: [
                { key: 'eyebrow', label: 'Eyebrow' },
                { key: 'title', label: 'Title' },
                { key: 'body', label: 'Description', type: 'textarea', rows: 3 }
            ],
            repeaters: [],
            build: buildCalculatorSection,
            editRender: calculatorEditRender
        },
        'myloft/single-area-projects': {
            title: 'Single Area - Projects',
            icon: 'portfolio',
            defaults: {
                eyebrow: 'Local Projects',
                title: 'Our Loft Conversion Services Across Surrey',
                viewAllText: 'View All Projects ->',
                viewAllUrl: '#',
                cards: [
                    {
                        imageUrl: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-11-scaled-1.jpg',
                        badge: 'Completed near Surrey',
                        title: 'Serene Collection - Twickenham Victorian terrace'
                    },
                    {
                        imageUrl: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-10-scaled-1.jpg',
                        badge: 'Completed near Surrey',
                        title: 'Heritage Collection - Richmond Edwardian semi-detached'
                    },
                    {
                        imageUrl: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-9-scaled-1.jpg',
                        badge: 'Completed near Surrey',
                        title: 'Family Collection - Kingston Victorian terrace'
                    }
                ]
            },
            fields: [
                { key: 'eyebrow', label: 'Eyebrow' },
                { key: 'title', label: 'Title' },
                { key: 'viewAllText', label: 'View All Link Text' },
                { key: 'viewAllUrl', label: 'View All Link URL' }
            ],
            repeaters: [
                {
                    key: 'cards',
                    label: 'Project Cards',
                    itemLabel: 'Card',
                    addLabel: 'Add Project Card',
                    itemType: 'object',
                    defaultItem: {
                        imageUrl: '',
                        badge: '',
                        title: ''
                    },
                    fields: [
                        { key: 'imageUrl', label: 'Image URL' },
                        { key: 'badge', label: 'Badge Text' },
                        { key: 'title', label: 'Project Title' }
                    ]
                }
            ],
            build: buildProjectsSection,
            editRender: projectsEditRender
        },
        'myloft/single-area-global-components': {
            title: 'Single Area - Global Components',
            icon: 'screenoptions',
            defaults: {
                cards: [
                    {
                        eyebrow: 'Global Component',
                        title: '8-Step Process',
                        desc: 'Pull in from shared block.'
                    },
                    {
                        eyebrow: 'Global Component',
                        title: 'What\'s Included',
                        desc: 'Pull in from shared block.'
                    },
                    {
                        eyebrow: 'Global Component',
                        title: 'Planning & Building Regulations',
                        desc: 'Pull in from shared block.'
                    }
                ]
            },
            fields: [],
            repeaters: [
                {
                    key: 'cards',
                    label: 'Global Component Cards',
                    itemLabel: 'Card',
                    addLabel: 'Add Global Card',
                    itemType: 'object',
                    defaultItem: {
                        eyebrow: 'Global Component',
                        title: '',
                        desc: ''
                    },
                    fields: [
                        { key: 'eyebrow', label: 'Eyebrow' },
                        { key: 'title', label: 'Title' },
                        { key: 'desc', label: 'Description', type: 'textarea', rows: 3 }
                    ]
                }
            ],
            build: buildGlobalComponentsSection,
            editRender: globalComponentsEditRender
        },
        'myloft/single-area-nearby-areas': {
            title: 'Single Area - Nearby Areas',
            icon: 'location-alt',
            defaults: {
                eyebrow: 'Nearby Areas',
                title: 'Surrey Areas We Serve',
                description: 'We work with homeowners across Surrey and the surrounding area. Explore our local area guides or book a free survey wherever you are.',
                areas: [
                    { text: 'Walton on Thames', url: '#' },
                    { text: 'Weybridge', url: '#' },
                    { text: 'Esher', url: '#' },
                    { text: 'Cobham', url: '#' },
                    { text: 'Oxshott', url: '#' },
                    { text: 'Ascot', url: '#' },
                    { text: 'Lightwater', url: '#' },
                    { text: 'Chobham', url: '#' },
                    { text: 'Woking', url: '#' }
                ]
            },
            fields: [
                { key: 'eyebrow', label: 'Eyebrow' },
                { key: 'title', label: 'Title' },
                { key: 'description', label: 'Description', type: 'textarea', rows: 3 }
            ],
            repeaters: [
                {
                    key: 'areas',
                    label: 'Area Buttons',
                    itemLabel: 'Area',
                    addLabel: 'Add Area Button',
                    itemType: 'object',
                    defaultItem: {
                        text: '',
                        url: '#'
                    },
                    fields: [
                        { key: 'text', label: 'Button Text' },
                        { key: 'url', label: 'Button URL' }
                    ]
                }
            ],
            build: buildNearbyAreasSection,
            editRender: nearbyAreasEditRender
        },
        'myloft/single-area-contact': {
            title: 'Single Area - Contact CTA',
            icon: 'megaphone',
            defaults: {
                eyebrow: 'Final CTA',
                title: 'Ready to Transform Your Surrey Home?',
                description: 'Book a free survey. We visit your property, confirm feasibility, and deliver a fixed-price proposal within 48 hours. No commitment required. No pressure.',
                bgImageUrl: 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/03/Hartington-5-scaled-1.jpg',
                cta1Text: 'Book Free Survey',
                cta1Url: '#',
                cta2Text: 'Get Instant Estimate ->',
                cta2Url: '#calculator',
                footerText: 'My Loft - by Masterpiece Construction',
                pills: [
                    'Free survey at your property',
                    'Fixed-price proposal within 48 hours',
                    'No commitment required',
                    'Designer collections included at no extra cost'
                ]
            },
            fields: [
                { key: 'eyebrow', label: 'Eyebrow' },
                { key: 'title', label: 'Title' },
                { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
                { key: 'bgImageUrl', label: 'Background Image URL' },
                { key: 'cta1Text', label: 'Primary CTA Text' },
                { key: 'cta1Url', label: 'Primary CTA URL' },
                { key: 'cta2Text', label: 'Secondary CTA Text' },
                { key: 'cta2Url', label: 'Secondary CTA URL' },
                { key: 'footerText', label: 'Footer Text' }
            ],
            repeaters: [
                {
                    key: 'pills',
                    label: 'CTA Pills',
                    itemLabel: 'Pill',
                    addLabel: 'Add CTA Pill',
                    itemType: 'string',
                    defaultItem: '',
                    itemField: { label: 'Pill Text' }
                }
            ],
            build: buildContactSection,
            editRender: contactEditRender
        },
        'myloft/single-area-faq': {
            title: 'Single Area - FAQ',
            icon: 'editor-help',
            defaults: {
                eyebrow: 'Local FAQs',
                title: 'Loft Conversion FAQs - Surrey',
                faqs: [
                    {
                        question: 'How much does a loft conversion cost in Surrey?',
                        answer: 'Most Surrey loft conversions with My Loft range from GBP 70,000 to GBP 105,000 - fixed price, all-in. The exact figure depends on your property type, conversion type, and chosen designer collection. Larger detached properties in Weybridge, Cobham, and Esher typically sit toward the upper end of the range. You receive a fixed-price proposal within 48 hours of your free survey.',
                        open: true
                    },
                    {
                        question: 'Do I need planning permission for a loft conversion in Surrey?',
                        answer: 'Most Surrey loft conversions proceed under permitted development - no planning application required. The main exceptions are properties within conservation areas, listed buildings, and front or side dormers.',
                        open: false
                    },
                    {
                        question: 'Does the Green Belt affect loft conversions in Surrey?',
                        answer: 'For most Surrey homeowners, the Green Belt has no practical impact on a loft conversion within their existing property.',
                        open: false
                    },
                    {
                        question: 'Which Surrey areas do you serve?',
                        answer: 'Weybridge, Esher, Cobham, Oxshott, Walton on Thames, Thames Ditton, Molesey, Kingston, Surbiton, Twickenham, Richmond, Teddington, Wimbledon, Wandsworth, Woking, Ascot and surrounding areas.',
                        open: false
                    },
                    {
                        question: 'How long does a loft conversion take in Surrey?',
                        answer: 'Typically 6-10 weeks from contract to handover.',
                        open: false
                    },
                    {
                        question: 'Are there different planning authorities across Surrey and do they have different rules?',
                        answer: 'Yes. Surrey spans multiple planning authorities including Elmbridge, Kingston, Woking, Runnymede, Surrey Heath, and Waverley.',
                        open: false
                    },
                    {
                        question: 'Is a loft conversion worth it in Surrey given property values?',
                        answer: 'For most Surrey homeowners, yes. Typical uplift is 15-20%, and the cost of moving can be significantly higher than converting.',
                        open: false
                    }
                ]
            },
            fields: [
                { key: 'eyebrow', label: 'Eyebrow' },
                { key: 'title', label: 'Title' }
            ],
            repeaters: [
                {
                    key: 'faqs',
                    label: 'FAQ Items',
                    itemLabel: 'FAQ',
                    addLabel: 'Add FAQ',
                    itemType: 'object',
                    defaultItem: {
                        question: '',
                        answer: '',
                        open: false
                    },
                    fields: [
                        { key: 'question', label: 'Question', type: 'textarea', rows: 2 },
                        { key: 'answer', label: 'Answer', type: 'textarea', rows: 4 },
                        { key: 'open', label: 'Open by default', type: 'toggle' }
                    ]
                }
            ],
            build: buildFaqSection,
            editRender: faqEditRender
        }
    };

    function registerSectionBlock(name, config) {
        if (typeof getBlockType === 'function' && getBlockType(name)) {
            return;
        }

        registerBlockType(name, {
            apiVersion: 2,
            title: config.title,
            icon: config.icon,
            category: 'myloft',
            supports: {
                html: false,
                reusable: true
            },
            attributes: {
                data: { type: 'object', default: {} },
                html: { type: 'string', default: '' }
            },
            edit: function (props) {
                var blockProps = useBlockProps({ style: { margin: 0, padding: 0 } });

                var storedData = props.attributes && props.attributes.data && typeof props.attributes.data === 'object'
                    ? props.attributes.data
                    : {};
                var storedHtml = props.attributes && typeof props.attributes.html === 'string'
                    ? props.attributes.html
                    : '';

                var data = mergeDefaults(config.defaults || {}, storedData);
                var previewHtml = storedHtml && storedHtml.trim() !== ''
                    ? storedHtml
                    : config.build(data);

                useEffect(function () {
                    var hasStoredData = props.attributes && props.attributes.data && Object.keys(props.attributes.data).length > 0;
                    var hasStoredHtml = props.attributes && typeof props.attributes.html === 'string' && props.attributes.html.trim() !== '';

                    if (!hasStoredData || !hasStoredHtml) {
                        props.setAttributes({
                            data: data,
                            html: previewHtml
                        });
                    }
                }, []);

                function setData(nextData) {
                    props.setAttributes({
                        data: nextData,
                        html: config.build(nextData)
                    });
                }

                var inlineEdit = typeof config.editRender === 'function';
                var panels = [];

                if (Array.isArray(config.fields) && config.fields.length) {
                    var fieldControls = config.fields.map(function (field) {
                        return renderFieldControl(
                            field,
                            data[field.key],
                            function (value) {
                                var nextData = Object.assign({}, data);
                                nextData[field.key] = value;
                                setData(nextData);
                            },
                            name + '-field-' + field.key,
                            { inline: inlineEdit }
                        );
                    }).filter(Boolean);

                    if (fieldControls.length) {
                        panels.push(
                            el(
                                PanelBody,
                                {
                                    key: name + '-fields',
                                    title: 'Section Content',
                                    initialOpen: true
                                },
                                fieldControls
                            )
                        );
                    }
                }

                (config.repeaters || []).forEach(function (repeater) {
                    panels.push(renderRepeaterPanel(repeater, data, setData, { inline: inlineEdit }));
                });

                var body;
                if (inlineEdit) {
                    // New style: edit the section's text inline on the canvas with
                    // RichText (formatting + links). Existing content is retained
                    // because we read/write the same stored `data`.
                    body = el(
                        'div',
                        {
                            className: 'single-area-blocks',
                            style: { border: '1px solid #d7d7d7', borderRadius: '8px', overflow: 'hidden' }
                        },
                        config.editRender(data, makeEditHelpers(data, setData))
                    );
                } else {
                    body = el(
                        'div',
                        {
                            className: 'single-area-blocks',
                            style: { border: '1px solid #d7d7d7', borderRadius: '8px', overflow: 'hidden' },
                            contentEditable: true,
                            suppressContentEditableWarning: true,
                            onBlur: function (event) { props.setAttributes({ html: event.currentTarget.innerHTML }); },
                            dangerouslySetInnerHTML: { __html: previewHtml }
                        }
                    );
                }

                return el(
                    Fragment,
                    null,
                    el(InspectorControls, null, panels),
                    el('div', blockProps, body)
                );
            },
            save: function () {
                return null;
            }
        });
    }

    Object.keys(blockConfigs).forEach(function (name) {
        registerSectionBlock(name, blockConfigs[name]);
    });
})(window.wp);
