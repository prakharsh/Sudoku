// sudoku array used to generate the board
var sudoku = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
// solution  array is used to track user progree
var solution=new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
var x=0 ;
document.getElementById("btn").addEventListener("click",startgame) ;
function startgame(){
  // initialize the both arrays on a new game click
  for(var i=0 ;i<81 ;i++){
    sudoku[i]=0 ;
    solution[i]=0 ;
  }
  // to start the timer
  time() ;
  // clear the board from prev game
  clearprev() ;
  // set the difficulty
  diff() ;
}
// this sets the difficulty given by user
function diff(){
  if(document.getElementById("easy").checked){
      x=35 ;
  }
  else if(document.getElementById("medium").checked){
      x=40 ;
  }
  else {
      x=45 ;
  }
  solve(sudoku,x) ;
}

// this returns the row number
function row_num(cell) {
  return Math.floor(cell / 9);
}

// this returns the col number
function col_num(cell) {
  return cell % 9;
}

// this returns the 3X3 block number
function block_num(cell) {
  return Math.floor(row_num(cell) / 3) * 3 + Math.floor(col_num(cell) / 3);
}

// this checks if the number can be place in given row
function valid_by_row(number, row, sudoku) {
  for (var i = 0; i <= 8; i++) {
    if (sudoku[row * 9 + i] == number) {
      return false;
    }
  }
  return true;
}

// this checks if the number can be place in given column
function valid_by_col(number, col, sudoku) {
  for (var i = 0; i <= 8; i++) {
    if (sudoku[col + 9 * i] == number) {
      return false;
    }
  }
  return true;
}

// this checks if the number can be place in given block
function valid_by_block(number, block, sudoku) {
  for (var i = 0; i <= 8; i++) {
    if (
      sudoku[
        Math.floor(block / 3) * 27 +
          (i % 3) +
          9 * Math.floor(i / 3) +
          3 * (block % 3)
      ] == number
    ) {
      return false;
    }
  }
  return true;
}

// this checks if the number can be place in given cell
function valid_by_cell(cell, number, sudoku) {
  var row = row_num(cell);
  var col = col_num(cell);
  var block = block_num(cell);
  return (
    valid_by_row(number, row, sudoku) &&
    valid_by_col(number, col, sudoku) &&
    valid_by_block(number, block, sudoku)
  );
}

// check if the row is completely filled
function isRowComplete(row, sudoku) {
  var rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
  var rowTemp = new Array();
  for (var i = 0; i <= 8; i++) {
    rowTemp[i] = sudoku[row * 9 + i];
  }
  rowTemp.sort();
  return rowTemp.join() == rightSequence.join();
}

// check if col is completely filled
function isColComplete(col, sudoku) {
  var rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
  var colTemp = new Array();
  for (var i = 0; i <= 8; i++) {
    colTemp[i] = sudoku[col + i * 9];
  }
  colTemp.sort();
  return colTemp.join() == rightSequence.join();
}

// check if block is completely filled
function isBlockComplete(block, sudoku) {
  var rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
  var blockTemp = new Array();
  for (var i = 0; i <= 8; i++) {
    blockTemp[i] =
      sudoku[
        Math.floor(block / 3) * 27 +
          (i % 3) +
          9 * Math.floor(i / 3) +
          3 * (block % 3)
      ];
  }
  blockTemp.sort();
  return blockTemp.join() == rightSequence.join();
}

// this returns true if the sudoku is fully solved
function isSudokuFullySolved(sudoku) {
  for (var i = 0; i <= 8; i++) {
    if (
      !isBlockComplete(i, sudoku) ||
      !isRowComplete(i, sudoku) ||
      !isColComplete(i, sudoku)
    ) {
      return false;
    }
  }
  return true;
}

// this returns all the possible choices of a cell
function cellPossibleChoices(cell, sudoku) {
  var possible = new Array();
  for (var i = 1; i <= 9; i++) {
    if (valid_by_cell(cell, i, sudoku)) {
      possible.unshift(i);
    }
  }
  return possible;
}

// this returns the random number from available choices
function pickRandomValue(possible, cell) {
  var randomPicked = Math.floor(Math.random() * possible[cell].length);
  return possible[cell][randomPicked];
}

// this return the 2d array of choices available in each cell
function allCellsChoices(sudoku) {
  var possible = new Array();
  for (var i = 0; i <= 80; i++) {
    if (sudoku[i] == 0) {
      possible[i] = new Array();
      possible[i] = cellPossibleChoices(i, sudoku);
      if (possible[i].length == 0) {
        return false;
      }
    }
  }
  return possible;
}

