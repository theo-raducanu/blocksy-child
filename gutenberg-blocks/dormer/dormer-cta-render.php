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

// A CTA shows only when its text is non-empty. Read straight from the raw
// attributes (not $a) so a deliberately cleared CTA isn't refilled by the
// default text via the array_filter()/wp_parse_args() merge above.
$cta1_text = array_key_exists( 'cta1Text', $_raw ) ? trim( (string) $_raw['cta1Text'] ) : $defaults['cta1Text'];
$cta2_text = array_key_exists( 'cta2Text', $_raw ) ? trim( (string) $_raw['cta2Text'] ) : $defaults['cta2Text'];
$show_cta1 = ( $cta1_text !== '' );
$show_cta2 = ( $cta2_text !== '' );
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
		<?php if ( $show_cta1 || $show_cta2 ) : ?>
		<div style="margin-top:44px;text-align:center;display:flex;justify-content:center;gap:20px;flex-wrap:wrap;">
			<?php if ( $show_cta1 ) : ?>
			<a href="<?php echo esc_url( $a['cta1Url'] ); ?>" class="btn-cta btn-cta--solid"><?php echo blocksy_child_kses_inline( $cta1_text ); ?></a>
			<?php endif; ?>
			<?php if ( $show_cta2 ) : ?>
			<a href="<?php echo esc_url( $a['cta2Url'] ); ?>" class="<?php echo esc_attr( $cta2_class ); ?>"><?php echo blocksy_child_kses_inline( $cta2_text ); ?></a>
			<?php endif; ?>
		</div>
		<?php endif; ?>
	</div>
</section>
