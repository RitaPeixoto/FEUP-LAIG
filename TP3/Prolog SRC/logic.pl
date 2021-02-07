% Predicados para verificações da lógica do jogo

% Verifica se o jogo chegou ao fim	
% Caso: Fim de jogo, já não há moves possíveis
checkEnd(GameState, Player-_-_-_-_, Winner1):-
    opposite(Player, Player1),
    getMovablePieces(GameState, Player1, Res),!,
    ((Res==[],
    opposite(Player, Player1),
    getWinner(GameState, Player1-_-_-_-_, Winner1));(Winner1='')).
	
getWinner(GameState, Player-_-_-_-_, Winner1):-
	game_over(GameState, Winner),
	(
		(Winner='both', opposite(Player, Winner1), write(Winner1), write(' won!!\n')); %no caso de não ser possível desempatar, ganha o ultimo jogador a mover uma peça
		(write('\n!! '), Winner1=Winner, write(Winner), write(' won !!\n'))
	).


% Caso: AI vs AI or Human vs Human, o modo de jogo não troca
/*checkEnd(GameState, Color-Mode-0-Ai1-Ai2, ListOfMoves):-
	playerTurn(GameState, Color-Mode-Ai1-Ai2, ListOfMoves, NewState),
	opposite(Color, NextColor),
	display_game(NewState, NextColor-Mode-0-Ai1-Ai2).
% Caso: AI vs Human, o modo de jogo troca a cada jogada
checkEnd(GameState, Color-Mode-1-Ai1-Ai2, ListOfMoves):- 
	playerTurn(GameState, Color-Mode-Ai1-Ai2, ListOfMoves, NewState),
	opposite(Color, NextColor),
	opposite(Mode, NextMode),
	display_game(NewState, NextColor-NextMode-1-Ai1-Ai2).
*/
% Verifica quem foi o vencedor
game_over(GameState, Winner):-
	value(GameState, 'black', ScoreB),
	write('Black group sizes: '), write(ScoreB), write('\n'),
	value(GameState, 'white', ScoreW),
	write('White group sizes: '), write(ScoreW), write('\n'),
	getWinner(ScoreB, ScoreW, Winner).

% Avaliaçao do valor final do jogo de um jogador 
value(GameState, Player, Value):-
	countGroupSizes(GameState, Player, Sizes),
	samsort(>, Sizes, Value).

% Compara os tamanhos dos grupos de cada cor para determinar qual jogador fez o maior grupo
getWinner([], [], 'both').
getWinner([], _, 'white').
getWinner(_, [], 'black').	
getWinner([Score|B], [Score|W], Winner):-
	getWinner(B, W, Winner).
getWinner([ScoreB|_], [ScoreW|_], 'black'):-
	ScoreB>ScoreW.
getWinner([ScoreB|_], [ScoreW|_], 'white'):-
	ScoreB<ScoreW.


%Preenche lista com tamanho de todos os grupos do jogador	
countGroupSizes(GameState, Player, Sizes):-
	findPieces(GameState, Player, 1, ListTemp),
	findGroups(GameState, ListTemp, Sizes).

%Itera tabuleiro à procura de grupos	
findGroups(_, [], []).
findGroups(GameState, [Pos|L], Sizes):-
	getGroupSize(GameState, [Pos], L, 0, Size, Remaining),
	findGroups(GameState, Remaining, Sizes1),
	append([Size], Sizes1, Sizes).
	
%Determina o tamanho de um grupo
getGroupSize(_, [], Remaining, Counter, Counter, Remaining). 
getGroupSize(GameState, [Pos|Buffer], L, Counter, Size, Remaining):-
	Counter1 is Counter+1,
	adjacentPieces(Pos, L, Buffer1),
	append(Buffer, Buffer1, Buffer2),
	removeFromList(L, Buffer1, NewL),
	getGroupSize(GameState, Buffer2, NewL, Counter1, Size, Remaining).
	
%Devolve lista com peças adjacentes da mesma cor	
adjacentPieces([Row, Column], List, Buffer):-
	RowUp is Row-1,
	checkAdjacent([RowUp, Column], List, Up),
	RowDown is Row+1,
	checkAdjacent([RowDown, Column], List, Down),
	ColRight is Column+1,
	checkAdjacent([Row, ColRight], List, Right),
	ColLeft is Column-1,
	checkAdjacent([Row, ColLeft], List, Left),
	append([], Up, L1),
	append(L1, Down, L2),
	append(L2, Right, L3),
	append(L3, Left, Buffer).

%Verifica se a peça adjacente ainda não foi visitada
checkAdjacent(NewPos, List, [NewPos]):-	
	member(NewPos, List).
checkAdjacent(_,_,[]).

 
%Determina valor de uma peça, somando 1 ponto por cada peça ortogonalmente adjacente  da mesma cor e 0.5 pontos por cada parede adjacente
 valuePiece(GameState, Pos, Value):-
	valueUp(GameState, Pos, V1),
	valueDown(GameState, Pos, V2),
	valueRight(GameState, Pos, V3),
	valueLeft(GameState, Pos, V4),
	Value is V1+V2+V3+V4.

%Devolve valor da peça acima	
valueUp(GameState, [Row, Col], 1):-
	Row>1,
	RowUp is Row-1,
	getColor(GameState, [Row, Col], Color),
	getColor(GameState, [RowUp, Col], Color).
valueUp(GameState, [Row, Col], 0):-
	Row>1,
	RowUp is Row-1,
	getColor(GameState, [Row, Col], Color),
	getColor(GameState, [RowUp, Col], Color2),
	Color\=Color2.
valueUp(_, [Row, _], 0.5):-
    Row==1.

%Devolve valor da peça abaixo
valueDown(GameState, [Row, Col], 1):-
	length(GameState, L),
	Row<L,
	RowDown is Row+1,
	getColor(GameState, [Row, Col], Color),
	getColor(GameState, [RowDown, Col], Color).
valueDown(GameState, [Row, Col], 0):-
	length(GameState, L),
	Row<L,
	RowDown is Row+1,
	getColor(GameState, [Row, Col], Color),
	getColor(GameState, [RowDown, Col], Color2),
	Color\=Color2.
valueDown(GameState, [Row, _], 0.5):-
    length(GameState, L),
	Row==L.

%Devolve valor da peça à direita
valueRight([H|T], [Row, Col], 1):-
	length(H, L),
	Col<L,
	ColRight is Col+1,
	getColor([H|T], [Row, Col], Color),
	getColor([H|T], [Row, ColRight], Color).
valueRight([H|T], [Row, Col], 0):-
	length(H, L),
	Col<L,
	ColRight is Col+1,
	getColor([H|T], [Row, Col], Color),
	getColor([H|T], [Row, ColRight], Color2),
	Color\=Color2.
valueRight([H|_], [_, Col], 0.5):-
    length(H, L),
	Col==L.

%Devolve valor da peça à esquerda
valueLeft(GameState, [Row, Col], 1):-
	Col>1,
	ColLeft is Col-1,
	getColor(GameState, [Row, Col], Color),
	getColor(GameState, [Row, ColLeft], Color).
valueLeft(GameState, [Row, Col], 0):-
	Col>1,
	ColLeft is Col-1,
	getColor(GameState, [Row, Col],Color),
	getColor(GameState, [Row, ColLeft],Color2),
	Color\=Color2.
valueLeft(_, [_, Col], 0.5):-
    Col==1.
	
	
	
