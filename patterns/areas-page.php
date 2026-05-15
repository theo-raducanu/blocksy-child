<?php
/**
 * Title: Areas Page Blocks
 * Slug: blocksy-child/areas-page
 * Description: Loft conversion areas page built with native Gutenberg blocks.
 * Categories: myloft
 * Inserter: true
 */
?>
<?php
$myloft_areas_blocks_file = get_stylesheet_directory() . '/static/areas-block-markup.html';

if (file_exists($myloft_areas_blocks_file)) {
	readfile($myloft_areas_blocks_file);
}
