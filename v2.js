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
  