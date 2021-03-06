const STATE = {

	healthy             : 0,
	sick_treated        : 1,
	sick_untreated      : 2,
	recovered_treated   : 3,
	recovered_untreated : 4,
	dead_treated        : 5,
	dead_untreated      : 6  
};

let rng = new RNG( );

function Human( pos, vel, acc, sicktime = 0, state = STATE.healthy ) {

	let o = this;
	
	o.pos   = pos;
	o.vel   = vel;
	o.acc   = acc;
	o.time  = sicktime;
	o.state = state,
	o.velo  = { 
		x : 0,
		y : 0 
	};
	
	o.new_state = function( state = STATE.sick_treated ) {
	
		o.state = state;
		
		if( o.state == STATE.sick_treated ) {
		
			o.velo.x = o.vel.x;
			o.velo.y = o.vel.y;
		}
		else if( o.state == STATE.recovered_treated ) {
		
			o.vel.x = o.velo.x;
			o.vel.y = o.velo.y;
		}
	};
}

function Wall( x0, y0, x1, y1 ) {

	let o = this;
	
	o.x0 = x0 <= x1 ? x0 : x1;
	o.x1 = x1 <  x0 ? x0 : x1;
	o.y0 = y0 <= y1 ? y0 : y1;
	o.y1 = y1 <  y0 ? y0 : y1;
	
	o.collide = function( human, rad ) {
	
		if(
			human.pos.x + rad < o.x0 || o.x1 < human.pos.x - rad ||
			human.pos.y + rad < o.y0 || o.y1 < human.pos.y - rad ) {
			
			return human;
		}
		
		let
		r2  = rad * rad,
		dx0 = Math.max( o.x0 - human.pos.x, 0 ),
		dy0 = Math.max( o.y0 - human.pos.y, 0 ),
		dx1 = Math.max( human.pos.x - o.x1, 0 ),
		dy1 = Math.max( human.pos.y - o.y1, 0 ),
		dxs0 = dx0 * dx0,
		dys0 = dy0 * dy0,
		dxs1 = dx1 * dx1,
		dys1 = dy1 * dy1,
		axe = new V2( dxs0 < dxs1 ? dx1 : - dx0, dys0 < dys1 ? dy1 : - dy0 ),
		axx = axe.x * axe.x,
		a2xy = 2 * axe.x * axe.y,
		ayy = axe.y * axe.y;
		
		if( axx + ayy < r2 && v2dot( axe, human.vel ) < 0 ) {
		
			let
			aln = - 1.0 / ( axx + ayy );
			
			human.vel.x = 0.001 * axe.x + aln * ( ( axx - ayy ) * human.vel.x + a2xy *          human.vel.y ) ;
			human.vel.y = 0.001 * axe.y + aln * ( a2xy *          human.vel.x + ( ayy - axx ) * human.vel.y );
			
			human.pos = v2add( human.pos, V2( 1.1 * human.vel.x, 1.1 * human.vel.y ) );
		} 
		
		return human;
	};
}

function sign( x ) {

	return x < 0 ? -1 : 0 < x ? 1 : 0;
}

