% Predicados para jogadas do computador

% Escolha da jogada a efetuar pelo computador, dependendo do nível de dificuldade
choose_move(GameState, Player, Level, Move):-
    valid_moves(GameState, Player-_-_-_-_, ListOfMoves),
    computerMove(Level, ListOfMoves, Move),
    sleep(2).

% Caso: Nível 1 - jogada aleatória
computerMove(1, ListOfMoves, OldPos-NewPos):-
	getRandomPlay(ListOfMoves, OldPos-NewPos-_).
% Caso: Nível 2 - computador escolhe a jogada que permita obter o maior valor para a peça
computerMove(2, ListOfMoves, OldPos-NewPos):-
    findHighestVal(ListOfMoves, OldPos-NewPos-_).
	
% Preenche Move com um elemento aleatório de ListOfMoves
getRandomPlay(ListOfMoves, Move):-
	length(ListOfMoves, Length),
    Length1 is Length+1,
    random(1, Length1, Index),
    nth1(Index, ListOfMoves, Move).

% Preenche Highest com o movimento mais vantajoso, aquele que permite que a peça aumente mais de valor
findHighestVal([Pos1-Pos2-Val|List], Highest):-
	findHighestVal(List, Pos1-Pos2-Val, Highest).
	
findHighestVal([], Highest, Highest).
findHighestVal([Pos1-Pos2-Val|List], _-_-Max, Highest):-
	Val > Max,
	findHighestVal(List, Pos1-Pos2-Val, Highest).
findHighestVal([_-_-Val|List], Pos1-Pos2-Max, Highest):-
	Val =< Max,
	findHighestVal(List, Pos1-Pos2-Max, Highest).





