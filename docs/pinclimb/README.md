## Creating the One-Button Mini-Game PIN CLIMB

English | [日本語](./index.html?lang=ja)

This article explains how to create a one-button mini-game using [crisp-game-lib](https://github.com/abagames/crisp-game-lib).

To create a one-button mini-game, it is important to decide what functions to assign to the one-button. For more information, please refer to the following articles.

- [How to realize various actions in a one-button game](https://github.com/abagames/various-actions-in-a-one-button-game/blob/main/README.md)

In the game we are going to make, we will assign the function "stretch" to the button. The rules of the game are shown below.

- You control a spinning "cord".
- The cord stretches as long as the button is held down, and shrinks when the button is released.
- The cord rotates around a "pin".
- Pins appear from the top of the screen and scroll down.
- When the cord catches on another pin, the cord moves to that pin.
- When the cord moves to the bottom of the screen, the game is over.

<br><br><br><br>

(src_hide) 0_template.js

### Preparing the template source code

To create a game using `crisp-game-lib`, you need to prepare the template source code. For more information, see [Getting started](https://github.com/abagames/crisp-game-lib#getting-started).

<br>

Let me explain how to view this article. Is the source code displayed on the right side of the screen? If not, scroll down the page until this text is above the center of the screen.

The newly appended source code will be displayed on the right side of the screen. The display is in [unified format of diff](https://en.wikipedia.org/wiki/Diff#Unified_format). Lines with `+` at the beginning are added lines, and lines with `-` are deleted lines.

In the lower right corner of the screen, the game screen realized by the current source code is displayed. Right now it just shows the score and the high score.

<br>

Take a look at the template on the right side of the screen. `title` , `description` are variables to set the game title and description, `characters` are variables to define the pixel art to be displayed on the screen, and `options` are variables to set the game settings. These variables will be set later.

The `update` function describes the logic of the game. The `update` function is called 60 times per second to draw the game screen, respond to mouse operations, and so on.

The `ticks` variable in the `update` function is 0 when the game starts and is incremented by 1 every 1/60 of a second. `if (!ticks) {}` is equivalent to `if (ticks === 0) {}`, and the initialization process at the start of the game can be done in `{}`.

<br><br><br><br>

(src_hide) 1_pins_variable.js

### Displaying Pins

First declare the `pins` array variable. It is not mandatory, but using a comment containing `@type` to declare the type of the variable is helpful for error detection and code completion. The `Vector` class is a two-dimensional vector class with a set of functions useful for working with (x, y) coordinates.

Initialize the `pins` variable with `[vec(50, 5)]`. The `vec()` function creates a `Vector` instance with the x-coordinate as the first argument and the y-coordinate as the second.

`forEach` is used to draw a `box` with each element of `pins` as coordinates. The `box` function takes coordinates as its first argument and its size as its second argument. The `crisp-game-lib` screen consists of 100x100 dots, with (0, 0) at the top left and (99, 99) at the bottom right.

<br><br><br><br>

(src_silent) 1a_pins_variable.js

(src_hide) 2_add_pins.js

### Add pins and scroll down

Make pins appear from the top of the screen at some interval and scroll down. Set the `nextPinDist` variable to the distance to the next pin. Set the distance in the y direction to scroll to the `scr` variable, and add the value of `scr` to the y-coordinate of each pin.

If `nextPinDist` is less than 0, add a new pin using the `push` function of the array. The x-coordinate of the pin is set randomly using the `rnd` function. The `rnd` function returns a value between the first and the second argument. The distance to the next pin is also calculated using the `rnd` function and added to `nextPinDist`.

<br><br><br><br>

(src_hide) 3_remove_pins.js

### Deleting a pin that is off the screen

If you do not remove a pin that has scrolled off the screen, the pin will remain in the array forever. Instead of `forEach`, use the `remove` function to remove the off-screen pins.

The `remove` function takes an array of elements to be repeatedly retrieved as its first argument, and a function to process the retrieved elements as its second argument. If the second argument returns `true`, this element is removed from the array (this function works almost identically to [lodash's remove function](https://lodash.com/docs/#remove)). By returning `true` when it is off the screen ( `pin.y > 102` ), the pin is removed.

<br><br><br><br>

(src_hide) 4_add_cord.js

### Adding a cord

The `cord` variable manages the cord. The `cord` has properties for the angle ( `angle` ), length ( `length` ), and center pin ( `pin` ) of the cord. The `cord` is also initialized in `if (!ticks) {}`.

<br><br><br><br>

(src_hide) 5_draw_cord.js

### Draw a cord

Add the angles of the cord and rotate it. Then draw the cord using the `line` function. The `line` function draws a line connecting the coordinates of the first and second arguments. The function `addWithAngle` of `Vector` shifts the coordinates in the direction of the angle of the first argument by the distance of the second argument.

<br><br><br><br>

(src_hide) 6_extend_cord.js

### Cord extends when a button is pressed

The `input` variable contains the state of the input from the mouse, touch screen, or keyboard. The `input.isPressed` variable is `true` when a button, touch screen or key is pressed. Here, the length of the cord is added when the button is pressed, and returned to the initial `cordLength` value when the button is released.

Move the mouse cursor to the game screen in the lower right corner of the screen and press the mouse button. You will see the cord stretching.

In this page, to make it easier to understand the game behavior even when the mouse cursor is outside the game screen, the state in which the mouse button is pressed is reproduced at random. The cord automatically stretches and shrinks with this reproduction action.

<br><br><br><br>

(src_hide) 7_scroll_cord.js

### Scrolling according to the position of the cord

In this game, the pins scroll downward from the top of the screen, so if the cord is at the top of the screen, it is difficult to see what is happening beyond the screen. Therefore, if the y-coordinate of the pin at the center of the cord is less than 80, the scrolling distance is increased.

We also add a process to end the game when the cord reaches the bottom of the screen. Calling the `end` function will cause the game to transition to the game over state.

<br><br><br><br>

(src_hide) 8_move_to_pin.js

### Cord moves to another pin

Add a process for moving the cord to the pin when a cord collides with a another pin.

To detect a collision, use the return value of the `box` function. By checking if `isColliding.rect.black` is `true`, you can test if the box collides with a black rectangle. The `line` function, used to draw a cord, draws a line consisting of several rectangles. Therefore, this test can be used to determine if the drawn pins collide with the cord.

Drawing functions other than the `box` function can also check if they collide with another square by checking `isColliding` in the same way.

The pin that collides with the cord is stored in the `nextPin` variable. If `nextPin` is not `null`, moves the cord to `nextPin` and returns the cord length to the initial value `cordLength`.

<br><br><br><br>

(src_hide) 9_add_score.js

### Adding up scores

Adding up the score correctly according to the player's skill is necessary for the mini-game to be viable. In this example, when a cord moves to another pin, we will add the moving distance to the score. The moving distance is calculated using the `distanceTo` function of the `Vector` class.

The first argument of the `addScore` function is the score to be added. If you give a coordinate as the second argument, the score added is displayed at that coordinate. The second argument is optional, and if it is omitted, the score is not displayed.

Also, a sound effect will be played according to the score addition. Use the `play` function to play the sound. The first argument of the `play` function specifies the type of sound effect. There are several types of sound effects, such as `coin`, `select`, `hit`, `explosion`, `laser`, `jump`, and so on, in addition to `powerUp` specified here.

<br>

On this page, the sound will only be played when the mouse cursor is hovered over the game screen. Move the mouse cursor over the game screen, press the button to extend the cord, and confirm that the sound effect is heard when the cord moves.

<br><br><br><br>

(src_hide) 10_play_ses.js

### Adding other sound effects

In addition to when the cord moves, you can also play other sound effects. The `select` sound is played at the moment the button is pressed. You can tell when a button is pressed by checking if `input.isJustPressed` is `true`. It also plays an `explosion` sound when the game is over.

<br><br><br><br>

(src_hide) 11_adjust_difficulty.js

### Make the game progressively more difficult

In mini-games, it is important to make the game gradually more difficult as time goes by, thereby creating a feeling of tension among the players. A good way to make games more difficult is to increase the game speed.

The `difficulty` variable can be used to adjust the difficulty of the game. The `difficulty` variable is 1 at the beginning of the game, 2 after 1 minute, and so on, increasing by 1 every minute. The `difficulty` is referenced in the source code to speed up various actions.

Here, the scrolling speed, cord extension speed, and cord rotation speed are gradually increased.

Thus, the source code of the game is complete.

<br><br><br><br>

(src_hide) 12_set_options.js

### Setting the Title, Description, and Options

If you set a title ( `title` ) and a description ( `description` ) for your game, these texts will be displayed on the title screen before the game starts. You can also set options with `options`. Here you can enable playing background music ( `isPlayingBgm` ) and showing a replay of the previous game on the title screen after game over ( `isReplayEnabled` ).

When you hover the mouse cursor over the game screen, you will hear the BGM playing. If the game is over and you return to the title screen, the previous play will be replayed.

<br><br><br><br>

(src_hide) 13_change_sound.js

### Adjusting the sound

If `isPlaingBgm` is enabled, background music will be automatically generated and played during the game. Also, the sound effects played by the `play` function will be generated automatically as well. These sounds can be changed by setting `seed` in the `options`. You can set various values for `seed` until you get the BGM and sound effects you like.

<br><br><br><br>

(src_hide) 99_completed.js

### Finished!

Now it's complete. There are [many more games](https://github.com/abagames/crisp-game-lib#demo-click-the-image-to-play) using `crisp-game-lib`. Please refer to them as well. All source code is available as [sample codes](https://github.com/abagames/crisp-game-lib#more-sample-codes).

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
  seed: 400,
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
