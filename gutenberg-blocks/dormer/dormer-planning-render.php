<?php
defined( 'ABSPATH' ) || exit;
$defaults = [
	'eyebrow'  => 'Planning & Compliance',
	'h2'       => 'Planning Permission & Building Regulations',
	'intro'    => 'Most loft conversions in London fall under permitted development — no planning permission required. We manage the entire building control process, from submission to final sign-off.',
	'noPlan1'  => 'Rear roof slope only',
	'noPlan2'  => 'Materials match existing house',
	'noPlan3'  => 'Within 40m³ volume (terrace)',
	'noPlan4'  => 'Property not listed',
	'noPlan5'  => 'Not in Article 4 direction area',
	'planReq1' => 'Front or side dormers',
	'planReq2' => 'Conservation area properties',
	'planReq3' => 'Listed buildings',
	'planReq4' => 'Article 4 direction areas',
	'planReq5' => 'Exceeds permitted development limits',
	'footnote'  => 'Building control fees (£800–£1,200) are included in your fixed quote. We handle everything — submission to sign-off. Updated February 2026.',
	'reg1Badge' => 'S',
	'reg1Title' => 'Structural Integrity',
	'reg1Desc'  => 'Load-bearing calcs, steel beam specs, floor joist strengthening.',
	'reg2Badge' => 'F',
	'reg2Title' => 'Fire Safety',
	'reg2Desc'  => 'Escape routes, 30-min fire-rated doors, smoke alarms, window specification.',
	'reg3Badge' => 'I',
	'reg3Title' => 'Insulation',
	'reg3Desc'  => 'U-value 0.15 W/m²K or better. Airtightness, condensation control.',
	'reg4Badge' => 'A',
	'reg4Title' => 'Staircase & Acoustics',
	'reg4Desc'  => 'Max 42° pitch, 2m headroom, acoustic insulation in floors and party walls.',
];
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== ''; } ), $defaults );
?>
<section class="section section--light" id="planning">
	<div class="wrap">
		<div style="text-align:center;margin-bottom:52px;">
			<span class="eyebrow"><?php echo blocksy_child_kses_inline( $a['eyebrow'] ); ?></span>
			<h2 style="margin-bottom:12px;"><?php echo blocksy_child_kses_inline( $a['h2'] ); ?></h2>
			<p style="max-width:560px;margin:0 auto;color:#5a5a5a;"><?php echo blocksy_child_kses_inline( $a['intro'] ); ?></p>
		</div>
		<div class="grid-2" style="gap:36px;align-items:flex-start;">
			<div style="background:var(--color-black);border-radius:var(--radius-card);padding:32px;overflow:hidden;">
				<h3 style="color:#fff;margin-bottom:20px;font-size:1rem;">Permitted Development vs Planning Permission</h3>
				<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(255,255,255,0.08);border-radius:10px;overflow:hidden;">
					<div style="background:#1e1e1e;padding:12px 16px;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:rgba(255,255,255,0.45);">No Planning Needed ✓</div>
					<div style="background:#1e1e1e;padding:12px 16px;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:rgba(255,255,255,0.45);">Planning Required ✗</div>
					<?php for ( $i = 1; $i <= 5; $i++ ) : ?>
					<div style="background:rgba(255,255,255,0.03);padding:10px 16px;font-size:0.83rem;color:var(--color-muted);border-top:1px solid rgba(255,255,255,0.06);"><?php echo blocksy_child_kses_inline( $a[ 'noPlan' . $i ] ); ?></div>
					<div style="background:rgba(255,255,255,0.03);padding:10px 16px;font-size:0.83rem;color:var(--color-muted);border-top:1px solid rgba(255,255,255,0.06);"><?php echo blocksy_child_kses_inline( $a[ 'planReq' . $i ] ); ?></div>
					<?php endfor; ?>
				</div>
				<p style="color:rgba(255,255,255,0.35);font-size:0.78rem;margin-top:16px;"><?php echo blocksy_child_kses_inline( $a['footnote'] ); ?></p>
			</div>
			<div>
				<h3 style="margin-bottom:18px;font-size:1rem;">Building Regulations — What We Cover</h3>
				<div style="display:flex;flex-direction:column;gap:10px;">
					<?php foreach ( [ 'reg1', 'reg2', 'reg3', 'reg4' ] as $r ) : ?>
					<div class="card" style="padding:16px 20px;border-radius:16px;display:flex;gap:14px;align-items:flex-start;">
						<div style="flex-shrink:0;width:32px;height:32px;background:rgba(253,83,32,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:800;color:var(--color-orange);"><?php echo blocksy_child_kses_inline( $a[ $r . 'Badge' ] ); ?></div>
						<div>
							<h4 style="font-size:0.875rem;margin-bottom:2px;"><?php echo blocksy_child_kses_inline( $a[ $r . 'Title' ] ); ?></h4>
							<p style="font-size:0.8rem;color:#777;"><?php echo blocksy_child_kses_inline( $a[ $r . 'Desc' ] ); ?></p>
						</div>
					</div>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</div>
</section>
