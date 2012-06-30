<?php
remove_action( 'genesis_loop', 'genesis_do_loop' );
add_action( 'genesis_loop', 'pretty_grid_loop_helper' );

/** Add support for Genesis Grid Loop */
function pretty_grid_loop_helper() {

	genesis_grid_loop( array(
		'features'				=> 0,
		'feature_image_size'	=> 'feature',
		'feature_image_class'	=> 'post-image',
		'feature_content_limit'	=> 300,
		'grid_image_size'		=> 'grid-thumbnail',
		'grid_image_class'		=> 'aligncenter post-image',
		'grid_content_limit'	=> 50,
		'more'					=> __( '[Read More...]', 'genesis' ),
		'posts_per_page'		=> 6,
	) );

}

/** Remove the post meta function for front page only */
remove_action( 'genesis_after_post_content', 'genesis_post_meta' );

/** Copyright */
add_filter( 'genesis_footer_creds_text', 'child_footer_creds_text', 10, 1);
function child_footer_creds_text( $creds_text ){
    return sprintf( '%1$s ' . g_ent( '&copy;' ) . ' ' . date( 'Y' ) . ' %2$s <a href="http://www.honeymood.ru">www.honeymood.ru</a> %2$s [footer_loginout]', __( 'Copyright', 'genesis' ), g_ent( '&middot;' ) );
}


genesis();