<?php
/*
 * Theme defenitions
 *
 */
// Core
if( !defined( 'THEME_URI' ) ){
    define( 'THEME_URI', get_template_directory() );
}
if( !defined( 'THEME_HOME_URL' ) ){
    define( 'THEME_HOME_URL', get_home_url('/') );
}
if( !defined( 'SITE_URL' ) ){
    define( 'SITE_URL', site_url() );
}
//MU plugins slug
if( !defined( 'MU_ACF' ) ){
    define( 'MU_ACF', 'advanced-custom-fields/acf.php' );
}
if( !defined( 'MU_SVG' ) ){
    define( 'MU_SVG', 'safe-svg/safe-svg.php' );
}
