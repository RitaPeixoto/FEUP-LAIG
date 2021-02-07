% Predicados de visualização do tabuleiro

%representacao inicial do tabuleiro
initialBoard([
[black,white,black,white,black,white,black,white,black,white],
[white,black,white,black,white,black,white,black,white,black],
[black,white,black,white,black,white,black,white,black,white],
[white,black,white,black,white,black,white,black,white,black],
[black,white,black,white,black,white,black,white,black,white],
[white,black,white,black,white,black,white,black,white,black],
[black,white,black,white,black,white,black,white,black,white],
[white,black,white,black,white,black,white,black,white,black],
[black,white,black,white,black,white,black,white,black,white],
[white,black,white,black,white,black,white,black,white,black]
]).

%representacao intermédia do tabuleiro
midBoard([
[white,black,white,black,white,black,white,black,white,black],
[black,white,white,white,black,black,black,white,white,white],
[white,black,black,black,white,white,white,black,black,black],
[black,black,black,white,white,white,black,white,black,white],
[white,white,white,black,black,black,white,black,white,black],
[black,white,black,white,black,white,black,white,black,white],
[white,black,white,black,white,black,white,black,white,black],
[black,white,black,white,black,white,black,white,black,white],
[white,black,white,black,white,black,white,black,white,black],
[black,white,black,white,black,white,black,white,black,white]
]).

%representacao final do tabuleiro
finalBoard([
[white,white,white,white,black,black,black,white,white,white],
[black,white,white,white,black,black,black,white,white,black],
[black,black,black,white,white,white,black,black,black,black],
[black,black,black,black,white,white,white,black,black,black],
[white,white,white,black,black,black,white,white,white,white],
[white,white,white,black,black,black,white,white,white,white],
[black,black,black,white,white,white,black,black,black,black],
[black,black,black,white,white,white,black,black,black,black],
[black,white,white,black,black,black,white,white,white,black],
[white,white,white,black,black,black,white,white,white,white]
]).


% Preenche tabuleiro de tamanho N
fillBoard(GameState, N):- fillBoard(GameState, N, N, 'white').
fillBoard([], 0, _, _).
fillBoard([H|T], Rows, Cols, 'black'):- 
	fillLine(H, Cols, 'black'), 
	R1 is Rows-1,
	fillBoard(T, R1, Cols, 'white').
fillBoard([H|T], Rows, Cols, 'white'):- 
	fillLine(H, Cols, 'white'), 
	R1 is Rows-1,
	fillBoard(T, R1, Cols, 'black').

% Preenche uma linha do tabuleiro
fillLine([], 0, _).
fillLine(['white'|T], N, 'white'):- N1 is N-1, fillLine(T, N1, 'black').
fillLine(['black'|T], N, 'black'):- N1 is N-1, fillLine(T, N1, 'white').

% Imprime cabeçalho
printInitialLine(L):- 
	write('   '), 
	printInitialLine(L, 1). 
printInitialLine([], _):- write('\n').
printInitialLine([_|T], N):- 
	N<10, 
	write(N), write('   '), 
	N1 is N+1, printInitialLine(T, N1).
printInitialLine([_|T], N):- 
	N>=10, 
	write(N), write(' '), 
	N1 is N+1, printInitialLine(T, N1).
	
% Imprime linha intermédia
printDivLine1([]):- write('\n').
printDivLine1([_|T]):- environ('OS','Windows_NT'), write('\xFE63\-+'), printDivLine1(T).
printDivLine1([_|T]):- write('\xFE63\\xFE63\+'), printDivLine1(T).
printDivLine(L):- write('  +'), printDivLine1(L).
	
 
% Imprime tabuleiro linha a linha
printBoard([], _).
printBoard([L|T], 0):- 
	print('\n'),
	printInitialLine(L),
	printDivLine(L),
	printBoard([L|T], 1),
	write('\n').
printBoard([L|T], N):- 
	N>=10, 
	write(N), write('|'), 
	printLine(L),
	printDivLine(L), 
	N1 is N+1, 
	printBoard(T, N1).
printBoard([L|T], N):- 
	N>0,
	N<10, 
	write(N), write(' |'), 
	printLine(L), 
	printDivLine(L), 
	N1 is N+1, 
	printBoard(T, N1).

% Imprime linha célula a célula
printLine([]):- write('\n').
printLine([C|L]):- printCell(C), write('|'), printLine(L).

% Associa código a um caracter e imprime na consola
printCell(C):- code(C, P), write(P).
code(black, ' \x26AB\ ').
code(white, ' \x26AA\ ').
