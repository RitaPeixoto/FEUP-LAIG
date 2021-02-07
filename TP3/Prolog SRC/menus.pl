% Imprime menu inicial
initialMenu :-
	write('\nWelcome to Emulsion!!\n\n'),
	write('Choose mode:\n'),
	write('[1] Player-Player\n'),
	write('[2] Player-Computer\n'),
	write('[3] Computer-Player\n'),
	write('[4] Computer-Computer\n'),
	write('[0] Exit Game\n'),
	read(Option),
	startGame(Option).

% Exit Game
startGame(0).

% Player-Player mode
startGame(1):-
	initial(GameState), 
	display_game(GameState, 'black'-'player'-0-_-_),
	initialMenu.

% Player-Computer mode	
startGame(2):-
	initial(GameState), 
	aiLevelMenu('Ai', Ai),
	display_game(GameState, 'black'-'player'-1-_-Ai),
	initialMenu.

% Computer-Player mode	
startGame(3):-
	initial(GameState), 
	aiLevelMenu('Ai', Ai),
	display_game(GameState, 'black'-'computer'-1-Ai-_),
	initialMenu.

% Computer-Computer mode
startGame(4):-
	aiLevelMenu('Ai1', Ai1),
	aiLevelMenu('Ai2', Ai2),
	initial(GameState), 
	display_game(GameState, 'black'-'computer'-0-Ai1-Ai2),
	initialMenu.

% Invalid option	
startGame(_):-
	write('Not valid a option, exiting!\n').

% Menu para escolher o nivel do computer
aiLevelMenu(AiNumber, Ai) :-
	format('Choose ~a level:\n', AiNumber),
	write('[1] Random\n'),
	write('[2] Highest value move\n'),
	read(Ai1),
	(integer(Ai1), Ai1>0,Ai1<3, Ai=Ai1);
	(write('Wrong characters inserted, try again\n'), aiLevelMenu(AiNumber, Ai)).


	