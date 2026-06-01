<?php
defined( 'ABSPATH' ) || exit;
$defaults = [
	'eyebrow' => 'FAQs',
	'h2'      => 'Dormer Loft Conversion: Common Questions',
	'q1'  => 'How much does a dormer loft conversion cost?',
	'a1'  => '£70,000–£100,000 all-in with My Loft. Fixed price confirmed after free survey. Includes structural work, designer collection, en-suite, fitted furniture, project management, and a 6-year workmanship guarantee. No hidden costs.',
	'q2'  => 'How much value does a dormer add to my home?',
	'a2'  => 'Typically 15–20% in London. A £800k property with an £85k conversion often reaches £920k–£960k, creating a net gain of £35k–£75k — plus years of enjoyment before any sale.',
	'q3'  => 'Can I finance a dormer loft conversion?',
	'a3'  => 'Yes. Options include remortgage or equity release (2–5% APR), home improvement loans (4–9% APR, up to £100k), or our milestone payment plan. We provide full cost breakdowns to support mortgage or loan applications.',
	'q4'  => 'Do I need to hire an interior designer separately?',
	'a4'  => 'No. Every My Loft project includes a complete signature collection by a named interior designer — at no extra cost. Each scheme covers layout, colours, materials, furniture, lighting, and finishing touches.',
	'q5'  => 'Can I customise a designer collection?',
	'a5'  => 'Collections are pre-designed systems — this is what keeps delivery efficient and pricing fixed. Choose from 6 styles, select en-suite specification, and add optional upgrades. Minor palette adjustments are possible. Fully bespoke design is available through Masterpiece Construction (£250k+ projects).',
	'q6'  => 'Do I need planning permission for a dormer extension?',
	'a6'  => 'Most rear dormers don\'t — they qualify under permitted development. Planning is required for front or side dormers, conservation areas, listed buildings, and Article 4 direction areas. We confirm your planning status at survey and handle any applications needed.',
	'q7'  => 'What about party walls in a terraced house?',
	'a7'  => 'The Party Wall Act 1996 applies where work affects shared walls. We serve all notices, handle agreements, and appoint surveyors if needed. Surveyor costs (if required, £700–£1,500) are included in your fixed quote.',
	'q8'  => 'How long does a dormer loft conversion take?',
	'a8'  => '6–10 weeks from contract to handover. We\'re faster because pre-designed collections eliminate the design phase, materials are pre-ordered, and dedicated teams know our workflow inside out. Quality is maintained through Masterpiece Construction standards, a named PM, and weekly progress updates.',
	'q9'  => 'Will I need to move out?',
	'a9'  => 'No — 95% of our clients stay throughout the build. Some choose to stay elsewhere during weeks 1–2 (structural phase) if very noise-sensitive or with very young children, but it isn\'t required. Your home remains fully functional throughout.',
	'q10' => 'Which properties cannot be converted?',
	'a10' => 'Properties with insufficient headroom (below 2.2m ridge height), modern truss roofs (unless modified at +£10–15k), poor structural condition, or complex multi-valley roofs. We assess honestly at survey — 95% of London Victorian and Edwardian terraces are suitable.',
	'q11' => 'What guarantees do you provide?',
	'a11' => '6-year workmanship guarantee, manufacturer warranties on all products, building regulations completion certificate, fixed-price guarantee, 6–10 week timeline commitment, and a 4-week post-completion check-in call.',
	'ctaImageId'   => 0,
	'ctaImageUrl'  => '',
	'ctaImageAlt'  => '',
	'ctaTitle'     => 'Ready to Get Started?',
	'ctaBody'      => 'We visit your property, confirm feasibility, and deliver a fixed price within 48 hours. No surprises — ever.',
	'ctaBtn1Text'  => 'Book Free Survey →',
	'ctaBtn1Url'   => '#contact',
	'ctaBtn2Text'  => 'Get Instant Estimate →',
	'ctaBtn2Url'   => '#calculator',
	'faqs'         => [],
];
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== ''; } ), $defaults );
$cta_img = ! empty( $a['ctaImageUrl'] ) ? $a['ctaImageUrl'] : 'https://masterpiececonstruction.co.uk/wp-content/uploads/2023/04/project1-8-scaled-1.jpg';

