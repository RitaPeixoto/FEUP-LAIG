% Predicados para mover pecas no tabuleiro

%Ronda de jogo de um jogador
% Caso: jogador humano
getValidMovesforPiece(GameState, Player, [Row,Column], NewMoves):-
	valid_moves(GameState, Player-_-_-_-_, ListOfMoves),
	findall(NewPos, member([Row, Column]-NewPos-_, ListOfMoves), NewMoves).

getMovablePieces(GameState, Player, OldMoves):-
	valid_moves(GameState, Player-_-_-_-_, ListOfMoves),
	((setof(OldPos, (NewPos-Val)^member(OldPos-NewPos-Val, ListOfMoves), OldMoves));(OldMoves=[])).
%after this we can move. js task nt t let choose wrong pieces???


playerTurn(GameState, Player-'player'-_-_, OldPos, NewPos, NewState):-
	% printTurn(Player),
	% %gets moveable pieces and user chooses one
	% setof(OldPos, (NewPos-Val)^member(OldPos-NewPos-Val, ListOfMoves), OldMoves),
	% write('Choose one of the available pieces to move ([Row, Col]) :\n'),
	% printList(OldMoves),
	% readPos(Player, OldMoves, [Row, Column]),
	% %gets possible positions to move the selected piece to and user chooses one
	% findall(NewPos, member([Row, Column]-NewPos-_, ListOfMoves), NewMoves), 
	% write('Choose one of the possible positions to move to ([Row, Col]) :\n'),
	% printList(NewMoves),
	% readPos(Player, NewMoves, NewPos),
	
	% %moves piece getting the new game state
	move(GameState, OldPos-NewPos, NewState).
% Caso: jogador computador
playerTurn(GameState, Player-'computer'-Ai1-Ai2, _, Move, NewState):-
	%printTurn(Player),
	getLevel(Player, Ai1-Ai2, Level),
	choose_move(GameState, Player, Level, Move),
	move(GameState, Move, NewState).
% Caso: jogador escolhe peça que não pode mover
playerTurn(GameState, Player, ListOfMoves, NewState):-	
	write('Cant move this piece, choose again!\n'),
	playerTurn(GameState, Player, ListOfMoves, NewState), !.

% Lista com jogadas possíveis
valid_moves(GameState, Player-_-_-_-_, ListOfMoves):-
	findPieces(GameState, Player, 1, ListTemp),
	findMoves(GameState, ListTemp, ListOfMoves).

%Encontra posicoes das pecas do jogador	
findPieces([], _, _, []).
findPieces([H|T], Player, Row, List):-
	findPiecesRow(H, Player, Row, 1, L1),
	Row1 is Row+1,
	findPieces(T, Player, Row1, L2),
	append(L1, L2, List).

findPiecesRow([], _, _, _, []).
findPiecesRow([Player|R], Player, Row, Col, List):-
	Col1 is Col+1,
	findPiecesRow(R, Player, Row, Col1, L1),
	append([[Row, Col]], L1, List).
findPiecesRow([Color|R], Player, Row, Col, List):-
	Color\=Player,
	Col1 is Col+1,
	findPiecesRow(R, Player, Row, Col1, List).
	
%Encontra movimentos possiveis para cada peça	
findMoves(_, [], []).
findMoves(GameState, [Pos|L], ListOfMoves):-
	validMovesInPos(GameState, Pos, L1),
	findMoves(GameState, L, L2),
	append(L1, L2, ListOfMoves).

%Encontra movimentos possiveis para uma peça especifica
validMovesInPos(GameState, [Row, Column], ListOfMoves):-
	RowUp is Row-1,
	RowDown is Row+1,
	ColRight is Column+1,
	ColLeft is Column-1,
	checkMove(GameState, [Row, Column], [RowUp, Column], MoveUp),
	checkMove(GameState, [Row, Column], [RowDown, Column], MoveDown),
	checkMove(GameState, [Row, Column], [Row, ColRight], MoveRight),
	checkMove(GameState, [Row, Column], [Row, ColLeft], MoveLeft),
	checkMove(GameState, [Row, Column], [RowUp, ColLeft], MoveDiagLeftUp),
	checkMove(GameState, [Row, Column], [RowDown, ColLeft], MoveDiagLeftDown),
	checkMove(GameState, [Row, Column], [RowUp, ColRight], MoveDiagRightUp),
	checkMove(GameState, [Row, Column], [RowDown, ColRight], MoveDiagRightDown),
	append([], MoveUp, L1),
	append(L1, MoveDown, L2),
	append(L2, MoveRight, L3),
	append(L3, MoveLeft, L4),
	append(L4, MoveDiagLeftUp, L5),
	append(L5, MoveDiagLeftDown, L6),
	append(L6, MoveDiagRightUp, L7),
	append(L7, MoveDiagRightDown, ListOfMoves).

%Verifica se o movimento é válido (cores diferentes e o valor da peca aumenta)
checkMove(GameState, Pos, NewPos, [Pos-NewPos-Val3]):-	
	getColor(GameState, Pos, Color1),
	getColor(GameState, NewPos, Color2),
	Color1\=Color2,
	valuePiece(GameState, Pos, Val1),
	switchPieces(GameState, Pos-NewPos, NewState),
	valuePiece(NewState, NewPos, Val2),
	Val2>Val1,
	Val3 is Val2-Val1.
checkMove(_, _, _,[]).
	
	
% Validação e execução de uma jogada, obtendo o novo estado do jogo
move(GameState, Move, NewGameState):-
	switchPieces(GameState, Move, NewGameState).


%Troca duas peças, obtendo o novo estado do jogo
switchPieces(InitialBoard, Pos1-Pos2, NewBoard):-
    switchColor(InitialBoard, Pos1, NewBoardAux),
    switchColor(NewBoardAux, Pos2, NewBoard).
	
%Muda a cor da peça numa determinada posição	
switchColor([R|T], [1, Column], [NewR|T]):-
	switchColorColumn(R, Column, NewR).
switchColor([R|T], [Row, Column], [R|NewT]):-
	Row>1,
	Row1 is Row-1,
	switchColor(T, [Row1, Column], NewT).
	
switchColorColumn(['black'|L], 1, ['white'|L]).
switchColorColumn(['white'|L], 1, ['black'|L]).
switchColorColumn([C|L], Column, [C|NewL]):-
	Column>1,
	NewCol is Column-1,
	switchColorColumn(L, NewCol, NewL).