Display = function( cnvs_width, cnvs_height, disp_width, disp_height ) {
    
    let o = this;
  
    o.cnvs_width  = cnvs_width;
    o.cnvs_height = cnvs_height;
    o.disp_width  = disp_width;
    o.disp_height = disp_height;
  
    o.create = function( ) {
  
      let
      cdev = o.cnvs_height / o.cnvs_width,
      ddev = o.disp_height / o.disp_width;
  
      if( cdev < ddev ) {
  
        o.ad2c = o.cnvs_height / o.disp_height;
  
        o.off = V2( 0.5 * ( o.cnvs_width - o.ad2c * o.disp_width ), 0 );  
      }
      else {
  
        o.ad2c = o.cnvs_width / o.disp_width;
  
        o.off = V2( 0, 0.5 * ( o.cnvs_height - o.ad2c * o.disp_height ) );
      }
  
      o.ac2d = 1.0 / o.ad2c;
    };
  
    o.xd2c = function( x ) {
  
      return o.off.x + x * o.ad2c;
    };
  
    o.yd2c = function( y ) {
  
      return o.off.y + y * o.ad2c;
    };
  
    o.d2c = function( dp ) {
  
      return V2( o.xd2c( dp.x ), o.yd2c( dp.y ) ) ;
    };
  
    o.xc2d = function( x ) {
  
      return ( x - o.off.x ) * o.ac2d;
    };
  
    o.yc2d = function( y ) {
  
      return ( y - o.off.y ) * o.ac2d;
    };
  
    o.c2d = function( cp ) {
  
      return V2( o.xc2d( cp.x ), o.yc2d( cp.y ) );
    };
  
    o.create( );
}
  
