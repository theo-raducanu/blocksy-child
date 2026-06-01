<?php
defined( 'ABSPATH' ) || exit;
$col_defaults = [
	[ 'designer' => 'Olivia Hart Collection', 'name' => 'Serene',   'desc' => 'Scandi-minimal · Warm whites, pale oak, soft grey · Master bedroom retreat',       'price' => 'From £70,000', 'imgDefault' => 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Richmond-scaled.jpg' ],
	[ 'designer' => 'Olivia Hart Collection', 'name' => 'Bold',     'desc' => 'Contemporary · Charcoal, terracotta, brass · Creative office / guest room',          'price' => 'From £75,000', 'imgDefault' => 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Chelsea.jpg' ],
	[ 'designer' => 'James Chen Collection',  'name' => 'Heritage', 'desc' => 'Modern classic · Warm greys, deep greens, natural wood · Master bedroom + dressing', 'price' => 'From £78,000', 'imgDefault' => 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Putney-2-scaled.jpg' ],
	[ 'designer' => 'James Chen Collection',  'name' => 'Urban',    'desc' => 'Industrial-modern · Black, white, concrete grey, steel · Home office / studio',      'price' => 'From £72,000', 'imgDefault' => 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Putney-1-scaled.jpg' ],
	[ 'designer' => 'Priya Sharma Collection','name' => 'Family',   'desc' => 'Playful · Soft pastels, natural woods, white · Nursery / playroom',                  'price' => 'From £70,000', 'imgDefault' => 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Chiswick-scaled.jpg' ],
	[ 'designer' => 'Priya Sharma Collection','name' => 'Haven',    'desc' => 'Calm retreat · Stone, linen, warm timber, botanical · Bedroom sanctuary',            'price' => 'From £74,000', 'imgDefault' => 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/Putney-scaled.jpg' ],
];
$defaults = [
	'eyebrow'  => 'Designer Collections',
	'h2'       => 'Six Signature Collections. No Design Fees. No Guesswork.',
	'intro'    => 'Three interior designers have created six complete loft schemes — each covering layout, colours, materials, furniture, lighting, and every finishing detail.',
	'cta1Text' => 'Get Instant Estimate →',
	'cta1Url'  => '#calculator',
	'cta2Text' => 'Book Free Survey →',
	'cta2Url'  => '#contact',
];
for ( $i = 1; $i <= 6; $i++ ) {
	$c = $col_defaults[ $i - 1 ];
	$defaults[ 'col' . $i . 'ImageId' ]      = 0;
	$defaults[ 'col' . $i . 'ImageUrl' ]     = '';
	$defaults[ 'col' . $i . 'ImageAlt' ]     = '';
	$defaults[ 'col' . $i . 'ImageDefault' ] = $c['imgDefault'];
	$defaults[ 'col' . $i . 'Designer' ]     = $c['designer'];
	$defaults[ 'col' . $i . 'Name' ]         = $c['name'];
	$defaults[ 'col' . $i . 'Desc' ]         = $c['desc'];
	$defaults[ 'col' . $i . 'Price' ]        = $c['price'];
}
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== ''; } ), $defaults );
?>
<section class="section section--light" id="collections">
	<div class="wrap">
		<div style="text-align:center;margin-bottom:52px;">
			<span class="eyebrow"><?php echo blocksy_child_kses_inline( $a['eyebrow'] ); ?></span>
			<h2 style="margin-bottom:14px;"><?php echo blocksy_child_kses_inline( $a['h2'] ); ?></h2>
			<p style="max-width:580px;margin:0 auto;color:#5a5a5a;"><?php echo blocksy_child_kses_inline( $a['intro'] ); ?></p>
		</div>
		<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:32px;">
			<?php for ( $i = 1; $i <= 6; $i++ ) :
				$img_url = ! empty( $a[ 'col' . $i . 'ImageUrl' ] ) ? $a[ 'col' . $i . 'ImageUrl' ] : $col_defaults[ $i - 1 ]['imgDefault'];
			?>
			<div class="col-card">
				<div class="img-ph img-ph--light" style="aspect-ratio:4/3;border-radius:var(--radius-img) var(--radius-img) 0 0;background-image:url('<?php echo esc_url( $img_url ); ?>');background-size:cover;background-position:center;"></div>
				<div class="col-card__body">
					<div class="col-card__designer"><?php echo blocksy_child_kses_inline( $a[ 'col' . $i . 'Designer' ] ); ?></div>
					<div class="col-card__name"><?php echo blocksy_child_kses_inline( $a[ 'col' . $i . 'Name' ] ); ?></div>
					<div class="col-card__desc"><?php echo blocksy_child_kses_inline( $a[ 'col' . $i . 'Desc' ] ); ?></div>
					<div class="col-card__price"><?php echo blocksy_child_kses_inline( $a[ 'col' . $i . 'Price' ] ); ?></div>
				</div>
			</div>
			<?php endfor; ?>
		</div>
		<div style="text-align:center;">
			<a href="<?php echo esc_url( $a['cta1Url'] ); ?>" class="btn-cta btn-cta--solid"><?php echo blocksy_child_kses_inline( $a['cta1Text'] ); ?></a>
			&nbsp;&nbsp;
			<a href="<?php echo esc_url( $a['cta2Url'] ); ?>" class="btn btn--dark"><?php echo blocksy_child_kses_inline( $a['cta2Text'] ); ?></a>
		</div>
	</div>
</section>
