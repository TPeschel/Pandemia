Display = function( cnvs_width, cnvs_height, disp_width, disp_height ) {
    
    let dis = this;
  
    dis.cnvs_width  = cnvs_width;
    dis.cnvs_height = cnvs_height;
    dis.disp_width  = disp_width;
    dis.disp_height = disp_height;
  
    dis.create = function( ) {
  
      let
      cdev = dis.cnvs_height / dis.cnvs_width,
      ddev = dis.disp_height / dis.disp_width;
  
      if( cdev < ddev ) {
  
        dis.ad2c = dis.cnvs_height / dis.disp_height;
  
        dis.off = V2( .5 * ( dis.cnvs_width - dis.ad2c * dis.disp_width ), 0 );
  
      }
      else {
  
        dis.ad2c = dis.cnvs_width / dis.disp_width;
  
        dis.off = V2( 0, .5 * ( dis.cnvs_height - dis.ad2c * dis.disp_height ) );
      }
  
      dis.ac2d = 1. / dis.ad2c;
    };
  
    dis.xd2c = function( x ) {
  
      return dis.off.x + x * dis.ad2c;
    }
  
    dis.yd2c = function( y ) {
  
      return dis.off.y + y * dis.ad2c;
    }
  
    dis.d2c = function( dp ) {
  
      return V2( dis.xd2c( dp.x ), dis.yd2c( dp.y ) ) ;
    }
  
    dis.xc2d = function( x ) {
  
      return ( x - dis.off.x ) * dis.ac2d;
    }
  
    dis.yc2d = function( y ) {
  
      return ( y - dis.off.y ) * dis.ac2d;
    }
  
    dis.c2d = function( cp ) {
  
      return V2( dis.xc2d( cp.x ), dis.yc2d( cp.y ) );
    }
  
    dis.create( );
}
  