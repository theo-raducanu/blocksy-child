<?php
defined( 'ABSPATH' ) || exit;
$defaults = [
	'eyebrow'    => 'Timeline & Process',
	'h2'         => 'Building a Dormer Loft Conversion: What to Expect',
	'intro'      => '',
	'imageId'    => 0,
	'imageUrl'   => '',
	'imageAlt'   => '',
	'step1Title' => 'Online Discovery',        'step1Desc' => 'Browse collections, use pricing calculator. No pressure.',
	'step2Title' => 'Consultation Call',       'step2Desc' => '20-minute call within 24 hours. Confirm suitability, book survey.',
	'step3Title' => 'Free Property Survey',    'step3Desc' => 'Within 7 days. We measure, assess, confirm planning. 45–60 min.',
	'step4Title' => 'Fixed Price Proposal',    'step4Desc' => 'Within 48 hours. Full spec, visualisations, payment schedule. Guaranteed.',
	'step5Title' => 'Pre-Construction',        'step5Desc' => 'Building control, party wall notices, materials ordering — all handled by us.',
	'step6Title' => 'Structural Build',        'step6Desc' => 'Weeks 1–5: scaffold, steelwork, dormer frame, roofing, weatherproofing.',
	'step7Title' => 'Interior Fit-Out',        'step7Desc' => 'Weeks 6–10: plastering, flooring, fitted furniture, en-suite, decorating.',
	'step8Title' => 'Handover & Aftercare',    'step8Desc' => 'Final walkthrough, all warranties, building regs certificate. 4-week check-in call.',
	'cta1Text' => 'Book Free Survey →',
	'cta1Url'  => '#contact',
	'cta2Text' => 'Get Instant Estimate →',
	'cta2Url'  => '#calculator',
];
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== '' && $v !== 0; } ), $defaults );
$image_url = ! empty( $a['imageUrl'] ) ? $a['imageUrl'] : 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Kew.jpg';
?>
<section class="section section--dark" id="process-image">
	<div class="wrap">
		<div style="text-align:center;margin-bottom:56px;">
			<span class="eyebrow"><?php echo esc_html( $a['eyebrow'] ); ?></span>
			<h2 style="color:#fff;"><?php echo esc_html( $a['h2'] ); ?></h2>
			<?php if ( ! empty( $a['intro'] ) ) : ?>
			<p class="section-intro" style="color:rgba(255,255,255,0.7);max-width:720px;margin:16px auto 0;font-size:1rem;line-height:1.6;"><?php echo esc_html( $a['intro'] ); ?></p>
			<?php endif; ?>
		</div>
		<div class="grid-2" style="gap:64px;align-items:flex-start;">
			<div>
				<img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $a['imageAlt'] ); ?>" style="width:100%;height:auto;display:block;border-radius:16px;" />
			</div>
			<div>
				<h3 style="color:#fff;margin-bottom:20px;font-size:1rem;letter-spacing:0.04em;text-transform:uppercase;opacity:0.5;">From Enquiry to Handover — 8 Steps</h3>
				<div style="display:flex;flex-direction:column;gap:0;">
					<?php for ( $i = 1; $i <= 8; $i++ ) : ?>
					<div style="display:flex;gap:16px;padding:14px 0;border-bottom:<?php echo $i < 8 ? '1px solid rgba(255,255,255,0.07)' : 'none'; ?>;align-items:flex-start;">
						<div class="step-num" style="width:32px;height:32px;font-size:0.75rem;"><?php echo sprintf( '%02d', $i ); ?></div>
						<div>
							<div style="color:#fff;font-weight:600;font-size:0.9rem;"><?php echo esc_html( $a[ 'step' . $i . 'Title' ] ); ?></div>
							<div style="color:var(--color-muted);font-size:0.82rem;"><?php echo esc_html( $a[ 'step' . $i . 'Desc' ] ); ?></div>
						</div>
					</div>
					<?php endfor; ?>
				</div>
			</div>
		</div>
		<div style="margin-top:44px;text-align:center;display:flex;justify-content:center;gap:20px;flex-wrap:wrap;">
			<a href="<?php echo esc_url( $a['cta1Url'] ); ?>" class="btn-cta btn-cta--solid"><?php echo esc_html( $a['cta1Text'] ); ?></a>
			<a href="<?php echo esc_url( $a['cta2Url'] ); ?>" class="btn btn--white"><?php echo esc_html( $a['cta2Text'] ); ?></a>
		</div>
	</div>
</section>
