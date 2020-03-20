function V2( x, y ) {

  return {
    x : x,
    y : y
  };
}

function v2dot( a, b ) {

  return a.x * b.x + a.y * b.y;
}

function v2abs2( a ) {

  return v2dot( a, a );
}

function v2abs( a ) {

  return Math.sqrt( v2dot( a, a ) );
}

function v2add( a, b ) {

  return V2( a.x + b.x, a.y + b.y );
}

function v2sub( a, b ) {

  return V2( a.x - b.x, a.y - b.y );
}

function v2mul( a, b ) {

  return V2( a.x * b.x, a.y * b.y );
}

function v2div( a, b ) {

  return V2( a.x / b.x, a.y / b.y );
}

function v2dist( a, b ) {

  return v2abs( v2sub( b, a ) );
}

function swap( x, y ) {

  return [ y, x ];
}

function Wall( x0, y0, x1, y1 ) {

  let dis = this;

  dis.x0 = x0 <= x1 ? x0 : x1;
  dis.x1 = x1 <  x0 ? x0 : x1;
  dis.y0 = y0 <= y1 ? y0 : y1;
  dis.y1 = y1 <  y0 ? y0 : y1;

  dis.collide = function( human, rad ) {
  
    let
    r2  = rad * rad,
    dx0 = Math.max( dis.x0 - human.pos.x, 0 ),
    dy0 = Math.max( dis.y0 - human.pos.y, 0 ),
    dx1 = Math.max( human.pos.x - dis.x1, 0 ),
    dy1 = Math.max( human.pos.y - dis.y1, 0 ),
    dxs0 = dx0 * dx0,
    dys0 = dy0 * dy0,
    dxs1 = dx1 * dx1,
    dys1 = dy1 * dy1,
    axe = new V2( dxs0 < dxs1 ? dx1 : - dx0, dys0 < dys1 ? dy1 : - dy0 ),
    axx = axe.x * axe.x,
    a2xy = 2 * axe.x * axe.y,
    ayy = axe.y * axe.y;

    if( axx + ayy < r2 && v2dot( axe, human.vel ) < 0 ) {

      //console.log( axx + ayy );
      let
      aln = - 1. / ( axx + ayy );

      human.vel.x = .001 * axe.x + aln * ( ( axx - ayy ) * human.vel.x + a2xy *          human.vel.y ) ;
      human.vel.y = .001 * axe.y + aln * ( a2xy *          human.vel.x + ( ayy - axx ) * human.vel.y );

      human.pos = v2add( human.pos, V2( 1.1 * human.vel.x, 1.1 * human.vel.y )  );
    } 

    return human;
  }
  
  /*
  dis.collide = function( human, rad ) {

    let xmirrored = false;

    if( dis.y0 < human.pos.y + rad && human.pos.y - rad < dis.y1 ) {

      if( 0 < human.vel.x ) {

        if( Math.abs( dis.x0 - human.pos.x ) < rad ) {

          human.vel.x = - Math.abs( human.vel.x );

          human.pos.x = 2 * ( dis.x0 - rad ) - human.pos.x;

          xmirrored = true;
        }
      }
      else
      if( human.vel.x < 0 ) {

        if( Math.abs( human.pos.x - dis.x1 ) < rad ) {

          human.vel.x = + Math.abs( human.vel.x );

          human.pos.x = 2 * ( dis.x1 + rad ) - human.pos.x;

          xmirrored = true;
        }
      }
    }

    if( ! xmirrored )
    if( dis.x0 < human.pos.x + rad && human.pos.x - rad < dis.x1 ) {

      if( 0 < human.vel.y ) {

        if( Math.abs( dis.y0 - human.pos.y ) < rad ) {

          human.vel.y = - Math.abs( human.vel.y );

          human.pos.y = 2 * ( dis.y0 - rad ) - human.pos.y;
        }
      }
      else
      if( human.vel.y < 0 ) {

        if( Math.abs( human.pos.y - dis.y1 ) < rad ) {

          human.vel.y = + Math.abs( human.vel.y );

          human.pos.y = 2 * ( dis.y1 + rad ) - human.pos.y;
        }
      }
    }

    return human;
  }
  */
}
function sign( x ) {

  return x < 0 ? -1 : 0 < x ? 1 : 0;
}

