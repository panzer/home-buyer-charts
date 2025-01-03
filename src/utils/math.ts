export function addNumberTo2DArray(array2D: number[][], numberToAdd: number) {
    return array2D.map((row) => row.map((value) => value + numberToAdd));
  }
  
  export function addNumberTo2DArrayWithPredicate(array2D: number[][], numberToAdd: number, predicateFn: (r: number, c: number) => boolean) {
    return array2D.map((row, rowIndex) =>
      row.map((value, colIndex) =>
        predicateFn(rowIndex, colIndex) ? value + numberToAdd : value
      )
    );
  }
  
  export function multiplyNumberTo2DArray(array2D: number[][], numberToMultiply: number) {
    return array2D.map((row) => row.map((value) => value * numberToMultiply));
  }
  
  export function divideNumberTo2DArray(array2D: number[][], numberToDivide: number) {
    return array2D.map((row) => row.map((value) => value / numberToDivide));
  }
  
  export function add2DArrays(array2D1: number[][], array2D2: number[][]) {
    return array2D1.map((row, rowIndex) =>
      row.map((value, colIndex) => value + array2D2[rowIndex][colIndex])
    );
  }
  
  export function subtract2DArrays(array2D1: number[][], array2D2: number[][]) {
    return array2D1.map((row, rowIndex) =>
      row.map((value, colIndex) => value - array2D2[rowIndex][colIndex])
    );
  }
  
  export function subtractNumberFrom2DArray(array2D: number[][], numberToSubtract: number) {
    return array2D.map((row) => row.map((value) => value - numberToSubtract));
  }
  
  export function subtract2DArrayFromNumber(numberToStart: number, array2D: number[][]) {
    return array2D.map((row) => row.map((value) => numberToStart - value));
  }
  
  export function multiply2DArrays(array2D1: number[][], array2D2: number[][]) {
    return array2D1.map((row, rowIndex) =>
      row.map((value, colIndex) => value * array2D2[rowIndex][colIndex])
    );
  }
  
  export function divide2DArrays(array2D1: number[][], array2D2: number[][]) {
    return array2D1.map((row, rowIndex) =>
      row.map((value, colIndex) => value / array2D2[rowIndex][colIndex])
    );
  }
  
  export function transformUnary2DArray(array: number[][], transformFn: (v: number, r: number, c: number) => number) {
    return array.map((row, rowIndex) =>
      row.map((value, colIndex) => transformFn(value, rowIndex, colIndex))
    );
  }
  
  export function duplicateColumnAcross2DArray(columnArray: number[], nRows: number): number[][] {
    return Array(nRows).fill([...columnArray]);
  }
  
  export function duplicateRowAcross2DArray(rowArray: number[], nCols: number): number[][] {
    return Array(rowArray.length)
      .fill(null)
      .map((_, index) => new Array(nCols).fill(rowArray[index]));
  }
  
  export function PMT(rate: number, nper: number, pv: number) {
    if (rate === 0) {
      return pv / nper;
    }
  
    const pvif = Math.pow(1 + rate, nper);
    return (rate / (pvif - 1)) * -(pv * pvif);
  }