Histogram = function ( 
  cnvs_name,
  max_x, max_y,
  colors = { 
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
},

max_hospital = 0.2 ) {

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
  o.max_hospital = max_hospital;

  o.clear = function( ) {
  
    o.x = [ ];
    o.y = [ ];
    
    o.cntxt.fillStyle = "#ffffff";
    o.cntxt.fillRect( 0, 0, o.cnvs.width, o.cnvs.height );     
  };
  
  o.add = function( states ) {
  
    let
    s = 0,
    yn = [ 
    s, 
    s += states.sick.treated,
    s += states.sick.untreated,
    s += states.recovered.treated,
    s += states.recovered.untreated,
    s += states.healthy,
    s += states.dead.treated,
    s += states.dead.untreated 
    ];
    
    if( o.x.length < 1 ) {
    
      o.x = [ 0 ];
      o.y = [ yn ];
      
      return;
    }
    
    if( o.x.length < 2 ) {
    
      o.x = [ 0, 1 ];
      o.y = [ o.y[ 0 ], yn ];
    }
    else {
      
      o.x = [ o.x[ 1 ], o.x[ 1 ] + 1 ];
      o.y = [ o.y[ 1 ], yn ];
    }
  };
    
  o.plot = function( ) {
    
    if( o.x.length < 2 ) {
    
      return;
    }
    
    let
    x0 = o.dsp.xd2c( o.x[ 0 ] ),
    x1 = o.dsp.xd2c( o.x[ 1 ] ),
    yv0 = o.y[ 0 ],
    yv1 = o.y[ 1 ];
    
    for( let j = 0; j < yv0.length - 1; ++ j ) {
    
      let 
      y0 = o.dsp.yd2c( o.max_y - yv0[ j ] ),
      y1 = o.dsp.yd2c( o.max_y - yv1[ j + 1 ] );
      
      o.cntxt.fillStyle = [
      o.colors.sick.treated, o.colors.sick.untreated,
      o.colors.recovered.treated, o.colors.recovered.untreated,
      o.colors.healthy,
      o.colors.dead.treated, o.colors.dead.untreated
      ][ j ];
      
      o.cntxt.fillRect( x0, y0, x1 - x0, y1 - y0 );     
      
      o.cntxt.strokeStyle = "#ff0000";
      o.cntxt.beginPath( );
      o.cntxt.moveTo( x0, o.dsp.yd2c( ( 1.0 - o.max_hospital ) * o.max_y ) );
      o.cntxt.lineTo( x1, o.dsp.yd2c( ( 1.0 - o.max_hospital ) * o.max_y ) );
      o.cntxt.stroke( );
    }
  };
  
  o.clear( );
};