// this removes the used number from choices
function removeUsedNum(attemptArray, number) {
  var newArray = new Array();
  for (var i = 0; i < attemptArray.length; i++) {
    if (attemptArray[i] != number) {
      newArray.unshift(attemptArray[i]);
    }
  }
  return newArray;
}

// this returns the cell in which there is least choices
function leastChoicesCell(possible) {
  var max = 9;
  var minChoices = 0;
  for (var i = 0; i <= 80; i++) {
    if (possible[i] != undefined) {
      if (possible[i].length <= max && possible[i].length > 0) {
        max = possible[i].length;
        minChoices = i;
      }
    }
  }
  return minChoices;
}

// this fills the board 
function solve(sudoku,x) {
  var saved = new Array();
  var savedSudoku = new Array();
  var i = 0;
  var nextMove;
  var whatToTry;
  var attempt;
  while (!isSudokuFullySolved(sudoku)) {
    i++;
    nextMove = allCellsChoices(sudoku);
    if (nextMove == false) {
      nextMove = saved.pop();
      sudoku = savedSudoku.pop();
    }
    whatToTry = leastChoicesCell(nextMove);
    attempt = pickRandomValue(nextMove, whatToTry);
    if (nextMove[whatToTry].length > 1) {
      nextMove[whatToTry] = removeUsedNum(nextMove[whatToTry], attempt);
      saved.push(nextMove.slice());
      savedSudoku.push(sudoku.slice());
    }
    sudoku[whatToTry] = attempt;
  }
  removesomevalues(sudoku,x) ;
  displaySudoku(sudoku,i);
}

// this removes some values from sudoku
function removesomevalues(sudoku,i){
   while(i>0){
    var x=Math.floor(Math.random() * (81 - 0) + 0) ;
      if(sudoku[x]!=0){
        sudoku[x]=0 ;
        i-- ;
      }
    
   }
   
}
// display the puzzle on screen
function displaySudoku(sudoku,i) {
  for (var j = 0; j < 81; j++) {
    if(sudoku[j]!=0){
      solution[j]=sudoku[j] ;
      document.getElementById(j).innerHTML = sudoku[j];
      document.getElementById(j).style.pointerEvents = "none";
      document.getElementById(j).style.color = "rgb(0,0,0)";
      document.getElementById(j).classList.add("filled_cell")
    }
    else document.getElementById(j).style.pointerEvents = "auto";
  }
}
// takes input from user
function input(x) {
  if (x.value == undefined) {
    if (value == "C" && document.getElementById(x).style.pointerEvents != "none") {
      document.getElementById(x).innerHTML = "";
      solution[x]=0 ;
    } 
    else{
      document.getElementById(x).innerHTML = value;
      document.getElementById(x).style.color = "rgb(0,0,255)";
      solution[x]=value ;
    } 
  }
 else {
    value = x.value;
    document.getElementById(x.id).classList.add("onfocused");
  }
}

var timeid;
// use to maintain the timer
function time(){
  clearInterval(timeid) ;
var seconds = 0;
var second = 0;
var minutes = 0;
timeid=setInterval(timer, 1000);
function timer() {
  document.getElementById("time").innerHTML =
    "Time " + pad(minutes) + ":" + pad(second);
  second = seconds - minutes * 60;
  seconds++;
  minutes = Math.floor(seconds / 60);
}
}
// helper function to display time
function pad(d) {
  return d < 10 ? "0" + d.toString() : d.toString();
}
// this removes the colour changed by clicking
function changeColor(x) {
  document.getElementById(x).classList.remove("onfocused");
}
// this clears the board from previous game
function clearprev(){
  for(var i=0 ;i<81 ;i++){
    document.getElementById(i).innerHTML="" ;
    document.getElementById(i).classList.remove("filled_cell") ;
  }
}
// this check if the solution by user is correct
function isFullySolved(solution){
  for(var i=0 ;i<81 ;i++){
    if(solution[i]==0) return false ;
    }
    return true ;
}
function solncheck(){
  if(!isFullySolved(solution)){
    if(!alert("Fully Solve The Sudoku before submitting :-()")) window.location.reload() ;
  }
  else if(isSudokuFullySolved(solution)){
   if(!alert("Congrats! You Won :-) ")) window.location.reload() ;
  }
  else{ 
    if(!alert("You Lost  :-( "))window.location.reload() ;
  }
}