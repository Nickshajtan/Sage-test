<?php

namespace App\Modules;

/*
 * ACF custom Gutenberg blocks
 *
 */
class CustomGutenbergBlocks
{
    public function __construct(){
        if( !class_exists('ACF') ){
            add_action('admin_notices', array( $this, function(){
                            echo '<div class="error notice-error"><p>' .  __('ACF is not included. Enable it now, please, this plugin is required', 'sage') . '</p></div>';
            }));  
            exit;
        }
        $this->init();
    }
    
    private function init(){
        add_action( 'init', array( $this, '_registerAcfBlockTypes' ) );
        $this->_registerAcfBlockTypes();
    }
    
    public static function getSageTitle( $class = '' ){
        $tag   = get_sub_field('tag');
        $title = wp_kses_post( get_sub_field('block_title') );
        if (empty($tag)) { $tag = 'div';	};
        if (empty($title)) { $title = '';	};
        return '<'.$tag.' class="'.$class.'">'. $title .'</'.$tag.'>';    
    }
    
    private function _registerAcfBlockTypes() {
        acf_register_block( 
            array(
                'name'					=> 'alert_block',
                'title'					=> __('Alert Block', 'hcc'),
                'description'			=> __('.','hcc'),
                'render_template'	    => dirname( __FILE__ ) . '/../Blocks/alert_block.php', //source for rendering template
                'render_callback'       => array($this, '_alertBlockCallback'), // or rendering callback method
                'category'				=> 'widgets',
                'icon'					=> 'format-status',
                'mode'					=> 'preview',
                'supports'				=> array( 'align' => false ),
                'post_types'			=> array('post'),
            )
        );   
    }
    
    public function _alertBlockCallback(){
        if( have_rows('gtn_block') ){
            while( has_sub_field( 'gtn_block') ){
                $text  = wp_kses_post( get_sub_field('text') ); 
                $title = $this->getSageTitle( get_sub_field('title') ); 

                if( !empty( $title ) ){
                    echo $title;
                }
                if( !empty( $text ) ){
                    echo $text;
                }
                
            }
        }
    }
}

function getSageTitle( $element, $class = '' ){
    $title = CustomGutenbergBlocks::getSageTitle( $element );
    return $title;
}