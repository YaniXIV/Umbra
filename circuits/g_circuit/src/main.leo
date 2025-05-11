// The 'g_circuit' program.
program g_circuit.aleo {
    transition main( 
      lat1: i32, lon1: i32,
      lat2: i32, lon2: i32,
      radius_squared: i32
) -> bool{
  let dx: i32 = lon2 - lon1;
  let dy: i32 = lat2 - lat1;

  let dist_squared: i32 = dx * dx + dy * dy;

  return dist_squared <= radius_squared;
    }
}

