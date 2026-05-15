<?php
defined( 'ABSPATH' ) || exit;
$defaults = [
	'eyebrow'     => 'All Loft Conversion Types',
	'h2'          => 'Not Sure Which Conversion Is Right for You?',
	'description' => 'We\'ll confirm the best solution for your property during your free survey. Browse all conversion types below.',
	'types'       => [],
	'type1Name'  => 'Dormer',             'type1Desc' => 'Vertical extension from roof slope. Maximum headroom and floor area. Suits most London terraces.',                  'type1Price' => 'From £70,000', 'type1Url' => '',
	'type2Name'  => 'Hip-to-Gable',       'type2Desc' => 'Extends hipped roof to a vertical gable wall. Significant space gain for semi-detached properties.',               'type2Price' => 'From £75,000', 'type2Url' => '/hip-to-gable-loft-conversion',
	'type3Name'  => 'Velux / Roof Light', 'type3Desc' => 'Adds roof windows without altering the roofline. Most affordable option where headroom is sufficient.',            'type3Price' => 'From £55,000', 'type3Url' => '/velux-loft-conversion',
	'type4Name'  => 'Mansard',            'type4Desc' => 'Near-vertical rear walls and flat roof. Maximum volume — common in central and inner London.',                       'type4Price' => 'From £80,000', 'type4Url' => '/mansard-loft-conversion',
	'type5Name'  => 'L-Shaped Dormer',    'type5Desc' => 'Rear dormer over a rear extension. Maximum space on Victorian terraces with rear additions.',                       'type5Price' => 'From £85,000', 'type5Url' => '/l-shaped-dormer-loft-conversion',
];
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== ''; } ), $defaults );

$default_types = [
	[
		'name' => $defaults['type1Name'],
		'desc' => $defaults['type1Desc'],
		'price' => $defaults['type1Price'],
		'url' => $defaults['type1Url'],
		'linkText' => 'Current page',
		'featured' => true,
		'badgeText' => 'Most Popular',
	],
	[
		'name' => $defaults['type2Name'],
		'desc' => $defaults['type2Desc'],
		'price' => $defaults['type2Price'],
		'url' => $defaults['type2Url'],
		'linkText' => 'Learn more →',
		'featured' => false,
		'badgeText' => '',
	],
	[
		'name' => $defaults['type3Name'],
		'desc' => $defaults['type3Desc'],
		'price' => $defaults['type3Price'],
		'url' => $defaults['type3Url'],
		'linkText' => 'Learn more →',
		'featured' => false,
		'badgeText' => '',
	],
	[
		'name' => $defaults['type4Name'],
		'desc' => $defaults['type4Desc'],
		'price' => $defaults['type4Price'],
		'url' => $defaults['type4Url'],
		'linkText' => 'Learn more →',
		'featured' => false,
		'badgeText' => '',
	],
	[
		'name' => $defaults['type5Name'],
		'desc' => $defaults['type5Desc'],
		'price' => $defaults['type5Price'],
		'url' => $defaults['type5Url'],
		'linkText' => 'Learn more →',
		'featured' => false,
		'badgeText' => '',
	],
];

$legacy_types = [];
for ( $i = 1; $i <= 5; $i++ ) {
	$legacy_types[] = [
		'name' => isset( $a[ 'type' . $i . 'Name' ] ) ? (string) $a[ 'type' . $i . 'Name' ] : '',
		'desc' => isset( $a[ 'type' . $i . 'Desc' ] ) ? (string) $a[ 'type' . $i . 'Desc' ] : '',
		'price' => isset( $a[ 'type' . $i . 'Price' ] ) ? (string) $a[ 'type' . $i . 'Price' ] : '',
		'url' => isset( $a[ 'type' . $i . 'Url' ] ) ? (string) $a[ 'type' . $i . 'Url' ] : '',
		'linkText' => 1 === $i ? 'Current page' : 'Learn more →',
		'featured' => 1 === $i,
		'badgeText' => 1 === $i ? 'Most Popular' : '',
	];
}

$types = [];

