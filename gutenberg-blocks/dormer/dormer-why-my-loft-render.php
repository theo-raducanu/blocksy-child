<?php
defined( 'ABSPATH' ) || exit;
$defaults = [
	'eyebrow'      => 'Why My Loft',
	'h2'           => 'Why Choose My Loft for Your Dormer Conversion?',
	'h3Subtitle'   => 'Design-Led Lofts, Fixed Price, Zero Stress',
	'usp1Badge'    => 'No Design Fees',
	'usp1H3'       => 'Designer Collections Included',
	'usp1P'        => 'Six signature collections by named interior designers — complete schemes covering layout, materials, furniture, lighting, and finishing touches. Included in every project at no extra cost.',
	'usp2Badge'    => 'Price Guarantee',
	'usp2H3'       => 'Fixed Pricing from Day One',
	'usp2P'        => 'The price we quote is the price you pay. No hidden costs, no provisional sums, no "we\'ll see on site" surprises. You know exactly what you\'re getting before you commit.',
	'usp3Badge'    => 'Fast Build',
	'usp3H3'       => '6–10 Week Delivery',
	'usp3P'        => 'Systematised processes, pre-designed collections, materials ordered in advance. No design delays. Dedicated teams who know our workflow — delivering faster without cutting corners.',
	'dark1H3'      => 'Masterpiece Construction Quality',
	'dark1P'       => 'My Loft is part of the Masterpiece Construction family. The same commitment to craftsmanship and quality — applied to a streamlined, fixed-price loft conversion service.',
	'dark2H3'      => 'Everything Managed for You',
	'dark2P'       => 'Named project manager from survey to handover. Building regulations, party wall notices, and all trades coordination handled. Weekly photo updates. 6-year workmanship guarantee.',
	'includedTitle' => 'Everything Included in Your Fixed Price',
	'inc1'  => 'Structural design by chartered engineer',
	'inc2'  => 'Your chosen designer collection',
	'inc3'  => 'Building regulations approval &amp; sign-off',
	'inc4'  => 'Bespoke fitted under-eaves storage',
	'inc5'  => 'Party wall agreements handled',
	'inc6'  => 'En-suite or shower room — complete spec',
	'inc7'  => 'Complete electrics, heating &amp; ventilation',
	'inc8'  => 'Staircase design &amp; installation',
	'inc9'  => 'Named PM, weekly updates &amp; coordination',
	'inc10' => '6-year workmanship guarantee',
	'cta1Text' => 'Get Instant Estimate →',
	'cta1Url'  => '#calculator',
	'cta2Text' => 'Book Free Survey →',
	'cta2Url'  => '#contact',
];
$_raw = isset( $block_attributes ) && is_array( $block_attributes ) ? $block_attributes : [];
$a = wp_parse_args( array_filter( $_raw, function( $v ) { return $v !== ''; } ), $defaults );
$usps = [
	[ 'badge' => $a['usp1Badge'], 'h3' => $a['usp1H3'], 'p' => $a['usp1P'] ],
	[ 'badge' => $a['usp2Badge'], 'h3' => $a['usp2H3'], 'p' => $a['usp2P'] ],
	[ 'badge' => $a['usp3Badge'], 'h3' => $a['usp3H3'], 'p' => $a['usp3P'] ],
];
$included = array_values( [ 'inc1','inc2','inc3','inc4','inc5','inc6','inc7','inc8','inc9','inc10' ] );
?>
<section class="section section--dark" id="why-my-loft">
	<div class="wrap">
		<div style="text-align:center;margin-bottom:56px;">
			<span class="eyebrow"><?php echo esc_html( $a['eyebrow'] ); ?></span>
			<h2 style="color:#fff;margin-bottom:12px;"><?php echo esc_html( $a['h2'] ); ?></h2>
			<h3 style="color:rgba(255,255,255,0.7) !important;font-size:1rem !important;font-weight:400 !important;line-height:1.6 !important;letter-spacing:normal !important;text-transform:none !important;margin:0 !important;font-family:inherit !important;"><?php echo esc_html( $a['h3Subtitle'] ); ?></h3>
		</div>
		<div class="grid-3" style="margin-bottom:32px;">
			<?php
			$usp_icons = [
				'<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />',
				'<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />',
				'<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />',
			];
			foreach ( $usps as $idx => $usp ) : ?>
			<div class="card" style="text-align:center;">
				<div class="icon-wrap" style="margin:0 auto 18px;"><svg class="icon" viewBox="0 0 24 24"><?php echo $usp_icons[ $idx ]; ?></svg></div>
				<span class="badge badge--light" style="margin-bottom:12px;"><?php echo esc_html( $usp['badge'] ); ?></span>
				<h3 style="margin-bottom:10px;"><?php echo esc_html( $usp['h3'] ); ?></h3>
				<p style="color:#5a5a5a;font-size:0.875rem;"><?php echo esc_html( $usp['p'] ); ?></p>
			</div>
			<?php endforeach; ?>
		</div>
		<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:48px;">
			<div class="card--dark">
				<div class="icon-wrap icon-wrap--white" style="margin-bottom:16px;"><svg class="icon icon--white" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg></div>
				<h3 style="color:#fff;margin-bottom:8px;"><?php echo esc_html( $a['dark1H3'] ); ?></h3>
				<p style="color:var(--color-muted);font-size:0.875rem;"><?php echo esc_html( $a['dark1P'] ); ?></p>
			</div>
			<div class="card--dark">
				<div class="icon-wrap icon-wrap--white" style="margin-bottom:16px;"><svg class="icon icon--white" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" /></svg></div>
				<h3 style="color:#fff;margin-bottom:8px;"><?php echo esc_html( $a['dark2H3'] ); ?></h3>
				<p style="color:var(--color-muted);font-size:0.875rem;"><?php echo esc_html( $a['dark2P'] ); ?></p>
			</div>
		</div>
		<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-card);padding:36px;">
			<h3 style="color:#fff;margin-bottom:24px;text-align:center;"><?php echo esc_html( $a['includedTitle'] ); ?></h3>
			<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 48px;">
				<?php foreach ( $included as $idx => $key ) :
					$is_last_pair = ( $idx >= 8 );
				?>
				<div style="display:flex;align-items:center;gap:10px;color:var(--color-muted);font-size:0.875rem;padding:6px 0;<?php echo $is_last_pair ? '' : 'border-bottom:1px solid rgba(255,255,255,0.06);'; ?>">
					<span style="color:var(--color-orange);font-weight:800;font-size:0.8rem;">✓</span><?php echo esc_html( $a[ $key ] ); ?>
				</div>
				<?php endforeach; ?>
			</div>
		</div>
		<div style="margin-top:36px;text-align:center;display:flex;justify-content:center;gap:20px;flex-wrap:wrap;">
			<a href="<?php echo esc_url( $a['cta1Url'] ); ?>" class="btn-cta btn-cta--solid"><?php echo esc_html( $a['cta1Text'] ); ?></a>
			<a href="<?php echo esc_url( $a['cta2Url'] ); ?>" class="btn btn--white"><?php echo esc_html( $a['cta2Text'] ); ?></a>
		</div>
	</div>
</section>
