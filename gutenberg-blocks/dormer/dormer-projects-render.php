<?php
defined( 'ABSPATH' ) || exit;
$proj_defaults = [
	[ 'imgDefault' => 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-11-scaled-1.jpg', 'title' => 'Serene Collection, Richmond',  'detail' => 'Victorian terrace · 7 weeks · £78,000' ],
	[ 'imgDefault' => 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-10-scaled-1.jpg', 'title' => 'Bold Collection, Islington',   'detail' => 'Edwardian semi · 8 weeks · £92,000' ],
	[ 'imgDefault' => 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-9-scaled-1.jpg',  'title' => 'Family Collection, Chiswick', 'detail' => 'Victorian terrace · 6 weeks · £72,000' ],
];
$defaults = [
	'eyebrow'      => 'Completed Projects',
	'h2'           => 'Design-Led Loft Conversions Across London',
	'viewAllText'  => 'View All Projects →',
	'viewAllUrl'   => '#',
	'proj1ImageId'  => 0, 'proj1ImageUrl' => '', 'proj1ImageAlt' => '', 'proj1Title' => 'Serene Collection, Richmond',  'proj1Detail' => 'Victorian terrace · 7 weeks · £78,000',
	'proj2ImageId'  => 0, 'proj2ImageUrl' => '', 'proj2ImageAlt' => '', 'proj2Title' => 'Bold Collection, Islington',   'proj2Detail' => 'Edwardian semi · 8 weeks · £92,000',
	'proj3ImageId'  => 0, 'proj3ImageUrl' => '', 'proj3ImageAlt' => '', 'proj3Title' => 'Family Collection, Chiswick', 'proj3Detail' => 'Victorian terrace · 6 weeks · £72,000',
	'test1Quote' => '"We couldn\'t afford a designer and a builder separately. My Loft meant we got a beautifully designed space at the same price we\'d budgeted for a basic conversion."',
	'test1Name'  => 'Sarah &amp; James',
	'test1Loc'   => 'Richmond · Serene Collection',
	'test2Quote' => '"The fixed pricing gave us total peace of mind. Weekly photo updates, on budget, on time. The Bold collection has so much personality — it\'s become our favourite room."',
	'test2Name'  => 'Priya &amp; Michael',
	'test2Loc'   => 'Islington · Bold Collection',
	'test3Quote' => '"Three months before our due date, My Loft delivered on time and created a nursery more beautiful than we could have designed ourselves."',
	'test3Name'  => 'Emma &amp; Tom',
	'test3Loc'   => 'Chiswick · Family Collection',
];
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== ''; } ), $defaults );
?>
<section class="section section--dark" id="projects">
	<div class="wrap">
		<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:44px;flex-wrap:wrap;gap:16px;">
			<div>
				<span class="eyebrow"><?php echo esc_html( $a['eyebrow'] ); ?></span>
				<h2 style="color:#fff;"><?php echo esc_html( $a['h2'] ); ?></h2>
			</div>
			<a href="<?php echo esc_url( $a['viewAllUrl'] ); ?>" class="btn btn--white"><?php echo esc_html( $a['viewAllText'] ); ?></a>
		</div>
		<div class="grid-3" style="margin-bottom:36px;">
			<?php for ( $i = 1; $i <= 3; $i++ ) :
				$img_url = ! empty( $a[ 'proj' . $i . 'ImageUrl' ] ) ? $a[ 'proj' . $i . 'ImageUrl' ] : $proj_defaults[ $i - 1 ]['imgDefault'];
			?>
			<div>
				<div class="img-ph" style="aspect-ratio:4/3;background-image:url('<?php echo esc_url( $img_url ); ?>');background-size:cover;background-position:center;"></div>
				<p style="color:#fff;font-weight:600;font-size:0.9rem;margin-top:10px;"><?php echo esc_html( $a[ 'proj' . $i . 'Title' ] ); ?></p>
				<p style="color:var(--color-grey-icon);font-size:0.8rem;"><?php echo esc_html( $a[ 'proj' . $i . 'Detail' ] ); ?></p>
			</div>
			<?php endfor; ?>
		</div>
		<div class="grid-3">
			<?php for ( $i = 1; $i <= 3; $i++ ) : ?>
			<div style="background:var(--color-white);border-radius:var(--radius-card);padding:28px 32px;">
				<p style="font-size:0.9rem;line-height:1.75;color:#3a3a3a;font-style:italic;margin-bottom:16px;"><?php echo wp_kses_post( $a[ 'test' . $i . 'Quote' ] ); ?></p>
				<div style="font-size:0.875rem;font-weight:700;color:var(--color-black);"><?php echo wp_kses_post( $a[ 'test' . $i . 'Name' ] ); ?></div>
				<div style="font-size:0.78rem;color:#999;margin-top:2px;"><?php echo esc_html( $a[ 'test' . $i . 'Loc' ] ); ?></div>
			</div>
			<?php endfor; ?>
		</div>
	</div>
</section>
