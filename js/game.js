let timer = null;
const MAX = 5;
let count = 0;
const APPLICATION_KEY = "88a57060540c282de7f31759e5910cf1c77c04635264b6ba8070f2d1111e2811";
const CLIENT_KEY = "69885a62ad894e618863265ffa3fea42c45b41beb583a59dee5ec52d89a1b362";
const ncmb = new NCMB(APPLICATION_KEY,CLIENT_KEY);
const DBName = "TimeClass";

let TimeClass = ncmb.DataStore(DBName);

function init() {
  if (timer == null) {
    start = new Date();
    time();
    gameStart();
  }
}

function gameStart() {
  count++;
  let size = 5;
  let qNum = Math.floor(Math.random()*q.length);
  for (let i=0; i<size*size; i++) {
    let s = document.createElement("span");
    s.textContent = q[qNum][0];
    s.setAttribute("id", "num"+i);
    s.addEventListener("click", function() {
      if (this.textContent == q[qNum][1]) {
        // alert("正解");
        correct.play();
        while (cells.firstChild) {
          cells.removeChild(cells.firstChild);
        }
        if (count < MAX) {
          gameStart();
        } else {
          clearTimeout(timer);
          alert("Game clear!");
          let time = new TimeClass();
          let key = "message";
          time.set(key, parseInt(score.textContent));
          time.save()
          .then (function() {
            console.log("成功");
          })
          .catch (function(err) {
            console.log("エラー発生： " + err);
          });
          TimeClass
            .order("message")
            .fetchAll()
            .then(function(results) {
              let highScore = results[0].message;
              if (parseInt(score.textContent) < highScore) {
                alert("High score! : " + parseInt(score.textContent));
              }
            })
            .catch(function(err) {
              console.log("エラー発生： " + err);
            });
        }
      } else {
        wrong.play();
      }
    });
    cells.appendChild(s);
    if (i % size == size - 1) {
      const br = document.createElement("br");
      cells.appendChild(br);
    }
  }
  let p = Math.floor(Math.random()*size*size);
  let ans = document.getElementById("num" + p);
  ans.textContent = q[qNum][1];
}

function time() {
  let now = new Date();
  let eTime = parseInt((now.getTime() - start.getTime())/1000);
  score.textContent = eTime;
  timer = setTimeout("time()", 1000);
}
