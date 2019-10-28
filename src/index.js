module.exports = function solveSudoku(matrix) {
  let rowMissing = [],
      colMissing = [],
      squareMissing = [],
      candidates = [[],[],[],[],[],[],[],[],[]];
  
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
      
      return true;
    }
    
    return false;
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
    
      return true;
    }
  
    return false;
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
    
      return true;
    }
    
    return false;
  }

  let findJoints = (i, j, square) => {
    let arr = [];

    for(let k = 0; k < rowMissing[i].length; ++k)
      if( colMissing[j].includes(rowMissing[i][k]) &&
          squareMissing[square].includes(rowMissing[i][k]) )
        arr.push(rowMissing[i][k]);

    return arr;
  }

  let findSectorsMissing = () => {  
    let redo = true;
    while(redo) {
      redo = false;
      for(let i = 0; i < 9; ++i) {
          redo = setRowMissing(i) || redo;
          redo = setColMissing(i) || redo;
          redo = setSquareMissing(i) || redo;
      }
    }
  }

  let setCandidates = () => {
    let redo = true;
    while(redo) {
      redo = false;
    
      findSectorsMissing();
      
      for(let i = 0; i < 9; ++i)
        for(let j = 0; j < 9; ++j)
          if(matrix[i][j] === 0) {
            candidates[i][j] = findJoints( i, j, squarePos(i, j) );

            if(candidates[i][j].length === 1) {
              matrix[i][j] = candidates[i][j][0];
              candidates[i][j] = [];
              redo = true;
            }
          } else
            candidates[i][j] = [];
    }
  }

  let findUniq = (arr) => {
    for(let i = 0; i < arr.length - 1; ++i) {
      let another = arr.slice(i + 1, arr.length).indexOf(arr[i]);

      if(another !== -1) {
        while(another !== -1) {
          arr.splice(another + i + 1, 1);
          another = arr.slice(i + 1, arr.length).indexOf(arr[i]);
        }

        arr.splice(i, 1);
        --i;
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
        arr = arr.concat( candidates[i][j] );

    return findUniq(arr);
  }

  let insertSquareUniq = (square, uniqArr) => {
    if( uniqArr.length === 0)
      return false;

    let startRow = Math.floor(square / 3) * 3,
        startCol = (square % 3) * 3;

    for(let i = startRow; i < startRow + 3; ++i)
      for(let j = startCol; j < startCol + 3; ++j)
        for(let n = 0; n < uniqArr.length; ++n)
          if( candidates[i][j].includes( uniqArr[n] ) )
            matrix[i][j] = uniqArr[n];
    
    return true;
  }

  let findRowUniq = (row) => {
    let arr = [];

    for(let i = 0; i < 9; ++i)
      arr = arr.concat( candidates[row][i] );
    
    return findUniq(arr);
  }

  let insertRowUniq = (row, uniqArr) => {
    if( uniqArr.length === 0)
      return false;

    for(let i = 0; i < 9; ++i)
      for(let n = 0; n < uniqArr.length; ++n)
        if( candidates[row][i].includes( uniqArr[n] ) )
          matrix[row][i] = uniqArr[n];
    
    return true;
  }

  let findColUniq = (col) => {
    let arr = [];

    for(let i = 0; i < 9; ++i)
      arr = arr.concat( candidates[i][col] );

    return findUniq(arr);
  }

  let insertColUniq = (col, uniqArr) => {
    if( uniqArr.length === 0)
      return false;

    for(let i = 0; i < 9; ++i)
      for(let n = 0; n < uniqArr.length; ++n)
        if( candidates[i][col].includes( uniqArr[n] ) )
          matrix[i][col] = uniqArr[n];
    
    return true;
  }

  let lastHero = () => {
    let redo = true;
    while(redo) {
      redo = false;
      
      setCandidates();
      
      for(let i = 0; i < 9; ++i) {
        redo = insertSquareUniq( i, findSquareUniq(i) ) || redo;
        redo = insertColUniq( i, findColUniq(i) ) || redo;
        redo = insertRowUniq( i, findRowUniq(i) ) || redo;
      }
    }
  }

  let isCorrectFor = (candidate, row, col) => {
    for(let i = 0; i < 9; ++i)
        if(matrix[i][col] === candidate || matrix[row][i] === candidate)
          return false;

    let [r, c] = squareStart( squarePos(row, col) );

    for(let i = r; i < r + 3; ++i)
      for(let j = c; j < c + 3; ++j)
        if(matrix[i][j] === candidate)
          return false;

    return true;
  }

  let brutForce = () => {
    for(let i = 0; i < 9; ++i) {
      for(let j = 0; j < 9; ++j)
        if(matrix[i][j] === 0) {
          for(let n = 1; n <= 9; ++n) {
            if( isCorrectFor(n, i, j) ) {
              matrix[i][j] = n;
              
              if( brutForce() ) {
                return true;
              } else {
                matrix[i][j] = 0;
              }
            }
          }

          return false;
        }
    }

    return true;
  }
  
  lastHero();
  lastHero();
  
  brutForce();

  return matrix;
}
