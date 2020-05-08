<article {!! post_class() !!}>
  <header>
    <h1 class="entry-title">{!! get_the_title() !!}</h1>
    @include('partials/entry-meta')
  </header>
  <div class="entry-content">
    @if( !empty( $page_content ) ) 
        {!! $page_content !!}
    @endif
    @if( has_post_thumbnail() && isset( $page_thumbnail ) )
        {!! $page_thumbnail !!}
    @endif
  </div>
  <footer>
    {!! wp_link_pages(['echo' => 0, 'before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']) !!}
  </footer>
  {!! comments_template('/partials/comments.blade.php') !!}
</article>
