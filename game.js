

var rot = {a:0,b:0,g:0};
var pos = {x:0,y:0};

var radius = 2.5;

var devicerot = {alpha:0,beta:0,gamma:0};

function deviceOrientationHandler(e)
{
    devicerot = {alpha:e.alpha,beta:e.beta,gamma:e.gamma};

    if(data.depth)s('camera').style.perspectiveOrigin = `calc(50% + ${(-e.gamma*15)}vmin) calc(50% + ${(-e.beta*15)}vmin)`;

}
function mousemovement(e)
{

    var X = (e.clientX - (window.innerWidth / 2))/20;
    var Y = (e.clientY - (window.innerHeight / 2))/20;
    devicerot = {beta:Y,gamma:X};

    if(data.depth)s('camera').style.perspectiveOrigin = `calc(50% + ${(-e.gamma*15)}vmin) calc(50% + ${(-e.beta*15)}vmin)`;

}
if (window.DeviceOrientationEvent) {

    if(navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) window.addEventListener('deviceorientation', deviceOrientationHandler, false);
        else window.onmousemove = mousemovement;
    console.log('supported')
}

var barriers = [];
class Ball
{
    constructor(x,y,rad)
    {
        this.active = true;
        this.rad = rad;
        this.pos = {x:x,y:y};
        this.speed = {x:0,y:0};
        this.look = cd('rectangle ball');
        this.look.style.setProperty('--w',rad*2+'vmin');
        this.look.style.setProperty('--h',rad*2+'vmin');
        s('cont').appendChild(this.look);
    }
    move(x,y,delta)
    {
        if(this.active) {


            var posposY = this.pos.y + this.speed.y * delta;
            var posposX = this.pos.x + this.speed.x * delta;


            for (var i in barriers) {
                var bar = barriers[i];
                if (bar.active && ((posposX - this.rad < bar.r && posposX + this.rad > bar.l && posposY < bar.b && posposY > bar.t) || (posposX < bar.r && posposX > bar.l && posposY - this.rad < bar.b && posposY + this.rad > bar.t) || (get_distance(bar.l, bar.t, posposX, posposY) <= this.rad || get_distance(bar.l, bar.b, posposX, posposY) <= this.rad || get_distance(bar.r, bar.t, posposX, posposY) <= this.rad || get_distance(bar.r, bar.b, posposX, posposY) <= this.rad))) {
                    //
                    var left = Math.abs(posposX + this.rad - bar.l);
                    var right = Math.abs(posposX - this.rad - bar.r);
                    var top = Math.abs(posposY + this.rad - bar.t);
                    var bottom = Math.abs(posposY - this.rad - bar.b);

                    var smallest = Math.min(left, right, top, bottom);

                    if (smallest == left) {
                        if (Math.abs(this.speed.x) > 20) navigator.vibrate(50);
                        this.speed.x *= -1;
                        posposX = bar.l - this.rad;
                    }
                    else if (smallest == right) {
                        if (Math.abs(this.speed.x) > 20) navigator.vibrate(50);
                        this.speed.x *= -1;
                        posposX = bar.r + this.rad;
                    }
                    else if (smallest == top) {
                        if (Math.abs(this.speed.y) > 20) navigator.vibrate(50);
                        this.speed.y *= -1;
                        posposY = bar.t - this.rad;
                    }
                    else if (smallest == bottom) {
                        if (Math.abs(this.speed.y) > 20) navigator.vibrate(50);
                        this.speed.y *= -1;
                        posposY = bar.b + this.rad;
                    }


                }
            }

            for (var i in balls) if (balls[i] != this && balls[i].active) {
                var ball = balls[i];
                if (get_distance(posposX, posposY, ball.pos.x, ball.pos.y) <= (this.rad + ball.rad)) {
                    this.speed.x *= -.7;
                    this.speed.y *= -.7;

                    posposX = this.pos.x;
                    posposY = this.pos.y;
                }

            }

            for (var i in holes) {
                var hole = holes[i];
                if (get_distance(hole.pos.x, hole.pos.y, this.pos.x, this.pos.y) < hole.rad && this.rad <= hole.rad) {

                    this.active = false;
                    this.look.style.animation = 'death 300ms linear infinite';
                    this.look.style.setProperty('--x2', hole.pos.x + 'vmin');
                    this.look.style.setProperty('--y2', hole.pos.y + 'vmin');

                    if (hole.type == 'death')
                    {
                        this.die();

                    }

                    else if (hole.type == 'win')
                    {
                        setTimeout(win,1000);
                        var this2 = this;
                        setTimeout(()=>{this2.look.hidden = 1},300);
                    }

                }

            }
            this.pos.x = posposX;
            this.pos.y = posposY;




            this.look.style.setProperty('--x', this.pos.x + 'vmin');
            this.look.style.setProperty('--y', this.pos.y + 'vmin');
        }


    }
    die()
    {

        var this2 = this;
        setTimeout(()=>{this2.look.remove()},300);
        var j = 0;
        for(var i of balls)if(i.active)++j;
        // alert(j);
        if(j==0)
        {

            for(var k in currentlevel.balls)
            {
                var b = currentlevel.balls[k];
                balls.push(new Ball(b[0],b[1],b[2]));
            }

        }
    }
}
var doors = [];
class Barrier
{
    constructor(x,y,w,h,type,id)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.l =x-(w/2);
        this.r =x+(w/2);
        this.t =y-(h/2);
        this.b =y+(h/2);

