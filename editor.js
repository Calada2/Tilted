var currentitem = 'barrier';
var firstclick = secondclick = null;
var tempdot = cr(2,2,'red','translate(var(--x),var(--y))');
tempdot.style.borderRadius = '50%';
tempdot.style.zIndex = 9999999999;
s('editor_bottom').appendChild(tempdot);
tempdot.hidden = true;

function clickeditortop(e)
{
    var elem = s('editor_top');

    var left = Math.round(2* 33 *((((e.touches ? e.touches[0].pageX : e.clientX) - elem.offsetLeft) / elem.offsetWidth) - .5));
    var top = Math.round(2* 49 * ((((e.touches ? e.touches[0].pageY : e.clientY) - elem.offsetTop) / elem.offsetHeight) - .5));
    cancomplete = 0;
    if(currentitem == 'barrier')
    {
        if(firstclick == null)
        {
            firstclick = [left,top];
            tempdot.style.setProperty('--x',left + 'vmin');
            tempdot.style.setProperty('--y',top + 'vmin');
            tempdot.hidden = false;
        }
        else
        {
            secondclick = [left,top];
            tempdot.hidden = true;
            place_barrier();
        }
    }
    if(currentitem == 'door')
    {
        if(firstclick == null)
        {
            firstclick = [left,top];
            tempdot.style.setProperty('--x',left + 'vmin');
            tempdot.style.setProperty('--y',top + 'vmin');
            tempdot.hidden = false;
        }
        else
        {
            secondclick = [left,top];
            tempdot.hidden = true;
            place_barrier(true, prompt('What should the id of the door be?',editordata.doors.length));
        }
    }
    else if(currentitem == 'hole')
    {
        var elem = cr(6*.7,6*.7,'#333 radial-gradient(circle at 70% 70%, rgba(0,0,0,.1) 50%, rgba(0,0,0,.5) 60%)','translate(var(--x),var(--y))');
        elem.className += ' hole';
        elem.id=editordata.holes.length;
        elem.onclick=function(){delete editordata.holes[this.id]; this.remove()};
        setxy(elem, left, top);
        s('editor_bottom').appendChild(elem);
        editordata.holes.push([left,top,3,'death']);
    }
    else if(currentitem == 'finish')
    {
        var elem = cr(6*.7,6*.7,'lightgreen radial-gradient(circle at 70% 70%, rgba(0,0,0,.1) 50%, rgba(0,0,0,.5) 60%)','translate(var(--x),var(--y))');
        elem.className += ' hole';
        elem.id=editordata.holes.length;
        elem.onclick=function(){delete editordata.holes[this.id]; this.remove()};
        setxy(elem, left, top);
        s('editor_bottom').appendChild(elem);
        editordata.holes.push([left,top,3,'win']);
    }
    else if(currentitem == 'ball')
    {
        var elem = cr(5.8*.7,5.8*.7,'','translate(var(--x),var(--y))');
        elem.className += ' ball';
        elem.id=editordata.balls.length;
        elem.onclick=function(){delete editordata.balls[this.id]; this.remove()};
        setxy(elem, left, top);
        s('editor_bottom').appendChild(elem);
        editordata.balls.push([left,top,3]);
    }
    else if(currentitem.includes('button'))
    {
        console.log(Number(currentitem.split('button')[1]));
        var elem = cr(8*.7,8*.7);
        elem.className += ' ingamebutton';
        elem.id=editordata.buttons.length;
        elem.onclick=function(){delete editordata.buttons[this.id]; this.remove()};
        setxy(elem, left, top);
        s('editor_bottom').appendChild(elem);
        var num =Number(currentitem.split('button')[1]);
        elem.style.setProperty('--color',num == 0 ? '#526dd6' : (num  == 1 ? '#2ba963' : (num  == 2 ? '#c8504d' : 'yellow')));
        var id = prompt("What should the button's ID be?",(editordata.doors.length-1));
        elem.innerHTML = id;
        editordata.buttons.push([left,top,num,4,id]);
    }



}

function change_editor_action(action)
{
    tempdot.hidden = true;
    firstclick = null;
    secondclick = null;
    currentitem = action;
    s('editor_bottom').style.zIndex = action == 'delete' ? 300 : 100;
    for(var i = 0; i < 11; ++i)document.querySelectorAll('.button')[i].setAttribute('selected',0);
}

