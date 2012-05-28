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
    return sprintf( '%1$s ' . g_ent( '&copy;' ) . ' ' . date( 'Y' ) . ' %2$s <a href="http://yogastudio.cz">yogastudio.cz</a> %2$s [footer_loginout]', __( 'Copyright', 'genesis' ), g_ent( '&middot;' ) );
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

//add_filter( 'genesis_footer_backtotop_text', 'my_add_ratings', 10, 1);
function my_add_ratings( $backtotop_text ){ 
    $content = $backtotop_text . "</div>";
    $content .= '<div class="rating">';
    $content .= mail_ru();
    $content .= '</div><div class="rating">';
    $content .= liveinternet();
    return $content;
}

function mail_ru() {
  $content = '<!--Rating@Mail.ru counter-->' . "\n";
  $content .= '<script language="javascript"><!--' . "\n";
  $content .= "d=document;var a='';a+=';r='+escape(d.referrer);js=10;//--></script>" . "\n";
  $content .= '<script language="javascript1.1"><!--' . "\n";
  $content .= "a+=';j='+navigator.javaEnabled();js=11;//--></script>" . "\n";
  $content .= '<script language="javascript1.2"><!--' . "\n";
  $content .= "s=screen;a+=';s='+s.width+'*'+s.height;" . "\n";
  $content .= "a+=';d='+(s.colorDepth?s.colorDepth:s.pixelDepth);js=12;//--></script>" . "\n";
  $content .= '<script language="javascript1.3"><!--' . "\n";
  $content .= 'js=13;//--></script><script language="javascript" type="text/javascript"><!--' . "\n";
  $content .= "d.write('<a href=\"http://top.mail.ru/jump?from=2172758\" target=\"_top\">'+" . "\n";
  $content .= "'<img src=\"http://d7.c2.b1.a2.top.mail.ru/counter?id=2172758;t=233;js='+js+" . "\n";
  $content .= "a+';rand='+Math.random()+'\" alt=\"Рейтинг@Mail.ru\" border=\"0\" '+" . "\n";
  $content .= "'height=\"31\" width=\"88\"><\/a>');if(11<js)d.write('<'+'!-- ');//--></script>" . "\n";
  $content .= '<noscript><a target="_top" href="http://top.mail.ru/jump?from=2172758">' . "\n";
  $content .= '<img src="http://d7.c2.b1.a2.top.mail.ru/counter?js=na;id=2172758;t=109" ' . "\n";
  $content .= 'height="18" width="88" border="0" alt="Рейтинг@Mail.ru"></a></noscript>' . "\n";
  $content .= '<script language="javascript" type="text/javascript"><!--' . "\n";
  $content .= "if(11<js)d.write('--'+'>');//--></script>" . "\n";
  $content .= '<!--// Rating@Mail.ru counter-->' . "\n";

  return $content;
}

function liveinternet() {
  $content = '<!--LiveInternet counter--><script type="text/javascript"><!--' . "\n";
  $content .= "document.write(\"<a href='http://www.liveinternet.ru/click' \"+" . "\n";
  $content .= "\"target=_blank><img src='//counter.yadro.ru/hit?t57.16;r\"+" . "\n";
  $content .= 'escape(document.referrer)+((typeof(screen)=="undefined")?"":' . "\n";
  $content .= '";s"+screen.width+"*"+screen.height+"*"+(screen.colorDepth?' . "\n";
  $content .= 'screen.colorDepth:screen.pixelDepth))+";u"+escape(document.URL)+' . "\n";
  $content .= '";h"+escape(document.title.substring(0,80))+";"+Math.random()+' . "\n";
  $content .= "\"' alt='' title='LiveInternet' \"+" . "\n";
  $content .= "\"border='0' width='88' height='31'><\/a>\")" . "\n";
  $content .= '//--></script><!--/LiveInternet-->' . "\n";
  
  return $content;
}

