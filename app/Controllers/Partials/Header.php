<?php

namespace App\Controllers\Partials;
use Sober\Controller\Controller;

trait Header
{
    public function siteLogo()
    {
        $logo_img = '';
        if( $custom_logo_id = get_theme_mod('custom_logo') ){
            if( is_front_page() ){
                $logo_img = wp_get_attachment_image( $custom_logo_id, 'full', false, array(
                    'class'    => 'custom-logo',
                    'itemprop' => 'logo',
                ) );    
            }
            else{
                $logo_img = get_custom_logo();
            }
        }
        else{
            $logo_img = wp_kses_post( get_bloginfo('name', 'display') );
        }
        return $logo_img;
    }
    
    public function siteBreadcrumbs(){
        if ( function_exists( 'yoast_breadcrumb' ) ){
            return yoast_breadcrumb( '<div id="breadcrumbs">', '</div>' );
        }
    }
    
    public function headerLink(){
        if( function_exists( 'get_field' ) ){
            $link = get_field('header_link_button', 'options');
            if( $link ){
                $link_url    = esc_url( $link['url'] );
                $link_title  = esc_html( $link['title'] );
                $link_target = $link['target'] ? esc_attr( $link['target'] ) : '_self';
                
                return '<a class="button bordered-btn" href="' . $link_url . '" target="' . $link_target . '">' . $link_title . '</a>';
            }
        }
    }
}