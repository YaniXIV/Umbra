program geoproof.aleo {
  // The 'geoproof' program.
    transition main( 
      x1: i32, y1: i32,
      public x2: i32, public y2: i32,
      public radius_squared: i32
) -> bool{
  let dx: i32 = x2 - x1;
  let dy: i32 = y2 - y1;

  let dist_squared: i32 = dx * dx + dy * dy;

  return dist_squared <= radius_squared;
    }
}
