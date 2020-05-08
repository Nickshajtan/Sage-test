<?php

namespace App\Controllers\Partials;
use Sober\Controller\Controller;

trait ErrorPage
{
    public function errorText(){
        if( function_exists('get_field') ){
            return wp_kses_post( get_field('error_text', 'options') );
        }
    }
    public function errorImage(){
        if( function_exists('get_field') ){
            $image = get_field('error_image', 'options');
        }
        if( !empty( $image ) ){
            $title = esc_attr( $image['title'] );
            $alt   = esc_attr( $image['alt'] );
            $url   = esc_url( $image['url'] );
            
            return '<img src="' . $url . '" alt="' . $alt . '" title="' . $title . '">';
        }
        
    }
}