if ( isset( $a['types'] ) && is_array( $a['types'] ) && ! empty( $a['types'] ) ) {
	foreach ( $a['types'] as $index => $row ) {
		$name = isset( $row['name'] ) ? (string) $row['name'] : '';
		$desc = isset( $row['desc'] ) ? (string) $row['desc'] : '';
		$price = isset( $row['price'] ) ? (string) $row['price'] : '';
		$url = isset( $row['url'] ) ? (string) $row['url'] : '';
		$link_text = isset( $row['linkText'] ) ? (string) $row['linkText'] : '';
		$featured = isset( $row['featured'] ) ? (bool) $row['featured'] : ( 0 === $index );
		$badge_text = isset( $row['badgeText'] ) ? (string) $row['badgeText'] : '';

		if ( '' === trim( $name ) && '' === trim( $desc ) && '' === trim( $price ) && '' === trim( $url ) ) {
			continue;
		}

		if ( '' === trim( $link_text ) ) {
			$link_text = '' !== trim( $url ) ? 'Learn more →' : 'Current page';
		}

		if ( $featured && '' === trim( $badge_text ) ) {
			$badge_text = 'Most Popular';
		}

		$types[] = [
			'name' => $name,
			'desc' => $desc,
			'price' => $price,
			'url' => $url,
			'linkText' => $link_text,
			'featured' => $featured,
			'badgeText' => $badge_text,
		];
	}
}

if ( empty( $types ) ) {
	$types = $legacy_types;
}

if ( empty( $types ) ) {
	$types = $default_types;
}
?>
<section class="section section--light" id="types">
	<div class="wrap">
		<div style="text-align:center;margin-bottom:44px;">
			<span class="eyebrow"><?php echo esc_html( $a['eyebrow'] ); ?></span>
			<h2 style="margin-bottom:12px;"><?php echo esc_html( $a['h2'] ); ?></h2>
			<p style="max-width:520px;margin:0 auto;color:#5a5a5a;font-size:0.95rem;"><?php echo esc_html( $a['description'] ); ?></p>
		</div>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;">
			<?php foreach ( $types as $type ) : ?>
			<?php
			$type_name = isset( $type['name'] ) ? (string) $type['name'] : '';
			$type_desc = isset( $type['desc'] ) ? (string) $type['desc'] : '';
			$type_price = isset( $type['price'] ) ? (string) $type['price'] : '';
			$type_url = isset( $type['url'] ) ? (string) $type['url'] : '';
			$type_link_text = isset( $type['linkText'] ) ? (string) $type['linkText'] : 'Learn more →';
			$type_featured = ! empty( $type['featured'] );
			$type_badge_text = isset( $type['badgeText'] ) ? (string) $type['badgeText'] : '';
			?>
			<?php if ( $type_featured ) : ?>
			<div style="background:var(--color-black);border-radius:var(--radius-card);padding:24px 20px;border:2px solid var(--color-orange);position:relative;">
				<?php if ( '' !== trim( $type_badge_text ) ) : ?>
				<div style="position:absolute;top:-11px;left:50%;transform:translateX(-50%);"><span class="badge" style="font-size:0.62rem;padding:3px 7px;"><?php echo esc_html( $type_badge_text ); ?></span></div>
				<?php endif; ?>
				<h4 style="color:#fff;margin-bottom:6px;font-size:0.95rem;"><?php echo esc_html( $type_name ); ?></h4>
				<p style="color:var(--color-muted);font-size:0.78rem;margin-bottom:10px;"><?php echo esc_html( $type_desc ); ?></p>
				<div style="font-size:0.78rem;color:var(--color-orange);font-weight:700;margin-bottom:10px;"><?php echo esc_html( $type_price ); ?></div>
				<?php if ( '' !== trim( $type_url ) ) : ?>
				<a href="<?php echo esc_url( $type_url ); ?>" class="btn btn--white" style="font-size:0.78rem;"><?php echo esc_html( $type_link_text ); ?></a>
				<?php else : ?>
				<span style="font-size:0.75rem;color:rgba(255,255,255,0.4);font-weight:600;"><?php echo esc_html( $type_link_text ); ?></span>
				<?php endif; ?>
			</div>
			<?php else : ?>
			<div style="background:var(--color-white);border-radius:var(--radius-card);padding:24px 20px;">
				<h4 style="margin-bottom:6px;font-size:0.95rem;"><?php echo esc_html( $type_name ); ?></h4>
				<p style="color:#777;font-size:0.78rem;margin-bottom:10px;"><?php echo esc_html( $type_desc ); ?></p>
				<div style="font-size:0.78rem;color:var(--color-orange);font-weight:700;margin-bottom:10px;"><?php echo esc_html( $type_price ); ?></div>
				<?php if ( '' !== trim( $type_url ) ) : ?>
				<a href="<?php echo esc_url( $type_url ); ?>" class="btn btn--dark" style="font-size:0.78rem;"><?php echo esc_html( $type_link_text ); ?></a>
				<?php else : ?>
				<span style="font-size:0.78rem;color:#666;font-weight:600;"><?php echo esc_html( $type_link_text ); ?></span>
				<?php endif; ?>
			</div>
			<?php endif; ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>
