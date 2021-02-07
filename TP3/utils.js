function searchForArray(haystack, needle) {
  var i, j, current;
  for (i = 0; i < haystack.length; ++i) {
    if (needle.length === haystack[i].length) {
      current = haystack[i];
      for (j = 0; j < needle.length && needle[j] === current[j]; ++j);
      if (j === needle.length)
        return i;
    }
  }
  return -1;
}

function colorTiles(orchestrator, coordinates) {
  for (let i in orchestrator.gameBoard.tiles) {
    this.x = Math.floor((orchestrator.gameBoard.tiles[i].id - 1) / orchestrator.gameBoard.size);
    this.y = (orchestrator.gameBoard.tiles[i].id - 1) % orchestrator.gameBoard.size;

    let comparableArray = [this.x, this.y, ""];
    let comparableArray2 = [this.x, this.y];

    if ((searchForArray(coordinates, comparableArray) != -1) || (searchForArray(coordinates, comparableArray2) != -1)) {
      orchestrator.gameBoard.tiles[i].highlight = true;
    }
  }
}

function unColorTiles(orchestrator) {
  for (let i in orchestrator.gameBoard.tiles) {
    orchestrator.gameBoard.tiles[i].highlight = false;;

  }
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

function availableButtons(orchestrator, buttons) {
  orchestrator.menu.resetButtons()
  for (let i = 0; i < buttons.length; i++)
    orchestrator.menu.makeAvailable(buttons[i])
}

function endavailableButtons(orchestrator, buttons) {
  orchestrator.endMenu.resetButtons()
  for (let i = 0; i < buttons.length; i++)
    orchestrator.endMenu.makeAvailable(buttons[i])
}

