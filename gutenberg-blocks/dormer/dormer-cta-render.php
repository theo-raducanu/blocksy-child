<?php
defined( 'ABSPATH' ) || exit;
$defaults = [
	'mode'     => 'dark',
	'eyebrow'  => 'Ready When You Are',
	'h2'       => 'Start Your Dormer Loft Conversion Today',
	'intro'    => '',
	'cta1Text' => 'Book Free Survey →',
	'cta1Url'  => '#contact',
	'cta2Text' => 'Get Instant Estimate →',
	'cta2Url'  => '#calculator',
];
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== '' && $v !== 0; } ), $defaults );

$is_dark        = ( $a['mode'] !== 'light' );
$section_class  = 'section ' . ( $is_dark ? 'section--dark' : 'section--light' );
$heading_color  = $is_dark ? '#fff' : '#1e1e1e';
$intro_color    = $is_dark ? 'rgba(255,255,255,0.7)' : '#3a3a3a';
$cta2_class     = $is_dark ? 'btn btn--white' : 'btn btn--dark';
?>
<section class="<?php echo esc_attr( $section_class ); ?>" id="cta-section">
	<div class="wrap">
		<div style="text-align:center;">
			<span class="eyebrow"><?php echo blocksy_child_kses_inline( $a['eyebrow'] ); ?></span>
			<h2 style="color:<?php echo esc_attr( $heading_color ); ?>;"><?php echo blocksy_child_kses_inline( $a['h2'] ); ?></h2>
			<?php if ( ! empty( $a['intro'] ) ) : ?>
			<p class="section-intro" style="color:<?php echo esc_attr( $intro_color ); ?>;max-width:720px;margin:16px auto 0;font-size:1rem;line-height:1.6;"><?php echo blocksy_child_kses_inline( $a['intro'] ); ?></p>
			<?php endif; ?>
		</div>
		<div style="margin-top:44px;text-align:center;display:flex;justify-content:center;gap:20px;flex-wrap:wrap;">
			<a href="<?php echo esc_url( $a['cta1Url'] ); ?>" class="btn-cta btn-cta--solid"><?php echo blocksy_child_kses_inline( $a['cta1Text'] ); ?></a>
			<a href="<?php echo esc_url( $a['cta2Url'] ); ?>" class="<?php echo esc_attr( $cta2_class ); ?>"><?php echo blocksy_child_kses_inline( $a['cta2Text'] ); ?></a>
		</div>
	</div>
</section>