function setxy(elem,x,y)
{
    elem.style.setProperty('--x',x+'vmin');
    elem.style.setProperty('--y',y+'vmin');
}
var editordata = {barriers: [],balls: [],holes:[],buttons:[],doors:[]};
function place_barrier(door,id)
{
    door = door || false;
    var h = Math.abs(firstclick[1] - secondclick[1]) || 1;
    var w = Math.abs(firstclick[0] - secondclick[0]) || 1;
    var x = (firstclick[0] + secondclick[0])/2;
    var y = (firstclick[1] + secondclick[1])/2;
    var elem = cr(w,h,'saddlebrown','translate(var(--x),var(--y))');
    elem.type = 'barrier';
    elem.style.border = '.3px solid';


    setxy(elem,x,y);
    s('editor_bottom').appendChild(elem);
    firstclick = null;
    secondclick = null;
    if(door)
    {
        elem.id=editordata.doors.length;
        elem.style.background = 'lightgray';
        elem.innerHTML = id;
        editordata.doors.push([x,y,w,h,id]);
        elem.onclick=function(){delete editordata.doors[this.id]; this.remove()};

    }
    else
    {
        elem.id=editordata.barriers.length;
        editordata.barriers.push([x,y,w,h]);
        elem.onclick=function(){delete editordata.barriers[this.id]; this.remove()};
    }

}




/*var levels = [
    {
        balls:[[0,0,2.9]],
        holes: [[10,10,3,'death'],[-10,-10,3,'death'],[-10,10,3,'death'],[10,-10,3,'death']],
        barriers: [[20,50,3,40],[35,50,3,40],[-20,-50,10,10],[-30,-20,13,13],[-35,-60,6,8]]
    }
];*/

function show_editor_misc()
{
    s('editormisc').hidden = 0;
}
function save_editor_misc()
{
    s('editormisc').hidden = 1;
    var values = s('editormisc').querySelectorAll('input');
}

var cancomplete = 0;
var currentlevel = null;
function playlevel()
{
    var level = {barriers: [],balls: [],holes:[],buttons:[],doors:[]};
    for(var i of editordata.barriers)if(i != undefined)level.barriers.push([1.428*i[0],1.428*i[1],1.428*i[2],1.428*i[3]]);
    for(var i of editordata.doors)if(i != undefined)level.doors.push([1.428*i[0],1.428*i[1],1.428*i[2],1.428*i[3],i[4],i[5]]);
    for(var i of editordata.holes)if(i != undefined)level.holes.push([1.428*i[0],1.428*i[1],i[2],i[3]]);
    for(var i of editordata.balls)if(i != undefined)level.balls.push([1.428*i[0],1.428*i[1],i[2]]);
    for(var i of editordata.buttons)if(i != undefined)level.buttons.push([1.428*i[0],1.428*i[1],i[2],i[3],i[4]]);
    console.log(JSON.stringify(level));
    loadlevel(level, true);
    s('editor').hidden = true;
}
function tempshare()
{
    if(cancomplete)
    {
        var level = {barriers: [],balls: [],holes:[],buttons:[],doors:[]};
        for(var i of editordata.barriers)if(i != undefined)level.barriers.push([~~(1.428*i[0]),~~(1.428*i[1]),~~(1.428*i[2]),~~(1.428*i[3])]);
        for(var i of editordata.doors)if(i != undefined)level.doors.push([~~(1.428*i[0]),~~(1.428*i[1]),~~(1.428*i[2]),~~(1.428*i[3]),i[4],i[5]]);
        for(var i of editordata.holes)if(i != undefined)level.holes.push([~~(1.428*i[0]),~~(1.428*i[1]),i[2],i[3]]);
        for(var i of editordata.balls)if(i != undefined)level.balls.push([~~(1.428*i[0]),~~(1.428*i[1]),i[2]]);
        for(var i of editordata.buttons)if(i != undefined)level.buttons.push([~~(1.428*i[0]),~~(1.428*i[1]),i[2],i[3],i[4]]);
        level.creator = prompt("What is your (the creator's) name?");
        level.name = prompt("What is your level's name?");
        saved_levels.push(JSON.stringify(level));
        localStorage.p94l = JSON.stringify(saved_levels);
        levelpacks[7].levels.push(level);
        savedata[7].push([1,0]);
        alert('Level saved!');
        tomain();
        localStorage.p94 = JSON.stringify(savedata);
        //prompt('Your level in JSON:',JSON.stringify(level));
    }
    else
    {
        alert('You need to play through your level before you can save it');
    }



}