const s = gid = id => document.getElementById(id);

const cd = name =>
{
    var elem = document.createElement('div');
    elem.className = name;
    return elem;
}

var cr = (w,h,bg,t) => {
    var elem = cd('rectangle');
    elem.style.setProperty('--w',w+'vmin');
    elem.style.setProperty('--h',h+'vmin');
    elem.style.background = bg;
    elem.style.transform = t;
    elem.style.backgroundSize = '100% 100%,15vmin 15vmin';
    return elem;
}

const get_distance = (x1, y1, x2, y2) => Math.hypot(x2-x1,y2-y1);

var wood = 'linear-gradient(45deg,sandybrown,wheat,sandybrown,wheat,sandybrown,wheat,sandybrown,wheat)';
var steel = 'linear-gradient(45deg,gray,lightgray,gray,lightgray,gray,lightgray,gray,lightgray)';
var door = 'linear-gradient(45deg,#CCC,#DDD,#CCC,#DDD,#CCC,#DDD,#CCC,#DDD)';
//var wood = 'linear-gradient(45deg,sandybrown,#CBB27B,sandybrown,#CBB27B,sandybrown,#CBB27B,sandybrown,#CBB27B)';