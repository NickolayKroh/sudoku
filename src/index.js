// module.exports = 
function solveSudoku(matrix) {
  let rowMissing = [],
      colMissing = [],
      squareMissing = [],
      isSolved = false;
  
  let squarePos = (i, j) => 3 * Math.floor(i/3) + Math.floor(j/3);
  
  let getMissing = arr => {
    let resultArr = [];
    
    for(let n = 1; n <= 9; ++n)
      if( !arr.includes(n) )
        resultArr.push(n);

    return resultArr;
  }
  
  let setRowMissing = i => rowMissing[i] = getMissing( matrix[i] );
  
  let setColMissing = j => {
    let arr = [];
    
    for(let i = 0; i < 9; ++i)
        arr.push( matrix[i][j] );
    
    colMissing[j] = getMissing(arr);
  }
  
  let setSquareMissing = (square) => {
    let startRow = Math.floor(square / 3) * 3,
        startCol = (square % 3) * 3,
        arr = [];
      
    for(let i = startRow; i < startRow + 3; ++i)
      for(let j = startCol; j < startCol + 3; ++j)
        arr.push( matrix[i][j] );

console.log(startRow, startCol);
console.log("arr=", arr);

    squareMissing[square] = getMissing(arr);
  }
  
  let findJoints = (i, j, square) => {
    let arr = [];

    for(let k = 0; k < rowMissing[i].length; ++k)
      if( colMissing[j].includes(rowMissing[i][k]) &&
          squareMissing[square].includes(rowMissing[i][k]) )
        arr.push(rowMissing[i][k]);

console.log("row = ", rowMissing[i]);
console.log("col = ", colMissing[j]);
console.log("sqr = ", squareMissing[square]);
console.log("jnt = ", arr);
matrix.forEach( e => console.log("" + e) );

    return arr;
  }
  
  let k = 15;
  while( k-- ) {
    isSolved = true;
    
    for(let i = 0; i < 9; ++i)
      for(let j = 0; j < 9; ++j)
        if(matrix[i][j] === 0) {
          isSolved = false;
          
          setRowMissing(i);
          if(rowMissing[i].length === 1) {
            matrix[i][j] = rowMissing[i][0];
            continue;
          }

          setColMissing(j);
          if(colMissing[j].length === 1) {
            matrix[i][j] = colMissing[j][0];
            continue;
          }

          let square = squarePos(i, j);
          
          setSquareMissing(square);
          if(squareMissing[square].length === 1) {
            matrix[i][j] = squareMissing[square][0];
            continue;
          }
          
          let joints = findJoints(i, j, square);
          if(joints.length === 1)
            matrix[i][j] = joints[0];
        }
  }
  
  return matrix;
}

function isSolved(initial, sudoku) {
  for (let i = 0; i < 9; i++) {
    let [r,c] = [Math.floor(i/3)*3,(i%3)*3];
    if (
        (sudoku[i].reduce((s,v)=>s.add(v),new Set()).size != 9) ||
        (sudoku.reduce((s,v)=>s.add(v[i]),new Set()).size != 9) ||
        (sudoku.slice(r,r+3).reduce((s,v)=>v.slice(c,c+3).reduce((s,v)=>s.add(v),s),new Set()).size != 9)
      ) return false;
  }
  return initial.every((row, rowIndex) => {
    return row.every((num, colIndex) => {
      return num === 0 || sudoku[rowIndex][colIndex] === num;
    });
  });
}

const initial = [ [6, 5, 0, 7, 3, 0, 0, 8, 0],
                  [0, 0, 0, 4, 8, 0, 5, 3, 0],
                  [8, 4, 0, 9, 2, 5, 0, 0, 0],
                  [0, 9, 0, 8, 0, 0, 0, 0, 0],
                  [5, 3, 0, 2, 0, 9, 6, 0, 0],
                  [0, 0, 6, 0, 0, 0, 8, 0, 0],
                  [0, 0, 9, 0, 0, 0, 0, 0, 6],
                  [0, 0, 7, 0, 0, 0, 0, 5, 0],
                  [1, 6, 5, 3, 9, 0, 4, 7, 0] ];
const cop = initial.map(r => [...r]);
let arr = solveSudoku(cop);

console.log(isSolved(initial, arr));
arr.forEach( e => console.log("" + e) );
// console.log("1" + arr);