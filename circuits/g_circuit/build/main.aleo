program g_circuit.aleo;

function main:
    input r0 as i32.private;
    input r1 as i32.private;
    input r2 as i32.private;
    input r3 as i32.private;
    input r4 as i32.private;
    sub r3 r1 into r5;
    sub r2 r0 into r6;
    mul r5 r5 into r7;
    mul r6 r6 into r8;
    add r7 r8 into r9;
    lte r9 r4 into r10;
    output r10 as boolean.private;
