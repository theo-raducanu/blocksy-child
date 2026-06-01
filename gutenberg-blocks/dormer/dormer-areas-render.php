<?php
defined( 'ABSPATH' ) || exit;
$defaults = [
	'eyebrow'     => 'Areas We Serve',
	'h2'          => 'Loft Conversions Across London — Zones 2–5',
	'description' => 'We work across all London boroughs. Find your area for local pricing, planning notes, and recommended collections.',
	'b1Name'  => 'Richmond',       'b1Url'  => '/loft-conversion-richmond',
	'b2Name'  => 'Islington',      'b2Url'  => '/loft-conversion-islington',
	'b3Name'  => 'Hackney',        'b3Url'  => '/loft-conversion-hackney',
	'b4Name'  => 'Haringey',       'b4Url'  => '/loft-conversion-haringey',
	'b5Name'  => 'Waltham Forest', 'b5Url'  => '/loft-conversion-waltham-forest',
	'b6Name'  => 'Lewisham',       'b6Url'  => '/loft-conversion-lewisham',
	'b7Name'  => 'Greenwich',      'b7Url'  => '/loft-conversion-greenwich',
	'b8Name'  => 'Wandsworth',     'b8Url'  => '/loft-conversion-wandsworth',
	'b9Name'  => 'Lambeth',        'b9Url'  => '/loft-conversion-lambeth',
	'b10Name' => 'Southwark',      'b10Url' => '/loft-conversion-southwark',
	'b11Name' => 'Tower Hamlets',  'b11Url' => '/loft-conversion-tower-hamlets',
	'b12Name' => 'Newham',         'b12Url' => '/loft-conversion-newham',
	'fc1Name' => 'Wandsworth', 'fc1Desc' => 'Battersea, Tooting, Balham. High-value Victorian stock — strong ROI on loft conversions.',                               'fc1Cost' => 'Typical cost: £78k–£100k', 'fc1Cta' => 'View Wandsworth →', 'fc1Url' => '/loft-conversion-wandsworth',
	'fc2Name' => 'Islington',  'fc2Desc' => 'Multiple conservation areas — Barnsbury, Canonbury. We advise on planning status from day one.',                         'fc2Cost' => 'Typical cost: £80k–£100k', 'fc2Cta' => 'View Islington →',  'fc2Url' => '/loft-conversion-islington',
	'fc3Name' => 'Haringey',   'fc3Desc' => 'Crouch End, Muswell Hill — excellent Victorian and Edwardian terraces. Well-suited to dormer conversions.',              'fc3Cost' => 'Typical cost: £72k–£92k',  'fc3Cta' => 'View Haringey →',   'fc3Url' => '/loft-conversion-haringey',
];
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== ''; } ), $defaults );

$default_boroughs = [];
for ( $i = 1; $i <= 12; $i++ ) {
	$default_boroughs[] = [
		'name' => $defaults[ 'b' . $i . 'Name' ],
		'url'  => $defaults[ 'b' . $i . 'Url' ],
	];
}

$default_feature_cards = [
	[
		'name' => $defaults['fc1Name'],
		'desc' => $defaults['fc1Desc'],
		'cost' => $defaults['fc1Cost'],
		'cta'  => $defaults['fc1Cta'],
		'url'  => $defaults['fc1Url'],
	],
	[
		'name' => $defaults['fc2Name'],
		'desc' => $defaults['fc2Desc'],
		'cost' => $defaults['fc2Cost'],
		'cta'  => $defaults['fc2Cta'],
		'url'  => $defaults['fc2Url'],
	],
	[
		'name' => $defaults['fc3Name'],
		'desc' => $defaults['fc3Desc'],
		'cost' => $defaults['fc3Cost'],
		'cta'  => $defaults['fc3Cta'],
		'url'  => $defaults['fc3Url'],
	],
];

$boroughs = ( isset( $a['boroughs'] ) && is_array( $a['boroughs'] ) && ! empty( $a['boroughs'] ) ) ? $a['boroughs'] : $default_boroughs;
$feature_cards = ( isset( $a['featureCards'] ) && is_array( $a['featureCards'] ) && ! empty( $a['featureCards'] ) ) ? $a['featureCards'] : $default_feature_cards;
?>
<section class="section section--dark" id="areas">
	<div class="wrap">
		<div style="text-align:center;margin-bottom:44px;">
			<span class="eyebrow"><?php echo blocksy_child_kses_inline( $a['eyebrow'] ); ?></span>
			<h2 style="color:#fff;"><?php echo blocksy_child_kses_inline( $a['h2'] ); ?></h2>
			<p style="color:var(--color-muted);max-width:500px;margin:12px auto 0;font-size:0.95rem;"><?php echo blocksy_child_kses_inline( $a['description'] ); ?></p>
		</div>
		<div class="borough-grid" style="margin-bottom:44px;">
			<?php foreach ( $boroughs as $borough ) : ?>
			<?php
			$borough_name = isset( $borough['name'] ) ? (string) $borough['name'] : '';
			$borough_url = isset( $borough['url'] ) ? (string) $borough['url'] : '';
			if ( '' === trim( $borough_name ) ) {
				continue;
			}
			?>
			<a href="<?php echo esc_url( $borough_url ); ?>" class="borough-pill"><?php echo blocksy_child_kses_inline( $borough_name ); ?></a>
			<?php endforeach; ?>
		</div>
		<div class="grid-3">
			<?php foreach ( $feature_cards as $feature_card ) : ?>
			<?php
			$feature_name = isset( $feature_card['name'] ) ? (string) $feature_card['name'] : '';
			$feature_desc = isset( $feature_card['desc'] ) ? (string) $feature_card['desc'] : '';
			$feature_cost = isset( $feature_card['cost'] ) ? (string) $feature_card['cost'] : '';
			$feature_cta = isset( $feature_card['cta'] ) ? (string) $feature_card['cta'] : '';
			$feature_url = isset( $feature_card['url'] ) ? (string) $feature_card['url'] : '';
			if ( '' === trim( $feature_name ) ) {
				continue;
			}
			?>
			<div class="card--dark">
				<h4 style="color:#fff;margin-bottom:6px;"><?php echo blocksy_child_kses_inline( $feature_name ); ?></h4>
				<p style="color:var(--color-muted);font-size:0.85rem;margin-bottom:10px;"><?php echo blocksy_child_kses_inline( $feature_desc ); ?></p>
				<div style="font-size:0.8rem;color:var(--color-orange);font-weight:600;margin-bottom:10px;"><?php echo blocksy_child_kses_inline( $feature_cost ); ?></div>
				<a href="<?php echo esc_url( $feature_url ); ?>" class="btn btn--white" style="font-size:0.8rem;"><?php echo blocksy_child_kses_inline( $feature_cta ); ?></a>
			</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
