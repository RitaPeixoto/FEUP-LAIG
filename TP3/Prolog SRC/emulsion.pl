:- compile('display.pl').
:- compile('moves.pl').
:- compile('utils.pl').
:- compile('logic.pl').
:- compile('menus.pl').
:- compile('computer.pl').
:- use_module(library(lists)).
:- use_module(library(samsort)).
:- use_module(library(system)).
:- use_module(library(random)).


% Predicado principal
play :- 
	initialMenu.
	%finalBoard(GameState),
	%printBoard(GameState, 0).

% Retorna estado inicial
initial(GameState):- 
	write('Insert board size:\n'),
	read(Size),
	(Size>4, Size<11), !,
	fillBoard(GameState, Size).
initial(GameState):-
	write('Not valid!\n'),
	initial(GameState).

% Mostra tabuleiro atual, verifica movimentos possiveis e verifica se o jogo já acabou
display_game(GameState, Player):- 
	printBoard(GameState, 0),
	valid_moves(GameState, Player, ListOfMoves),
	checkEnd(GameState, Player, ListOfMoves).