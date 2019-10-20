// module.exports = 
function solveSudoku(matrix) {
  let rowMissing = [],
      colMissing = [],
      squareMissing = [],
      isSolved = false,
      joints = [[],[],[],[],[],[],[],[],[]];
  
  let squarePos = (i, j) => 3 * Math.floor(i/3) + Math.floor(j/3);
  let squareStart = (square) => {
    let startRow = Math.floor(square / 3) * 3,
        startCol = (square % 3) * 3;

    return [startRow, startCol];
  }
  
  let getMissing = (arr) => {
    let resultArr = [];
    
    for(let n = 1; n <= 9; ++n)
      if( !arr.includes(n) )
        resultArr.push(n);

    return resultArr;
  }
  
  let setRowMissing = (i) => {
    rowMissing[i] = getMissing( matrix[i] );
  
    if(rowMissing[i].length === 1) {
      for(let j = 0; j < 9; ++j)
        if(matrix[i][j] === 0) {
          matrix[i][j] = rowMissing[i][0];
          break;
        }

      rowMissing[i] = [];
    }
  }
  
  let setColMissing = (j) => {
    let arr = [];
    
    for(let i = 0; i < 9; ++i)
        arr.push( matrix[i][j] );
    
    colMissing[j] = getMissing(arr);

    if(colMissing[j].length === 1) {
      for(let i = 0; i < 9; ++i)
        if(matrix[i][j] === 0) {
          matrix[i][j] = colMissing[j][0];
          break;
        }

      colMissing[j] = [];
    }
  }
  
  let setSquareMissing = (square) => {
    let startRow = Math.floor(square / 3) * 3,
        startCol = (square % 3) * 3,
        arr = [];
      
    for(let i = startRow; i < startRow + 3; ++i)
      for(let j = startCol; j < startCol + 3; ++j)
        arr.push( matrix[i][j] );

    squareMissing[square] = getMissing(arr);
 
    if(squareMissing[square].length === 1) {
      for(let i = startRow; i < startRow + 3; ++i)
        for(let j = startCol; j < startCol + 3; ++j)
          if(matrix[i][j] === 0) {
            matrix[i][j] = squareMissing[square][0];
            squareMissing[square] = [];
            return;
          }
    }
  }
  
  let findJoints = (i, j, square) => {
    let arr = [];

    for(let k = 0; k < rowMissing[i].length; ++k)
      if( colMissing[j].includes(rowMissing[i][k]) &&
          squareMissing[square].includes(rowMissing[i][k]) )
        arr.push(rowMissing[i][k]);

    return arr;
  }

  let setJoints = () => {
    for(let i = 0; i < 9; ++i) {
        setRowMissing(i);
        setColMissing(i);
        setSquareMissing(i);
    }

    for(let i = 0; i < 9; ++i)
      for(let j = 0; j < 9; ++j)
        if(matrix[i][j] === 0)
          joints[i][j] = findJoints(i, j, squarePos(i,j));
        else
          joints[i][j] = [];
  }

  let findUniq = (arr) => {
    for(let i = 0; i < arr.length - 1; ++i) {
      let another = arr.slice(i + 1, arr.length).indexOf(arr[i]);

      if(another !== -1) {
        while(another !== -1) {
          arr.splice(another, 1);
          another = arr.slice(i + 1, arr.length).indexOf(arr[i]);
        }

        arr.splice(i, 1);
      }
    }

    return arr;
  }

  let findSquareUniq = (square) => {
    let startRow = Math.floor(square / 3) * 3,
        startCol = (square % 3) * 3,
        arr = [];
  
    for(let i = startRow; i < startRow + 3; ++i)
      for(let j = startCol; j < startCol + 3; ++j)
        arr = arr.concat( joints[i][j] );

    return findUniq(arr);
  }

  let insertSquareUniq = (square, uniqArr) => {
    if( uniqArr.length === 0)
      return;

    let startRow = Math.floor(square / 3) * 3,
        startCol = (square % 3) * 3;

    for(let i = startRow; i < startRow + 3; ++i)
      for(let j = startCol; j < startCol + 3; ++j)
        for(let n = uniqArr[0]; n < uniqArr.length; ++n)
          if( joints[i][j].includes( uniqArr[n] ) )
            matrix[i][j] = uniqArr[n];
  }

  let lastSquareHero = () => {
    for(let i = 0; i < 9; ++i)
      insertSquareUniq( i, findSquareUniq(i) );
  }
  
  let findRowUniq = (row) => {
    let arr = [];
  
    for(let i = 0; i < 9; ++i)
      arr = arr.concat( joints[row][i] );

    return findUniq(arr);
  }

  let insertRowUniq = (row, uniqArr) => {
    if( uniqArr.length === 0)
      return;

    for(let i = 0; i < 9; ++i)
      for(let n = uniqArr[0]; n < uniqArr.length; ++n)
        if( joints[row][i].includes( uniqArr[n] ) )
          matrix[row][i] = uniqArr[n];
  }

  let lastRowHero = () => {
    for(let i = 0; i < 9; ++i)
      insertRowUniq( i, findRowUniq(i) );
  }

  let findColUniq = (col) => {
    let arr = [];
  
    for(let i = 0; i < 9; ++i)
      arr = arr.concat( joints[i][col] );

    return findUniq(arr);
  }

  let insertColUniq = (col, uniqArr) => {
    if( uniqArr.length === 0)
      return;

    for(let i = 0; i < 9; ++i)
      for(let n = uniqArr[0]; n < uniqArr.length; ++n)
        if( joints[i][col].includes( uniqArr[n] ) )
          matrix[i][col] = uniqArr[n];
  }
  
  let lastColHero = () => {
    for(let i = 0; i < 9; ++i)
      insertColUniq( i, findColUniq(i) );
  }
  
  let v = 250;
  while(v--) {
    setJoints();
    lastSquareHero();
    lastRowHero();
    lastColHero();
  }

  // console.log("arr=", rowMissing[0]);

  // for(let i = 0; i < 9; ++i)
  //   // for(let j = 0; j < 3; ++j)
  //     console.log(joints[0][i]);
  
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

console.log('is solved - ', isSolved(initial, arr));
console.log('is change - ', (initial !== arr));

arr.forEach( e => console.log("" + e) );
// console.log("1" + arr);