<?php
/*
 * Text with image & button block
 *
 */
if( get_row_layout() == 'cycle_block' ){    
    $return .= \App\template('partials.front-page.flexible.cycle-block', [
        'block_title'    => $this->_getSageTitle('block-title'),
        'block_subtitle' => wp_kses_post( 
                        trim( get_sub_field('subtitle') )
        ),
        'block_text'     => wp_kses_post( 
                        trim( get_sub_field('text') )
        ),
        'block_cards'    => $this->_getInnerCycleBlock(),            
    ]);
}