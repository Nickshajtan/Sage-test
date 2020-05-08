<?php
namespace App\Controllers\Partials;
use Sober\Controller\Controller;

trait Footer
{
    public function siteCopyright(){
        return wp_kses_post( 
            str_ireplace( "%year%", date('Y', time()), get_option('options_сopyright') ) 
        );
    }
    public function siteSocials(): array{

        if( function_exists('get_field') ){
            $socials = get_field('socials', 'options');   
        }
      
        if( isset( $socials ) && is_array( $socials ) ){
            return $socials;
        }
        else{
            return [];
        }
    }
    
    private function _getSageTitle( $element, $class = '' ){
        $tag   = $element['tag'];
        $title = wp_kses_post( $element['block_title'] );
        if (empty($tag)) { $tag = 'div';	};
        if (empty($title)) { $title = '';	};
        return '<'.$tag.' class="'.$class.'">'. $title .'</'.$tag.'>';    
    }
    
    public function siteForm(){
       $return = '';
       if( is_plugin_active('contact-form-7/wp-contact-form-7.php') ){
           if( function_exists('get_field') ){
               $forms         = get_field('form', 'options');
               $section_title = get_field('section_title', 'options');
               if( isset( $forms ) && is_array( $forms ) ){
                   foreach( $forms as $form ){
                       $return .= \App\template('partials.footer.form-c7', [
                           'section_title' => $this->_getSageTitle( $section_title ),
                           'c7_content'    => $form->post_content,
                           'c7_post_type'  => $form->post_type,
                           'c7_post_title' => wp_kses_post( $form->post_title ),
                           'c7_post_id'    => $form->ID,
                           'c7_form'       => get_post_meta( $form->ID, '_form', true ),
                           'c7_code'       => 
                           ( function_exists('apply_shortcode') ) ? 
                                                apply_shortcode( '[contact-form-7 id="' . $form->ID . '" title="' . wp_kses_post( $form->post_title ) . '"]' )
                                                                  :
                                                do_shortcode( '[contact-form-7 id="' . $form->ID . '" title="' . wp_kses_post( $form->post_title ) . '"]' ),
                       ]);
                   }
               }
           }
       }
       else{
           $section_title = ( function_exists('get_field') ) ? 
                                $this->_getSageTitle( get_field('section_title', 'options') ) 
                                                             : 
                                '<strong>' . __('Have Question in mind? Let us help you', 'sage') . '</strong>';
           
           $return .= \App\template('partials.footer.form-custom', [
               'section_title'     => $section_title,
               'form_submit_text'  => __('Send', 'sage'),
               'form_email_text'   => __('Send', 'sage'),
           ]);
       }
       if( function_exists('get_field') ){
           $display_form = get_field('display_form', 'options');
       }
       if( isset( $display_form ) && $display_form === 'yes' ){
           return $return;
       }
       if( !isset( $display_form ) ){
           return '';
       }
    }
}