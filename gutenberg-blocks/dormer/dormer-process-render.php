<?php
defined( 'ABSPATH' ) || exit;
$defaults = [
	'eyebrow'       => 'Timeline & Process',
	'h2'            => 'Building a Dormer Loft Conversion: What to Expect',
	'intro'         => '',
	'tl1Weeks'      => 'Wks 1–2',
	'tl1Phase'      => 'Structural Phase',
	'tl1Desc'       => 'Scaffold, roof opening, steelwork, dormer frame construction.',
	'tl2Weeks'      => 'Wks 3–4',
	'tl2Phase'      => 'Weathertight',
	'tl2Desc'       => 'Dormer roof completed, windows installed, fully weatherproofed.',
	'tl3Weeks'      => 'Wks 5–7',
	'tl3Phase'      => 'First Fix Interior',
	'tl3Desc'       => 'Insulation, plasterwork, electrics, heating, staircase.',
	'tl4Weeks'      => 'Wks 8–10',
	'tl4Phase'      => 'Fit-Out & Handover',
	'tl4Desc'       => 'Fitted furniture, en-suite, decorating, lighting, snagging, handover.',
	'whyFasterTitle' => 'Why We\'re Faster',
	'whyFasterBody'  => 'Pre-designed collections eliminate the design phase. Materials pre-ordered before day one. Dedicated teams, strong building control relationships, fixed scope — no mid-project changes.',
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
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== ''; } ), $defaults );
$tl_rows = [];
for ( $i = 1; $i <= 4; $i++ ) {
	$tl_rows[] = [ 'weeks' => $a[ 'tl' . $i . 'Weeks' ], 'phase' => $a[ 'tl' . $i . 'Phase' ], 'desc' => $a[ 'tl' . $i . 'Desc' ], 'last' => ( $i === 4 ) ];
}
?>
<section class="section section--dark" id="process">
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
				<h3 style="color:#fff;margin-bottom:20px;font-size:1rem;letter-spacing:0.04em;text-transform:uppercase;opacity:0.5;">Build Timeline — 6–10 Weeks</h3>
				<?php foreach ( $tl_rows as $row ) : ?>
				<div class="timeline-row"<?php echo $row['last'] ? ' style="border-bottom:none;"' : ''; ?>>
					<div class="timeline-weeks"><?php echo esc_html( $row['weeks'] ); ?></div>
					<div>
						<div style="font-size:0.95rem;font-weight:700;color:#fff;margin-bottom:3px;"><?php echo esc_html( $row['phase'] ); ?></div>
						<div style="font-size:0.875rem;color:var(--color-muted);"><?php echo esc_html( $row['desc'] ); ?></div>
					</div>
				</div>
				<?php endforeach; ?>
				<div style="margin-top:28px;background:#efece6;border:1px solid rgba(253,83,32,0.2);border-radius:16px;padding:20px 24px;">
					<p style="color:#5a5a5a;font-size:0.875rem;font-weight:600;margin-bottom:6px;"><?php echo esc_html( $a['whyFasterTitle'] ); ?></p>
					<p style="color:#5a5a5a;font-size:0.82rem;"><?php echo esc_html( $a['whyFasterBody'] ); ?></p>
				</div>
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
