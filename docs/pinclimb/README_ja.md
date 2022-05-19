## ワンボタンミニゲーム PIN CLIMB を作る

[English](./index.html) | 日本語

この記事では、[crisp-game-lib](https://github.com/abagames/crisp-game-lib/blob/master/README_ja.md) を使った、ワンボタンミニゲームの作り方を説明します。

ワンボタンミニゲームを作るには、ワンボタンにどのような機能を割り当てるかが重要です。詳しくは、以下の記事を参照ください。

- [ワンボタンゲームをたくさん作ったので、その作り方をおさらいしたい](https://aba.hatenablog.com/entry/2021/08/08/195706)

今回作るゲームでは、ボタンに「伸びる」という機能を割り当てます。ゲームのルールを以下に示します。

- あなたはくるくる回る「ひも」を操作します
- ひもはボタンを押している間は伸びて、ボタンを離すと縮みます
- ひもは「ピン」を中心に回ります
- ピンは画面の上端から出現して下方向にスクロールします
- ひもが他のピンに引っかかると、そのピンが中心になるように移動します
- ひもが画面の下端に移動するとゲームオーバーです

<br><br><br><br>

(src) [0_template.js](./src/0_template.js)

### テンプレートのソースコードを準備する

`crisp-game-lib` を使ってゲームを作るには、テンプレートとなるソースコードを準備する必要があります。詳しくは、[始め方](https://github.com/abagames/crisp-game-lib/blob/master/README_ja.md#%E5%A7%8B%E3%82%81%E6%96%B9)を見てください。

<br>

ここでこの記事の見方を説明します。画面右にソースコードが表示されていますか？表示されていない場合は、この文章が画面中央より上に来るまで、ページを下へスクロールしてください。

画面右には新たに追記したソースコードが表示されます。表示は[diff のユニファイド形式](<https://ja.wikipedia.org/wiki/Diff#%E3%83%A6%E3%83%8B%E3%83%95%E3%82%A1%E3%82%A4%E3%83%89%E5%BD%A2%E5%BC%8F_(Unified_format)>)で表示され、行頭に `+` がある行が追記した行、`-` がある行が削除した行です。

画面右下には、現在のソースコードで実現されるゲーム画面が表示されます。今はスコアとハイスコアが表示されているだけです。

<br>

画面右のテンプレートを見てみましょう。`title` , `description` はゲームのタイトルと説明を設定するための変数、`characters` は画面に表示するドット絵を定義するための変数、`options` はゲームの設定を行うための変数です。これらの変数は後ほど設定します。詳細については、 [char()](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#char)と[Options](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#Options)のリファレンスを参照ください。

`update` 関数に、ゲームのロジックを記述します。`update` 関数は 1 秒に 60 回呼び出され、ゲーム画面の描画やマウス操作に反応する処理などを行います。

`update` 関数内にある `ticks` 変数は、ゲーム開始時は 0 で、1/60 秒ごとに 1 加算されます。`if (!ticks) {}` は、`if (ticks === 0) {}` と同じ意味で、ゲーム開始時に行う初期化の処理が、`{}` 内で行えます。

<br><br><br><br>

(src) [1_pins_variable.js](./src/1_pins_variable.js)

### ピンを表示する

まず `pins` 配列変数を宣言します。必須ではないですが、`@type` を含むコメントを使って、変数の型を宣言すると、エラー検出やコード補完をする際に役立ちます。`Vector` クラスは、(x, y) 座標を扱う際に便利な関数群を備えた、 2 次元のベクトルを扱うクラスです。

`pins` 変数を `[vec(50, 5)]` で初期化します。`vec()` 関数は、第 1 引数を x 座標、第 2 引数を y 座標とした、[Vector](https://abagames.github.io/crisp-game-lib/ref_document/classes/Vector.html) インスタンスを生成します。

`forEach` を使って、`pins` の各要素を座標として [box](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#box)、つまり四角を描画します。`box` 関数は第 1 引数に座標を、第 2 引数にその大きさを指定します。`crisp-game-lib` の画面は 100x100 ドットで構成されていて、左上が(0, 0)、右下が(99, 99)です。

<br><br><br><br>

(src_silent) 1a_pins_variable.js

(src) [2_add_pins.js](./src/2_add_pins.js)

### ピンを追加しスクロールさせる

ピンをある程度の間隔で画面上端から出現させ、下にスクロールさせます。`nextPinDist` 変数に次のピンまでの距離を設定します。`scr` 変数にはスクロールする y 方向の距離を設定し、各ピンの y 座標に `scr` の値を加えます。

`nextPinDist` が 0 より小さな値になった場合、配列の `push` 関数を使って新たなピンを追加します。ピンの x 座標は [rnd](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#rnd) 関数を使ってランダムに設定します。`rnd` 関数は第 1 引数から第 2 引数までの間の値を返します。次のピンまでの距離も `rnd` 関数を使って算出し、`nextPinDist` に加算します。

<br><br><br><br>

(src) [3_remove_pins.js](./src/3_remove_pins.js)

### 画面から外れたピンを削除する

画面下へスクロールして画面から外れたピンを削除しないと、いつまでも配列にピンが残り続けてしまいます。`forEach` の代わりに [remove](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#remove) 関数を使って画面から外れたピンを削除します。

`remove` 関数は第 1 引数に繰り返し要素を取り出す配列を、第 2 引数に取り出した要素を引数として処理を行う関数を指定します。第 2 引数の関数が `true` を返すと、この要素は配列から削除されます（この関数は [lodash の remove 関数](https://lodash.com/docs/#remove) とほぼ同じ動作をします）。画面から外れた ( `pin.y > 102` ) 時に `true` を返すことで、ピンを削除します。

<br><br><br><br>

(src) [4_add_cord.js](./src/4_add_cord.js)

### ひもを追加する

`cord` 変数でひもを管理します。`cord` はひもの角度 ( `angle` ) 、長さ ( `length` ) 、中心のピン ( `pin` ) をプロパティに持ちます。`cord` も `if (!ticks) {}` 内で初期化します。

<br><br><br><br>

(src) [5_draw_cord.js](./src/5_draw_cord.js)

### ひもを描画する

ひもの角度を加算して回転させます。その後、 [line](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#line) 関数を使ってひもを描画します。`line` 関数は第 1 引数と第 2 引数の座標をつなぐ線を描画します。`Vector` の `addWithAngle` 関数は、第 1 引数の角度方向に、第 2 引数の距離分、座標をずらします。

<br><br><br><br>

(src) [6_extend_cord.js](./src/6_extend_cord.js)

### ボタンを押すとひもが伸びる

[input](https://abagames.github.io/crisp-game-lib/ref_document/modules/input.html) 変数には、マウスやタッチパネル、キーボードからの入力状態が格納されます。`input.isPressed` 変数はボタンやタッチパネル、キーが押されている時に `true` になります。ここでは、ボタンを押した時にひもの長さを加算し、離した時に長さの初期値である `cordLength` に戻します。

画面右下のゲーム画面にマウスカーソルを合わせて、マウスボタンを押してみてください。ひもが伸びる動作が確認できます。

このページでは、マウスカーソルがゲーム画面の外にある場合でもゲームの動作が分かりやすいように、ボタンが押された状態をランダムに再現します。ひもが自動的に伸びたり縮んだりするのは、この動作のためです。

<br><br><br><br>

(src) [7_scroll_cord.js](./src/7_scroll_cord.js)

### ひもの位置に合わせてスクロールする

このゲームではピンが画面上端から下方向へスクロールするため、ひもが画面上部にあると画面の先の状況を見るのが難しくなります。そのため、ひもの中心のピンの y 座標が 80 より小さい場合、スクロールする距離を増やします。

また、ひもが画面下へ到達した場合にゲームを終了させる処理も追加します。 [end](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#end) 関数を呼び出すことで、ゲームオーバー状態へ遷移します。

<br><br><br><br>

(src) [8_move_to_pin.js](./src/8_move_to_pin.js)

### ひもが別のピンへ移動する

ひもが別のピンに引っかかった場合、そのピンへひもが移動する処理を追加します。あるピンがひもが衝突した時に、ひもをそのピンへ移動することで、この処理を実現します。

衝突([Collision](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#Collision))を判定するには、`box` 関数の返り値を使います。`isColliding.rect.black` が `true` であるかを確認することで、box が黒の四角に衝突しているかを判定できます。ひもを描画する `line` 関数は、複数の四角で線を描画します。そのため、この確認を行うことで、描画したピンがひもと衝突するかを判定できます。

`box` 関数以外の描画関数も、同様に `isColliding` を確認することで、描画時に別の四角に衝突するかを確認できます。

ひもと衝突したピンを `nextPin` 変数に格納します。`nextPin` が `null` でなければ、ひもを `nextPin` へ移動させ、ひもの長さを初期値である `cordLength` へ戻します。

<br><br><br><br>

(src) [9_add_score.js](./src/9_add_score.js)

### スコアを加算する

プレイヤーの腕前に合わせて正しくスコアを加算することが、ミニゲームとして成り立つためには必要です。ここではひもが別のピンに移動した時に、その移動距離をスコアに加算することにします。移動距離は `Vector` クラスの `distanceTo` 関数を用いて計算します。

[addScore](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#addScore) 関数の第 1 引数に、加算するスコアを与えることで、スコアを加算します。第 2 引数に座標を与えると、その座標に加算されたスコアを表示します。第 2 引数は必須ではなく、省略するとスコア表示は行いません。

また、スコアの加算に応じて効果音が鳴るようにします。音を鳴らすには [play](https://abagames.github.io/crisp-game-lib/ref_document/modules.html#play) 関数を使います。`play` 関数の第 1 引数で効果音の種類を指定します。ここで指定した `powerUp` の他に、`coin`, `select`, `hit`, `explosion`, `laser`, `jump` などの種類があります。

<br>

このページでは、ゲーム画面にマウスカーソルが合っている時のみ音が鳴ります。ゲーム画面にマウスカーソルを合わせて、ボタンを押してひもを伸ばし、ピンが移動する時に効果音が鳴ることを確認しましょう。

<br><br><br><br>

(src) [10_play_ses.js](./src/10_play_ses.js)

### 他の効果音を追加する

ひもが移動する時以外にも、効果音を鳴らします。ボタンを押した瞬間に `select` 音を鳴らします。ボタンを押した瞬間は `input.isJustPressed` が `true` になっているかを調べることで分かります。また、ゲームオーバーの時に `explosion` 音を鳴らします。

<br><br><br><br>

(src) [11_adjust_difficulty.js](./src/11_adjust_difficulty.js)

### ゲームを徐々に難しくする

ミニゲームでは、時間が経つごとに少しずつ難しくすることで、プレイヤーに緊張感を持たせることが重要です。ゲームを難しくするには、ゲームスピードを速くすることが有効です。

`difficulty` 変数を使うことで、ゲームの難易度調整を行うことができます。`difficulty` はゲーム開始時には 1、その後 1 分経過すると 2、という具合に 1 分ごとに 1 つずつ値が増加します。`difficulty` をソースコード内で参照し、様々な動作のスピードを上げます。

ここでは、スクロール速度、ひもの伸びる速度、ひもの回転速度を徐々に増加させます。

これでゲーム本体のソースコードは完成です。

<br><br><br><br>

(src) [12_set_options.js](./src/12_set_options.js)

### タイトル、説明、オプションを設定する

タイトル ( `title` ) と ゲームの説明文 ( `description` ) を設定すると、ゲーム開始前のタイトル画面にそれらのテキストが表示されます。また、`options` でオプションを設定できます。ここでは、BGM の再生 ( `isPlayingBgm` ) および、ゲームオーバ後のタイトル画面での前回のゲームのリプレイ表示 ( `isReplayEnabled` ) を有効にします。

ゲーム画面にマウスカーソルを合わせると、BGM が流れることが確認できます。そのままゲームオーバーになり、タイトル画面に戻ると、前回のプレイ内容が表示されます。

<br><br><br><br>

(src) [13_change_sound.js](./src/13_change_sound.js)

### 音を調整する

`isPlaingBgm` を有効にすると、BGM が自動生成され、ゲーム中に BGM が流れるようになります。また、`play` 関数で鳴る効果音も同様に自動生成されます。これらの音は、`options` において `seed` を設定することで変更できます。気に入った BGM や効果音になるまで、`seed` に色々な数値を設定してみましょう。

<br><br><br><br>

(src) [99_completed.js](./src/99_completed.js)

### 完成！

これで完成です。`crisp-game-lib` を使ったゲームは[他にもたくさんある](http://www.asahi-net.or.jp/~cs8k-cyu/browser.html)ので、それらも参照ください。ソースコードはすべて[サンプルコード](https://github.com/abagames/crisp-game-lib-games/tree/main/docs)として公開されています。

最終的なソースコードは、以下の通りです。

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
