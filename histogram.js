Histogram = function ( cnvs_name, max_x, max_y ) {

    let o = this;

	o.cnvs        = document.getElementById ( cnvs_name );
	o.cntxt       = o.cnvs.getContext ( "2d" );
	o.cnvs.width  = o.cnvs.clientWidth;
    o.cnvs.height = o.cnvs.clientHeight;
    o.max_x       = max_x;
    o.max_y       = max_y;
    o.dsp         = new Display( o.cnvs.width, o.cnvs.height, max_x, max_y );
    o.cntxt.font  = "12pt Calibri";
    
    o.x = [ ];
    o.y = [ ];

    o.add = function( x, states ) {

        o.x.push( x );
/*
        o.states        = {
            total     : count_of_humans_x * count_of_humans_y, 
            healthy   : 0,
            sick      : {
              treated   : 0,
              untreated : 0
            },
            recovered : {
              treated   : 0,
              untreated : 0
            },
            dead      : {
              treated   : 0,
              untreated : 0
            }
          };
*/        
        let 
        s = 0,
        y = [ ];

        y.push( s );

        s += states.sick.treated; y.push( s );
        s += states.sick.untreated; y.push( s );
        s += states.recovered.treated; y.push( s );
        s += states.recovered.untreated; y.push( s );
        s += states.dead.treated; y.push( s );
        s += states.dead.untreated; y.push( s );
        s += states.healthy; y.push( s );

        o.y.push( y );
    }

    o.plot = function( ) {

        for( let i = 0; i < o.x.length - 1; ++i ) {
            
            let
            x0 = o.dsp.xd2c( o.x[ i ] ),
            x1 = o.dsp.xd2c( o.x[ i + 1 ] ),
            yv0 = o.y[ i ],
            yv1 = o.y[ i + 1 ];
            
            for( let j = 0; j < yv0.length - 1; ++ j ) {

                let y0 = o.dsp.yd2c( o.max_y - yv0[ j ] );
                let y1 = o.dsp.yd2c( o.max_y - yv1[ j + 1 ] );

                o.cntxt.fillStyle = [
                    "#0000ff", "#ff0000",
                    "#0080ff", "#ff8000",
                    "#002060", "#602000", 
                    "#00ff00"
                  ][ j ];
                  
                o.cntxt.fillRect( x0, y0, x1 - x0, y1 - y0 );            
            }
        }
    }
}