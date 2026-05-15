<?php
defined( 'ABSPATH' ) || exit;
$defaults = [
	'stat1Label' => 'Fixed Price',
	'stat1Value' => 'Guaranteed',
	'stat2Label' => 'Delivery',
	'stat2Value' => '6–10 Weeks',
	'stat3Label' => 'Designer Collections',
	'stat3Value' => 'Included',
	'stat4Label' => 'Design Fees',
	'stat4Value' => '£0',
	'stat5Label' => 'Workmanship',
	'stat5Value' => '6-Year Guarantee',
	'stat6Label' => 'By',
	'stat6Value' => 'Masterpiece Construction',
];
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== ''; } ), $defaults );
$stats = [];
for ( $i = 1; $i <= 6; $i++ ) {
	$stats[] = [ 'label' => $a[ 'stat' . $i . 'Label' ], 'value' => $a[ 'stat' . $i . 'Value' ] ];
}
?>
<section class="section--dark" style="padding:40px 0;border-top:1px solid rgba(255,255,255,0.07);">
	<div class="wrap" style="width:var(--theme-container-width,1200px);max-width:var(--theme-normal-container-max-width,1200px);">
		<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:16px;align-items:center;justify-items:center;">
			<?php foreach ( $stats as $stat ) : ?>
			<div style="text-align:center;">
				<div style="font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--color-grey-icon);margin-bottom:3px;"><?php echo esc_html( $stat['label'] ); ?></div>
				<div style="font-size:0.95rem;font-weight:800;color:var(--color-grey-icon)"><?php echo esc_html( $stat['value'] ); ?></div>
			</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
