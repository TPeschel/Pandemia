/* seq for sequence
 * creates an array
 * with elements computed by a given unary function pUFct_fct
 * which transforms the index running from pI_begin <= i < p_end
 *
 * var
 * a = seq ( sSqr, -5, +6 ); // a = [ 25, 16, 9, 4, 1,  0,  1,  4,  9,  16, 25  ]
 * seq( sSqt, 0, 10, a );    // a = [ 0,  1,  4, 9, 16, 25, 36, 49, 64, 81, 100 ]
 */
function seq ( pUFct_fct, pI_begin, pI_end, pA_dst = [ ] ) {

	for ( var i = pI_begin; i < pI_end; ++ i )

		pA_dst[ i - pI_begin ] = pUFct_fct ( i );

	return pA_dst;
}

/* fun for function
 * works on an array
 * with elements computed by a given unary function pUFct_fct
 * which transforms the element itself
 *
 * var
 * a = seq ( sSqr, -5, +6 ), // a = [ 25, 16,  9,  4,  1, 0,  1,  4,  9, 16, 25 ]
 * b = fun ( sSqt, a );      // b = [  5,  4,  3,  2,  1, 0,  1,  2,  3,  4,  5 ]
 * fun ( sNeg, b, a );       // a = [ -5, -4, -3, -2, -1, 0, -1, -2, -3, -4, -5 ]
 */
function fun ( pUFct_fct, pA_src, pA_dst = [ ] ) {

	for ( var i = 0; i < pA_src.length; ++ i )

		pA_dst[ i ] = pUFct_fct ( pA_src[ i ] );

	return pA_dst;
}

/* rel for relation
 * works on an array
 * with elements computed by a given binary function pBFct_fct
 * which transforms the elements of the two arrays pA_src1 and pA_src2
 * it also works if one argument pA_srcX is a constant
 *
 * var
 * a = seq ( sSqr, 1, +4 ) // a = [ 1, 2,  3 ]
 * b = rel ( sAdd, a, a ); // b = [ 2, 4,  6 ]
 * rel ( rMul, b, a, a );  // a = [ 2, 8, 18 ]
 */
function rel ( pBFct_fct, pA_src1, pA_src2, pA_dst = [ ] ) {

	if ( pA_src1 instanceof Array && pA_src2 instanceof Array ) {

		for ( var i = 0; i < pA_src1.length; ++ i )

			pA_dst[ i ] = pBFct_fct( pA_src1[ i ], pA_src2[ i ] );

		return pA_dst;
	}

	if ( pA_src1 instanceof Array ) {

		for ( var i = 0; i < pA_src1.length; ++ i )

			pA_dst[ i ] = pBFct_fct( pA_src1[ i ], pA_src2 );

		return pA_dst;
	}

	for ( var i = 0; i < pA_src2.length; ++ i )

		pA_dst[ i ] = pBFct_fct( pA_src1, pA_src2[ i ] );

	return pA_dst;
}

function cum ( pBFct_fct, pA_src, s = 0 ) {

	var
	i = -1;

	while ( ++ i < pA_src.length )

		s = pBFct_fct( pA_src[ i ], s );

	return s;
}

function iof ( pBFct_fct, pA_src, s = 0 ) {

	var
	i = -1;

	while ( ++ i < pA_src.length )

		s = pBFct_fct( pA_src[ s ], pA_src[ i ] ) == pA_src[ i ] ? i : s;

	return s;
}


// some useful functions


function arr ( pI_size, pUFct_fct = cst ( 0 ), pA_dst = [ ] ) {

	return seq ( pUFct_fct, 0, pI_size, pA_dst );
}

function rnd ( mn = 0, mx = 1 ) {

	var
	mn = mn,
	mx = mx;

	return function ( i ) {

		 return mn + ( mx - mn ) * Math.random ( );
	}
}

function cst ( p_val ) {

	var
	val = p_val;

	return function ( i ) {

		return val;
	};
}

function add ( p_val = 0 ) {

	var
	val = p_val;

	return function ( i ) {

		return i + val;
	};
}

function intg ( dx = 1, c = 0 ) {

	var
	s = c;

	return function ( i ) { return s += dx * i; };
}

function pol ( pA_coeff ) {

	var
	coeff = pA_coeff.slice ( );

	return function ( x ) {

		var
		r = 0,
		e = -1,
		p = 1;

		while ( ++ e < coeff.length ) {

			r += coeff[ e ] * p;
			p *= x;
		}

		return r;
	};
}

function sSet ( a ) { return a; }

function sNeg ( a ) { return -a; }

function sSqt ( a ) { return Math.sqrt ( a ); }

function sSqr ( a ) { return a * a; }

function sExp ( a ) { return Math.exp ( a ); }

function sLog ( a ) { return Math.log ( a ); }

function sSin ( a ) { return Math.sin ( a ); }

function sCos ( a ) { return Math.cos ( a ); }

function sTan ( a ) { return Math.tan ( a ); }

function rMin ( a, b ) { return a < b ? a : b; }

function rMax ( a, b ) { return a < b ? b : a; }

function rAdd ( a, b ) { return a + b; }

function rSub ( a, b ) { return a - b; }

function rMul ( a, b ) { return a * b; }

function rDiv ( a, b ) { return a / b; }

function rPow ( a, b ) { return Math.pow ( a, b ); }

function round ( a, b = 2 ) { return Math.pow( 10, -b ) * Math.round ( a * Math.pow ( 10, b ) ); }
