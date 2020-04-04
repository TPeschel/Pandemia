// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316
function RNG( seed ) {
  
    // LCG using GCC's constants
    this.m = 0x80000000; // 2**31;
    this.a = 1103515245;
    this.c = 12345;
  
    this.state = seed ? seed : Math.floor( Math.random( ) * ( this.m - 1 ) );
}

RNG.prototype.nextInt = function() {

    this.state = ( this.a * this.state + this.c ) % this.m;
  
    return this.state;
}

RNG.prototype.nextFloat = function( ) {
    // returns in range [0,1]
    return this.nextInt( ) / ( this.m - 1 );
}

RNG.prototype.nextRange = function( start, end ) {
    
    // returns in range [start, end): including start, excluding end
    // can't modulu nextInt because of weak randomness in lower bits
    let
    rangeSize = end - start,
    randomUnder1 = this.nextInt( ) / this.m;

    return start + Math.floor( randomUnder1 * rangeSize );
}

RNG.prototype.choice = function( array ) {
  
    return array[ this.nextRange( 0, array.length ) ];
}

// let rng = new RNG( 20 );

// for( let i = 0; i < 10; ++ i )
//   console.log(rng.nextRange(10, 50));

// var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
// for (var i = 0; i < 10; i++)
//   console.log(rng.choice(digits));