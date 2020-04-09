Display = function( cnvs_width, cnvs_height, disp_width, disp_height, keep_aspect_ratio ) {
    
    let o = this;
  
    o.cnvs_width  = cnvs_width;
    o.cnvs_height = cnvs_height;
    o.disp_width  = disp_width;
    o.disp_height = disp_height;
    o.keep_aspect_ratio = keep_aspect_ratio;
  
    o.create = function( ) {
  
      let
      cdev = o.cnvs_height / o.cnvs_width,
      ddev = o.disp_height / o.disp_width;
  
      if( o.keep_aspect_ratio ) {
  
        if( cdev < ddev ) {
    
          o.ad2c = V2( o.cnvs_height / o.disp_height, 1.0 );
    
          o.off = V2( 0.5 * ( o.cnvs_width - o.ad2c.x * o.disp_width ), 0 );  
        }
        else {
    
          o.ad2c = V2( 1.0, o.cnvs_width / o.disp_width );
    
          o.off = V2( 0, 0.5 * ( o.cnvs_height - o.ad2c.y * o.disp_height ) );
        }
      }
      else {
        
          o.ad2c = V2( o.cnvs_height / o.disp_height, o.cnvs_width / o.disp_width );
    
          o.off = V2( 0, 0 );
      }
  
      o.ac2d.x = 1.0 / o.ad2c.x;
      o.ac2d.y = 1.0 / o.ad2c.y;
    };
  
    o.xd2c = function( x ) {
  
      return o.off.x + x * o.ad2c.x;
    };
  
    o.yd2c = function( y ) {
  
      return o.off.y + y * o.ad2c.y;
    };
  
    o.d2c = function( dp ) {
  
      return V2( o.xd2c( dp.x ), o.yd2c( dp.y ) ) ;
    };
  
    o.xc2d = function( x ) {
  
      return ( x - o.off.x ) * o.ac2d.x;
    };
  
    o.yc2d = function( y ) {
  
      return ( y - o.off.y ) * o.ac2d.y;
    };
  
    o.c2d = function( cp ) {
  
      return V2( o.xc2d( cp.x ), o.yc2d( cp.y ) );
    };
  
    o.create( );
};
  
