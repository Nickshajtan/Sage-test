<?php

namespace App\Controllers;
use Sober\Controller\Controller;
use \App\Modules\MyNavWalker;
use \App\Modules\AqResizer;
use \App\Modules\SliderCPT;
use \App\Modules\CustomGutenbergBlocks;

class App extends Controller
{
    use \App\Controllers\Partials\Header;
    use \App\Controllers\Partials\Footer;
    use \App\Controllers\Partials\ErrorPage;
    
    public function __construct() {
        $slider_cpt = new \App\Modules\SliderCPT();
        $acf_gtb    = new \App\Modules\CustomGutenbergBlocks();
    }
    
    public function siteName()
    {
        return wp_kses_post( get_bloginfo('name') );
    }

    public static function title()
    {
        if (is_home()) {
            if ($home = get_option('page_for_posts', true)) {
                return wp_kses_post( get_the_title($home) );
            }
            return __('Latest Posts', 'sage');
        }
        if (is_archive()) {
            return wp_kses_post( get_the_archive_title() );
        }
        if (is_search()) {
            return sprintf(__('Search Results for %s', 'sage'), get_search_query());
        }
        if (is_404()) {
            return __('Page not Found', 'sage');
        }
        return wp_kses_post( get_the_title() );
    }
    
}
