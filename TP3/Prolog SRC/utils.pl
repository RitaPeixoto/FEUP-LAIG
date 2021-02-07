% Funções utilitárias 

% Escreve linha com o jogador atual
printTurn(Player):-	
	nl,
	write('---------- '), write(Player), write(' turn ----------'), 
	nl, nl .

% Lê input do utilizador para escolher posicao
readPosition(Player, Row, Column):-
	format('~a, choose row:\n', Player),
	read(Row1),
	format('~a, choose column:\n', Player),
	read(Column1),
	(integer(Row1), integer(Column1), Row=Row1, Column=Column1,!);
	(write('Wrong characters inserted, try again\n'),!, readPosition(Player, Row, Column)).
 	
% Lê input do utilizador para escolher nova posicao
readPos(Player, ListOfMoves, [NewR, NewC]):-
	readPosition(Player, NewR, NewC),
	member([NewR, NewC], ListOfMoves).
readPos(Player, ListOfMoves, NewPos):-
	write('Cant move here, choose again!\n'),
	readPos(Player, ListOfMoves, NewPos).


% Encontra a cor da peça numa determinada posição
getColor(GameState, [Row, Column], Piece):-
	nth1(Row, GameState, L),
	nth1(Column, L, Piece).

% Remove todos os elementos de uma lista presentes na outra	
removeFromList(Res, [], Res).
removeFromList(List, [H|T], Res):-
	delete(List, H, Temp),
	removeFromList(Temp, T, Res).
	
% Encontra o valor máximo presente numa lista
maxList(Sizes, Value):-
	maxListAux(Sizes, 0, Value).
maxListAux([], Max, Max).
maxListAux([H|T], Max, Value):-
	H>Max,
	maxListAux(T, H, Value).
maxListAux([H|T], Max, Value):-
	H=<Max,
	maxListAux(T, Max, Value).

% Imprime lista de posicoes
printOptions(List):-
	printList(List).
	
% Imprime elementos de uma lista
printList([]).
printList([Pos|List]):-
	write(Pos), write('\n'),
	printList(List).	
	
% Devolve jogador/modo oposto
opposite('black', 'white').
opposite('white', 'black').
opposite('player', 'computer').
opposite('computer', 'player').

% Devolve nível de AI para o jogador atual
getLevel('black', Level-_, Level).
getLevel('white', _-Level, Level).