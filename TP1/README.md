# LAIG 2020/2021 - TP1

## Group: T01G07

| Name             | Number    | E-Mail              |
| ---------------- | --------- | --------------------|
| Rita Peixoto     | 201806257 | up201806257@fe.up.pt|
| Luis Silva       | 201808912 | up201808912@fe.up.pt|

----
## Project information

-  Parser with error description
-  Default cameras, materials and textures applied when none defined to allow scene rendering
-  Thorough error search and report in XML parsing with faulty node identification
-  Warnings on possible user-made mistakes such has no child or primitive in node or texture defined as null instead of clear
-  Cameras save the position where user placed them (when switching between cameras)
-  Reutilization of already defined primitives improving XML readibility and lightweightness
-  Realistic scene
-  Object oriented structure with get and set functions

- Scene
  - The scene shows an airport check-in gate. It has two x-ray boxes where bags are checked, which have black curtains on either sides of them. There are also boxes where travellers belongigns are placed for the x-ray check as shown in the left mat where a laptop is placed inside the boxes, and on the right mat where the boxes are empty. In the middle of the xray boxes there is a metal detector which has a green and a red signal. After this equipment there is the airport terminal and some signal indicating where other terminals are. 
  On the floor there are social distancing signs, there are line dividers (two make two lines, one for each X-Ray box). On the left wall there are safety recommendations, a warning signs,a bathroom sign and a plane schedule board (that shows the next planes ariving/leavind/delayed.
  
  - [scene](https://git.fe.up.pt/laig/laig-2020-2021/t01/laig-t01-g07/-/blob/master/TP1/scenes/LAIG_TP1_T1G07.xml)
----
## Issues/Problems

- None known bugs

## Things to keep in mind
- When does the program execution stops?
  - There isn't a root id defined 
  - It's missing one of the main tags (ex: initials, materials, lights,etc.)
  - There's a non-defined id node
  - There's a node whose id is repeated
  
- Other implementation details
  - Having no descendants is an error, because it doesn't make a lot of sense to have a node without descendants, so something must be wrong
  - Every time something isn't valid, it's ignored and set a default whole element, not only a default component, because, for instance, if the material has an invalid r value for RGB in specular, the output of the parsing won't be what was expected, so to warn the user, we use a default one, something he wasn't expecting to see there
