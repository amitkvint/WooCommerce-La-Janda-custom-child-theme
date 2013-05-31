<?php


// Declare sidebar widgets

// Tag Line Widget

    if (function_exists('register_sidebar')) {
    	register_sidebar(array(
    		'name' => 'Tag Line',
    		'id'   => 'tag-line',
    		'description'   => 'This is our tag line widget for the header.',
    		'before_widget' => '',
    		'after_widget'  => '',
    		'before_title'  => '<h2>',
    		'after_title'   => '</h2>'
    	));
    }
    // Quote Line Widget
    if (function_exists('register_sidebar')) {
        register_sidebar(array(
            'name' => 'Quote Line',
            'id'   => 'quote-line',
            'description'   => 'This is our tag line widget for the quotes header.',
            'before_widget' => '<div>',
            'after_widget'  => '<span class="quote-page"><a href="http://lajanda.org/testimonials/">More testimonails here...</a></span></div>',
            'before_title'  => '<h2>',
            'after_title'   => '</h2>'
        ));
    }

     if (function_exists('register_sidebar')) {
        register_sidebar(array(
            'name' => 'Welcome Widget',
            'id'   => 'welcome-widget',
            'description'   => 'This is our welcome homepage widget for the header.',
            'before_widget' => '<div>',
            'after_widget'  => '</div>',
            'before_title'  => '<h2>',
            'after_title'   => '</h2>'
        ));
    }
    // register navs

    // Banners Menu

    if (function_exists('register_nav_menus')) {

        function register_lajanda_menus() {
          register_nav_menus(
            array(
            'banner-nav' => __( 'Home page Banners Menu' )
            )
          );
        }
    }

        add_action( 'init', 'register_lajanda_menus' );
    
    // Courses Menu

        if (function_exists('register_nav_menus')) {

        function register_course_menus() {
          register_nav_menus(
            array(
            'course-nav' => __( 'Course page Nav Menu' )
            )
          );
        }
    }
        add_action( 'init', 'register_course_menus' );

            // Courses Enrollment

        add_action('woocommerce_after_main_content', 'insert_enrol');
 
        function insert_enrol() {
                echo do_shortcode( '[contact-form-7 id="483" title="Enrolment Form"]' );
            }

            // Remove from price in single-product.php

        function custom_from_price_html( $price, $product ) { 
                if ( strpos( $price, 'From: ' ) <> false ) 
                return ''; 
                else return $price; 
                } 
                add_filter( 'woocommerce_get_price_html', 'custom_from_price_html', 10, 2 );
            
            // Remove add to cart buttons

        /*function remove_loop_button() {
                remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
                remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
                }
                add_action('init','remove_loop_button');*/

        // Exckude Accommodation category from shop page (shows only courses)

    add_action( 'pre_get_posts', 'custom_pre_get_posts_query' );
     
    function custom_pre_get_posts_query( $q ) {
     
        if ( ! $q->is_main_query() ) return;
        if ( ! $q->is_post_type_archive() ) return;
        
        if ( ! is_admin() ) {
     
            $q->set( 'tax_query', array(array(
                'taxonomy' => 'product_cat',
                'field' => 'slug',
                'terms' => array( 'Accommodation' ), // Don't display products in the accommodation category on the shop page
                'operator' => 'NOT IN'
            )));
        
        }
     
        remove_action( 'pre_get_posts', 'custom_pre_get_posts_query' );
 
}

    add_action( 'woocommerce_product_meta_end', 'custom_product_meta' ); 
    
        function custom_product_meta() { 
        global $post; 
        $the_cats = array(); 
        $cats = get_the_terms( $post->ID, 'product_cat' ); 
        foreach( $cats as $cat ) 
        $the_cats[] = $cat->slug; 
        if ( in_array( 'coffee-tea', $the_cats ) ) { 
        echo '<span class="season">* High Season - July And August</span>'; 
        } 
    }
?>