        this.active = 1;

        this.type = type || 0;
        this.id = id;



        this.look = cd('cont');
        for(var i = 0; i < 4; ++i)this.look.appendChild(cr(i % 2 == 0 ? w : h, 10, 'linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.1),transparent),' + (type ? door : wood), 'rotateX(90deg) rotateY('+(i * 90)+'deg) translateZ(' + (i % 2 == 0 ? (h/2) : (w/2)) + 'vmin)'));

        var elem = cr(w,h,'linear-gradient(transparent,transparent),' +  (type ? door : wood),'translateZ(5vmin)');
        //elem.style.filter = 'blur(.0001vmin)';  //Giving blur to barrier top prevents a display glitch in chrome mobile
        this.look.appendChild(elem);


        /* var shadow = cr(w,h,'rgba(0,0,0,.3)','translateZ(-4.99vmin)');
         shadow.style.filter = 'blur(.5vmin)';
         this.look.appendChild(shadow);*/

        this.look.style.transform = 'translateX('+x+'vmin) translateY('+y+'vmin)';
        if(type)
        {
            this.look.style.transition = 'transform 300ms';
            doors[id] = this;
        }

        s('cont').appendChild(this.look);
    }
    open()
    {
        this.look.style.transform = 'translateX('+this.x+'vmin) translateY('+this.y+'vmin) translateZ(-9.995vmin)';
        this.active = 0;
    }
    close()
    {
        this.look.style.transform = 'translateX('+this.x+'vmin) translateY('+this.y+'vmin) translateZ(0)';
        this.active = 1;
    }
}
class Hole
{
    constructor(x,y,rad,type)
    {
        this.pos = {x:x,y:y};
        this.rad = rad;
        this.type = type;
        this.look = cr(rad*2,rad*2,(type=='death'?'#333':'lightgreen') + ' radial-gradient(circle at 70% 70%, rgba(0,0,0,.1) 50%, rgba(0,0,0,.5) 60%)');
        this.look.className += ' hole';
        this.look.style.setProperty('--x',x+'vmin');
        this.look.style.setProperty('--y',y+'vmin');

        console.log(this.look);
        s('cont').appendChild(this.look);
    }
}

class Button
{
    constructor(x,y,type,rad,id)
    {
        this.pos = {x:x,y:y};
        this.rad = rad;
        this.type = type; //0: HOLD   1: ON   2: OFF   3: DUMMY
        this.id = id;
        this.inuse = 0;
        this.look = cr(rad*2,rad*2);
        this.look.style.setProperty('--x',x+'vmin');
        this.look.style.setProperty('--y',y+'vmin');
        this.look.style.setProperty('--color',type == 0 ? '#526dd6' : (type == 1 ? '#2ba963' : (type == 2 ? '#c8504d' : 'yellow')));
        this.look.className += ' ingamebutton';
        s('cont').appendChild(this.look);
    }
    check()
    {

        var lastinuse = this.inuse;
        this.inuse = 0;
        for (var i in balls) {
            var ball = balls[i];
            if (ball.active && get_distance(this.pos.x, this.pos.y, ball.pos.x, ball.pos.y) < this.rad) {
                this.inuse = 1;
                break;
            }

        }
        if(lastinuse != this.inuse)
        {
            this.look.setAttribute('use',String(this.inuse));
            if(this.inuse)
            {
                if(this.type == 0)
                {
                    doors[this.id].open();
                }
                if(this.type == 1)
                {
                    doors[this.id].open();
                }
            }
            else
            {
                if(this.type == 0)
                {
                    doors[this.id].close();
                }
                if(this.type == 2)
                {
                    doors[this.id].close();
                }
            }
        }


    }
}


