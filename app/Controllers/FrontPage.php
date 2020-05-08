<?php

namespace App\Controllers;

use Sober\Controller\Controller;

class FrontPage extends Controller
{
    public function __construct () {
        $this->init();
    }
    
    private function init(){
        $this->id = get_option( 'page_on_front' );    
    }
    
    private function _getSageTitle( $class = '' ){
        $tag   = get_sub_field('tag');
        $title = wp_kses_post( get_sub_field('block_title') );
        if (empty($tag)) { $tag = 'div';	};
        if (empty($title)) { $title = '';	};
        return '<'.$tag.' class="'.$class.'">'. $title .'</'.$tag.'>';    
    }
    
    public function getSlider(){
        $return = '';
        
        $slides = get_posts(array(
            'numberposts'      => -1,
            'post_type'        => 'slider',
            'post_status'      => 'publish',
            'orderby'          => 'title',
            'order'            => 'ASC',
            'suppress_filters' => true,
        ));
        if( !empty( $slides ) && is_array( $slides ) ){
            foreach( $slides as $slide ){
                $slide_id = $slide->ID;
                if( function_exists('get_field') ){
                    if( have_rows('slide_fields', $slide_id) ){
                        while( has_sub_field( 'slide_fields', $slide_id ) ){
                            $image = get_sub_field('image');
                            if( $image ){
                                $image_url   = esc_url( $image['url'] );
                                $image_alt   = esc_attr( $image['alt'] );
                                $image_title = esc_attr( $image['title'] );
                            }
                            $link = get_sub_field('link');
                            if( $link ){
                                $link_url    = esc_url( $link['url'] );
                                $link_title  = esc_html( $link['title'] );
                                $link_target = $link['target'] ? esc_attr( $link['target'] ) : '_self';
                            }
                            $return .= \App\template('partials.front-page.slider-item', [
                                'slide_title'    => $this->_getSageTitle('block-title'),
                                'slide_subtitle' => wp_kses_post( 
                                                 trim( get_sub_field('subtitle') )
                                ),
                                'slide_text'     => wp_kses_post( 
                                                 trim( get_sub_field('text') )
                                ),
                                'slide_link'     => ( $link ) ?
                                                '<a class="button" href="' . $link_url . '" target="' . $link_target . '">' . $link_title . '</a>'
                                                              : '',
                                'slide_image'    => ( $image ) ?
                                                '<img src="' . $image_url . '" alt="' . $image_alt . '" title="' . $image_title . '">'
                                                               : '',
                            ]);
                        } 
                    }
                }   
            }
        }
        
        return $return;
    }
    
    public function flexibleContent(){
        //array_merge
        $return  = '';
        $post_id = $this->id;
        $slug    = 'flexible_content';
        if( function_exists('get_field') ){
            $content = get_field( $slug, $this->id );
            if( isset( $content ) && is_array( $content ) ){
                while ( has_sub_field( $slug, $this->id ) ){
                    try{
                        $row_layout_slug = trim( str_replace( ' ', '-', mb_strtolower( get_row_layout() ) ) );
                        if ( !( @include 'FrontPagePartials/flexible-' . $row_layout_slug . '.php' ) == TRUE ){
                            throw new Exception( __('Including flexible parts failed', 'sage') );
                        }
                    }
                    catch(Exception $e){
                        add_action('admin_notices', function(){
                                        echo '<div class="error notice-error"><p>' .  $e->getMessage() . '; </p></div>';
                        });   
                        $return .= $e->getMessage() . "\n";
                    }
                }
            }
        }
        return $return;
    }
    
    private function _getInnerCycleBlock(){
            $cards_data = [];
            $cards      = get_sub_field('cards');
            if( isset( $cards ) && is_array( $cards ) ){
                    foreach( $cards as $card ){
                        
                        switch( get_row_layout() ){
                            case 'cards_block':
                                $template_name = 'partials.front-page.flexible.card-item';
                                break;
                            case 'cycle_block':
                                $template_name = 'partials.front-page.flexible.cycle-item';
                                break;
                            default:
                                $template_name = '';
                        }
                    
                        $conter = 0;
                        $image  = $card['image'];
                        if( $image ){
                            $image_url   = esc_url( $image['url'] );
                            $image_alt   = esc_attr( $image['alt'] );
                            $image_title = esc_attr( $image['title'] );
                        }
                        
                        $cards_data .= \App\template($template_name, [
                            'card_title'    => wp_kses_post( 
                                trim( $card['title'] )
                            ),
                            'card_subtitle' => wp_kses_post( 
                                trim( $card['subtitle'] ) 
                            ),
                            'card_text' => wp_kses_post( 
                                trim( $card['text'] ) 
                            ),
                            'card_image'    => ( $image ) ?
                                            '<img src="' . $image_url . '" alt="' . $image_alt . '" title="' . $image_title . '">'
                                                          : '',
                            'card_counter'  => 
                                            $counter++,
                        ]);
                    }
            }
            return $cards_data;
    }
    
    public function iframeMap(){
        if( !wp_is_mobile() && false ){
            return '<iframe title="Coronavirus COVID-19 Global Cases by Johns Hopkins CSSE" width="800" height="600" frameborder="0" scrolling="no" marginheight="0"                        marginwidth="0" src="https://fdoh.maps.arcgis.com/apps/opsdashboard/index.html#/8d0de33f260d444c852a615dc7837c86">
                    </iframe>';   
        }
    }
}
