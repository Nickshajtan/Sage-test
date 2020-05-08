@if ( ! defined( 'ABSPATH' ) )
    @php exit @endphp
@endif
<!doctype html>
<html {!! get_language_attributes() !!}>
  @include('partials.head')
  <body @php body_class() @endphp>
    @php do_action('get_header') @endphp
    @php wp_body_open() @endphp
    @include('partials.header')
    <div class="wrap container" role="document">
      <div class="content row">
        <main class="main col-12">
          <div class="row d-flex h-100">
              @yield('content')
              @if ( App\display_sidebar() && ( is_404() || is_home() ) )
                      @if( is_active_sidebar('sidebar-primary') )
                      <aside class="sidebar sidebar-left sidebar-column col-12 col-lg-3 d-flex order-3 order-lg-2 flex-column">
                        @include('partials.sidebar')
                      </aside>
                      @endif
              @endif
              @if( is_home() )
              <div class="col-12 col-lg-9 d-flex align-items-center justify-content-center order-2 order-lg-3">
                  {!! get_the_posts_pagination() !!}
              </div>
              @endif
          </div>
        </main>
      </div>
    </div>
    @php do_action('get_footer') @endphp
    @include('partials.footer')
    @php wp_footer() @endphp
  </body>
</html>
