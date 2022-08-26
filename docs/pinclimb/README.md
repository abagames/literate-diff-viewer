## Creating the One-Button Mini-Game PIN CLIMB

English | [日本語](./index.html?lang=ja)

This article explains how to create a one-button mini-game using [crisp-game-lib](https://github.com/abagames/crisp-game-lib).

For a one-button mini-game, it is essential to decide what functions to assign to the one-button. For more information, please refer to the following articles.

- [How to realize various actions in a one-button game](https://dev.to/abagames/how-to-realize-various-actions-in-a-one-button-game-fak)

We will assign the function "stretch" to the button in the game we will make. The rules of the game are shown below.

- You control a spinning "cord".
- The cord stretches as long as the button is held down and shrinks when the button is released.
- The cord rotates around a "pin".
- Pins appear from the top of the screen and scroll down.
- When the cord catches on another pin, the cord moves to that pin.
- When the cord moves to the bottom of the screen, the game is over.

<br><br><br><br>

(src) [0_template.js](./src/0_template.js)

### Preparing the template source code

To create a game using `crisp-game-lib`, you must prepare the template source code. For more information, see [Getting started](https://github.com/abagames/crisp-game-lib#getting-started).

<br>

Let me explain how to view this article. Is the source code displayed on the right side of the screen? If not, scroll down the page until this text is above the center of the screen.

The newly appended source code will be displayed on the right side of the screen. The display is in a [unified format of diff](https://en.wikipedia.org/wiki/Diff#Unified_format). Lines with `+` at the beginning are added lines, and lines with `-` are deleted lines.

In the lower right corner of the screen, the game screen realized by the current source code is displayed. Right now, it just shows the score and the high score.

<br>

Take a look at the template on the right side of the screen. `title` and `description` are variables to set the game title and description, `characters` define the pixel art displayed on the screen, and `options` are variables to put the game settings. These variables will be set later. See a reference of [char()](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#char) and [Options](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#Options) for more information.

The `update` function describes the logic of the game. The `update` function is called 60 times per second to draw the game screen, respond to mouse operations, etc.

The `ticks` variable in the `update` function is 0 when the game starts. `ticks` incremented by one every 1/60 of a second. `if (!ticks) {}` is equivalent to `if (ticks === 0) {}`, and the initialization process at the start of the game can be done in `{}`.

<br><br><br><br>

(src) [1_pins_variable.js](./src/1_pins_variable.js)

### Displaying pins

First, declare the `pins` array variable. It is not mandatory, but using a comment containing `@type` to declare the type of the variable is helpful for error detection and code completion. The `Vector` class is a two-dimensional vector class with functions useful for working with (x, y) coordinates.

Initialize the `pins` variable with `[vec(50, 5)]`. The `vec()` function creates a [Vector](https://abagames.github.io/crisp-game-lib/ref_document/classes/Vector.html) instance with the x-coordinate as the first argument and the y-coordinate as the second.

`forEach` is used to draw a [box](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#box) with each element of `pins` as coordinates. The `box` function takes coordinates as its first argument and its size as its second argument. The `crisp-game-lib` screen consists of 100x100 dots, with (0, 0) at the top left and (99, 99) at the bottom right.

<br><br><br><br>

(src_silent) 1a_pins_variable.js

(src) [2_add_pins.js](./src/2_add_pins.js)

### Add pins and scroll down

Make pins appear from the top of the screen at some interval and scroll down. Set the `nextPinDist` variable to the distance to the next pin. Set the distance in the y-direction to scroll to the `scr` variable. Add the value of `scr` to the y-coordinate of each pin.

If `nextPinDist` is less than 0, add a new pin using the `push` function of the array. The x-coordinate of the pin is set randomly using the [rnd](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#rnd) function. The `rnd` function returns a value between the first and the second argument. The distance to the next pin is also calculated using the `rnd` function and added to `nextPinDist`.

<br><br><br><br>

(src) [3_remove_pins.js](./src/3_remove_pins.js)

### Deleting a pin that is off the screen

If you do not remove a pin that has scrolled off the screen, the pin will remain in the array forever. Instead of `forEach`, use the [remove](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#remove) function to remove the off-screen pins.

The `remove` function takes an array as its first argument and a function as its second argument. The function receives each element of the array as a first argument. If the function returns `true`, this element is removed from the array (this function works almost identically to [lodash's remove function](https://lodash.com/docs/#remove)). The pin is removed by returning `true` from the function when off the screen ( `pin.y > 102` ).

<br><br><br><br>

(src) [4_add_cord.js](./src/4_add_cord.js)

### Adding a cord

The `cord` variable manages the cord. The `cord` has properties for the angle ( `angle` ), length ( `length` ), and center pin ( `pin` ) of the cord. The `cord` is also initialized in `if (!ticks) {}`.

<br><br><br><br>

(src) [5_draw_cord.js](./src/5_draw_cord.js)

### Draw a cord

Add the angles of the cord and rotate it. Then draw the cord using the `line` function.

The [line](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#line) function draws a line connecting the coordinates of the first and second arguments. The function `addWithAngle` of `Vector` shifts the coordinates in the direction of the angle of the first argument by the distance of the second argument.

<br><br><br><br>

(src) [6_extend_cord.js](./src/6_extend_cord.js)

### Cord extends when a button is pressed

The [input](https://abagames.github.io/crisp-game-lib/ref_document/modules/input.html) variable contains the input state from the mouse, touch screen, or keyboard. The `input.isPressed` variable is `true` when a button, touch screen or key is pressed. Here, the length of the cord is added when the button is pressed and returned to the initial `cordLength` value when the button is released.

Move the mouse cursor to the game screen in the lower right corner and press the mouse button. You will see the cord stretching.

To make it easier to understand the game behavior, even when the mouse cursor is outside the game screen, the state in which the mouse button is pressed is reproduced randomly. The cord automatically stretches and shrinks with this reproduction action.

<br><br><br><br>

(src) [7_scroll_cord.js](./src/7_scroll_cord.js)

### Scrolling according to the position of the cord

Pins scroll down from the top of the screen, so it isn't easy to see what is happening beyond the screen if the cord is at the top. Therefore, if the y-coordinate of the pin at the center of the cord is less than 80, the scrolling distance is increased.

We also add a process to end the game when the cord reaches the bottom of the screen. Calling the [end](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#end) function will cause the game to transition to the game-over state.

<br><br><br><br>

(src) [8_move_to_pin.js](./src/8_move_to_pin.js)

### Cord moves to another pin

Add a process for moving the cord to the pin when a cord collides with another pin.

To detect a [Collision](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#Collision), use the return value of the `box` function. By checking if `isColliding.rect.black` is `true`, you can test if the box collides with a black rectangle. The `line` function, used to draw a cord, draws a line consisting of several rectangles. Therefore, this test can determine if the drawn pins collide with the cord.

Drawing functions other than the `box` function can also check if they collide with another square by checking `isColliding` in the same way.

The pin that collides with the cord is stored in the `nextPin` variable. If `nextPin` is not `null`, move the cord to `nextPin` and return the cord length to the initial value `cordLength`.

<br><br><br><br>

(src) [9_add_score.js](./src/9_add_score.js)

### Adding up scores

Adding up the score correctly according to the player's skill is necessary for the mini-game to be viable. In this example, when a cord moves to another pin, we add the moving distance to the score. The moving distance is calculated using the `distanceTo` function of the `Vector` class.

The first argument of the [addScore](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#addScore) function is the score to be added. If you give a coordinate as the second argument, the score added is displayed at that coordinate. The second argument is optional, and the score is not shown if omitted.

Also, a sound effect will be played according to the score addition. Use the [play](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#play) function to play the sound. The first argument of the `play` function specifies the type of sound effect. There are several types of sound effects, such as `coin`, `select`, `hit`, `explosion`, `laser`, `jump`, and so on, in addition to `powerUp` specified here.

<br>

The sound will only be played when the mouse cursor hovers over the game screen. Move the mouse cursor over the game screen, press the button to extend the cord, and confirm that the sound effect is heard when the cord moves.

<br><br><br><br>

(src) [10_play_ses.js](./src/10_play_ses.js)

### Adding other sound effects

In addition to when the cord moves, you can also play other sound effects. The `select` sound is played at the moment the button is pressed. You can tell when a button is pressed by checking if `input.isJustPressed` is `true`. It also plays an `explosion` sound when the game is over.

<br><br><br><br>

(src) [11_adjust_difficulty.js](./src/11_adjust_difficulty.js)

### Make the game progressively more difficult

In mini-games, it is vital to gradually make the game more difficult as time goes by, thereby creating tension among the players. An excellent way to make games more difficult is to increase the game speed.

The `difficulty` variable can be used to adjust the difficulty of the game. The `difficulty` variable is one at the beginning of the game, two after 1 minute, and increasing by one every minute. The `difficulty` is referenced in the source code to speed up various actions.

The scrolling speed, cord extension speed, and cord rotation speed gradually increase.

Thus, the source code of the game is complete.

<br><br><br><br>

(src) [12_set_options.js](./src/12_set_options.js)

### Setting the Title, Description, and Options

If you set a title ( `title` ) and a description ( `description` ) for your game, these texts will be displayed on the title screen before the game starts. You can also set options with `options`. Here you can enable playing background music ( `isPlayingBgm` ) and showing a replay of the previous game on the title screen after game-over ( `isReplayEnabled` ).

When you hover the mouse cursor over the game screen, you will hear the BGM playing. The previous play will be replayed if the game is over and you return to the title screen.

<br><br><br><br>

(src) [13_change_sound.js](./src/13_change_sound.js)

### Adjusting the sound

If `isPlaingBgm` is enabled, background music will be automatically generated and played during the game. Also, the sound effects played by the `play` function will be generated automatically. These sounds can be changed by setting `seed` in the `options`. You can set various values for `seed` until you get the BGM and sound effects you like.

<br><br><br><br>

(src) [99_completed.js](./src/99_completed.js)

### Finished!

Now it's complete. There are [many more games](http://www.asahi-net.or.jp/~cs8k-cyu/browser.html) using `crisp-game-lib`. Please refer to them as well. All source code is available as [sample codes](https://github.com/abagames/crisp-game-lib-games/tree/main/docs).

The final source code is as follows

```js
title = "PIN CLIMB";

description = `
[Hold] Stretch
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 8,
};

/** @type {{angle: number, length: number, pin: Vector}} */
let cord;
/** @type {Vector[]} */
let pins;
let nextPinDist;
const cordLength = 7;

function update() {
  if (!ticks) {
    pins = [vec(50, 5)];
    nextPinDist = 5;
    cord = { angle: 0, length: cordLength, pin: pins[0] };
  }
  let scr = difficulty * 0.02;
  if (cord.pin.y < 80) {
    scr += (80 - cord.pin.y) * 0.1;
  }
  if (input.isJustPressed) {
    play("select");
  }
  if (input.isPressed) {
    cord.length += difficulty;
  } else {
    cord.length += (cordLength - cord.length) * 0.1;
  }
  cord.angle += difficulty * 0.05;
  line(cord.pin, vec(cord.pin).addWithAngle(cord.angle, cord.length));
  if (cord.pin.y > 98) {
    play("explosion");
    end();
  }
  let nextPin;
  remove(pins, (p) => {
    p.y += scr;
    if (box(p, 3).isColliding.rect.black && p !== cord.pin) {
      nextPin = p;
    }
    return p.y > 102;
  });
  if (nextPin != null) {
    play("powerUp");
    addScore(ceil(cord.pin.distanceTo(nextPin)), nextPin);
    cord.pin = nextPin;
    cord.length = cordLength;
  }
  nextPinDist -= scr;
  while (nextPinDist < 0) {
    pins.push(vec(rnd(10, 90), -2 - nextPinDist));
    nextPinDist += rnd(5, 15);
  }
}
```
