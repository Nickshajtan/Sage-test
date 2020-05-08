<?php
/*
 * Text with image & button block
 *
 */
if( get_row_layout() == 'text_big_image_block' ){
    
    $image = get_sub_field('image');
    if( $image ){
        $image_url   = esc_url( $image['url'] );
        $image_alt   = esc_attr( $image['alt'] );
        $image_title = esc_attr( $image['title'] );
    }
    
    $return .= \App\template('partials.front-page.flexible.big-image-block', [
        'block_title'    => $this->_getSageTitle('block-title'),
        'block_subtitle' => wp_kses_post( 
                        trim( get_sub_field('subtitle') )
        ),
        'block_text'     => wp_kses_post( 
                        trim( get_sub_field('text') )
        ),
        'block_image'    => ( $image ) ?
                        '<img src="' . $image_url . '" alt="' . $image_alt . '" title="' . $image_title . '">'
                                       : '',
    ]);
}