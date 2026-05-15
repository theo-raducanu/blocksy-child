<?php
defined( 'ABSPATH' ) || exit;
$defaults = [
	'eyebrow'    => 'Get Started',
	'h2'         => 'Choose Your Style. Know Your Price. Love Your Loft.',
	'bgImageId'  => 0,
	'bgImageUrl' => '',
	'bgImageAlt' => '',
	'cta1Text'   => 'Book Free Survey →',
	'cta1Url'    => '#contact',
	'cta2Text'   => 'Get Instant Estimate →',
	'cta2Url'    => '#calculator',
];
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== ''; } ), $defaults );
$bg_img = ! empty( $a['bgImageUrl'] ) ? $a['bgImageUrl'] : 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/03/Hartington-5-scaled-1.jpg';
?>
<section class="section section--dark" id="contact" style="position:relative;">
	<div class="img-ph" style="position:absolute;inset:0;border-radius:0;background-image:url('<?php echo esc_url( $bg_img ); ?>');background-size:cover;background-position:center;" aria-hidden="true"></div>
	<div style="position:absolute;inset:0;background:rgba(4,4,4,0.88);"></div>
	<div class="wrap" style="position:relative;z-index:2;">
		<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:28px;">
			<div>
				<span class="eyebrow"><?php echo esc_html( $a['eyebrow'] ); ?></span>
				<h2 style="color:#fff;max-width:520px;"><?php echo esc_html( $a['h2'] ); ?></h2>
			</div>
			<div style="display:flex;flex-direction:column;gap:12px;align-items:anchor-center;">
				<a href="<?php echo esc_url( $a['cta1Url'] ); ?>" class="btn-cta btn-cta--solid"><?php echo esc_html( $a['cta1Text'] ); ?></a>
				<a href="<?php echo esc_url( $a['cta2Url'] ); ?>" class="btn btn--white" style="font-size:0.875rem;"><?php echo esc_html( $a['cta2Text'] ); ?></a>
			</div>
		</div>
	</div>
</section>
