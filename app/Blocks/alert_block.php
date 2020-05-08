<?php 
/**
 * ACF Alert Block Template.
 *
 *
 */
namespace App\Blocks;

if( have_rows('gtn_block') ){
    while( has_sub_field( 'gtn_block') ){
                $text  = wp_kses_post( get_sub_field('text') ); 
                $title = \App\Modules\getSageTitle( get_sub_field('title') ); 

                        if( !empty( $title ) ){
                            echo $title;
                        }
                        if( !empty( $text ) ){
                            echo $text;
                        }

    }
}