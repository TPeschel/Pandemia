Corona = function ( cnvs_name, count_of_humans = 100, radius = 10, velocity = 1., acceleration = 1., sicktime = 1000 ) {

  this.cnvs        = document.getElementById ( cnvs_name );
	this.cnvs.width  = this.cnvs.clientWidth;
	this.cnvs.height = this.cnvs.clientHeight;
	this.cntxt       = this.cnvs.getContext ( "2d" );
	this.cntxt.font  = "12pt Calibri";
	this.xmin = +Infinity;
	this.xmax = -Infinity;
	this.ymin = +Infinity;
	this.ymax = -Infinity,
	this.drws = [ ];
	this.fc1  = "#404040";
	this.fc2  = "#808080";
	this.bcl  = "#ffffff";
	this.cnt  = count_of_humans;
	this.sicktime = sicktime;
	this.rad  = radius;
	this.vel  = velocity;
	this.acceleration = acceleration;
	this.hmn  = [ ];
	this.leftwalls   = [ radius ];
	this.rightwalls  = [ this.cnvs.clientWidth - radius ];
	this.topwalls    = [ radius ];
	this.bottomwalls = [ this.cnvs.clientHeight - radius ];

	let
	dis = this;

	this.create = function( ) {

		dis.hmn.push( {
		  x : 2 * dis.rad + Math.random( ) * ( dis.cnvs.width  - 4 * dis.rad ),
		  y : 2 * dis.rad + Math.random( ) * ( dis.cnvs.height - 4 * dis.rad ),
		  vx : dis.vel * Math.cos( 6.28 * Math.random( ) ),
		  vy : dis.vel * Math.sin( 6.28 * Math.random( ) ),
		  ax : 0,
		  ay : 0,
		  c : 1
		} )

		for( let i = 1; i < dis.cnt; i ++ ) {

			let
			x  = -1,
			y  = -1,
			ok = false;

			while( ! ok ) {

				ok = true;

				x  = 2 * dis.rad + Math.random( ) * ( dis.cnvs.width  - 4 * dis.rad );
				y  = 2 * dis.rad + Math.random( ) * ( dis.cnvs.height - 4 * dis.rad );

				for( let j = 0; j < dis.hmn.length && ok ; j ++ ) {

					if( ( Math.abs( x - dis.hmn[ j ].x ) < 2 * dis.rad ) &&
						  ( Math.abs( y - dis.hmn[ j ].y ) < 2 * dis.rad ) )
						ok = false;
				}
			}

			if( ok ) {

				dis.hmn.push( {
				  x  : x,
				  y  : y,
				  vx : dis.vel * Math.cos( 6.28 * Math.random( ) ),
				  vy : dis.vel * Math.sin( 6.28 * Math.random( ) ),
				  ax : 0,
				  ay : 0,
			    c  : 0
			  } )
			}
		}
	}

	this.fnt = function ( font ) {

		dis.cntxt.font  = font;
	}

	this.fcol = function ( col1 = this.fc1, col2 = this.fc2 ) {

		dis.fc1 = col1;
		dis.fc2 = col2;
	}

	this.bcol = function ( col = this.bcl ) {

		dis.bcl = col;

		dis.cnvs.style.backgroundColor = this.bcl;
	}

	this.text = function ( txt, x, y ) {

		dis.cntxt.fillStyle = dis.fc1;
		dis.cntxt.fillText( txt, x, y );
	}

	this.collide_each = function( p ) {

    for( p2 of dis.hmn ) {

      let
	    w = p2.x - p.x;

	    if( w < 2 * dis.rad ) {

	      let
	      h = p2.y - p.y;

  	    if( w < 2 * dis.rad ) {

	        d2 = w * w + h * h;

	        if( d2 < 4 * dis.rad * dis.rad ) {

            if( 0 < p2.c && p2.c <= dis.sicktime && p.c == 0 ) {

              p.c  = 1;
            }
	        }
  	    }
	    }
    }

    return p;
	}

	this.collide_walls = function( p ) {

	  for( lw of dis.leftwalls ) {

	    if( p.x - dis.rad < lw ) {

	      p.vx = Math.abs( p.vx );

	      p.x = lw + dis.rad;
	    }
	  }
	  for( rw of dis.rightwalls ) {

	    if( rw < p.x + dis.rad ) {

	      p.vx = - Math.abs( p.vx );

	      p.x = rw - dis.rad;
	    }
	  }
	  for( tw of dis.topwalls ) {

	    if( p.y - dis.rad < tw ) {

	      p.vy = Math.abs( p.vy );

	      p.y = tw + dis.rad;
	    }
	  }
	  for( bw of dis.bottomwalls ) {

	    if( bw < p.y + dis.rad ) {

	      p.vy = - Math.abs( p.vy );

	      p.y = bw - dis.rad;
	    }
	  }

	  return p;
	}

	this.move = function( ) {

	  for( let i = 0; i < dis.hmn.length; i ++ ) {

	    h = dis.hmn[ i ];

  	  h.c =
  	    h.c == 0
  	    ? 0
  	    : h.c < dis.sicktime
  	      ? h.c + 1
  	      : h.c == dis.sicktime
  	          ? Math.random( ) < .95
  	            ? dis.sicktime + 1
  	            : dis.sicktime + 2
  	          : h.c;

      if( h.c < dis.sicktime + 2 ) {

        h.vx = Math.max( Math.min( h.vx + h.ax - .00001 * h.vx, 2 ), -2 );
        h.vy = Math.max( Math.min( h.vy + h.ay - .00001 * h.vy, 2 ), -2 );
      }
      else {

        h.vx = 0;
        h.vy = 0;
      }

      h.x += h.vx;
	    h.y += h.vy;

      h = this.collide_walls( h );

	    dis.hmn[ i ] = this.collide_each( h );
	  }
	}

	this.acc = function( ) {

	  for( let i = 0; i < dis.hmn.length; i ++ ) {

	    dis.hmn[ i ].ax = 0;
	    dis.hmn[ i ].ay = 0;
	  }

	  for( let i = 0; i < dis.hmn.length - 1; i ++ ) {

	    h1 = dis.hmn[ i ];

  	  for( let j = i + 1; j < dis.hmn.length; j ++ ) {

        if( i != j ) {

	        h2 = dis.hmn[ j ];

	        let
	        dx = ( h2.x - h1.x ),
	        dy = ( h2.y - h1.y ),
	        a  = Math.min( acceleration / ( dy * dy + dx * dx ), 10. );

	        a *= a;

	        h1.ax -= a * dx;
	        h1.ay -= a * dy;
	        h2.ax += a * dx;
	        h2.ay += a * dy;

	        dis.hmn[ j ] = h2;
        }

	      dis.hmn[ i ] = h1;
      }
	  }
	}

	this.draw = function ( ) {

    dis.cnvs        = document.getElementById ( "cnvs1" );
	  dis.cnvs.width  = this.cnvs.clientWidth;
  	dis.cnvs.height = this.cnvs.clientHeight;

    dis.cntxt.fillStyle = "#404040";

    dis.cntxt.fillRect( 0, 0, dis.cnvs.width, dis.cnvs.height );

	  for( p of dis.hmn ) {

	    dis.cntxt.beginPath( );
	    dis.cntxt.arc( p.x, p.y, dis.rad, 0, 6.28 );

	    //console.log( p )
	    dis.cntxt.fillStyle =
	      p.c == 0
	      ? "#00ff00"
	      : 0 < p.c && p.c <= dis.sicktime
	        ? "#ff0000"
	        : dis.sicktime + 1 == p.c
	          ? "#ffff40"
	          : "#404080";

	    dis.cntxt.fill( );
      dis.cntxt.stroke( );
	  }
	},
/*
	this.heal = function( ) {

    let
    cnt = 0;

    for( h of dis.hmn ) {

      if( h.c == 0 ) {

        cnt ++;
      }
    }

    return cnt;
	},

	this.sick = function( ) {

    let
    cnt = 0;

    for( h of dis.hmn ) {

      if( 0 < h.c && h.c <= dis.sicktime ) {

        cnt ++;
      }
    }

    return cnt;
	},

	this.reco = function( ) {

    let
    cnt = 0;

    for( h of dis.hmn ) {

      if( dis.sicktime < h.c ) {

        cnt ++;
      }
    }

    return cnt;
	};
*/
	this.state = function( ) {

    let
    cnth = 0,
    cnts = 0,
    cntr = 0,
    cntd = 0;

    for( h of dis.hmn ) {

      if( h.c == 0 ) cnth ++;
      else if( 0 < h.c && h.c <= dis.sicktime ) cnts ++;
      else if( dis.sicktime + 1 == h.c ) cntr ++;
      else cntd ++;
    }

    return [ cnth, cnts, cntr, cntd ];
	};

	this.create( );
}