Pandemia = function( 
	cnvs_name, 
	count_of_humans_x = 20, 
	count_of_humans_y = 10,
	radius = 0.015, 
	velocity = 0.015, 
	acceleration = 1.e-8, 
	sicktime = 500, 
	seed = 20, 
	addwalls = [ ],
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
	max_hospital = 0.1,
	mortality_inside = 0.1,
	mortality_outside = 0.25,
	damping_quara = dp,
	acc_quara = aq ) {
	
	let o = this;
	
	o.rng           = new RNG( seed ),
	o.cnvs          = document.getElementById ( cnvs_name );
/*	o.cnvs.width    = 512;
	o.cnvs.height   = 256;
*/
	o.cnvs.width    = this.cnvs.clientWidth;
	o.cnvs.height   = this.cnvs.clientHeight;
	o.cntxt         = this.cnvs.getContext ( "2d" );
	o.cntxt.font    = "12pt Calibri";
	o.dsp           = new Display( o.cnvs.width, o.cnvs.height, 2, 1 );
	o.cnt_x         = count_of_humans_x;
	o.cnt_y         = count_of_humans_y;
	o.sicktime      = sicktime;
	o.rad           = radius;
	o.vel           = velocity;
	o.acc           = acceleration;
	o.damp          = damping_quara,
	o.acq           = acc_quara,
	o.max_sicks     = max_hospital * count_of_humans_x * count_of_humans_y;
	o.mort_in       = mortality_inside,
	o.mort_out      = mortality_outside,
	o.time_cnt      = 0;
	o.hmn           = [ ];
	o.walls			= [ new Wall( 0.0, 0.0, 2.0, 0.05 ), new Wall( 0.0, 0.95, 2.0, 1.0 ), new Wall( 0.0, 0.0, 0.05, 1.0 ), new Wall( 1.95, 0.0, 2.0, 1.0 ) ];
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
	
	o.colors = colors;
	
	o.create = function( addwalls ) {
	
		for( let w of addwalls ) {
	
			o.walls.push( w );
		}
	};
	
	o.restart = function( ) {
	
		o.rng = new RNG( seed );
		
		o.time_cnt = 0;
		
		o.hmn = [ ];
		
		for( let i = 0; i < o.cnt_y; i ++ ) {
		
			let y = ( 1.5 + i ) / ( o.cnt_y + 2 );
		
			for( let j = 0; j < o.cnt_x; j ++ ) {
			
				let
				x = ( 1.5 + j ) / ( o.cnt_x + 2 ) * o.dsp.disp_width / o.dsp.disp_height,
				alpha = 6.28 * o.rng.nextFloat( );
				
				o.hmn.push( new Human( V2( x, y ), V2( o.vel * Math.cos( alpha ), o.vel * Math.sin( alpha ) ), V2( 0, 0 ), 0, STATE.healthy ) );
			}
		}
		
		o.hmn[ Math.floor( o.hmn.length * o.rng.nextFloat( ) ) ].new_state( STATE.sick_treated );
		
		o.upd_states( );
	};
	
	o.fnt = function ( font ) {
	
		o.cntxt.font  = font;
	};
	
	o.fcol = function ( col1 = o.fc1, col2 = o.fc2 ) {
	
		o.fc1 = col1;
		o.fc2 = col2;
	};
	
	o.bcol = function ( col = o.bcl ) {
	
		o.bcl = col;
		
		o.cnvs.style.backgroundColor = this.bcl;
	};
	
	o.text = function ( txt, x, y ) {
	
		o.cntxt.fillStyle = o.fc1;
		o.cntxt.fillText( txt, x, y );
	};
	
	o.collide_each = function( h ) {
	
		if( h.state == STATE.healthy ) {
		
			for( let h2 of o.hmn ) {
			
				if( h != h2 ) {
				
					let wdt = Math.abs( h2.pos.x - h.pos.x );
					
					if( wdt < 2 * o.rad ) {
					
						let hgt = Math.abs( h2.pos.y - h.pos.y );
						
						if( hgt < 2 * o.rad ) {
						
							let d2 = wdt * wdt + hgt * hgt;
							
							if( d2 < 4 * o.rad * o.rad ) {
							
								if( h2.state == STATE.sick_treated || h2.state == STATE.sick_untreated ) {
								
									h.time = 0;
									
									if( o.states.sick.treated < o.max_sicks ) {
									
										h.new_state( STATE.sick_treated );
									}
									else {
									
										h.new_state( STATE.sick_untreated );
									}
								}
							}
						}
					}
				}
			}
		}
		
		return h;
	};
	
	o.collide_walls = function( h ) {
	
		for( let w of o.walls ) {
		
			h = w.collide( h, o.rad );
		}
		
		return h;
	};
		
	o.move = function( ) {
		
		for( let i = 0; i < o.hmn.length; i ++ ) {
		
			h = o.hmn[ i ];
		
			++ h.time;
		
			if( o.sicktime < h.time ) {
		
				if( h.state == STATE.sick_treated ) {
		
					if( o.rng.nextFloat( ) < ( 1.0 - o.mort_in ) ) {
		
						h.new_state( STATE.recovered_treated );
					}
					else {
		
						h.new_state( STATE.dead_treated );
					}
				}
				else if( h.state == STATE.sick_untreated ) {
		
					if( o.rng.nextFloat( ) < ( 1.0 - o.mort_out ) ) {
		
						h.new_state( STATE.recovered_untreated );
					}
					else {
		
						h.new_state( STATE.dead_untreated );
					}
				}
			}
		
			h.vel.x = Math.max( Math.min( h.vel.x + h.acc.x, 0.01 ), -0.01 );
			h.vel.y = Math.max( Math.min( h.vel.y + h.acc.y, 0.01 ), -0.01 );

			if( ( h.state == STATE.dead_treated || h.state == STATE.dead_untreated ) ) {

				h.vel.x = 0.0;
				h.vel.y = 0.0;
			}
		
			if( h.state == STATE.sick_treated ) {
		
				h.vel.x *= ( 1.0 - 0.03 * o.damp );
				h.vel.y *= ( 1.0 - 0.03 * o.damp );
			}
		
			h.pos.x += h.vel.x;
			h.pos.y += h.vel.y;
			
			o.hmn[ i ] = o.collide_walls( h );
		}
		
		for( let i = 0; i < o.hmn.length; i ++ ) {
		
			o.hmn[ i ] = o.collide_each( o.hmn[ i ] );
		}
	};
		
	o.accelerate = function( ) {
		
		for( let i = 0; i < o.hmn.length; i ++ ) {
		
			o.hmn[ i ].acc = V2( 0, 0 );
		}
		
		for( let i = 0; i < o.hmn.length - 1; i ++ ) {
		
			h1 = o.hmn[ i ];
			
			for( let j = i + 1; j < o.hmn.length; j ++ ) {
		
				if( i != j ) {
		
					h2 = o.hmn[ j ];
		
					let
					d  = v2sub( h2.pos, h1.pos ),
					d2 = v2abs( d );
		
					if( d2 < 4 * o.rad ) {
		
						n  = 1.0 / v2abs( d );
						dn = V2( d.x * n, d.y * n ),
						a  = Math.min( o.acc / ( d.y * d.y + d.x * d.x ), 1e-3 );
						
						if( ( h2.state != STATE.dead_treated && h2.state != STATE.dead_untreated ) ) {

							h1.acc.x -= a * dn.x;
							h1.acc.y -= a * dn.y;
						}
						
						if( ( h1.state != STATE.dead_treated && h1.state != STATE.dead_untreated ) ) {

							h2.acc.x += a * dn.x;
							h2.acc.y += a * dn.y;
						}

						if( ( h1.state == STATE.sick_treated ) || ( h2.state == STATE.sick_treated ) ) {

							h1.acc.x -= o.acq * a * dn.x;
							h1.acc.y -= o.acq * a * dn.y;
						
							h2.acc.x += o.acq * a * dn.x;
							h2.acc.y += o.acq * a * dn.y;
						}
					}
				
					o.hmn[ j ] = h2;
				}
		
				o.hmn[ i ] = h1;
			}
		}
	};
		
	o.draw = function ( ) {
		
		o.cnvs.width  = o.cnvs.clientWidth;
		o.cnvs.height = o.cnvs.clientHeight;
		
		o.dsp = new Display( o.cnvs.width, o.cnvs.height, 2, 1 );
		
		o.cntxt.fillStyle = "#f0f0f0";
		
		o.cntxt.fillRect( 0, 0, o.cnvs.width, o.cnvs.height );
		
		o.cntxt.fillStyle = "#8090a0";
		
		for( let w of o.walls ) {
		
			let
			x0 = o.dsp.xd2c( w.x0 ),
			x1 = o.dsp.xd2c( w.x1 ),
			y0 = o.dsp.yd2c( w.y0 ),
			y1 = o.dsp.yd2c( w.y1 );
			
			o.cntxt.fillRect( x0, y0, x1 - x0, y1 - y0 );
		}
		
		let r = o.dsp.ad2c * o.rad;
		
		o.cntxt.strokeStyle = "#0f0f0f";
			
		for( let h of o.hmn ) {
		
			let p = o.dsp.d2c( h.pos );
			
			o.cntxt.beginPath( );
			o.cntxt.arc( p.x, p.y, r, 0, 6.28 );
			o.cntxt.stroke( );
			o.cntxt.fillStyle = [
			o.colors.healthy, 
			o.colors.sick.treated, o.colors.sick.untreated,
			o.colors.recovered.treated, o.colors.recovered.untreated,
			o.colors.dead.treated, o.colors.dead.untreated
			][ h.state ];
			
			o.cntxt.fill( );
		}
	};
	
	o.finished = function( ) {
	
		return o.states.sick.treated + o.states.sick.untreated === 0;
	};
	
	o.upd_states = function( ) {
	
		o.states = {
			total     : o.hmn.length, 
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
		
		for( let h of o.hmn ) {
		
			if( h.state == STATE.healthy ) ++ o.states.healthy;
			if( h.state == STATE.sick_treated ) ++ o.states.sick.treated;
			if( h.state == STATE.sick_untreated ) ++ o.states.sick.untreated;
			if( h.state == STATE.recovered_treated ) ++ o.states.recovered.treated;
			if( h.state == STATE.recovered_untreated ) ++ o.states.recovered.untreated;
			if( h.state == STATE.dead_treated ) ++ o.states.dead.treated;
			if( h.state == STATE.dead_untreated ) ++ o.states.dead.untreated;
		}
	
		return o.states;
	};
	
	o.do = function( ) {
	
		o.time_cnt = o.time_cnt < 4000 ? o.time_cnt + 1 : 0;
		
		o.accelerate( );
		o.move( );
		o.upd_states( );
		o.draw ( );
	};
		
	o.create( addwalls );
	o.restart( );
};

