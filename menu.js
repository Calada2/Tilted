function buildmenu()
{
    s('worlds').innerHTML = '';
    for(var i in levelpacks)
    {
        var elem = cd('menuelem');
        elem.innerHTML = levelpacks[i].name;
        var dots = cd('menuelemdots');
        for(var j in levelpacks[i].levels)
        {
            var lvl = levelpacks[i].levels[j];
            var dot = cd('leveldot');
            if(savedata[i] && savedata[i][j] && savedata[i][j][0] == 2)dot.style.background = 'lightgreen';
            dots.appendChild(dot);
        }
        elem.appendChild(dots);
        elem.pack = i;
        if(levelpacks[i].levels.length > 0)elem.onclick = function(){showlevels(this.pack)};
        s('worlds').appendChild(elem);
    }
}
var menulevel = 0;
var menuworld = 0;
var currentmenu = 'main';
function showlevels(world)
{
    currentmenu = 'levels';
    menuworld = world;
    var pack = levelpacks[world];
    s('worlds').hidden = true;
    s('levelselect').hidden = 0;
    s('levelcount').innerHTML = '';
    var levels = pack.levels.length;
    for(var i in pack.levels) s('levelcount').appendChild(cd('leveldot'));
    change_menulevel(0);
    /*alert(world);
    alert(levelpacks[world].levels.length);*/
}

function change_menulevel(to)
{

    menulevel = to;
    s('mapsketch').innerHTML = '';
    if(menulevel < 0) menulevel = levelpacks[menuworld].levels.length - 1;
    if(menulevel >= levelpacks[menuworld].levels.length) menulevel = menulevel = 0;
    var lvl = levelpacks[menuworld].levels[menulevel];
    s('title').innerHTML = lvl.name + '<br>by ' + lvl.creator;
    for(var i = 0; i < levelpacks[menuworld].levels.length; ++i) s('levelcount').childNodes[i].style.background = 'white';
    s('levelcount').childNodes[menulevel].style.background = '#222';
    for(var i in lvl.balls)
    {
        var b = lvl.balls[i];
        var elem = cr(b[2]*2,b[2]*2,'','translate(var(--x),var(--y))');
        elem.className += ' ball';
        setxy(elem, b[0], b[1]);
        s('mapsketch').appendChild(elem);
    }
    for(var i in lvl.holes)
    {
        var b = lvl.holes[i];
        //holes.push(new Hole(b[0],b[1],b[2],b[3]));

        var elem = cr(b[2]*2,b[2]*2,(b[3]=='death'?'#333':'lightgreen') + ' radial-gradient(circle at 70% 70%, rgba(0,0,0,.1) 50%, rgba(0,0,0,.5) 60%)','translate(var(--x),var(--y))');
        elem.className += ' hole';
        setxy(elem, b[0],b[1]);
        s('mapsketch').appendChild(elem);
    }
    for(var i in lvl.buttons)
    {
        var b = lvl.buttons[i];
        var elem = cr(b[3]*2,b[3]*2,'','translate(var(--x),var(--y))');
        elem.style.setProperty('--color','#526dd6');
        elem.className += ' ingamebutton';
        setxy(elem, b[0],b[1]);
        s('mapsketch').appendChild(elem);
    }
    for(var i in lvl.doors)
    {
        var b = lvl.doors[i];

        var elem = cr(b[2],b[3],'#CCC','translate(var(--x),var(--y))');
        elem.style.border = '.3px solid';
        setxy(elem,b[0],b[1]);

        s('mapsketch').appendChild(elem);
    }
    for(var i in lvl.barriers)
    {
        var b = lvl.barriers[i];

        var elem = cr(b[2],b[3],'saddlebrown','translate(var(--x),var(--y))');
        elem.style.border = '.3px solid';
        setxy(elem,b[0],b[1]);

        s('mapsketch').appendChild(elem);
    }



    s('record').innerHTML = 'Your record: ' + (savedata[menuworld][menulevel][1] || '- ') + 's';

    if(savedata[menuworld][menulevel][0]) s('start').innerHTML = 'PLAY';
    else s('start').innerHTML = 'LOCKED';

    s('start').setAttribute('locked',savedata[menuworld][menulevel][0]);


}
function toworlds()
{
    currentmenu = 'worlds';
    s('levelselect').hidden = true;
    s('worlds').hidden = false;
    buildmenu();
}
function startlevel()
{
    if(savedata[menuworld][menulevel][0])
    {

        s('levelselect').hidden = true;
        s('worlds').hidden = true;
        s('editor').hidden = true;
        loadlevel(levelpacks[menuworld].levels[menulevel]);
    }
}
function quitlevel()
{
    currentmenu = 'levels';
    data.running = false;
    s('levelselect').hidden = 0;
    s('restartbut').hidden =1;
}

function hidewin()
{
    s('win').hidden = 1;
    s('levelselect').hidden = 0;
    change_menulevel(menulevel+1);
}
function launchgame()
{
    currentmenu = 'worlds';
    s('mainmenu').hidden = 1;
    s('gui').hidden = 0;
    s('worlds').hidden = 0;
    buildmenu();
}
function launcheditor()
{
    currentmenu = 'editor';
    s('mainmenu').hidden = 1;
    s('editor').hidden = 0;
}
function tomain()
{
    currentmenu = 'main';
    s('worlds').hidden = 1;
    s('editor').hidden = 1;
    s('mainmenu').hidden = 0;
    s('gui').hidden = 1;
}


//s('worlds').hidden = true;
s('levelselect').hidden = true;