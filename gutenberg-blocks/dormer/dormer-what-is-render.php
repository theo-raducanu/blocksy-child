<?php
defined( 'ABSPATH' ) || exit;
$defaults = [
	'eyebrow' => 'Dormer Loft Conversions',
	'h2'      => 'What Is a Dormer Loft Conversion?',
	'para1'   => 'A dormer loft conversion adds a vertical extension — a <strong>dormer roof extension</strong> — to your existing roof slope, creating full-height walls, a proper floor, and significantly more natural light.',
	'para2'   => 'This type of loft conversion with dormer windows is London\'s most popular choice, particularly on Victorian and Edwardian terraces across Zones 2–5. A rear dormer typically qualifies for permitted development — no planning permission required.',
	'h3'      => 'Is a Dormer Right for Your Property?',
	'check1'  => 'At least 2.2m headroom at the ridge (highest point of roof)',
	'check2'  => 'Victorian or Edwardian terrace, semi-detached, or detached house',
	'check3'  => 'Traditional timber-framed roof structure',
	'check4'  => 'Rear elevation — not in a conservation area (or willing to apply)',
	'note'    => 'We confirm feasibility during your free survey — no commitment required.',
	'imageId'  => 0,
	'imageUrl' => '',
	'imageAlt' => '',
];
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== ''; } ), $defaults );
?>
<section class="section section--light" id="what-is-dormer">
	<div class="wrap">
		<div class="grid-2" style="gap:64px;">
			<div>
				<span class="eyebrow"><?php echo blocksy_child_kses_inline( $a['eyebrow'] ); ?></span>
				<h2 style="margin-bottom:20px;"><?php echo blocksy_child_kses_inline( $a['h2'] ); ?></h2>
				<p style="color:#3a3a3a;margin-bottom:16px;"><?php echo blocksy_child_kses_inline( $a['para1'] ); ?></p>
				<p style="color:#5a5a5a;margin-bottom:24px;"><?php echo blocksy_child_kses_inline( $a['para2'] ); ?></p>
				<h3 style="margin-bottom:14px;font-size:1rem;"><?php echo blocksy_child_kses_inline( $a['h3'] ); ?></h3>
				<ul class="checklist checklist--light">
					<li><span class="chk">✓</span><?php echo blocksy_child_kses_inline( $a['check1'] ); ?></li>
					<li><span class="chk">✓</span><?php echo blocksy_child_kses_inline( $a['check2'] ); ?></li>
					<li><span class="chk">✓</span><?php echo blocksy_child_kses_inline( $a['check3'] ); ?></li>
					<li><span class="chk">✓</span><?php echo blocksy_child_kses_inline( $a['check4'] ); ?></li>
				</ul>
				<p style="color:#999;font-size:0.85rem;margin-top:14px;"><?php echo blocksy_child_kses_inline( $a['note'] ); ?></p>
			</div>
			<div>
				<div class="img-ph img-ph--light" style="width:100%;aspect-ratio:4/3;background-image:url('<?php echo esc_url( ! empty( $a['imageUrl'] ) ? $a['imageUrl'] : 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Kew.jpg' ); ?>');background-size:cover;background-position:center;"></div>
			</div>
		</div>
	</div>
</section>
