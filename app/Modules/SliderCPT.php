<?php

namespace App\Modules;

/*
 * Slider custom post type
 *
 */
class SliderCPT
{
    public function __construct(){
        $this->init();
    }
    
    private function init(){
        add_action( 'init', array( $this, '_registerPostType' ) );
        $this->_registerPostType();
    }
    
    private function _registerPostType(){
        register_post_type('slider', array(
            'labels'             => array(
                'name'               => __('Slide', 'sage'),
                'singular_name'      => __('Slides', 'sage'),
                'add_new'            => __('Add slide', 'sage'),
                'add_new_item'       => __('Add new slide', 'sage'),
                'edit_item'          => __('Edit slide', 'sage'),
                'new_item'           => __('New slide', 'sage'),
                'view_item'          => __('View slide', 'sage'),
                'search_items'       => __('Find slide', 'sage'),
                'not_found'          => __('Any slide not found', 'sage'),
                'not_found_in_trash' => __('Any slide not found in trash', 'sage'),
                'parent_item_colon'  => '',
                'menu_name'          => __('Slider', 'sage'),
              ),
            'public'             => true,
            'publicly_queryable' => false,
            'exclude_from_search'=> true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'menu_position'      => 5,
            'menu_icon'          => 'dashicons-admin-post',
            'show_in_nav_menus'  => false,
            'query_var'          => false,
            'rewrite'            => true,
            'capability_type'    => 'post',
            'has_archive'        => false,
            'hierarchical'       => false,
            'supports'           => array('title','custom-fields')
        ));
    }
}
//Single ton