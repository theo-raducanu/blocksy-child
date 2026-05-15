<?php
/**
 * Title: Dormer Loft Conversion V2
 * Slug: blocksy-child/dormer-loft-conversion-v2
 * Description: Full dormer loft conversion landing page sections imported as Gutenberg HTML block.
 * Categories: text
 * Inserter: true
 */
?>
<?php
$myloft_markup_file = get_stylesheet_directory() . '/static/dormer-loft-conversion-v2-block-markup.html';

if (file_exists($myloft_markup_file)) {
	readfile($myloft_markup_file);
}
