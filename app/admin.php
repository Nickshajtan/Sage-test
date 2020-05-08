<?php

namespace App;

/**
 * Theme customizer
 */
add_action('customize_register', function (\WP_Customize_Manager $wp_customize) {
    // Add postMessage support
    $wp_customize->get_setting('blogname')->transport = 'postMessage';
    $wp_customize->selective_refresh->add_partial('blogname', [
        'selector' => '.brand',
        'render_callback' => function () {
            bloginfo('name');
        }
    ]);
});

/**
 * Customizer JS
 */
add_action('customize_preview_init', function () {
    wp_enqueue_script('sage/customizer.js', asset_path('scripts/customizer.js'), ['customize-preview'], null, true);
});

/*
 * ACF json sync
 *
 */
$theme_path = ( defined( THEME_URI ) ) ? THEME_URI : get_template_directory();
if( !empty($theme_path) ) {
    add_filter('acf/settings/save_json', function ($path) {
            $path = THEME_URI . '/acf-json';
            return $path;    
    });
}

/*
 * ACF options page
 *
 */
add_action('init', function ($post) {
    if( function_exists('acf_add_options_page') ) {
        // add parent
        $parent = acf_add_options_page(array(
            'page_title'	=> __('Theme General Settings', 'sage'),
            'menu_title'	=> __('Theme Settings', 'sage'),
            'menu_slug'		=> 'theme-general-settings',
            'icon_url'		=> 'dashicons-info',
            'capability'	=> 'edit_posts',
            'redirect'		=> true
        ));

        // add sub page
        acf_add_options_sub_page(array(
            'page_title'	=> __('General settings', 'sage'),
            'menu_title'	=> __('General', 'sage'),
            'parent_slug'	=> $parent['menu_slug'],
        ));
        acf_add_options_sub_page(array(
            'page_title'	=> __('Error page', 'sage'),
            'menu_title'	=> __('Error page settings', 'sage'),
            'parent_slug'	=> $parent['menu_slug'],
        ));
    
    }
});

/*
 * Disable gutenberg for selected templates or selected post types 
 *
 */
add_filter('use_block_editor_for_post', function($can_edit, $post){
    if( isset( $post->post_type ) && ( $post->post_type == 'page' || $post->post_type == 'slider' ) ){
        return false;
    }
    return $can_edit;
}, 10, 3);