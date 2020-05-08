@extends('layouts.app')
@section('content')
  @include('partials.page-header')

  @if (!have_posts())
    <div class="alert alert-warning">
      {{ __('Sorry, no results were found.', 'sage') }}
    </div>
    {!! get_search_form(false) !!}
  @endif
  <div class="col-12 col-lg-9 d-flex order-1">
      @while (have_posts()) @php the_post() @endphp
            @include('partials.content-'.get_post_type())
      @endwhile
  </div>
@endsection
