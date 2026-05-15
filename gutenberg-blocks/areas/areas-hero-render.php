<?php
/**
 * Dynamic render template for the Areas Hero block.
 */

$defaults = [
	'eyebrow' => 'Main Areas',
	'title' => 'Loft Conversion Areas Across London & Surrey',
	'subtitle' => 'Browse our primary service regions below. Each yellow region is a main area, with linked green sub-areas listed under it.',
	'pillOne' => 'Primary regions structured by area cluster',
	'pillTwo' => 'Sub-areas linked directly to local pages',
	'pillThree' => 'Consistent designer-led service model',
	'backgroundImageUrl' => 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-1-scaled-1.jpg',
];

$hero = wp_parse_args(isset($hero_attributes) && is_array($hero_attributes) ? $hero_attributes : [], $defaults);
?>
<section class="section section--dark" style="padding:190px 0 80px;position:relative;overflow:hidden;">
	<div style="position:absolute;inset:0;background-image:url('<?php echo esc_url($hero['backgroundImageUrl']); ?>');background-size:cover;background-position:center;"></div>
	<div style="position:absolute;inset:0;background:linear-gradient(100deg,rgba(4,4,4,.88) 0%,rgba(4,4,4,.58) 65%,rgba(4,4,4,.35) 100%);"></div>
	<div class="wrap" style="position:relative;z-index:2;">
		<span class="eyebrow"><?php echo esc_html($hero['eyebrow']); ?></span>
		<h1 style="color:#fff;max-width:780px;margin:0 0 16px;font-size:clamp(2.2rem,5vw,4rem);font-weight:800;line-height:1.15;"><?php echo esc_html($hero['title']); ?></h1>
		<p style="color:rgba(255,255,255,.84);max-width:820px;"><?php echo esc_html($hero['subtitle']); ?></p>
		<div class="intro-grid">
			<div class="intro-pill"><?php echo esc_html($hero['pillOne']); ?></div>
			<div class="intro-pill"><?php echo esc_html($hero['pillTwo']); ?></div>
			<div class="intro-pill"><?php echo esc_html($hero['pillThree']); ?></div>
		</div>
	</div>
</section>
