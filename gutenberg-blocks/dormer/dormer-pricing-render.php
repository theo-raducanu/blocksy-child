<?php
defined( 'ABSPATH' ) || exit;
$defaults = [
	'eyebrow'      => 'Transparent Pricing',
	'h2'           => 'Dormer Loft Conversion Cost: £70,000–£100,000',
	'intro'        => 'Fixed pricing means the quote confirmed after your survey is the price you pay. No hidden costs, no provisional sums.',
	'tableCaption' => 'Example Cost Breakdown — £80,000 Project',
	'row1Name' => 'Structural work &amp; dormer build',    'row1Range' => '£28k–£32k',
	'row2Name' => 'Fitted furniture &amp; storage',         'row2Range' => '£8k–£12k',
	'row3Name' => 'En-suite (standard specification)',       'row3Range' => '£10k–£15k',
	'row4Name' => 'Services — electrics &amp; heating',     'row4Range' => '£6k–£8k',
	'row5Name' => 'Staircase',                               'row5Range' => '£4k–£6k',
	'row6Name' => 'Plasterwork &amp; flooring',              'row6Range' => '£5k–£7k',
	'row7Name' => 'Building control, PM &amp; guarantees',  'row7Range' => '£8k–£11k',
	'tableFootnote' => 'All costs include building regulations fees (£800–£1,200) and project management. Updated February 2026.',
	'roiPropVal' => '£800,000',
	'roiCost'    => '£85,000',
	'roiAfter'   => '£920k–£960k',
	'roiNetGain' => '£35,000–£75,000',
	'fin1Title' => 'Remortgage / Equity Release', 'fin1Sub' => 'Most common · Lowest rates · 2–5% APR',   'fin1Badge' => 'Popular',
	'fin2Title' => 'Home Improvement Loan',        'fin2Sub' => 'Faster approval · 4–9% APR · Up to £100k', 'fin2Badge' => 'Flexible',
	'fin3Title' => 'Milestone Payment Plan',       'fin3Sub' => '10% deposit → 30% Wk 2 → 30% Wk 5 → 25% Wk 7 → 5% on handover', 'fin3Badge' => '',
];
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== ''; } ), $defaults );
?>
<section class="section section--light" id="pricing">
	<div class="wrap">
		<div style="text-align:center;margin-bottom:52px;">
			<span class="eyebrow"><?php echo blocksy_child_kses_inline( $a['eyebrow'] ); ?></span>
			<h2 style="margin-bottom:12px;"><?php echo blocksy_child_kses_inline( $a['h2'] ); ?></h2>
			<p style="max-width:560px;margin:0 auto;color:#5a5a5a;"><?php echo blocksy_child_kses_inline( $a['intro'] ); ?></p>
		</div>
		<div class="grid-2" style="gap:36px;align-items:flex-start;">
			<div style="background:var(--color-black);border-radius:var(--radius-card);padding:36px;">
				<p style="color:rgba(255,255,255,0.45);font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:20px;"><?php echo blocksy_child_kses_inline( $a['tableCaption'] ); ?></p>
				<table class="price-table">
					<thead><tr><th>Element</th><th>Typical Range</th></tr></thead>
					<tbody>
						<?php for ( $i = 1; $i <= 7; $i++ ) : ?>
						<tr>
							<td><?php echo blocksy_child_kses_inline( $a[ 'row' . $i . 'Name' ] ); ?></td>
							<td><?php echo blocksy_child_kses_inline( $a[ 'row' . $i . 'Range' ] ); ?></td>
						</tr>
						<?php endfor; ?>
					</tbody>
				</table>
				<p style="color:rgba(255,255,255,0.35);font-size:0.78rem;margin-top:18px;"><?php echo blocksy_child_kses_inline( $a['tableFootnote'] ); ?></p>
			</div>
			<div style="display:flex;flex-direction:column;gap:24px;">
				<div>
					<h3 style="margin-bottom:16px;">Return on Investment</h3>
					<div style="background:#ffffff;border:1px solid rgba(253,83,32,0.2);border-radius:16px;padding:22px 24px;">
						<?php
						$roi_rows = [
							[ 'Property value (example)', 'roiPropVal', false ],
							[ 'Conversion cost',           'roiCost',    false ],
							[ 'Value after conversion',    'roiAfter',   false ],
							[ 'Net gain',                  'roiNetGain', true  ],
						];
						foreach ( $roi_rows as $i => $row ) : ?>
						<div style="display:flex;justify-content:space-between;padding:8px 0;<?php echo $i < 3 ? 'border-bottom:1px solid rgba(253,83,32,0.12);' : ''; ?>font-size:<?php echo $row[2] ? '0.95rem' : '0.9rem'; ?>">
							<span style="color:#5a5a5a;"><?php echo esc_html( $row[0] ); ?></span>
							<strong <?php echo $row[2] ? 'style="color:var(--color-orange);font-size:1rem;"' : ''; ?>><?php echo blocksy_child_kses_inline( $a[ $row[1] ] ); ?></strong>
						</div>
						<?php endforeach; ?>
					</div>
				</div>
				<div>
					<h3 style="margin-bottom:14px;">Financing Options</h3>
					<div style="display:flex;flex-direction:column;gap:10px;">
						<?php foreach ( [ 'fin1', 'fin2', 'fin3' ] as $fin ) : ?>
					<?php if ( $fin !== 'fin3' ) : ?>
					<div class="card" style="padding:16px 20px;border-radius:16px;display:flex;justify-content:space-between;align-items:center;">
						<div>
							<h4 style="font-size:0.9rem;margin-bottom:2px;"><?php echo blocksy_child_kses_inline( $a[ $fin . 'Title' ] ); ?></h4>
							<p style="font-size:0.8rem;color:#888;"><?php echo blocksy_child_kses_inline( $a[ $fin . 'Sub' ] ); ?></p>
						</div>
						<span class="badge badge--light"><?php echo blocksy_child_kses_inline( $a[ $fin . 'Badge' ] ); ?></span>
					</div>
					<?php else : ?>
					<div class="card" style="padding:16px 20px;border-radius:16px;">
						<h4 style="font-size:0.9rem;margin-bottom:2px;"><?php echo blocksy_child_kses_inline( $a[ $fin . 'Title' ] ); ?></h4>
						<p style="font-size:0.8rem;color:#888;"><?php echo blocksy_child_kses_inline( $a[ $fin . 'Sub' ] ); ?></p>
					</div>
					<?php endif; ?>
						<?php endforeach; ?>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