function win()
{
    //data.running = false;
    clearInterval(timerinterval);
    s('restartbut').hidden = 1;
    if(!editormode)
    {
        savedata[menuworld][menulevel][0] = 2;

        if(savedata[menuworld][menulevel + 1] == undefined && levelpacks[menuworld].levels.length > menulevel)
        {
            savedata[menuworld][menulevel + 1] = [1,0];
        }
        else if(savedata[menuworld][menulevel + 1][0] == 0)savedata[menuworld][menulevel + 1][0] = 1;

        timertime = Math.round(timertime * 10)/10;
        if(savedata[menuworld][menulevel][1] == 0 || savedata[menuworld][menulevel][1] > timertime) savedata[menuworld][menulevel][1] = timertime;

        localStorage.p94 = JSON.stringify(savedata);
        s('win').hidden = 0;
        s('win').innerHTML = "<br><br>Congratulations!<br><small>You've beaten " + levelpacks[menuworld].levels[menulevel].name + "<br><br>Your time: "+ timertime +"s<br>Your record: "+savedata[menuworld][menulevel][1]+"s</small>";

    }
    else
    {
        data.running = false;
        cancomplete = 1;
        s('editor').hidden = 0;
        s('edbut').hidden = 1;
    }


}



const data = {};
data.running = false;
data.depth = 1;
var editormode = 0;
function loadlevel(level, editor)
{
    doors = [];
    editormode = editor;
    currentlevel = level;
    console.log(level);
    s('cont').innerHTML = '<div class=\'rectangle\' id=\'ground\'></div>';
    barriers = [];
    holes = [];
    balls = [];
    buttons = [];
    data.running = true;
    barriers.push(new Barrier(50,0,6,140));
    barriers.push(new Barrier(-50,0,6,140));
    barriers.push(new Barrier(0,73,106,6));
    barriers.push(new Barrier(0,-73,106,6));
    for(var i in level.holes)
    {
        var b = level.holes[i];
        holes.push(new Hole(b[0],b[1],b[2],b[3]));
    }
    for(var i in level.buttons)
    {
        var b = level.buttons[i];
        buttons.push(new Button(b[0],b[1],b[2],b[3],b[4]));
    }
    for(var i in level.barriers)
    {
        var b = level.barriers[i];
        barriers.push(new Barrier(b[0],b[1],b[2],b[3]));
    }
    for(var i in level.doors)
    {
        var b = level.doors[i];
        barriers.push(new Barrier(b[0],b[1],b[2],b[3],1,b[4],b[5]));
    }
    for(var i in level.balls)
    {
        var b = level.balls[i];
        balls.push(new Ball(b[0],b[1],b[2]));
    }

    timertime = 0;
    clearInterval(timerinterval);
    timerinterval = setInterval(timer, 100);
    if(editor)s('edbut').hidden = 0;
    else s('restartbut').hidden = 0;
    //prevtime = undefined;
}



var prevtime = undefined;
function gameloop()
{

    var delta = (+new Date() - (prevtime || +new Date())) / 1000;
    prevtime = +new Date();

    if(data.running && delta < .5) {



        for (var x of balls) if (x.active) {


            x.speed.x += (20 * devicerot.gamma) * delta;
            x.speed.y += (20 * devicerot.beta) * delta;

            x.move(x.speed.x, x.speed.y, delta);

            x.speed.x *= Math.pow(.37, delta * 4);
            x.speed.y *= Math.pow(.37, delta * 4);
        }

        for (var x of buttons) {
            x.check();
        }
    }

}
var gameinterval = setInterval(gameloop);

var timertime = 0;
var timerinterval = null;
function timer()
{
    timertime += .1
}

var holes = [];
var balls = [];