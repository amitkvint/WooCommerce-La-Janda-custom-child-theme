<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/**
 * Header Template
 *
 * Here we setup all logic and XHTML that is required for the header section of all screens.
 *
 * @package WooFramework
 * @subpackage Template
 */
 
 global $woo_options;
 
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<title><?php woo_title( '' ); ?></title>
<?php woo_meta(); ?>
<link rel="pingback" href="<?php echo esc_url( get_bloginfo( 'pingback_url' ) ); ?>" />
<?php
wp_head();
woo_head();
?>
<!-- Add jquery script to support Conditional Forms-->
<script type="text/javascript" src="<?php echo get_stylesheet_directory_uri(); ?>/js/1.7.1/jquery.min.js"></script>
<script type="text/javascript" src="<?php echo get_stylesheet_directory_uri(); ?>/js/1.7.1/hidefieldsScript.js"></script>
<!-- IE Fix for HTML5 Tags -->
<!--[if lt IE 9]>
<script src=" http://html5shiv.googlecode.com/svn/trunk/html5.js "></script>
<![endif]--> 
</head>
<body <?php body_class(); ?>>
<?php woo_top(); ?>
		
<div id="wrapper">
			<a href="http://lajanda.org/" class="float-logo" title="Learn Spanish at the Costa de La Luz"></a>
	<div class="top-things clearfix">
	   	<a href="http://lajanda.org/" class="top-logo" title="La Janda Spanish School"></a>
				<div class="social-links">
					<a href="http://www.facebook.com/lajandaspanishschool" title="La Janda Spanish School" class="icon-socialfacebook"></a>
					<a href="https://twitter.com/LaJandaVejer" title="La Janda Spanish School" class="icon-socialtwitter"></a>
					<a href="http://pinterest.com/lajanda/" title="La Janda Spanish School" class="icon-socialpinterest"></a>
					<a href="http://www.youtube.com/user/ihvejer" title="La Janda Spanish School" class="icon-socialplay"></a>
					<a href="http://lajanda.org/contact-la-janda-spanish-school/" title="La Janda Spanish School" class="icon-socialmail"></a>
					<div class="snail">
						<a href="#" class="icon-socialphone" title="La Janda Spanish School"></a>
						<a href="#" class="phone-number" title="La Janda Spanish School">+34 956447060</a>
					</div>
				</div>
					<?php if (function_exists('dynamic_sidebar') && dynamic_sidebar('tag-line')) : else : ?>
					<?php endif; ?>

	</div>
				
    <?php woo_header_before(); ?>

	<header id="header">
		
		<div class="col-full">
			
			<?php woo_header_inside(); ?>
			
		    <hgroup>
				<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a></h1>
				<h2 class="site-description"><?php bloginfo( 'description' ); ?></h2>
				<h3 class="nav-toggle"><a href="#navigation">&#9776; <span><?php _e( 'Navigation', 'woothemes' ); ?></span></a></h3>
			</hgroup>
	        
	        <?php woo_nav_before(); ?>

			<nav id="navigation" role="navigation">
				
				<?php
				if ( function_exists( 'has_nav_menu' ) && has_nav_menu( 'primary-menu' ) ) {
					wp_nav_menu( array( 'depth' => 6, 'sort_column' => 'menu_order', 'container' => 'ul', 'menu_id' => 'main-nav', 'menu_class' => 'nav fl', 'theme_location' => 'primary-menu' ) );
				} else {
				?>
		        <ul id="main-nav" class="nav fl">
					<?php if ( is_page() ) $highlight = 'page_item'; else $highlight = 'page_item current_page_item'; ?>
					<li class="<?php echo $highlight; ?>"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php _e( 'Home', 'woothemes' ); ?></a></li>
					<?php wp_list_pages( 'sort_column=menu_order&depth=6&title_li=&exclude=' ); ?>
				</ul><!-- /#nav -->
		        <?php } ?>

				<?php if ( isset( $woo_options['woo_header_search'] ) && ( $woo_options['woo_header_search'] == 'true' ) ): ?>
				<section class="search_main">
				    <form method="get" class="searchform" action="<?php echo home_url( '/' ); ?>" >
				        <input type="text" class="field s" name="s" placeholder="<?php esc_attr_e( 'Search...', 'woothemes' ); ?>" />
				    </form>
				</section><!--/.search_main-->
				<?php endif; ?>
		      
			</nav><!-- /#navigation -->
			<span class="enroll-button"><a href="http://lajanda.org/enrollment-form/">Enroll Now!</a></span>

			<?php woo_nav_after(); ?>

		</div><!-- /.col-full -->
	
	</header><!-- /#header -->

	<?php woo_content_before(); ?>
