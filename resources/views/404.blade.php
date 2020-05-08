@extends('layouts.app')

@section('content')
  @include('partials.page-header')


  @if (!have_posts())
    <div class="">
      {{ __('Sorry, but the page you were trying to view does not exist.', 'sage') }}
    </div>
  @endif
  
  @if ( trait_exists( '\App\Controllers\Partials\ErrorPage' ) )
      {!! $error_text !!}
      {!! $error_image !!}
  @endif
  
@endsection