function Human( pos, vel, acc, dis ) {

  return {
    pos : pos,
    vel : vel,
    acc : acc,
    dis : dis
  };
}

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

function rand( ) {

  return Math.random( );
}

Pandemic = function ( cnvs_name, count_of_humans_x = 10, count_of_humans_y = 5, radius = .01, velocity = .001, acceleration = 1.e-8, sicktime = 500 ) {

	let dis = this;

  dis.cnvs         = document.getElementById ( cnvs_name );
	dis.cnvs.width   = this.cnvs.clientWidth;
	dis.cnvs.height  = this.cnvs.clientHeight;
	dis.cntxt        = this.cnvs.getContext ( "2d" );
	dis.cntxt.font   = "12pt Calibri";
	dis.dsp          = new Display( dis.cnvs.width, dis.cnvs.height, 2, 1 );
	dis.cnt_x        = count_of_humans_x;
	dis.cnt_y        = count_of_humans_y;
	dis.sicktime     = sicktime;
	dis.rad          = radius;
	dis.vel          = velocity;
	dis.acc          = acceleration;
	dis.hmn          = [ ];
	dis.walls        = [ new Wall( 0., 0., 2., .05 ), new Wall( 0., .95, 2., 1. ), new Wall( 0., 0., .05, 1. ), new Wall( 1.95, 0., 2., 1. ),
	                     new Wall( .975, .1, 1.025, .9 ), new Wall( .475, .1, .525, .9 ), new Wall( 1.475, .1, 1.525, .9 ), new Wall( .1, .475, 1.9, .525 ) ];

	dis.create = function( ) {

	  for( let i = 0; i < dis.cnt_y; i ++ ) {

      let y = ( .5 + i ) / dis.cnt_y;

      for( let j = 0; j < dis.cnt_x; j ++ ) {

        let
        x = ( .5 + j ) / dis.cnt_x * dis.dsp.disp_width / dis.dsp.disp_height,
        alpha = 6.28 * rand( );

        dis.hmn.push( new Human( V2( x, y ), V2( dis.vel * Math.cos( alpha ), dis.vel * Math.sin( alpha ) ), V2( 0, 0 ), 0 ) );
      }
    }

    dis.hmn[ Math.floor( dis.hmn.length * rand( ) ) ].dis = 1;
	}

	dis.fnt = function ( font ) {

		dis.cntxt.font  = font;
	}

	dis.fcol = function ( col1 = dis.fc1, col2 = dis.fc2 ) {

		dis.fc1 = col1;
		dis.fc2 = col2;
	}

	dis.bcol = function ( col = dis.bcl ) {

		dis.bcl = col;

		dis.cnvs.style.backgroundColor = this.bcl;
	}

	dis.text = function ( txt, x, y ) {

		dis.cntxt.fillStyle = dis.fc1;
		dis.cntxt.fillText( txt, x, y );
	}

	dis.collide_each = function( h ) {

    for( h2 of dis.hmn ) {

      if( h != h2 ) {

        let wdt = Math.abs( h2.pos.x - h.pos.x );

	      if( wdt < 2 * dis.rad ) {

	        let hgt = Math.abs( h2.pos.y - h.pos.y );

    	    if( hgt < 2 * dis.rad ) {

	          let d2 = wdt * wdt + hgt * hgt;

	          if( d2 < 4 * dis.rad * dis.rad ) {

              if( 0 < h2.dis && h2.dis <= dis.sicktime && h.dis == 0 ) {

                h.dis  = 1;
              }
	          }
    	    }
	      }
	    }
    }

    return h;
	}

	dis.collide_walls = function( h ) {

    for( w of dis.walls ) {

      h = w.collide( h, dis.rad );
    }

	  return h;
	}

	dis.move = function( ) {

	  for( let i = 0; i < dis.hmn.length; i ++ ) {

	    h = dis.hmn[ i ];

  	  h.dis =
  	    h.dis == 0
  	    ? 0
  	    : h.dis < dis.sicktime
  	      ? h.dis + 1
  	      : h.dis == dis.sicktime
  	          ? Math.random( ) < .95
  	            ? dis.sicktime + 1
  	            : dis.sicktime + 2
  	          : h.dis;

      if( h.dis < dis.sicktime + 2 ) {

        h.vel.x = Math.max( Math.min( h.vel.x + h.acc.x - .000001 * h.vel.x, .005 ), -.005 );
        h.vel.y = Math.max( Math.min( h.vel.y + h.acc.y - .000001 * h.vel.y, .005 ), -.005 );
      }
      else {

        h.vel.x = 0;
        h.vel.y = 0;
      }

      h.pos.x += h.vel.x;
	    h.pos.y += h.vel.y;

      h = dis.collide_walls( h );

	    dis.hmn[ i ] = dis.collide_each( h );
	  }
	}

	dis.accelerate = function( ) {

	  for( let i = 0; i < dis.hmn.length; i ++ ) {

	    dis.hmn[ i ].acc = V2( 0, 0 );
	  }

	  for( let i = 0; i < dis.hmn.length - 1; i ++ ) {

	    h1 = dis.hmn[ i ];

  	  for( let j = i + 1; j < dis.hmn.length; j ++ ) {

        if( i != j ) {

	        h2 = dis.hmn[ j ];

	        let
	        d  = v2sub( h2.pos, h1.pos ),
	        n  = 1. / v2abs( d );
	        dn = V2( d.x * n, d.y * n ),
	        a  = Math.min( dis.acc / ( d.y * d.y + d.x * d.x ), 1e-4 );

	        //a *= Math.sqrt( a );

	        h1.acc.x -= a * dn.x;
	        h1.acc.y -= a * dn.y;
	        h2.acc.x += a * dn.x;
	        h2.acc.y += a * dn.y;

	        dis.hmn[ j ] = h2;
        }

	      dis.hmn[ i ] = h1;
      }
	  }
	}

	dis.draw = function ( ) {

    dis.cnvs        = document.getElementById ( "cnvs" );
	  dis.cnvs.width  = dis.cnvs.clientWidth;
  	dis.cnvs.height = dis.cnvs.clientHeight;

  	dis.dsp = new Display( dis.cnvs.width, dis.cnvs.height, 2, 1 );

    dis.cntxt.fillStyle = "#404040";

    dis.cntxt.fillRect( 0, 0, dis.cnvs.width, dis.cnvs.height );

    dis.cntxt.fillStyle = "#606060";

	  for( w of dis.walls ) {

	    let
	    x0 = dis.dsp.xd2c( w.x0 ),
	    x1 = dis.dsp.xd2c( w.x1 ),
      y0 = dis.dsp.yd2c( w.y0 ),
	    y1 = dis.dsp.yd2c( w.y1 );

	    dis.cntxt.fillRect( x0, y0, x1 - x0, y1 - y0 );
	  }

	  let r = dis.dsp.ad2c * dis.rad;

    for( h of dis.hmn ) {

	    let
	    p = dis.dsp.d2c( h.pos );

	    dis.cntxt.strokeStyle = h.dis == 0 ? "#00ff00" : "#ff0000";

	    dis.cntxt.beginPath( )
	    dis.cntxt.arc( p.x, p.y, r, 0, 6.28 );
      dis.cntxt.stroke( );
	    dis.cntxt.fillStyle =
	      h.dis == 0
	      ? "#00ff00"
	      : 0 < h.dis && h.dis <= dis.sicktime
	        ? "#ff0000"
	        : dis.sicktime + 1 == h.dis
	          ? "#ffff40"
	          : "#101010";

	    dis.cntxt.fill( );
	  }
	}

	dis.state = function( ) {

    let
    cnth = 0,
    cnts = 0,
    cntr = 0,
    cntd = 0;

    for( h of dis.hmn ) {

      if( h.dis == 0 ) cnth ++;
      else if( 0 < h.dis && h.dis <= dis.sicktime ) cnts ++;
      else if( dis.sicktime + 1 == h.dis ) cntr ++;
      else cntd ++;
    }

    return [ cnth, cnts, cntr, cntd ];
	};

	dis.create( );
}

