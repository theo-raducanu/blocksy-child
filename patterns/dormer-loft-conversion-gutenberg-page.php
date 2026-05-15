<?php
/**
 * Title: Dormer Loft Conversion Gutenberg Page
 * Slug: blocksy-child/dormer-loft-conversion-gutenberg-page
 * Description: Full Dormer Loft Conversion page assembled from reusable dynamic Gutenberg section blocks.
 * Categories: myloft
 * Inserter: true
 */
?>
<?php
$myloft_dormer_gutenberg_file = get_stylesheet_directory() . '/static/dormer-loft-conversion-gutenberg-page.html';

if (file_exists($myloft_dormer_gutenberg_file)) {
	readfile($myloft_dormer_gutenberg_file);
}
