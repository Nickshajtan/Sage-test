<?php
/*
 * Text with image & button block
 *
 */
if( get_row_layout() == 'text_image_block' ){
    
    $link = get_sub_field('button');
    if( $link ){
        $link_url    = esc_url( $link['url'] );
        $link_title  = esc_html( $link['title'] );
        $link_target = $link['target'] ? esc_attr( $link['target'] ) : '_self';
    }
    
    $image = get_sub_field('image');
    if( $image ){
        $image_url   = esc_url( $image['url'] );
        $image_alt   = esc_attr( $image['alt'] );
        $image_title = esc_attr( $image['title'] );
    }
    
    $return .= \App\template('partials.front-page.flexible.text-image-block', [
        'block_title'    => $this->_getSageTitle('block-title'),
        'block_subtitle' => wp_kses_post( 
                        trim( get_sub_field('subtitle') )
        ),
        'block_text'     => wp_kses_post( 
                        trim( get_sub_field('text') )
        ),
        'block_link'     => ( $link ) ?
                        '<a class="button" href="' . $link_url . '" target="' . $link_target . '">' . $link_title . '</a>'
                                      : '',
        'block_image'    => ( $image ) ?
                        '<img src="' . $image_url . '" alt="' . $image_alt . '" title="' . $image_title . '">'
                                      : '',
    ]);
}