@if ( trait_exists( '\App\Controllers\Partials\Footer' ) && !is_home() && !is_single() )
    @section('footer-form')
        @includeIf('partials.footer.form')
    @show
@endif
<footer id="mastfooter" class="mastfooter content-info @if( is_front_page() ) is-home @endif">
  <div class="container">
    @if ( App\display_sidebar() )
        @if( is_active_sidebar('sidebar-footer') )
            <div class="row">
                <div class="col-12">
                    @php dynamic_sidebar('sidebar-footer') @endphp
                </div>
            </div>
        @endif
    @endif
    <div class="row">
        @if ( trait_exists( '\App\Controllers\Partials\Header' ) && isset( $site_logo ) )
                <div class="logo col-12 col-lg-3 d-flex align-items-center justify-content-start">
                    {!! $site_logo !!}
                </div>
        @endif
        @if (has_nav_menu('footer_navigation'))
                <nav class="menu-wrapper nav-footer d-flex align-items-center justify-content-center col-12 col-lg-6">
                    {!! wp_nav_menu(['theme_location' => 'footer_navigation', 'menu_class' => 'nav']) !!}
                </nav>
        @endif
        @if ( trait_exists( '\App\Controllers\Partials\Footer' ) && isset( $site_socials ) )
                <ul class="socials socials-footer col-12 col-lg-3 d-flex align-items-center justify-content-end">
                    @foreach( $site_socials as $social )
                      @include('partials.footer.social-item', ['social' => $social])
                    @endforeach
                </ul>
        @endif
        </div>
        @if ( trait_exists( '\App\Controllers\Partials\Footer' ) && isset( $site_copyright ) )
            <div class="col-12 copyright d-flex align-items-center justify-content-center">
                {!! $site_copyright !!}
            </div>
        @endif 
  </div>
</footer>
