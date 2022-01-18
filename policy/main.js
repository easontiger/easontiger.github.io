"use strict";
class attr {
    constructor() {
        this.con = [5, 5, 5, 5];
    }
}
var data = new attr();
class Choice {
    constructor(name, d) {
        this.name = name;
        this.d = d;
    }
}
function run(x) {
    for (let i = 0; i < 4; i++)
        data.con[i] += x.d[i];
}
class Pol {
    constructor(con, cho) {
        this.con = con;
        this.cho = cho;
    }
}
function read(inp) {
    var f = inp.files[0], fr = new FileReader();
    fr.onloadend = function (e) {
        pol = JSON.parse(e.currentTarget.result);
        data = new attr();
        write();
    };
    fr.readAsText(f);
}
$.ajax({
    type: 'GET',
    url: 'dat.json',
    dataType: "json",
    success: function (result) {
        pol = result;
        rewrite();
        document.getElementById("l").innerText = toString(L);
    }
});
class str {
    constructor(c, e) {
        this.c = c;
        this.e = e;
    }
}
function toString(s) {
    return lang == Lang.Chinese ? s.c : s.e;
}
var pol;
var x = null;
var Lang;
(function (Lang) {
    Lang[Lang["English"] = 0] = "English";
    Lang[Lang["Chinese"] = 1] = "Chinese";
})(Lang || (Lang = {}));
var lang = Lang.English;
const at = [new str("经济", "Economy"), new str("军事", "Military"), new str("人民", "People"), new str("君权", "Authority")];
const L = new str("English", "中文");
document.getElementById("l").onclick = function () {
    lang = (lang == Lang.English ? Lang.Chinese : Lang.English);
    document.getElementById("l").innerText = toString(L);
    write();
};
function ParseO(val) {
    return '<span style="color:' + (val <= 3 || val >= 8 ? 'red' : 'black') + '">' + val + '</span>';
}
function write() {
    var a = "";
    for (let i = 0; i < at.length; i++)
        a += toString(at[i]) + ":" + ParseO(data.con[i]) + '\t\t';
    document.getElementById("attr").innerHTML = a + '<br>';
    a = toString(x.con) + '<br>';
    for (let i = 0; i < x.cho.length; i++) {
        a += '<button onclick="run(x.cho[' + i.toString() + ']);window.rewrite();"' + '>' + toString(x.cho[i].name) + "</button><br>";
    }
    document.getElementById('pol').innerHTML = a;
}
function rewrite() {
    x = pol[Math.floor(Math.random() * pol.length)];
    write();
}
