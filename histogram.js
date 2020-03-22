Histogram = function ( 
  cnvs_name, max_x, max_y,
  colors =   colors = { 
    healthy : "#00ff00",
    sick : {
      treated : "#0000ff",
      untreated : "#ff0000",
    },
    recovered : {
      treated : "#6060ff",
      untreated : "#ff6060",
    },
    dead : {
      treated : "#00007f",
      untreated : "#7f0000",
    }
  } ) {

    let o = this;

    o.cnvs        = document.getElementById ( cnvs_name );
    o.cntxt       = o.cnvs.getContext ( "2d" );
    o.cnvs.width  = o.cnvs.clientWidth;
    o.cnvs.height = o.cnvs.clientHeight;
    o.max_x       = max_x;
    o.max_y       = max_y;
    o.dsp         = new Display( o.cnvs.width, o.cnvs.height, max_x, max_y );
    o.cntxt.font  = "12pt Calibri";
    o.colors      = colors;
    
    o.x = [ ];
    o.y = [ ];

    o.add = function( x, states ) {

        o.x.push( x );

        let 
        s = 0,
        y = [ ];

        y.push( s );

        s += states.sick.treated; y.push( s );
        s += states.sick.untreated; y.push( s );
        s += states.recovered.treated; y.push( s );
        s += states.recovered.untreated; y.push( s );
        s += states.healthy; y.push( s );
        s += states.dead.treated; y.push( s );
        s += states.dead.untreated; y.push( s );

        o.y.push( y );
    }

    o.plot = function( ) {

      if( 1 < o.x.length ) {
                
      let
      x0 = o.dsp.xd2c( o.x[ o.x.length - 2 ] ),
      x1 = o.dsp.xd2c( o.x[ o.x.length - 1 ] ),
      yv0 = o.y[ o.y.length - 2 ],
      yv1 = o.y[ o.y.length - 1 ];
      
      for( let j = 0; j < yv0.length - 1; ++ j ) {

          let y0 = o.dsp.yd2c( o.max_y - yv0[ j ] );
          let y1 = o.dsp.yd2c( o.max_y - yv1[ j + 1 ] );

          o.cntxt.fillStyle = [
              o.colors.sick.treated, o.colors.sick.untreated,
              o.colors.recovered.treated, o.colors.recovered.untreated,
              o.colors.healthy,
              o.colors.dead.treated, o.colors.dead.untreated
            ][ j ];
            
          o.cntxt.fillRect( x0, y0, x1 - x0, y1 - y0 );            
      }
    }
  }
}