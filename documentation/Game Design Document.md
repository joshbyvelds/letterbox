# Letterbox Game Design Document

### Game Summary

The user must type the letter of the box that is falling down before it hits the boxes stacked on the bottom. 
Each box has a type, box types are worth a certain amount of points, letter themselves worth a base amount of points 
( like Scrabble ).The point of the game is to get a certain score before time runs out to pass the level and move on to the next one.
There is also "bad boxes" that will have a bad effect on the player.

Once a box is on the stack, it no longer has a type. ( it will still have a bad effect it is has one ). if it is 
touching another box. it will have to be typed all at once from left to right in order to be destroyed. if it is 
touching multiple boxes at once, then the player has a choice of what box to use in string. Once a box is select to be
part of the word string, the next letter must be touching this one. Once a string word is used it will be added to the 
'used word list'. Any word on the "Used Word List" cannot be used until it has been cleared from the list. The
'Used Word List's max length is determined by the level.  

### Box Types

From slowest to fastest:

Normal: 1 | 1 pts

Green: 2 | 5 pts

Blue: 3 | 20 pts

Red: 4 | 30 pts

Pink: 5 | 60 pts

Bronze: 10 | 100 pts

Sliver: 20 | 200 pts

Gold: 30  | 500 pts

### Letter Base Points

A: 1
B: 3
C: 3
D: 3
E: 1
F: 3
G: 5
H: 5
I: 1
J: 10
K: 7
L: 3
M: 3
N: 3
O: 1
P: 4
Q: 15
R: 3
S: 2
T: 3
U: 2
V: 20
W: 8
X: 15
Y: 20
Z: 10

### Good Box Types

x2: doubles the amount of points the box /string is worth

Time: Add some more time to the time bar. 

### Bad Boxes

Bomb: destroys all boxes in range.

Blind Eye: makes the entire screen black for a few seconds.

Wind: blows boxes around the screen with a powerful force.

Weight Smash: Makes the box like it was made of steel and it will fall straight down and smash all boxes in it's path.

 
