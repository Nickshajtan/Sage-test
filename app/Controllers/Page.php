<?php

namespace App\Controllers;
use Sober\Controller\Controller;

class Page extends Controller
{
    public function __construct () {
        $this->init();
    }
    
    private function init(){
        $this->id = get_the_ID();    
    }
    
    public function pageContent() {
        $content = get_the_content( null, false, $this->id );
        $content = wp_kses_post( apply_filters( 'the_content', $content ) );
        return $content;
    }
    
    public function pageThumbnail(){
        if( has_post_thumbnail( $this->id ) ){
            $src  = esc_url('');
            $args = array(
                'src'     => $src,
                'class'   => "attachment-$size",
                'alt'     => trim(strip_tags( $wp_postmeta->_wp_attachment_image_alt )),
                'title'   => trim(strip_tags( $wp_postmeta->_wp_attachment_image_title )),
            );
            $image = get_the_post_thumbnail( $this->id, 'medium', $args );
            return $image;
        }
    }
}
