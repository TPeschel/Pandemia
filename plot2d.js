Plot2d = function ( cnvs_name ) {

	this.cnvs        = document.getElementById ( cnvs_name );
	this.cnvs.width  = this.cnvs.clientWidth;
	this.cnvs.height = this.cnvs.clientHeight;
	this.cntxt       = this.cnvs.getContext ( "2d" );
	this.cntxt.font  = "12pt Calibri";
	this.xmin = +Infinity;
	this.xmax = -Infinity;
	this.ymin = +Infinity;
	this.ymax = -Infinity,
	this.drws = [ ],
	this.fc1  = "#404040",
	this.fc2  = "#808080",
	this.bcl  = "#ffffff",
	this.clrs = [ ];

	var
	dis = this;

	this.fnt = function ( font ) {

		this.cntxt.font  = font;
	}

	this.fcol = function ( col1 = this.fc1, col2 = this.fc2 ) {

		this.fc1 = col1;
		this.fc2 = col2;
	}

	this.bcol = function ( col = this.bcl ) {

		this.bcl = col;

		this.cnvs.style.backgroundColor = this.bcl;
	}

	this.dmnsns = function ( xmin, ymin, xmax, ymax ) {

		this.xmin = rMin ( this.xmin, xmin );
		this.xmax = rMax ( this.xmax, xmax );
		this.ymin = rMin ( this.ymin, ymin );
		this.ymax = rMax ( this.ymax, ymax );
	}

	this.text = function ( txt, x, y ) {

		this.cntxt.fillStyle = this.fc1;
		this.cntxt.fillText( txt, x, y );
	}

	this.linestrip = function ( x, y ) {

		this.cntxt.beginPath ( );

		var
		i = 0;

		this.cntxt.moveTo ( x[ i ], this.cnvs.height - 1 + y[ i ] );

		while ( ++ i < x.length )

			this.cntxt.lineTo ( x[ i ], y[ i ] );

		this.cntxt.stroke ( );
	}

	this.lines = function ( x, y ) {

		this.cntxt.beginPath ( );

		var
		i = 0;

		while ( i < x.length ) {

			this.cntxt.moveTo ( x[ i ], this.cnvs.height - 1 + y[ i ] );

			++ i;

			this.cntxt.lineTo ( x[ i ], y[ i ] );

			++ i;
		}

		this.cntxt.stroke ( );
	}

	this.vlines = function ( x ) {

		this.cntxt.beginPath ( );

		cum (

			function ( x, s ) {

				dis.cntxt.moveTo ( x, 0 );

				dis.cntxt.lineTo ( x, dis.cnvs.height - 1 );
			},
			x
		);

		this.cntxt.stroke ( );
	}

	this.hlines = function ( y ) {

		this.cntxt.beginPath ( );

		cum (

			function ( y, s ) {

				dis.cntxt.moveTo ( 0, dis.cnvs.height - 1 - y );

				dis.cntxt.lineTo ( dis.cnvs.width - 1, dis.cnvs.height - 1 - y );
			},
			y
		);

		this.cntxt.stroke ( );
	}

	this.vcoords = function ( x, dx ) {

		cum (

			function ( x, s ) {

				dis.text ( ( x / dx + dis.xmin ).toExponential( 1 ).toString ( ), x + 1, dis.cnvs.height - 1 );
			},
			x
		);
	}

	this.hcoords = function ( y, dy ) {

		cum (

			function ( y, s ) {

				dis.text ( ( y / dy + dis.ymin ).toExponential( 1 ).toString ( ), 1, dis.cnvs.height - 2 - y );
			},
			y
		);
	}

	this.grid = function ( ) {

		var
		xint = this.xmax - this.xmin,
		yint = this.ymax - this.ymin,
		xlog10 = Math.floor ( Math.log10 ( .05 * xint ) ),
		ylog10 = Math.floor ( Math.log10 ( .1 * yint ) ),
		dx_ = Math.pow ( 10, xlog10 ),
		dy_ = Math.pow ( 10, ylog10 ),
		dx = ( this.cnvs.width - 1 ) / xint,
		dy = ( this.cnvs.height - 1 ) / yint,
		xbeg_ = Math.ceil ( this.xmin / dx_ ),
		xend_ = Math.ceil ( this.xmax / dx_ ),
		ybeg_ = Math.ceil ( this.ymin / dy_ ),
		yend_ = Math.ceil ( this.ymax / dy_ ),
		x_    = rel( rMul, rel ( rSub, rel ( rMul, seq ( sSet, xbeg_, xend_ ), dx_ ), this.xmin ), dx ),
		y_    = rel( rMul, rel ( rSub, rel ( rMul, seq ( sSet, ybeg_, yend_ ), dy_ ), this.ymin ), dy );

		this.cntxt.strokeStyle = this.fc2;

		this.hlines( y_ );
		this.vlines( x_ );

		dx_ *= 10;
		dy_ *= 10;

		xbeg_ = Math.ceil ( this.xmin / dx_ );
		xend_ = Math.ceil ( this.xmax / dx_ );
		ybeg_ = Math.ceil ( this.ymin / dy_ );
		yend_ = Math.ceil ( this.ymax / dy_ );
		x__   =
		x_    = rel( rMul, rel ( rSub, rel ( rMul, seq ( sSet, xbeg_, xend_ ), dx_ ), this.xmin ), dx );
		y_    = rel( rMul, rel ( rSub, rel ( rMul, seq ( sSet, ybeg_, yend_ ), dy_ ), this.ymin ), dy );

		this.cntxt.strokeStyle = this.fc1;

		this.hlines( y_ );
		this.vlines( x_ );

		this.hcoords( y_, dy );
		this.vcoords( x_, dx );
	}

	this.addYX = function ( y = seq ( pol ( [ +1, -1, +1, -1, +1, -1 ] ), -10, 11 ) , x = seq ( pol ( [ 0, 1. ] ), 0, 21 ) ) {

		this.drws.push ( [ y, x ] );
		this.clrs.push ( this.fc1 );

		this.dmnsns ( cum ( rMin, x, +Infinity ), cum ( rMin, y, +Infinity ), cum ( rMax, x, -Infinity ), cum ( rMax, y, -Infinity ) );
	}

	this.addRT = function ( r = seq ( pol ( [ +1, -1, +1, -1, +1, -1 ] ), -10, 11 ) , t = seq ( pol ( [ 0, 1. ] ), 0, 21 ) ) {

		this.addYX ( rel( rMul, fun ( sCos, t ), r ), rel( rMul, fun ( sSin, t ), r ) );
	}

	this.draw = function ( toTheRight = false ) {

		var
		dx   = ( this.cnvs.width - 1 ) / ( this.xmax - this.xmin ),
		dy   = ( this.cnvs.height - 1 ) / ( this.ymax - this.ymin ),
		i    = -1;

		while ( ++ i < this.drws.length ) {

			var
			drw = this.drws[ i ],
			y_  = drw[ 0 ],
			x_  = drw[ 1 ],
			j   = 0;

			this.cntxt.beginPath ( );
			this.cntxt.strokeStyle = this.clrs[ i ];

			var
			xl = -Infinity,
			xr = dx * ( x_[ j ] - this.xmin );

			this.cntxt.moveTo ( xr, this.cnvs.height - 1 - dy * ( y_[ j ] - this.ymin ) );

			xl = xr;

			while ( ++ j < x_.length ) {

				xr = dx * ( x_[ j ] - this.xmin );

				if ( !toTheRight || ( toTheRight && xl < xr ) )

					this.cntxt.lineTo ( xr, this.cnvs.height - 1 - dy * ( y_[ j ] - this.ymin ) );

				xl = xr;
			}

			this.cntxt.stroke ( );
		}
	}
}
