@extends('layouts.app')

@section('content')
  @while(have_posts()) @php the_post() @endphp
     @if( false )
      @includeIf('partials.front-page.slider')
      @endif
      {!! $flexible_content !!}
      @if( false )
      {!! $iframe_map !!}
      @endif
  @endwhile
@endsection