<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/**
 * Template Name: ContactUs
 *
 * This template is a full-width version of the page.php template file. It removes the sidebar area.
 *
 * @package WooFramework
 * @subpackage Template
 */
	get_header('daf');
	global $woo_options;
?>
       
    <div id="content" class="page col-full">
    
    	<?php woo_main_before(); ?>
    	
		<section id="main" class="fullwidth">
           
        <?php
        	if ( have_posts() ) { $count = 0;
        		while ( have_posts() ) { the_post(); $count++;
        ?>                                                             
                <article <?php post_class(); ?>>
					<div class="featured">
						<?php if ( has_post_thumbnail() ) {the_post_thumbnail('medium');} ?>
					</div>
					
                    <div id="contactus-container">
    					<div id="contactus-header">
							<header>
								<h1><?php the_title(); ?></h1>
							</header>    					
						</div>
    
    				<div id="contactus-content">
						<section class="entry">
	                		<?php the_content(); ?>
	               		</section><!-- /.entry -->
	               	</div>
    

                </article><!-- /.post -->
                                                    
			<?php
					} // End WHILE Loop
				} else {
			?>
            <?php } ?>  
        
		</section><!-- /#main -->
		
		<?php woo_main_after(); ?>
		
    </div><!-- /#content -->
		
<?php get_footer(); ?>