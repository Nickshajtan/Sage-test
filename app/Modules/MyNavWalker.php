<?php

namespace App\Modules;

/*
 * Custom menu
 *
 */
class MyNavWalker extends \Walker_Nav_Menu {
    function start_el(&$output, $item, $depth = 0, $args = array(), $id = 0) {
		global $wp_query;           
		$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';
        
        //LI
        $class_names = $value = '';
		$classes = empty( $item->classes ) ? array() : (array) $item->classes;
		$classes[] = 'menu-item-' . $item->ID;
        
        $class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args ) );
		$class_names = ' class="' . esc_attr( $class_names ) . '"';
        
        $id = apply_filters( 'nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args );
		$id = strlen( $id ) ? ' id="' . esc_attr( $id ) . '"' : '';
        
        $output .= $indent . '<li' . $id . $value . $class_names .'>';
        
        //LINKS
        $atts = array();
        $atts['title']     = ! empty( $item->attr_title ) ? $item->attr_title : '';
        $atts['target']    = ! empty( $item->target )     ? $item->target     : '';
        $atts['rel']       = ! empty( $item->xfn )        ? $item->xfn        : '';
        if( ( !is_front_page() && ! empty( $item->url ) ) ){
             $atts['href'] = ( strpos( $item->url, '#' ) !== false ) ? esc_url( home_url() ) . $item->url : $item->url;
        }
        else{
             $atts['href'] = ! empty( $item->url )        ? $item->url        : '';
        }
        $anchor = ( strpos( $item->url, '#' ) !== false ) ? 'inside-link' : 'outside-link';
        $atts['class']     = $anchor . ' nav-link nav-link-' . $item->ID . ( $depth > 0 ? 'sub-menu-link' : '' );
        
        $atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );
        
        $attributes = '';
        foreach ( $atts as $attr => $value ) {
              if ( ! empty( $value ) ) {
                  $value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
                  $attributes .= ' ' . $attr . '="' . $value . '"';
              }
        }
        
        $title = apply_filters( 'the_title', $item->title, $item->ID );
        
        $item_output = $args->before;
        $item_output .= '<a id="link-item-' . $item->ID . '"' . $attributes . '>';  
        $item_output .= $args->link_before . $title . $args->link_after;
        if (strpos($class_names, 'has-children')){
            $item_output .= '</a>';
        }
        else{
            $item_output .= '</a>';   
        }
        $item_output .= $args->after;
        $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
    }
}