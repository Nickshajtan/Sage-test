<header id="masthead" class="masthead is-static @if( is_front_page() ) is-home @endif">
  <div class="container">
      <div class="row">
          <div class="col-12 d-flex flex-row align-items-center justify-content-between">
                @if ( trait_exists( '\App\Controllers\Partials\Header' ) && isset( $site_logo ) )
                    <div class="logo">
                        {!! $site_logo !!}
                    </div>
                @endif
                @if (has_nav_menu('primary_navigation'))
                    <nav class="menu-wrapper nav-primary d-flex align-items-center justify-content-center">
                        {!! wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav', 'walker' => new \App\Modules\MyNavWalker()]) !!}
                    </nav>
                @endif 
                @if ( trait_exists( '\App\Controllers\Partials\Header' ) && isset( $header_link ) )
                        {!! $header_link !!}
                @endif
          </div>
      </div>   
  </div>
  {{-- start YOAST breadcrumbs --}}
  @if ( trait_exists( '\App\Controllers\Partials\Header' ) && isset( $site_breadcrumbs ) )
  <div class="container">
      <div class="row d-flex flex-row align-items-center justify-content-center breadcrumbs">
          {!! $site_breadcrumbs !!}
      </div>
  </div>
  @endif
  {{-- end YOAST breadcrumbs --}}
</header>
