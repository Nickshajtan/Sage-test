<section style="border-top: 2px solid red; border-bottom: 2px solid green; padding: 100px 0; margin: 50px 0;    width: 100%;">
  <div class="col-12" style="background:#ddd">
  @if( !empty( $block_title ) )
      <h2>{!! $block_title !!}</h2>
  @endif
  @if( !empty( $block_subtitle ) )
      <h4>{!! $block_subtitle !!}</h4>
  @endif
  @if( !empty( $block_text ) )
      <code>{!! $block_text !!}</code>
  @endif
  <br>
  <br>
  <br>
  <br>
  </div>
  <div class="col-12" style="background:#efeb6d">
  @if( !empty( $block_cards ) )
     {!! $block_cards !!}
  @endif
  @php var_dump( $block_cards ) @endphp
  </div>
</section>