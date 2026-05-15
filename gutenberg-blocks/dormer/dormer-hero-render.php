<?php
/**
 * Dynamic render template for the Dormer Hero block.
 */

$defaults = [
	'title' => 'Dormer Loft Conversion London',
	'subtitle' => 'Transform your loft with signature designer collections. Fixed pricing, 6-10 week delivery, zero stress.',
	'primaryCtaText' => 'Get Instant Estimate',
	'primaryCtaUrl' => '#calculator',
	'showPrimaryCta' => true,
	'secondaryCtaText' => 'Explore Designer Collections ->',
	'secondaryCtaUrl' => '#collections',
	'showSecondaryCta' => true,
	'heroImageUrl' => '',
	'heroImageAlt' => '',
];

$_raw_hero = isset($hero_attributes) && is_array($hero_attributes) ? $hero_attributes : [];
$hero = wp_parse_args(array_filter($_raw_hero, function($v) { return $v !== ''; }), $defaults);
?>
<section class="section section--dark" style="padding:240px 0 80px;position:relative;overflow:hidden;">
	<div
		style="position:absolute;inset:0;background-color:#0d0d0d;<?php echo $hero['heroImageUrl'] !== '' ? 'background-image:url(' . esc_url($hero['heroImageUrl']) . ');background-size:cover;background-position:center;' : ''; ?>"
		aria-label="<?php echo esc_attr($hero['heroImageAlt']); ?>"
	></div>
	<div style="position:absolute;inset:0;background:linear-gradient(110deg,rgba(4,4,4,0.88) 0%,rgba(4,4,4,0.55) 70%,rgba(4,4,4,0.3) 100%);"></div>
	<div class="wrap" style="position:relative;z-index:2;width:var(--theme-container-width,1200px);max-width:var(--theme-normal-container-max-width,1200px);">
		<h1 style="color:#fff;max-width:680px;margin-bottom:20px;"><?php echo esc_html($hero['title']); ?></h1>
		<p style="color:rgba(255,255,255,0.82);font-size:1.1rem;max-width:540px;margin-bottom:40px;line-height:1.7;"><?php echo esc_html($hero['subtitle']); ?></p>
		<?php if (!empty($hero['showPrimaryCta']) || !empty($hero['showSecondaryCta'])) : ?>
		<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:center;">
			<?php if (!empty($hero['showPrimaryCta'])) : ?>
			<a href="<?php echo esc_url($hero['primaryCtaUrl']); ?>" class="btn-cta btn-cta--solid"><?php echo esc_html($hero['primaryCtaText']); ?></a>
			<?php endif; ?>
			<?php if (!empty($hero['showSecondaryCta'])) : ?>
			<a href="<?php echo esc_url($hero['secondaryCtaUrl']); ?>" class="btn btn--white"><?php echo esc_html($hero['secondaryCtaText']); ?></a>
			<?php endif; ?>
		</div>
		<?php endif; ?>
	</div>
</section>
