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

    function renderFieldControl(field, value, onChange, key) {
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

    function renderRepeaterPanel(repeater, data, setData) {
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
                            itemKey + '-' + field.key
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
                        itemKey + '-value'
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
                initialOpen: false
            },
            content
        );
    }

    function buildHeroSection(data) {
        var pills = (Array.isArray(data.pills) ? data.pills : []).map(function (pill) {
            return '<span class="pill">' + escapeHtml(pill) + '</span>';
        }).join('');

        return [
            '<section class="section section--dark" style="padding:220px 0 90px;position:relative;overflow:hidden;">',
            '    <div class="img-cover" style="position:absolute;inset:0;border-radius:0;background-image:url(\'' + escapeAttr(data.heroImageUrl) + '\');"></div>',
            '    <div style="position:absolute;inset:0;background:linear-gradient(110deg,rgba(4,4,4,.88) 0%,rgba(4,4,4,.58) 65%,rgba(4,4,4,.35) 100%);"></div>',
            '    <div class="wrap" style="position:relative;z-index:2;">',
            '        <h1 style="color:#fff;max-width:760px;margin-bottom:18px;">' + escapeHtml(data.title) + '</h1>',
            '        <p style="color:rgba(255,255,255,.83);max-width:760px;font-size:1.08rem;margin-bottom:30px;">' + escapeHtml(data.subtitle) + '</p>',
            '        <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;margin-bottom:24px;">',
            '            <a href="' + escapeAttr(data.primaryCtaUrl || '#calculator') + '" class="btn-cta btn-cta--solid">' + escapeHtml(data.primaryCtaText) + '</a>',
            '            <a href="' + escapeAttr(data.secondaryCtaUrl || '#collections') + '" class="btn btn--white">' + escapeHtml(data.secondaryCtaText) + '</a>',
            '        </div>',
            '        <div class="pill-row">' + pills + '</div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function buildTrustBarSection(data) {
        var metrics = (Array.isArray(data.metrics) ? data.metrics : []).map(function (metric) {
            return '<div class="hero-metric">' + escapeHtml(metric) + '</div>';
        }).join('');

        return [
            '<section class="section--dark" style="padding:34px 0;border-top:1px solid rgba(255,255,255,.09);border-bottom:1px solid rgba(255,255,255,.09);">',
            '    <div class="wrap">',
            '        <div class="hero-metrics">' + metrics + '</div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function buildIntroSection(data) {
        var paragraphs = (Array.isArray(data.paragraphs) ? data.paragraphs : []).map(function (paragraph, index, list) {
            var color = index === 0 ? '#3f3f3f' : '#555';
            var margin = index === list.length - 1 ? '' : 'margin-bottom:14px;';
            return '<p style="color:' + color + ';' + margin + '">' + escapeHtml(paragraph) + '</p>';
        }).join('');

        return [
            '<section class="section section--light" id="intro-surrey">',
            '    <div class="wrap">',
            '        <div class="grid-2" style="align-items:center;gap:52px;">',
            '            <div>',
            '                <span class="eyebrow">' + escapeHtml(data.eyebrow) + '</span>',
            '                <h2 style="margin-bottom:16px;">' + escapeHtml(data.title) + '</h2>',
            '                ' + paragraphs,
            '            </div>',
            '            <div class="img-cover" style="min-height:420px;background-image:url(\'' + escapeAttr(data.imageUrl) + '\');"></div>',
            '        </div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function buildPropertyProfileSection(data) {
        var cards = (Array.isArray(data.cards) ? data.cards : []).map(function (card) {
            var tone = card.tone === 'excellent' || card.tone === 'unlikely' ? card.tone : 'good';
            return [
                '<article class="property-card">',
                '    <span class="property-status property-status--' + tone + '">' + escapeHtml(card.status) + '</span>',
                '    <h3>' + escapeHtml(card.title) + '</h3>',
                '    <p class="property-conversion">' + escapeHtml(card.conversion) + '</p>',
                '    <p class="property-notes">' + escapeHtml(card.notes) + '</p>',
                '</article>'
            ].join('');
        }).join('');

        return [
            '<section class="section section--dark" id="property-profile">',
            '    <div class="wrap">',
            '        <div style="text-align:center;margin-bottom:36px;">',
            '            <span class="eyebrow">' + escapeHtml(data.eyebrow) + '</span>',
            '            <h2 style="color:#fff;">' + escapeHtml(data.title) + '</h2>',
            '        </div>',
            '        <div class="property-cards">' + cards + '</div>',
            '        <p style="color:var(--color-muted);max-width:980px;margin:0 auto 12px;">' + escapeHtml(data.summary) + '</p>',
            '        <p class="property-confirm">' + escapeHtml(data.confirm) + '</p>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function buildPlanningSection(data) {
        var authorities = (Array.isArray(data.authorities) ? data.authorities : []).map(function (row, index) {
            var openAttr = index === 0 ? ' open' : '';

            return [
                '<details class="planning-accordion-item"' + openAttr + '>',
                '    <summary class="planning-accordion-summary"><h3 class="planning-accordion-title">' + escapeHtml(row.name) + '</h3></summary>',
                '    <div class="planning-accordion-content">',
                '        <p class="planning-accordion-meta">' + escapeHtml(row.towns) + '</p>',
                '        <p class="planning-accordion-body">' + escapeHtml(row.notes) + '</p>',
                '    </div>',
                '</details>'
            ].join('');
        }).join('');

        var pdItems = (Array.isArray(data.pdItems) ? data.pdItems : []).map(function (item) {
            return '<li><span class="chk">+</span>' + escapeHtml(item) + '</li>';
        }).join('');

        var ppItems = (Array.isArray(data.ppItems) ? data.ppItems : []).map(function (item) {
            return '<li><span class="chk">-</span>' + escapeHtml(item) + '</li>';
        }).join('');

        return [
            '<section class="section section--light" id="planning-surrey">',
            '    <div class="wrap">',
            '        <span class="eyebrow">' + escapeHtml(data.eyebrow) + '</span>',
            '        <h2 style="margin-bottom:14px;">' + escapeHtml(data.title) + '</h2>',
            '        <p style="color:#444;margin-bottom:14px;">' + escapeHtml(data.intro1) + '</p>',
            '        <p style="color:#444;margin-bottom:24px;">' + escapeHtml(data.intro2) + '</p>',
            '        <h3 style="margin-bottom:12px;">' + escapeHtml(data.tableTitle) + '</h3>',
            '        <div class="planning-accordion" style="margin-bottom:24px;">' + authorities + '</div>',
            '        <div class="grid-2" style="gap:20px;">',
            '            <div class="card" style="border:1px solid #ddd8ce;">',
            '                <h3 style="margin-bottom:10px;">' + escapeHtml(data.pdTitle) + '</h3>',
            '                <ul class="checklist" style="color:#444;">' + pdItems + '</ul>',
            '            </div>',
            '            <div class="card" style="border:1px solid #ddd8ce;">',
            '                <h3 style="margin-bottom:10px;">' + escapeHtml(data.ppTitle) + '</h3>',
            '                <ul class="checklist" style="color:#444;">' + ppItems + '</ul>',
            '            </div>',
            '        </div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function buildCollectionsSection(data) {
        var cards = Array.isArray(data.cards) ? data.cards : [];
        var rows = chunkArray(cards, 2).map(function (row, rowIndex, rowList) {
            var rowCards = row.map(function (card) {
                return [
                    '<div class="card" style="padding:0;overflow:hidden;">',
                    '    <div class="img-cover" style="min-height:220px;border-radius:0;background-image:url(\'' + escapeAttr(card.imageUrl) + '\');"></div>',
                    '    <div style="padding:22px;">',
                    '        <div class="badge" style="margin-bottom:8px;">' + escapeHtml(card.label) + '</div>',
                    '        <h3 style="margin-bottom:6px;">' + escapeHtml(card.title) + '</h3>',
                    '        <p style="color:#555;font-size:.9rem;">' + escapeHtml(card.desc) + '</p>',
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
            '            <span class="eyebrow">' + escapeHtml(data.eyebrow) + '</span>',
            '            <h2 style="color:#fff;">' + escapeHtml(data.title) + '</h2>',
            '        </div>',
            '        ' + rows,
            '        <div style="text-align:center;"><a href="' + escapeAttr(data.viewAllUrl || '#') + '" class="btn btn--white">' + escapeHtml(data.viewAllText) + '</a></div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function buildPricingSection(data) {
        var cards = (Array.isArray(data.cards) ? data.cards : []).map(function (card) {
            var className = card.featured ? 'pricing-card pricing-card--featured' : 'pricing-card';
            return [
                '<article class="' + className + '">',
                '    <span class="pricing-badge">' + escapeHtml(card.badge) + '</span>',
                '    <h3>' + escapeHtml(card.title) + '</h3>',
                '    <p class="pricing-range">' + escapeHtml(card.range) + '</p>',
                '    <p class="pricing-best">' + escapeHtml(card.best) + '</p>',
                '</article>'
            ].join('');
        }).join('');

        return [
            '<section class="section section--light" id="pricing">',
            '    <div class="wrap">',
            '        <span class="eyebrow">' + escapeHtml(data.eyebrow) + '</span>',
            '        <h2 style="margin-bottom:14px;">' + escapeHtml(data.title) + '</h2>',
            '        <p style="color:#444;margin-bottom:20px;">' + escapeHtml(data.intro) + '</p>',
            '        <div class="pricing-cards">' + cards + '</div>',
            '        <a href="' + escapeAttr(data.ctaUrl || '#calculator') + '" class="btn-cta btn-cta--solid">' + escapeHtml(data.ctaText) + '</a>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function buildCalculatorSection(data) {
        return [
            '<section class="section section--dark" id="calculator">',
            '    <div class="wrap">',
            '        <div class="card--dark" style="text-align:center;"><span class="eyebrow">' + escapeHtml(data.eyebrow) + '</span>',
            '            <h2 style="color:#fff;margin-bottom:10px;">' + escapeHtml(data.title) + '</h2>',
            '            <p style="color:var(--color-muted);max-width:760px;margin:0 auto;">' + escapeHtml(data.body) + '</p>',
            '        </div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function buildProjectsSection(data) {
        var cards = (Array.isArray(data.cards) ? data.cards : []).map(function (card) {
            return [
                '<div class="card">',
                '    <div class="img-cover" style="min-height:190px;background-image:url(\'' + escapeAttr(card.imageUrl) + '\');margin-bottom:14px;"></div>',
                '    <span class="badge" style="margin-bottom:10px;">' + escapeHtml(card.badge) + '</span>',
                '    <h3 style="margin-bottom:8px;">' + escapeHtml(card.title) + '</h3>',
                '</div>'
            ].join('');
        }).join('');

        return [
            '<section class="section section--light" id="projects">',
            '    <div class="wrap">',
            '        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:26px;">',
            '            <div><span class="eyebrow">' + escapeHtml(data.eyebrow) + '</span><h2>' + escapeHtml(data.title) + '</h2></div>',
            '            <a href="' + escapeAttr(data.viewAllUrl || '#') + '" class="btn btn--dark">' + escapeHtml(data.viewAllText) + '</a>',
            '        </div>',
            '        <div class="grid-3">' + cards + '</div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function buildGlobalComponentsSection(data) {
        var cards = (Array.isArray(data.cards) ? data.cards : []).map(function (card) {
            return [
                '<div class="card--dark"><span class="eyebrow">' + escapeHtml(card.eyebrow) + '</span>',
                '    <h3 style="color:#fff;margin-bottom:8px;">' + escapeHtml(card.title) + '</h3>',
                '    <p style="color:var(--color-muted);font-size:.9rem;">' + escapeHtml(card.desc) + '</p>',
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

    function buildNearbyAreasSection(data) {
        var areas = (Array.isArray(data.areas) ? data.areas : []).map(function (area) {
            return '<a href="' + escapeAttr(area.url || '#') + '" class="btn-cta" style="background:#fff;border:1px solid #ddd8ce;color:#333;">' + escapeHtml(area.text) + '</a>';
        }).join('');

        return [
            '<section class="section section--light" id="areas-nearby">',
            '    <div class="wrap" style="text-align:center;"><span class="eyebrow">' + escapeHtml(data.eyebrow) + '</span>',
            '        <h2 style="margin-bottom:12px;">' + escapeHtml(data.title) + '</h2>',
            '        <p style="max-width:760px;margin:0 auto 20px;color:#555;">' + escapeHtml(data.description) + '</p>',
            '        <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">' + areas + '</div>',
            '    </div>',
            '</section>'
        ].join('');
    }

    function buildContactSection(data) {
        var pills = (Array.isArray(data.pills) ? data.pills : []).map(function (pill) {
            return '<span class="pill">' + escapeHtml(pill) + '</span>';
        }).join('');

        return [
            '<section class="section section--dark" id="contact" style="position:relative;overflow:hidden;">',
            '    <div class="img-cover" style="position:absolute;inset:0;border-radius:0;background-image:url(\'' + escapeAttr(data.bgImageUrl) + '\');"></div>',
            '    <div style="position:absolute;inset:0;background:rgba(30,30,30,.66);"></div>',
            '    <div class="wrap" style="position:relative;z-index:2;"><span class="eyebrow">' + escapeHtml(data.eyebrow) + '</span>',
            '        <h2 style="color:#fff;max-width:760px;margin-bottom:12px;">' + escapeHtml(data.title) + '</h2>',
            '        <p style="color:var(--color-muted);max-width:820px;margin-bottom:22px;">' + escapeHtml(data.description) + '</p>',
            '        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:18px;"><a href="' + escapeAttr(data.cta1Url || '#') + '" class="btn-cta btn-cta--solid">' + escapeHtml(data.cta1Text) + '</a><a href="' + escapeAttr(data.cta2Url || '#calculator') + '" class="btn btn--white">' + escapeHtml(data.cta2Text) + '</a></div>',
            '        <div class="pill-row" style="margin-bottom:16px;">' + pills + '</div>',
            '        <p style="color:#fff;font-weight:700;">' + escapeHtml(data.footerText) + '</p>',
            '    </div>',
            '</section>'
        ].join('');
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
                '    <div class="faq-q">' + escapeHtml(faq.question) + '<span class="faq-toggle"></span></div>',
                '    <div class="faq-a">' + escapeHtml(faq.answer) + '</div>',
                '</div>'
            ].join('');
        }).join('');

        return [
            '<section class="section section--dark" id="faq-surrey">',
            '    <div class="wrap">',
            '        <span class="eyebrow">' + escapeHtml(data.eyebrow) + '</span>',
            '        <h2 style="color:#fff;margin-bottom:24px;">' + escapeHtml(data.title) + '</h2>',
            '        ' + itemsHtml,
            '    </div>',
            '</section>'
        ].join('');
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
            build: buildHeroSection
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
            build: buildTrustBarSection
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
            build: buildIntroSection
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
            build: buildPropertyProfileSection
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
            build: buildPlanningSection
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
            build: buildCollectionsSection
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
            build: buildPricingSection
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
            build: buildCalculatorSection
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
            build: buildProjectsSection
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
            build: buildGlobalComponentsSection
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
            build: buildNearbyAreasSection
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
            build: buildContactSection
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
            build: buildFaqSection
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

                var panels = [];

                if (Array.isArray(config.fields) && config.fields.length) {
                    panels.push(
                        el(
                            PanelBody,
                            {
                                key: name + '-fields',
                                title: 'Section Content',
                                initialOpen: true
                            },
                            config.fields.map(function (field) {
                                return renderFieldControl(
                                    field,
                                    data[field.key],
                                    function (value) {
                                        var nextData = Object.assign({}, data);
                                        nextData[field.key] = value;
                                        setData(nextData);
                                    },
                                    name + '-field-' + field.key
                                );
                            })
                        )
                    );
                }

                (config.repeaters || []).forEach(function (repeater) {
                    panels.push(renderRepeaterPanel(repeater, data, setData));
                });

                return el(
                    Fragment,
                    null,
                    el(InspectorControls, null, panels),
                    el(
                        'div',
                        blockProps,
                        el(
                            'div',
                            {
                                className: 'single-area-blocks',
                                style: {
                                    border: '1px solid #d7d7d7',
                                    borderRadius: '8px',
                                    overflow: 'hidden'
                                },
                                contentEditable: true,
                                suppressContentEditableWarning: true,
                                onBlur: function (event) {
                                    props.setAttributes({ html: event.currentTarget.innerHTML });
                                },
                                dangerouslySetInnerHTML: { __html: previewHtml }
                            }
                        )
                    )
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
