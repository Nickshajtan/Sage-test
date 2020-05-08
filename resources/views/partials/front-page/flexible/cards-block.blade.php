<section style="border-top: 2px solid red; border-bottom: 2px solid green; padding: 100px 0; margin: 50px 0;    width: 100%;">
  <div class="col-12" style="background:#ddd">
    <h2>{!! $block_title !!}</h2>
    <h4>{!! $block_subtitle !!}</h4>
    <code>{!! $block_text !!}</code>
    <br>  
    <br>  
    <br>  
  </div>
  <div class="col-12" style="background:#efeb6d">
    @if( !empty( $block_cards ) )
      {!! $block_cards !!}
    @endif
  </div>
</section>

