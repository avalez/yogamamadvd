<?php
// Start the engine
require_once(TEMPLATEPATH.'/lib/init.php');

// Add wp-cycle slideshow
add_action('genesis_after_header', 'pixelhappy_include_slideshow', 5);
function pixelhappy_include_slideshow() {
    if( function_exists('wp_cycle') ) wp_cycle();
}

// Load script for right-click disable
add_action('get_header', 'pixelhappy_load_scripts');
function pixelhappy_load_scripts() {
    wp_enqueue_script('rightclick', CHILD_URL.'/js/rightclick.js', array(), '1.1', TRUE);
}

// Add widgeted footer section
add_action('genesis_before_footer', 'pixelhappy_include_footer_widgets'); 
function pixelhappy_include_footer_widgets() {
    require(CHILD_DIR.'/footer-widgeted.php');
}

// Restablish the post info line
remove_action('genesis_before_post_content', 'genesis_post_info');
add_action('genesis_before_post_content', 'pixelhappy_post_info');
function pixelhappy_post_info() {
    if(is_page()) return; // don't do post-info on pages
	genesis_post_info();
}

// Restablish the post meta line
remove_action('genesis_after_post_content', 'genesis_post_meta');
add_action('genesis_after_post_content', 'pixelhappy_post_meta');
function pixelhappy_post_meta() {
	if(is_page()) return; // don't do post-meta on pages
	genesis_post_meta();
}

// Register widget areas
genesis_register_sidebar(array(
	'name'=>'Footer #1',
	'id' => 'footer-1',
	'description' => 'This is the first column of the footer section.',
	'before_title'=>'<h4 class="widgettitle">','after_title'=>'</h4>'
));
genesis_register_sidebar(array(
	'name'=>'Footer #2',
	'id' => 'footer-2',
	'description' => 'This is the second column of the footer section.',
	'before_title'=>'<h4 class="widgettitle">','after_title'=>'</h4>'
));
genesis_register_sidebar(array(
	'name'=>'Footer #3',
	'id' => 'footer-3',
	'description' => 'This is the third column of the footer section.',
	'before_title'=>'<h4 class="widgettitle">','after_title'=>'</h4>'
));

// Copyright
add_filter( 'genesis_footer_creds_text', 'child_footer_creds_text', 10, 1);
function child_footer_creds_text( $creds_text ){ 
    return sprintf( '%1$s ' . g_ent( '&copy;' ) . ' ' . date( 'Y' ) . ' %2$s <a href="http://maklerblog.ru">maklerblog.ru</a> %2$s [footer_loginout]', __( 'Copyright', 'genesis' ), g_ent( '&middot;' ) );
}

// Authors list
// http://theme.fm/2011/08/how-to-create-an-authors-list-shortcode-in-wordpress-1534/
add_shortcode('authors-list', 'my_authors_list_shortcode');
function my_authors_list_shortcode( $atts = array() ) {

  	$query_args = array(
  		'orderby' => 'name', 'order' => 'ASC', 'number' => ''
  	);

    $users = get_users( $query_args );

    $content = "<ul class='authors-list'>";
    foreach( $users as $user ) {
    		if (/* $exclude_admin && */ 'admin' == $user->display_name ) {
      			continue;
    		}

        $content .= "<li>";
        // http://wordpress.org/extend/plugins/user-photo/
        if(function_exists('userphoto_exists') && userphoto_exists($user)) {
        		ob_start();
        		userphoto($user);
            $content .= ob_get_contents();
        		ob_end_clean();
        } else {
            $content .= get_avatar($user->ID, 96);
        }
        $content .= "<h3>" . $user->display_name . "</h3>";
        $content .= "<p class='author-description'>" . get_user_meta( $user->ID, 'description', true ) . "</p>";
        $content .= "</li>";
    }
    $content .= "</ul>";
    return $content;
}

// Allow HTML in WordPress Author Bios
// http://www.zachgraeve.com/2009/02/18/allow-html-in-wordpress-author-bios/
remove_all_filters('pre_user_description');