$legacy_faqs = [];
for ( $i = 1; $i <= 11; $i++ ) {
	$legacy_faqs[] = [
		'question' => isset( $a[ 'q' . $i ] ) ? (string) $a[ 'q' . $i ] : '',
		'answer'   => isset( $a[ 'a' . $i ] ) ? (string) $a[ 'a' . $i ] : '',
	];
}

$faqs = [];
if ( isset( $a['faqs'] ) && is_array( $a['faqs'] ) && ! empty( $a['faqs'] ) ) {
	foreach ( $a['faqs'] as $row ) {
		$question = ( isset( $row['question'] ) ) ? (string) $row['question'] : '';
		$answer = ( isset( $row['answer'] ) ) ? (string) $row['answer'] : '';
		if ( '' === trim( $question ) && '' === trim( $answer ) ) {
			continue;
		}
		$faqs[] = [
			'question' => $question,
			'answer'   => $answer,
		];
	}
}
if ( empty( $faqs ) ) {
	$faqs = $legacy_faqs;
}
?>
<section class="section section--dark" id="faq">
	<div class="wrap">
		<div class="grid-2" style="gap:64px;align-items:flex-start;">
			<div>
				<span class="eyebrow"><?php echo blocksy_child_kses_inline( $a['eyebrow'] ); ?></span>
				<h2 style="color:#fff;margin-bottom:36px;"><?php echo blocksy_child_kses_inline( $a['h2'] ); ?></h2>
				<?php foreach ( $faqs as $index => $row ) : ?>
				<?php
				$item_classes = ( 0 === $index ) ? 'faq-item open' : 'faq-item';
				$item_style = ( $index === count( $faqs ) - 1 ) ? ' style="border-bottom:none;"' : '';
				?>
				<div class="<?php echo esc_attr( $item_classes ); ?>"<?php echo $item_style; ?>>
					<h3 class="faq-q" onclick="this.closest('.faq-item').classList.toggle('open')"><?php echo blocksy_child_kses_inline( $row['question'] ); ?><span class="faq-toggle"></span></h3>
					<div class="faq-a"><?php echo blocksy_child_kses_inline( $row['answer'] ); ?></div>
				</div>
				<?php endforeach; ?>
			</div>

			<div style="position:sticky;top:90px;">
				<div style="position:relative;border-radius:var(--radius-img);overflow:hidden;min-height:480px;display:flex;flex-direction:column;justify-content:flex-end;">
					<div class="img-ph" style="position:absolute;inset:0;border-radius:0;background-image:url('<?php echo esc_url( $cta_img ); ?>');background-size:cover;background-position:center;"></div>
					<div style="position:relative;z-index:2;margin:20px;padding:28px;background:rgba(0,0,0,0.55);border-radius:16px;backdrop-filter:blur(12px);">
						<h3 style="color:#fff;margin-bottom:10px;font-size:1.1rem;"><?php echo blocksy_child_kses_inline( $a['ctaTitle'] ); ?></h3>
						<p style="color:rgba(255,255,255,0.75);font-size:0.875rem;margin-bottom:22px;"><?php echo blocksy_child_kses_inline( $a['ctaBody'] ); ?></p>
						<a href="<?php echo esc_url( $a['ctaBtn1Url'] ); ?>" class="btn-cta btn-cta--solid" style="width:100%;justify-content:center;margin-bottom:12px;"><?php echo blocksy_child_kses_inline( $a['ctaBtn1Text'] ); ?></a>
						<div style="text-align:center;">
							<a href="<?php echo esc_url( $a['ctaBtn2Url'] ); ?>" class="btn btn--white" style="font-size:0.85rem;justify-content:center;"><?php echo blocksy_child_kses_inline( $a['ctaBtn2Text'] ); ?></a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
