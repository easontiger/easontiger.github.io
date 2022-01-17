const card_dict = ["skeleton", "s-slime", "spider", "goblin", "barbarian", "X-bow", "fetch", "hope", "arrows", "armor", "fence", "t_wall", "reap", "squash", "p-spider",
    "archer", "shooter", "spear", "mouse", "b-angel", "m-slime", "l-slime", "to_sheep", "fireball", "frozen", "flame", "rand", "f-element", "i-element", "m-element", "wi-element",
    "gravity", "drugI", "clone", "sniper", "drugII", "snake", "guard", "poisonous", "piercing", "kill", "pain", "spill", "mind", "blast", "true-shield", "destroy", "poison", "defense",
    "shotgun", "ex1", "zombie", "tomb", "wi-doc", "bomb-man", "ma-exp", "b-cat", "hxbs", "whip", "space", "smoke", "ma-element"];
const summon = ["su-base", "su-attack", "su-defense", "su-magic", "su-buff", "drugIII"];
var cmd;
var range;
(function (range) {
    range[range["GROUND"] = 0] = "GROUND";
    range[range["RANGED"] = 1] = "RANGED";
    range[range["FLYING"] = 2] = "FLYING";
    range[range["FAKE_RANGED"] = 3] = "FAKE_RANGED";
})(range || (range = {}));
;
var rarity;
(function (rarity) {
    rarity[rarity["NORMAL"] = 0] = "NORMAL";
    rarity[rarity["RARE"] = 1] = "RARE";
    rarity[rarity["LEGENDARY"] = 2] = "LEGENDARY";
})(rarity || (rarity = {}));
;
var Type;
(function (Type) {
    Type[Type["null"] = 0] = "null";
    Type[Type["summon"] = 1] = "summon";
    Type[Type["building"] = 2] = "building";
    Type[Type["undead"] = 3] = "undead";
    Type[Type["element"] = 4] = "element";
})(Type || (Type = {}));
;
const T = ["无", "召唤兽", "建筑", "不死族", "元素"];
function repaint() { }
;
function _event() { }
;
const Max_Exp = 5;
class Bool {
    constructor(v, v_) {
        this.v1 = v;
        this.v2 = v_;
    }
    or() { return this.v1 || this.v2; }
    ;
}
function deepcopy(p) {
    var c = {};
    for (var i in p) {
        if (typeof p[i] == "object")
            c[i] = (p[i].constructor === Array ? [] : {}), c[i] = p[i].new();
        else
            c[i] = p[i];
    }
    return c;
}
class fieldStatus {
    constructor() {
        this.ald = false;
        this.space = new Bool(false, false);
    }
    print() {
        var s = "";
        function add(a, cb, color = "#000") {
            if (!a)
                return;
            s += "<font color=\"" + color + "\">" + cb + "</font><br>";
        }
        add(this.ald, "全传奇", "#ffa500");
        add(this.space.or(), "虚空破碎");
        return s;
    }
}
var fs = new fieldStatus();
function rand_rare() {
    var x = rand(100);
    if (x < 10)
        return rarity.LEGENDARY;
    return rarity.NORMAL;
}
class damage {
    constructor(ps, ms = 0) {
        this.m = ms;
        this.p = ps;
    }
    tostring() {
        return this.p + "+" + this.m;
    }
    new() {
        return new damage(this.p, this.m);
    }
}
class eventlist {
    constructor(l = new Array()) {
        this.list = l;
    }
    run(c) {
        for (var i in this.list)
            this.list[i](c);
    }
    add(f) {
        this.list.push(f);
    }
    plus(e) {
        this.list = this.list.concat(e.list);
    }
    new() {
        return new eventlist(this.list.splice(0));
    }
}
class map {
    constructor(a) {
        if (a)
            this.obj = a.obj, this.no = a.no;
        else
            this.obj = {}, this.no = undefined;
    }
    get(key) {
        return key == "" ? this.no : this.obj[key];
    }
    has(key) {
        return (key == "" && this.no != undefined) || this.obj[key] != undefined;
    }
    set(key, value = 1) {
        if (key == "")
            this.no = value;
        else
            this.obj[key] = value;
    }
    new() {
        return new map();
    }
    keys() {
        var a = [];
        for (var i in this.obj) {
            if (i)
                a.push(i);
        }
        if (this.no != undefined)
            a.push("");
        return a;
    }
}
;
class Skill {
    constructor(a, c, e, cn, ce, cn_ = "无") {
        this.cost = c;
        this.attr = a;
        this.eff = e;
        this.c_name = cn;
        this.c_ee = ce;
        this.cn_ = cn_;
    }
}
function add(c1, c2) {
    if (c1.status != "正常")
        c1.toggle(c1);
    if (c2.status != "正常")
        c2.toggle(c2);
    if ((!c1.taunt) && c2.m.has("taunt")) {
        var pr = ((c1.id == 1) ? p1 : p2);
        pr.taunt++;
    }
    c1.ma += c2.ma;
    c1.at.p += c2.at.p;
    c1.at.m += c2.at.m;
    c1.hp += c2.hp;
    c1.atn = Math.max(c1.atn, c2.atn);
    c1.shield += c2.shield;
    c1.sacred_shield += c2.sacred_shield;
    c1.taunt = c1.taunt || c2.taunt;
    c1.poisonous = c1.poisonous || c2.poisonous;
    c1.hide = c1.hide || c2.hide;
    c1.critical = Math.max(c1.critical, c2.critical);
    c1.r = Math.max(c1.r, c2.r);
    c1.freezing = c1.freezing || c2.freezing;
    c1.self_destructive = c1.self_destructive || c2.self_destructive;
    c1.piercing = c1.piercing || c2.piercing;
    c1.defrost = c1.defrost || c2.defrost;
    c1.frozen += c2.frozen;
    c1.bleed += c2.bleed;
    c1.poisoned += c2.poisoned;
    c1.max_at.m += c2.max_at.m;
    c1.max_at.p += c2.max_at.p;
    c1.max_hp += c2.max_hp;
    c1.death.plus(c2.death);
    return c1;
}
function encode(arr) {
    var result = "";
    for (var i = 0; i < arr.length; i++) {
        var temp = card_dict.indexOf(arr[i]).toString();
        switch (temp.length) {
            case 1:
                result += "0";
            case 2:
                result += "0";
        }
        result += temp;
    }
    return result;
}
function decode(arr) {
    var c = [];
    for (var i = 0; i < arr.length; i += 3) {
        c.push(new Card(dict(card_dict[parseInt(arr.substr(i, 3), 10)])));
    }
    return c;
}
function generator() {
    var result = "";
    for (var i = 0; i < 30; i++) {
        var temp = rand(card_dict.length - 1).toString();
        switch (temp.length) {
            case 1:
                result += "0";
            case 2:
                result += "0";
        }
        result += temp;
    }
    return result;
}
class Magic {
    constructor(a, m, nn, eee, e) {
        this.ma = m;
        this.attr = a;
        this.c_eff = eee;
        this.c_name = nn;
        this.effect = e;
        if (this.rare == rarity.LEGENDARY && this.c_name[this.c_name.length - 1] != ")")
            this.c_name = this.c_name + "(传奇)";
        this.to_ld = function () {
            this.rare = rarity.LEGENDARY;
            return false;
        };
    }
}
class Card {
    constructor(v) {
        this.value = v;
    }
}
class Creature {
    constructor(attr, ms, as, hs, n, feature, a = "", a_ = "") {
        this.ma = ms;
        this.attr = attr;
        this.const_attr = a_;
        this.usd = false;
        this.c_name = n;
        this.c_attr = a;
        this.at = as;
        this.max_at = new damage(as.p, as.m);
        this.hp = hs;
        this.status = "正常";
        this.max_hp = hs;
        this.revive = (!feature.has("revive") ? 0 : feature.get("revive"));
        this.atb = (!feature.has("atb") ? new damage(0) : feature.get("atb"));
        this.hpb = (!feature.has("hpb") ? 0 : feature.get("hpb"));
        this.type = (!feature.has("type") ? Type.null : feature.get("type"));
        this.atn = (!feature.has("atn") ? 1 : feature.get("atn"));
        this.shield = (!feature.has("shield") ? 0 : feature.get("shield"));
        this.sacred_shield = (!feature.has("s-shield") ? 0 : feature.get("s-shield"));
        this.ms = (!feature.has("ms") ? 0 : feature.get("ms"));
        this.taunt = (feature.get("taunt") == 1);
        this.poisonous = (feature.get("poison") == 1);
        this.addictive = (feature.get("add") == 1);
        this.critical = (!feature.has("c") ? 0 : feature.get("c"));
        if (feature.get("hide"))
            hide(this);
        this.poisoned = 0;
        this.bleed = 0;
        this.can_t = false;
        this.rare = rarity.NORMAL;
        switch (feature.get("range")) {
            case 1:
                this.r = range.RANGED;
                break;
            case 2:
                this.r = range.FLYING;
                break;
            case 3:
                this.r = range.FAKE_RANGED;
            default:
                this.r = range.GROUND;
                break;
        }
        this.m = feature;
        this.freezing = (feature.get("freezing") == 1);
        this.self_destructive = (feature.get("self") == 1);
        this.piercing = (feature.get("p") == 1);
        this.defrost = (feature.get("defrost") == 1);
        this.frozen = 0;
        this.alive = true;
        this.std_kill = function (c) {
            this.exp += Math.floor(c.exp / 2);
            p_(c).money += Math.floor(c.value / 2);
        };
        this.kill = this.std_kill;
        this.atl = (feature.get("charge") == 1 ? this.atn : 0);
        this.std_ated = function (at_er, para = 1) {
            this.exp += 1;
            if (this.at.m == 0 && this.at.p == 0)
                return;
            var m = (this.at.m > 0), p = (this.at.p > 0);
            if (at_er.sacred_shield > 0 && p) {
                at_er.sacred_shield--, p = false;
            }
            if (at_er.shield != 0 && p) {
                at_er.shield = Math.max(0, at_er.shield - this.at.p), p = false;
            }
            var c = (this.critical > rand(100) / 100);
            if (c)
                alert("Critical Hit!");
            if (p)
                at_er.hp -= Math.floor(this.at.p * (c ? 2 : 1) * para);
            at_er.hp -= this.at.m;
            at_er.harmed();
            if (this.freezing && (m || p))
                freezing(at_er);
            if (this.self_destructive)
                this.alive = false;
            if (this.defrost && (m || p))
                defrost(this);
            if (this.poisonous && (m || p))
                poison(at_er);
            if (this.piercing && p)
                at_er.bleed++;
            if (!alive(at_er))
                this.kill(at_er);
        };
        this.std_at = function (at_ed, para = 1) {
            this.atl--;
            if (this.atl == 0)
                this.exp += 2;
            if (this.at.m == 0 && this.at.p == 0)
                return;
            var m = (this.at.m > 0), p = (this.at.p > 0);
            var x = (this.critical > rand(100) / 100);
            if (x)
                alert("Critical Hit!");
            var c = (x ? 2 : 1) * para;
            if (at_ed.sacred_shield > 0 && p) {
                at_ed.sacred_shield--;
                p = false;
            }
            if (at_ed.shield != 0 && p) {
                at_ed.shield = Math.max(0, at_ed.shield - Math.floor(this.at.p * c));
                p = false;
            }
            at_ed.harmed();
            if (p)
                at_ed.hp -= Math.floor(this.at.p * c);
            at_ed.hp -= this.at.m;
            if (this.hide)
                this.critical -= 0.1;
            this.hide = false;
            if (this.freezing && (m || p))
                freezing(at_ed);
            if (this.poisonous && p)
                poison(at_ed);
            if (this.self_destructive)
                this.alive = false;
            if (this.piercing && p) {
                var pr = ((this.id == 2) ? p1 : p2);
                at_ed.bleed++;
                if (at_ed != pr.that)
                    this.std_at(pr.that), this.atl++;
            }
            if (this.defrost && (m || p))
                defrost(this);
            if (!alive(at_ed))
                this.kill(at_ed);
        };
        this.attack = function (at) { this.std_at(at); };
        this.attacked = function (at) { this.std_ated(at); };
        this.appear = function () { return true; };
        this.death = new eventlist();
        this.end = new eventlist();
        this.harmed = function () { };
        this.to_ld = function () {
            return false;
        };
        this.exp = 0;
        this.value = this.ma * 5;
    }
}
function harm(c, n) {
    if (n.p > 0) {
        if (c.sacred_shield > 0) {
            c.sacred_shield--;
        }
        else if (c.shield != 0) {
            c.shield = Math.max(0, c.shield - n.p);
        }
        else {
            c.hp -= n.p;
        }
    }
    if (n.m > 0)
        c.hp -= n.m;
}
function freezing(c, n = 1) {
    if (n == 0)
        return;
    if (c.freezing)
        buff(c, new damage(0, n));
    else if (c.defrost && c.at.m > 0)
        buff(c, new damage(0, -1)), freezing(c, n - 1);
    else
        c.frozen += n, c.atl = 0;
}
function poison(c, n = 1) {
    if (c.poisonous)
        buff(c, new damage(0, n));
    else
        c.poisoned += n;
}
function hide(c) {
    c.hide = true;
    c.critical += 0.1;
}
function defrost(c) {
    c.hp -= Math.floor(c.frozen / 2);
    c.frozen = 0;
}
function _silence(c) {
    c.alive = false;
    c.death = new eventlist();
    c.revive = 0;
}
function silence(c, kill) {
    c.appear = function () { };
    c.death = new eventlist();
    c.revive = 0;
    if (kill) {
        c.alive = false;
        clean(p_(c));
        return;
    }
    var p = p_(c);
    c.atl = (c.atl > 0 ? 1 : 0);
    c.atn = 1;
    c.attack = c.std_at;
    c.attacked = c.std_ated;
    if (c.taunt)
        c.taunt = false, p.taunt--;
    c.hide = false;
    c.poisonous = false;
    c.r = range.GROUND;
    c.appear = function () { return true; };
    c.freezing = false;
    c.self_destructive = false;
    c.piercing = false;
    c.defrost = false;
    c.addictive = false;
    c.m = new map();
    c.m.set("rare", c.rare);
    c.critical = 0;
    if (c.status != "正常") {
        c.toggle();
    }
    c.can_t = false;
    c.toggle = function () { };
    c.const_attr = "";
    c.harmed = function () { };
    c.kill = function () { };
    c.end = new eventlist();
    for (let i in p.deck)
        buff(p.deck[i], c.atb, c.hpb, -1);
    c.atb = new damage(0);
    c.hpb = 0;
    p.hp -= c.hpb;
    p.at.p -= c.atb.p;
    p.at.m -= c.atb.m;
    p.ms -= c.ms;
    c.ms = 0;
    var c_ = dict(c.origin);
    c.at = c_.at;
    c.max_at = c_.max_at;
    c.hp = c_.hp + c.max_hp - c.hp;
    c.max_hp = c_.max_hp;
    c.ma = c_.ma;
    c.sacred_shield = c.shield = 0;
    clean(p);
}
function buff(c, at, hp = 0, n = 1) {
    c.at.m += at.m * n;
    c.at.p += at.p * n;
    c.max_at.m += at.m * n;
    c.max_at.p += at.p * n;
    c.at.m = Math.max(0, c.at.m);
    c.at.p = Math.max(0, c.at.p);
    c.max_at.m = Math.max(0, c.max_at.m);
    c.max_at.p = Math.max(0, c.max_at.p);
    c.max_hp += hp * n;
    c.hp += hp * n;
}
function ent(c) {
    c.can_t = true;
    c.toggle = function (c_) {
        if (this.status == "正常") {
            c_.status = "自爆";
            c_.at.m += c_.hp;
            c_.self_destructive = true;
        }
        else {
            c_.status = '正常';
            c_.at.m -= c_.hp;
            c_.self_destructive = false;
        }
    };
}
function dict(name) {
    var x;
    if (fs.ald)
        x = rarity.LEGENDARY;
    else
        x = rand_rare();
    function _dict(n) {
        var c;
        switch (n) {
            case "skeleton":
                var m = new map();
                m.set("type", Type.undead);
                m.set("revive", 1);
                c = new Creature(0, 1, new damage(1), 1, "骷髅", m, "复生(1)");
                c.to_ld = function (x) {
                    x.revive = 2;
                    x.c_attr = "复生(2)";
                    return true;
                };
                return c;
            case "s-slime":
                var m = new map();
                m.set("add", 1);
                return new Creature(0, 1, new damage(1), 1, "小史莱姆", m, "附结");
            case "spider":
                var m = new map();
                return new Creature(0, 3, new damage(3), 3, "蜘蛛", m);
            case "goblin":
                var m = new map();
                m.set("taunt", 1);
                var a = new Creature(0, 3, new damage(1), 2, "哥布林", m, "嘲讽");
                a.attack = function (at_ed) {
                    a.std_at(at_ed);
                    p_(a).money += Math.floor(at_ed.value / 2);
                };
                a.kill = function (at_ed) {
                    p_(a).money += Math.floor(at_ed.value / 2);
                };
                return a;
            case "barbarian":
                var m = new map();
                return new Creature(0, 4, new damage(2), 5, "野蛮人", m);
            case "X-bow":
                var m = new map();
                m.set("atn", 4);
                m.set("range", 1);
                m.set("type", Type.building);
                return new Creature(0, 6, new damage(1), 10, "X连弩", m, "超级风怒;远程;建筑");
            case "fetch": return new Magic(0, 3, "奥术智慧", "抓2张牌", function () {
                var p = ((id == 1) ? p1 : p2);
                var c = new_card(p);
                if (c == undefined)
                    return true;
                p.hand.push(c);
                var c = new_card(p);
                if (c == undefined)
                    return true;
                p.hand.push(c);
                return true;
            });
            case "hope": return new Magic(0, 2, "孕育希望", "法力上限+1", function () {
                var p = ((id == 1) ? p1 : p2);
                p.ma++;
                return true;
            });
            case "arrows":
                c = new Magic(0, 2, "万箭齐发", "对每个敌方生物造成1+点物理伤害", function () {
                    var pr = ((id == 2) ? p1 : p2);
                    var p = ((id == 1) ? p1 : p2);
                    pr.deck.forEach(e => { harm(e, new damage(1 + p.ms)); });
                    clean(pr);
                    return true;
                });
                c.to_ld = function (x) {
                    x.effect = function () {
                        var pr = ((id == 2) ? p1 : p2);
                        var p = ((id == 1) ? p1 : p2);
                        pr.deck.forEach(e => { harm(e, new damage(1 + p.ms)); });
                        clean(pr);
                        pr.deck.forEach(e => { harm(e, new damage(1 + p.ms)); });
                        clean(pr);
                        return true;
                    };
                    x.c_eff = "对每个敌方生物造成1+点物理伤害,重复一次";
                    return true;
                };
                return c;
            case "armor": return new Magic(0, 2, "戎装加身", "你的所有生物获得+1/+1", function () {
                var p = ((id == 1) ? p1 : p2);
                p.deck.forEach(e => { buff(e, new damage(1), 1); });
                return true;
            });
            case "fence":
                var m = new map();
                m.set("taunt", 1);
                m.set("atn", 0);
                return new Creature(0, 2, new damage(0), 4, "栅栏", m, "嘲讽,不能攻击");
            case "t_wall":
                var m = new map();
                m.set("taunt", 1);
                m.set("poison", 1);
                return new Creature(0, 3, new damage(0), 3, "荆墙", m, "嘲讽;剧毒");
            case "reap": return new Magic(2, 3, "斩杀", "摧毁一个最大生命<=3+的生物", function () {
                var n = parseInt(cmd[2]);
                if (n != 1 && n != 0) {
                    alert("Index out of range");
                    return false;
                }
                var pr = ((n == 0) ? p1 : p2);
                if (!cmd[3]) {
                    alert("Invalid parameter");
                    return false;
                }
                n = parseInt(cmd[3]);
                if (n >= pr.deck.length) {
                    alert("Index out of range");
                    return false;
                }
                var p = ((id == 1) ? p1 : p2);
                if (pr.deck[n].max_hp > 3 + p.ms) {
                    alert("Creature chosen doesn't satisfy requirements");
                    return false;
                }
                pr.deck[n].alive = false;
                clean(pr);
                return true;
            });
            case "squash": return new Magic(2, 3, "碾碎", "摧毁一个力量<=3的生物", function () {
                var n = parseInt(cmd[2]);
                if (n != 1 && n != 0) {
                    alert("Index out of range");
                    return false;
                }
                var pr = ((n == 0) ? p1 : p2);
                n = parseInt(cmd[3]);
                if (n >= pr.deck.length) {
                    alert("Index out of range");
                    return false;
                }
                if (pr.deck[n].at.p > 3) {
                    alert("Creature chosen doesn't satisfy requirements");
                    return false;
                }
                pr.deck[n].alive = false;
                clean(pr);
                return true;
            });
            case "p-spider":
                var m = new map();
                m.set("poison", 1);
                return new Creature(0, 4, new damage(2, 1), 3, "毒蜘蛛", m, "剧毒");
            case "archer":
                var m = new map();
                m.set("range", 1);
                c = new Creature(0, 2, new damage(1), 2, "弓箭手", m, "远程");
                ent(c);
                return c;
            case "shooter":
                var m = new map();
                m.set("range", 1);
                return new Creature(0, 4, new damage(3), 3, "火枪手", m, "远程");
            case "spear":
                var m = new map();
                m.set("range", 1);
                return new Creature(0, 2, new damage(2), 1, "哥布林投矛手", m, "远程");
            case "mouse":
                var m = new map();
                c = new Creature(0, 1, new damage(1), 1, "瘟疫鼠", m, "亡语:一个随机敌方生物获得-1/-1", "亡语:一个随机敌方生物获得-1/-1");
                c.death = new eventlist(Array(function (tar) {
                    tar.usd = true;
                    var pr = ((tar.id == 2) ? p1 : p2);
                    if (pr.deck.length == 0)
                        return;
                    var cd = random_el(pr.deck);
                    buff(cd, new damage(-1), -1);
                    clean(pr);
                }));
                c.to_ld = function (x) {
                    x.death = new eventlist(Array(function (tar) {
                        tar.usd = true;
                        var pr = ((tar.id == 2) ? p1 : p2);
                        if (pr.deck.length == 0)
                            return;
                        for (var i = 0; i < pr.deck.length; i++)
                            buff(pr.deck[i], new damage(-1), -1);
                        clean(pr);
                    }));
                    x.c_attr = x.const_attr = "亡语:所有敌方生物获得-1/-1";
                    return true;
                };
                return c;
            case "b-angel":
                var m = new map();
                m.set("range", 2);
                c = new Creature(2, 5, new damage(4), 4, "一号天使", m, "战吼:目标生物获得+1/+1;飞行");
                c.appear = function () {
                    if (cmd.length != 4 && cmd.length != 2) {
                        alert("Invalid parameter");
                        return false;
                    }
                    if (cmd.length == 2) {
                        return confirm("Are you sure that you do not need appear?");
                    }
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    if (!cmd[3]) {
                        alert("Invalid parameter");
                        return false;
                    }
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    buff(pr.deck[n], new damage(1), 1);
                    return true;
                };
                return c;
            case "m-slime":
                var m = new map();
                m.set("add", 1);
                c = new Creature(0, 3, new damage(2), 2, "中史莱姆", m, "亡语:召唤一个小史莱姆;附结", "亡语:召唤一个小史莱姆");
                c.death = new eventlist(Array(function (tar) {
                    var pr = ((tar.id == 1) ? p1 : p2);
                    tar.usd = true;
                    call(pr, dict("s-slime"));
                }));
                return c;
            case "l-slime":
                var m = new map();
                m.set("add", 1);
                m.set("taunt", 1);
                c = new Creature(0, 5, new damage(3), 3, "大史莱姆", m, "亡语:召唤一个中史莱姆;嘲讽;附结", "亡语:召唤一个中史莱姆");
                c.death = new eventlist(Array(function (tar) {
                    var pr = ((tar.id == 1) ? p1 : p2);
                    tar.usd = true;
                    call(pr, dict("m-slime"));
                }));
                return c;
            case "to_sheep":
                return new Magic(2, 4, "变羊术", "将一个生物变成一个1/1的羊", function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    if (!cmd[3]) {
                        alert("Invalid parameter");
                        return false;
                    }
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    _silence(pr.deck[n]);
                    clean(pr);
                    call(pr, dict("sheep"), n);
                    return true;
                });
            case "sheep":
                var m = new map();
                return new Creature(0, 1, new damage(1), 1, "羊", m);
            case "soldier":
                var m = new map();
                return new Creature(0, 1, new damage(1), 1, "士兵", m);
            case "fireball":
                return new Magic(1, 5, "火球", "对一个单位造成5+点伤害并解冻它", function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    var p = ((id == 1) ? p1 : p2);
                    if (!isInt(cmd[3]) && cmd[3] != undefined) {
                        alert("Invalid parameter");
                        return false;
                    }
                    var c;
                    if (cmd[3] == undefined) {
                        c = pr.that;
                    }
                    else {
                        n = parseInt(cmd[3]);
                        if (n >= pr.deck.length) {
                            alert("Index out of range");
                            return false;
                        }
                        c = pr.deck[n];
                    }
                    harm(c, new damage(0, 5 + p.ms));
                    defrost(c);
                    clean(pr);
                    return true;
                });
            case "frozen":
                return new Magic(1, 4, "冰冻法术", "冻结一个生物(2)及它的相邻生物", function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    if (!cmd[3]) {
                        freezing(pr.that, 2);
                        return true;
                    }
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    freezing(pr.deck[n], 2);
                    if (n >= 1)
                        freezing(pr.deck[n - 1], 1);
                    if (n < pr.deck.length - 1)
                        freezing(pr.deck[n + 1], 1);
                    return true;
                });
            case "poison":
                return new Magic(1, 4, "毒药法术", "使一个生物(2)及它的相邻生物获得中毒", function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    if (!cmd[3]) {
                        poison(pr.that, 2);
                        return true;
                    }
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    poison(pr.deck[n], 2);
                    if (n >= 1)
                        poison(pr.deck[n - 1], 1);
                    if (n < pr.deck.length - 1)
                        poison(pr.deck[n + 1], 1);
                    clean(pr);
                    return true;
                });
            case "flame":
                return new Magic(1, 3, "净焰投掷", "对一个单位造成3+点伤害并解冻它", function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    if (!isInt(cmd[3]) && cmd[3] != undefined) {
                        alert("Invalid parameter");
                        return false;
                    }
                    var c;
                    if (cmd[3] == undefined) {
                        c = pr.that;
                    }
                    else {
                        n = parseInt(cmd[3]);
                        if (n >= pr.deck.length) {
                            alert("Index out of range");
                            return false;
                        }
                        c = pr.deck[n];
                    }
                    var p = ((id == 1) ? p1 : p2);
                    harm(c, new damage(0, 3 + p.ms));
                    defrost(c);
                    clean(pr);
                    return true;
                });
            case "rand":
                return new Magic(0, 4, "随机", "将一张随机卡牌置入你的手牌并使它的法力消耗变为0", function () {
                    var p = ((id == 1) ? p1 : p2);
                    var c = new Card(dict(random_el(card_dict)));
                    c.value.ma = 0;
                    p.hand.push(c);
                    return true;
                });
            case "f-element":
                var m = new map();
                m.set("defrost", 1);
                m.set("type", Type.element);
                c = new Creature(0, 2, new damage(0, 2), 2, "火元素", m, "解冻目标");
                ent(c);
                return c;
            case "i-element":
                var m = new map();
                m.set("freezing", 1);
                m.set("type", Type.element);
                c = new Creature(0, 2, new damage(0, 1), 3, "冰元素", m, "冻结目标");
                ent(c);
                return c;
            case "m-element":
                var m = new map();
                m.set("p", 1);
                m.set("type", Type.element);
                return new Creature(0, 3, new damage(3), 2, "金元素", m, "穿透");
            case "wi-element":
                var m = new map();
                m.set('atn', 2);
                m.set("charge", 1);
                m.set("type", Type.element);
                return new Creature(0, 3, new damage(1), 2, "风元素", m, "冲锋;风怒");
            case "gravity":
                return new Magic(0, 4, "重力反转", "使所有飞行生物变为近战，非飞行生物变为飞行", function () {
                    p1.deck.forEach(function (e) { if (e.r == range.FLYING) {
                        e.r = range.GROUND, e.m.set("range", 0);
                    }
                    else {
                        e.r = range.FLYING, e.m.set("range", 2);
                    } });
                    p2.deck.forEach(function (e) { if (e.r == range.FLYING) {
                        e.r = range.GROUND, e.m.set("range", 0);
                    }
                    else {
                        e.r = range.FLYING, e.m.set("range", 2);
                    } });
                    return true;
                });
            case "m-b":
                return new Magic(0, 0, "魔法球", "你的法力+1", function () {
                    var p = ((id == 1) ? p1 : p2);
                    p.m++;
                    return true;
                });
            case "drugI":
                return new Magic(0, 2, "力量药剂", "使你的英雄获得+1力量", function () {
                    var p = ((id == 1) ? p1 : p2);
                    buff(p.that, new damage(1));
                    return true;
                });
            case "drugIII":
                c = new Magic(0, 2, "魔力药剂", "使你的英雄获得1法强", function () {
                    var p = ((id == 1) ? p1 : p2);
                    p.ms++;
                    if (rarity.LEGENDARY == this.rare)
                        buff(p.that, new damage(0, 1));
                    return true;
                });
                c.to_ld = function (x) {
                    x.c_eff += "并获得1魔法伤害";
                    return true;
                };
                return c;
            case "clone":
                c = new Magic(2, 4, "克隆法术", "召唤目标生物的1/1复制", function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    var p = ((id == 1) ? p1 : p2);
                    if (!isInt(cmd[3])) {
                        alert("Invalid parameter");
                        return false;
                    }
                    n = parseInt(cmd[3]);
                    var c = pr.deck[n];
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    var m = new map(c.m);
                    m.set("charge", 1);
                    var d = new damage(0);
                    if (c.at.m > c.at.p)
                        d.m = 1;
                    else
                        d.p = 1;
                    var c1 = deepcopy(c);
                    if (rarity.LEGENDARY != this.rare) {
                        c1.at = d;
                        c1.hp = 1;
                    }
                    c1.id = id;
                    call(p, c1);
                    return true;
                });
                c.to_ld = function (x) {
                    x.c_eff = "召唤目标生物的复制";
                    return true;
                };
                return c;
            case "sniper":
                var m = new map();
                m.set("range", 1);
                m.set("hide", true);
                c = new Creature(0, 4, new damage(5), 2, "狙击手", m, "远程;隐匿");
                c.to_ld = function (x) {
                    x.c_attr += ";暴击(50);穿透";
                    x.piercing = true;
                    x.critical += 0.5;
                    return true;
                };
                return c;
            case "drugII":
                return new Magic(1, 2, "治疗药剂", "使目标恢复2+点生命", function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    var p = ((id == 1) ? p1 : p2);
                    if (!isInt(cmd[3]) && cmd[3] != undefined) {
                        alert("Invalid parameter");
                        return false;
                    }
                    if (cmd[3] == undefined) {
                        cure(pr.that, 2 + p.ms);
                        return true;
                    }
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    cure(pr.deck[n], 2 + p.ms);
                    return true;
                });
            case "snake":
                var m = new map();
                m.set("poison", 1);
                m.set("add", 1);
                return new Creature(0, 2, new damage(1), 1, "蛇", m, "附结;剧毒");
            case "guard":
                var m = new map();
                m.set("type", Type.undead);
                m.set("shield", 2);
                c = new Creature(0, 2, new damage(1), 1, "骷髅守卫", m);
                c.to_ld = function (x) {
                    x.c_attr += "圣盾(1);嘲讽";
                    x.taunt = true;
                    x.sacred_shield += 1;
                    return true;
                };
                return c;
            case "poisonous":
                return new Magic(2, 3, "武器淬毒", "如果目标生物不具剧毒,使它获得剧毒,否则使它获得+1攻击力", function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    if (pr.deck[n].poisonous)
                        buff(pr.deck[n], new damage(0, 1));
                    else
                        pr.deck[n].poisonous = true, pr.deck[n].m.set("poison", 1);
                    return true;
                });
            case "piercing":
                return new Magic(2, 4, "武器锐化", "目标生物获得穿透且使它获得+1攻击力", function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    pr.deck[n].m.set("p", 1);
                    pr.deck[n].piercing = true;
                    buff(pr.deck[n], new damage(1));
                    return true;
                });
            case "kill":
                return new Magic(2, 5, "影袭", "消灭目标生物", function () {
                    var n = parseInt(cmd[2]);
                    var pr = ((n == 0) ? p1 : p2);
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    pr.deck[n].alive = false;
                    clean(pr);
                    return true;
                });
            case "pain":
                c = new Magic(2, 5, "痛苦转化", "对目标生物造成4+点伤害,你回复4+点生命", function () {
                    var n = parseInt(cmd[2]);
                    var pr = ((n == 0) ? p1 : p2);
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    var p = ((id == 1) ? p1 : p2);
                    harm(pr.deck[n], new damage(0, 4 + p.ms));
                    cure(p.that, 4 + p.ms);
                    clean(pr);
                    return true;
                });
                c.to_ld = function (x) {
                    x.c_eff = "消灭目标随从，你回复其最大生命值+点生命";
                    x.effect = function () {
                        var n = parseInt(cmd[2]);
                        var pr = ((n == 0) ? p1 : p2);
                        n = parseInt(cmd[3]);
                        if (n >= pr.deck.length) {
                            alert("Index out of range");
                            return false;
                        }
                        var p = ((id == 1) ? p1 : p2);
                        pr.deck[n].alive = false;
                        cure(p.that, pr.deck[n].max_hp + p.ms);
                        clean(pr);
                        return true;
                    };
                    return true;
                };
                return c;
            case "spill":
                var m = new map();
                c = new Creature(0, 1, new damage(0, 2), 1, "溅射焰团", m, "亡语:随机对对手的一个生物造成1点伤害", "亡语:随机对对手的一个生物造成1点伤害");
                c.death = new eventlist(Array(function (tar) {
                    tar.usd = true;
                    var pr = ((tar.id == 2) ? p1 : p2);
                    if (pr.deck.length == 0)
                        return;
                    var cd = random_el(pr.deck);
                    harm(cd, new damage(0, 1));
                    clean(pr);
                }));
                c.to_ld = function (x) {
                    x.death = new eventlist(Array(function (tar) {
                        tar.usd = true;
                        var pr = ((tar.id == 2) ? p1 : p2);
                        if (pr.deck.length == 0)
                            return;
                        for (var i = 0; i < pr.deck.length; i++)
                            harm(pr.deck[i], new damage(0, 1));
                        ;
                        clean(pr);
                    }));
                    x.c_attr = x.const_attr = "亡语:对所有敌方生物造成1点伤害";
                };
                ent(c);
                return c;
            case "mind": return new Magic(0, 2, "心灵震爆", "对对手造成5+点伤害", () => (harm((id == 1 ? p2 : p1).that, new damage(0, 5 + ((id == 1) ? p1 : p2).ms)), true));
            case "blast":
                return new Magic(1, 10, "炎爆术", "对一个单位造成10+点伤害并解冻它", function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    if (!isInt(cmd[3]) && cmd[3] != undefined) {
                        alert("Invalid parameter");
                        return false;
                    }
                    var c;
                    if (cmd[3] == undefined) {
                        c = pr.that;
                    }
                    else {
                        n = parseInt(cmd[3]);
                        if (n >= pr.deck.length) {
                            alert("Index out of range");
                            return false;
                        }
                        c = pr.deck[n];
                    }
                    var p = ((id == 1) ? p1 : p2);
                    harm(c, new damage(0, 10 + p.ms));
                    defrost(c);
                    clean(pr);
                    return true;
                });
            case "true-shield":
                var ma = new Magic(2, 0, "真言术·盾", "使一个生物获得+2+生命", function () { });
                ma.effect = function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    var p = ((id == 1) ? p1 : p2);
                    buff(pr.deck[n], new damage(0), 2 + p.ms);
                    if (rarity.LEGENDARY == this.rare)
                        pr.deck[n].shield += 2 + p.ms;
                    return true;
                }.bind(ma);
                ma.to_ld = function (x) {
                    x.c_eff += "并获得2+护盾";
                    return true;
                };
                return ma;
            case "destroy":
                return new Magic(2, 3, "暗言术·灭", "摧毁一个力量>=5的生物", function () {
                    var n = parseInt(cmd[2]);
                    var pr = ((n == 0) ? p1 : p2);
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    if (pr.deck[n].at.p < 5) {
                        alert("Creature chosen doesn't satisfy requirements");
                        return false;
                    }
                    pr.deck[n].alive = false;
                    clean(pr);
                    return true;
                });
            case "defense":
                c = new Magic(1, 2, "防御姿态", "使目标获得3+点护盾", function () {
                    var n = parseInt(cmd[2]);
                    var pr = ((n == 0) ? p1 : p2);
                    if (!isInt(cmd[3]) && cmd[3] != undefined) {
                        alert("Invalid parameter");
                        return false;
                    }
                    var p = ((id == 1) ? p1 : p2);
                    if (cmd[3] == undefined) {
                        pr.that.shield += 3 + p.ms;
                        return true;
                    }
                    n = parseInt(cmd[3]);
                    pr.deck[n].shield += 3 + p.ms;
                    return true;
                });
                c.to_ld = function (x) {
                    x.c_eff = "使目标生物获得1层圣盾";
                    x.effect = function () {
                        var n = parseInt(cmd[2]);
                        var pr = ((n == 0) ? p1 : p2);
                        if (!isInt(cmd[3])) {
                            alert("Invalid parameter");
                            return false;
                        }
                        n = parseInt(cmd[3]);
                        pr.deck[n].sacred_shield++;
                        return true;
                    };
                    return true;
                };
                return c;
            case "shotgun":
                var m = new map();
                m.set("range");
                var a = new Creature(0, 5, new damage(4), 3, "霰弹枪手", m, "伤害溅射", "伤害溅射");
                a.attack = function (at_ed) {
                    var pr = ((id == 2) ? p1 : p2);
                    a.std_at(at_ed);
                    if (pr.that == at_ed)
                        return;
                    var n = parseInt(cmd[2]);
                    if (n >= 1)
                        a.std_at(pr.deck[n - 1], 0.5), a.atl++;
                    if (n < pr.deck.length - 1)
                        a.std_at(pr.deck[n + 1], 0.5), a.atl++;
                };
                return a;
            case "ex1":
                var m = new map();
                x = rarity.LEGENDARY;
                m.set("s-shield", 1);
                var a = new Creature(0, 5, new damage(0), 1, "实验体I", m, "圣盾;当受到战斗伤害时,获得+1/+1和圣盾", "当受到战斗伤害时,获得+1/+1和圣盾");
                a.harmed = () => (buff(a, new damage(1), 1), a.sacred_shield++);
                return a;
            case "zombie":
                var m = new map();
                var a = new Creature(0, 4, new damage(2), 5, "母体", m, "当完成击杀时,50%概率使目标变为我方僵尸", "当完成击杀时,50%概率使目标变为我方僵尸");
                a.kill = function (tar) {
                    a.std_kill(tar);
                    if (tar.type == Type.building)
                        return;
                    var p = ((this.id == 1) ? p1 : p2);
                    if (rarity.LEGENDARY == this.rare || Math.random() >= 0.5) {
                        var y = new Creature(0, tar.ma, tar.max_at, tar.max_hp, "僵尸", new map(), "亡语:对敌方英雄造成1点魔法伤害", "亡语:对敌方英雄造成1点魔法伤害");
                        y.death = new eventlist([function (tar) {
                                harm(pr_(tar).that, new damage(0, 1));
                            }]);
                        call(p, y);
                    }
                };
                a.to_ld = function (x) {
                    x.c_attr = x.const_attr = "当完成击杀时使目标变为我方僵尸";
                    return true;
                };
                return a;
            case "tomb":
                var m = new map();
                m.set("atn", 0);
                m.set("type", Type.building);
                var a = new Creature(0, 4, new damage(0), 5, "骷髅墓碑", m, "回合结束时，召唤1个骷髅;亡语:召唤3个骷髅", "回合结束时，召唤1个骷髅;亡语:召唤3个骷髅");
                a.end = new eventlist([function (c) {
                        var p = ((c.id == 1) ? p1 : p2);
                        call(p, dict("skeleton"));
                    }]);
                a.death = new eventlist([function (c) {
                        var p = ((c.id == 1) ? p1 : p2);
                        call(p, dict("skeleton"));
                        call(p, dict("skeleton"));
                        call(p, dict("skeleton"));
                    }]);
                return a;
            case "wi-doc":
                var m = new map();
                var a = new Creature(2, 1, new damage(2), 1, "巫医", m, "战吼:为目标回复2点血量");
                a.appear = function () {
                    if (cmd.length != 4 && cmd.length != 3) {
                        alert("Invalid parameter");
                        return false;
                    }
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    if (!cmd[3]) {
                        cure(pr.that, 2);
                        return true;
                    }
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    cure(pr.deck[n], 2);
                    return true;
                };
                return a;
            case "bomb-man":
                var m = new map();
                m.set("type", Type.undead);
                m.set("range");
                var a = new Creature(0, 3, new damage(2, 1), 2, "炸弹兵", m, "伤害溅射", "伤害溅射");
                a.attack = function (at_ed) {
                    var pr = ((id == 2) ? p1 : p2);
                    a.std_at(at_ed);
                    if (pr.that == at_ed)
                        return;
                    var n = parseInt(cmd[2]);
                    if (n >= 1)
                        a.std_at(pr.deck[n - 1], 0.5), a.atl++;
                    if (n < pr.deck.length - 1)
                        a.std_at(pr.deck[n + 1], 0.5), a.atl++;
                };
                ent(a);
                return a;
            case "ma-exp":
                return new Magic(0, 3, "魔爆术", "对每个敌方生物造成1+点魔法伤害", function () {
                    var pr = ((id == 2) ? p1 : p2);
                    var p = ((id == 1) ? p1 : p2);
                    pr.deck.forEach(e => { harm(e, new damage(0, 1 + p.ms)); });
                    clean(pr);
                    return true;
                });
            case "b-cat":
                var m = new map();
                m.set("revive", 8);
                m.set("ms", 1);
                var a = new Creature(0, 5, new damage(1), 1, "黑猫", m, "复生(8),法强+1");
                return a;
            case "hxbs":
                var m = new map();
                m.set("range");
                var a = new Creature(0, 4, new damage(2), 3, "回旋镖手", m, "攻击时会造成2次伤害", "攻击时会造成2次伤害");
                a.attack = function (at_ed) {
                    a.std_at(at_ed);
                    a.std_at(at_ed);
                    a.atl++;
                };
                return a;
            case "su-base":
                var m = new map();
                m.set("type", Type.summon);
                return new Creature(0, 2, new damage(2), 2, "标准型召唤兽", m);
            case "su-defense":
                var m = new map();
                m.set("taunt", 1);
                m.set("type", Type.summon);
                return new Creature(0, 2, new damage(1), 3, "防御型召唤兽", m);
            case "su-attack":
                var m = new map();
                m.set("charge", 1);
                m.set("type", Type.summon);
                return new Creature(0, 2, new damage(3), 1, "攻击型召唤兽", m);
            case "su-magic":
                var m = new map();
                m.set("ms", 1);
                m.set("type", Type.summon);
                return new Creature(0, 2, new damage(0, 1), 1, "法术型召唤兽", m);
            case "su-buff":
                var m = new map();
                m.set("atb", new damage(1));
                m.set("hpb", 1);
                m.set("type", Type.summon);
                return new Creature(0, 2, new damage(1), 2, "增益型召唤兽", m);
            case "whip":
                return new Magic(2, 1, "鞭策", "对一个生物造成1+点伤害,如果它是召唤兽,使它攻击力+1+", function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    var p = ((id == 1) ? p1 : p2);
                    if (!isInt(cmd[3]) && cmd[3] != undefined) {
                        alert("Invalid parameter");
                        return false;
                    }
                    var c;
                    n = parseInt(cmd[3]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    c = pr.deck[n];
                    harm(c, new damage(0, 1 + p.ms));
                    if (Type.summon == c.type)
                        c.at.p += 1 + p.ms;
                    clean(pr);
                    return true;
                });
            case "space":
                c = new Magic(0, 8, "扭曲虚空", "沉默并消灭所有生物", function () {
                    p1.deck.forEach(function (c) { _silence(c); });
                    p2.deck.forEach(function (c) { _silence(c); });
                    if (this.rare == rarity.LEGENDARY) {
                        if (id == 1)
                            fs.space.v1 = true;
                        else
                            fs.space.v2 = true;
                    }
                    clean(p1);
                    clean(p2);
                    return true;
                });
                c.to_ld = function (x) {
                    x.c_eff = "直到你的下个回合开始时,沉默并消灭所有生物";
                    return true;
                };
                return c;
            case "smoke":
                return new Magic(2, 4, "烟雾弹", "使一个随从及其相邻随从获得隐匿", function () {
                    var n = parseInt(cmd[2]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var p = p_(n + 1);
                    if (!isInt(cmd[3]) && cmd[3] != undefined) {
                        alert("Invalid parameter");
                        return false;
                    }
                    n = parseInt(cmd[3]);
                    if (n >= p.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    adj(parseInt(cmd[2]) + 1, n).forEach(function (c) { hide(c); });
                    return true;
                });
            case "ma-element":
                var m = new map();
                m.set("ms", 1);
                m.set("type", Type.element);
                return new Creature(0, 2, new damage(0, 1), 1, "魔力元素", m, "法强+1");
            case "magic":
                var m = new map();
                m.set("ms", 1);
                m.set("range");
                return new Creature(0, 5, new damage(0, 3), 3, "法师", m, "法强+1;远程");
        }
        return null;
    }
    var x1 = _dict(name);
    x1.rare = x;
    if (x == rarity.LEGENDARY)
        x1.to_ld(x1);
    x1.origin = name;
    return x1;
}
function to_ld(c) {
    if (c.rare == rarity.LEGENDARY)
        return;
    c.to_ld(c);
    c.value = Math.floor(c.value * 1.5);
    c.rare = rarity.LEGENDARY;
}
function cure(c, n = 0) {
    c.hp += n;
    c.hp = Math.min(c.hp, c.max_hp);
    c.poisoned = 0;
    c.bleed = 0;
}
function _status(c) {
    var s = "";
    function add(a, cb, color) {
        if (a == 0)
            return;
        if (s != "")
            s += ";";
        s += "<font color=\"" + color + "\">" + cb + "(" + a.toString() + ")" + "</font>";
    }
    add(c.frozen, "冻结", "#00e");
    add(c.poisoned, "中毒", "#0e0");
    add(c.bleed, "流血", "#e00");
    return s;
}
function attr(c) {
    var s = "";
    function add(a, cb) {
        if (!a)
            return;
        if (s != "")
            s += ";";
        s += cb;
    }
    add(c.atn == 2, "风怒");
    add(c.atn == 4, "超级风怒");
    add(c.taunt == true, "嘲讽");
    add(c.poisonous, "剧毒");
    add(c.r == range.FLYING, "飞行");
    add(c.r == range.RANGED, "远程");
    add(c.r == range.FAKE_RANGED, "伪远程");
    add(c.freezing, "极寒之力");
    add(c.self_destructive, "攻击后自毁");
    add(c.piercing, "穿透");
    add(c.defrost, "解冻目标");
    add(c.hide, "隐匿");
    add(c.ms > 0, "法强+" + c.ms.toString());
    add(c.sacred_shield > 0, "圣盾(" + c.sacred_shield.toString() + ")");
    add(c.revive > 0, "复生(" + c.revive.toString() + ")");
    add(c.critical != 0, "暴击(" + ((c.critical * 100).toString()) + ")");
    add(c.atb.p > 0 || c.atb.m > 0 || c.hpb > 0, "你的其他生物获得+(" + c.atb.tostring() + ")+" + c.hpb.toString());
    return s;
}
function skill_dict(name) {
    switch (name) {
        case "":
        case "null":
        case "no":
            var m = new map();
            m.set("charge", 1);
            return [new Skill(0, 0, function () { return true; }, "一无所长", "什么也不做"), new Creature(0, 0, new damage(1), 30, "无职业者", new map())];
        case "knight":
            return [new Skill(0, 2, function () {
                    var p = ((id == 1) ? p1 : p2);
                    ++p.x;
                    var c = dict("soldier");
                    buff(c, new damage(0, Math.floor(p.x / 3)), Math.floor(p.x / 3));
                    call(p, c);
                    return true;
                }, "召唤", "将一个1/1的士兵置入战场", "每召唤3个士兵,使之后召唤的士兵获得+1/+1"), new Creature(0, 0, new damage(1), 30, "圣骑士", new map())];
        case "magic":
            var m = new map();
            m.set("range", 1);
            return [new Skill(1, 2, function () {
                    var n = parseInt(cmd[1]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    if (!isInt(cmd[2]) && cmd[2] != undefined) {
                        alert("Invalid parameter");
                        return false;
                    }
                    var c;
                    if (cmd[2] == undefined) {
                        c = pr.that;
                    }
                    else {
                        n = parseInt(cmd[2]);
                        if (n >= pr.deck.length) {
                            alert("Index out of range");
                            return false;
                        }
                        c = pr.deck[n];
                    }
                    var p = ((id == 1) ? p1 : p2);
                    harm(c, new damage(0, 1 + p.ms));
                    defrost(c);
                    clean(pr);
                    return true;
                }, "小火球", "对目标造成1+点伤害", "法强+1"), new Creature(0, 0, new damage(0, 1), 30, "法师", m), 1];
        case "attacher":
            return [new Skill(0, 2, function () {
                    var p = ((id == 1) ? p1 : p2);
                    p.hand.forEach(e => {
                        if (e.value instanceof Creature)
                            e.value.addictive = true;
                    });
                    return true;
                }, "附结", "使你的所有生物手牌获得附结"), new Creature(0, 0, new damage(1), 30, "附结者", new map())];
        case "doc":
            var m = new map();
            m.set("range", 1);
            return [new Skill(1, 2, function () {
                    var n = parseInt(cmd[1]);
                    if (n != 1 && n != 0) {
                        alert("Index out of range");
                        return false;
                    }
                    var pr = ((n == 0) ? p1 : p2);
                    if (!isInt(cmd[2]) && cmd[2] != undefined) {
                        alert("Invalid parameter");
                        return false;
                    }
                    if (cmd[2] == undefined) {
                        cure(pr.that, 2);
                        return true;
                    }
                    n = parseInt(cmd[2]);
                    if (n >= pr.deck.length) {
                        alert("Index out of range");
                        return false;
                    }
                    var p = ((id == 1) ? p1 : p2);
                    cure(pr.deck[n], 2 + p.ms);
                    clean(pr);
                    return true;
                }, "治疗", "目标恢复2+点生命"), new Creature(0, 0, new damage(0, 1), 30, "牧师", m)];
        case "suck":
            return [new Skill(0, 2, function () {
                    var p = ((id == 1) ? p1 : p2);
                    p.that.hp -= 2;
                    var c = new_card(p);
                    c.value.ma = Math.max(0, c.value.ma - 4);
                    if (c == undefined)
                        return true;
                    p.hand.push(c);
                    return true;
                }, "生命分流", "抓1张牌并使其法力消耗-4,对你造成2点伤害"), new Creature(0, 0, new damage(0, 1), 30, "术士", new map())];
        case "summon":
            return [new Skill(0, 2, function () {
                    var p = p_(id);
                    call(p, dict(random_el(summon)));
                    return true;
                }, "召唤", "随机召唤一个召唤兽"), new Creature(0, 0, new damage(0), 30, "召唤师", new map())];
    }
}
class Player {
    constructor(j) {
        var m = new map();
        m.set("charge", 1);
        this.that = new Creature(0, 0, new damage(1), 50, "英雄", m);
        this.hand = [];
        this.x = 0;
        this.at = new damage(0);
        this.hp = 0;
        this.pile = [];
        this.cnt = 0;
        this.deck = [];
        this.taunt = 0;
        this.ma = 1;
        this.m = 1;
        this.id = j;
        this.s = undefined;
        this.ms = 0;
        this.money = 0;
    }
}
function call(p, c, n) {
    if (!c.appear())
        return false;
    if (fs.space.or())
        return true;
    c.id = p.id;
    buff(c, p.at, p.hp);
    for (let i in p.deck)
        buff(p.deck[i], c.atb, c.hpb);
    if (n == undefined)
        p.deck.push(c);
    else
        p.deck.splice(n, 0, c);
    if (c.taunt)
        p.taunt++;
    p.ms += c.ms;
    p.at.m += c.atb.m;
    p.at.p += c.atb.p;
    p.hp += c.hpb;
    return true;
}
function new_card(p) {
    if (p.pile.length == 0) {
        p.that.hp -= (++p.cnt);
        return;
    }
    var c = random_el(p.pile);
    p.pile.splice(p.pile.indexOf(c), 1);
    return c;
}
function new_turn(p) {
    if (p.ma < 10)
        p.ma++;
    if (id == 1) {
        fs.space.v1 = false;
    }
    else {
        fs.space.v2 = false;
    }
    p.m = p.ma;
    p.deck.forEach(e => {
        if (e.frozen == 0)
            e.atl = e.atn;
        else
            e.atl = 0, e.frozen--;
    });
    var e = p.that;
    if (e.frozen == 0)
        e.atl = e.atn;
    else
        e.atl = 0, e.frozen--;
    var c = new_card(p);
    if (c == undefined)
        return;
    p.hand.push(c);
}
function end_turn(p) {
    function check(e) {
        if (e.poisoned > 0)
            e.hp--;
        e.hp -= e.bleed;
        if (e.type == Type.building)
            e.hp--;
        e.end.run(e);
    }
    p.money += 5;
    p.deck.forEach(e => { check(e); });
    check(p.that);
    clean(p);
}
var p1 = new Player(1), p2 = new Player(2), id = 1;
function p_(x) {
    if (x instanceof Creature)
        x = x.id;
    return (x == 1) ? p1 : p2;
}
function adj(id, n) {
    var p = p_(id);
    var res = [p.deck[n]];
    if (n > 0)
        res.push(p.deck[n - 1]);
    if (n < p.deck.length - 1)
        res.push(p.deck[n + 1]);
    return res;
}
function pr_(x) {
    if (x instanceof Creature)
        x = x.id;
    return (x == 1) ? p2 : p1;
}
function isInt(str) {
    var num = /^[0-9]+$/;
    return num.test(str);
}
function alive(c) {
    var a = c.alive && c.poisoned < 3 && c.hp > 0;
    if (!a && c.revive > 0 && c.max_hp > 0) {
        c.revive--;
        c.hp = 1;
        cure(c, 0);
        c.alive = true;
        return true;
    }
    return a;
}
function clean(p) {
    for (var id = 0; id < p.deck.length; id++)
        if (!alive(p.deck[id])) {
            if (!p.deck[id].usd)
                p.deck[id].death.run(p.deck[id]);
            if (p.deck[id].taunt)
                p.taunt--;
            p.ms -= p.deck[id].ms;
            var c = p.deck[id];
            for (let i in p.deck)
                buff(p.deck[i], c.atb, c.hpb, -1);
            p.hp -= c.hpb;
            p.at.p -= c.atb.p;
            p.at.m -= c.atb.m;
            p.deck.splice(id, 1);
            id = -1;
        }
}
function random_el(arr) {
    return arr[rand(arr.length - 1)];
}
function str(c, a, id, can_at) {
    var r = document.createElement("div");
    r.id = id;
    r.className = (a ? "creature" : "unable");
    r.setAttribute("can", can_at.toString());
    r.setAttribute("rare", c.rare.toString());
    var temp = document.createElement("div");
    temp.className = "cname";
    temp.innerText = c.c_name + "(" + T[c.type] + ")" + "(" + c.status + ")(" + c.exp + "/" + Max_Exp + ")";
    r.appendChild(temp);
    r.appendChild(document.createTextNode(c.at.tostring() + "(" + c.max_at.tostring() + ")/" + c.hp.toString() + "(" + c.max_hp + ")" + (c.shield ? "+" + c.shield.toString() : "")));
    r.appendChild(document.createElement("br"));
    temp = document.createElement("div");
    if (c.frozen > 0) {
        temp.className = "frozen";
        temp.innerText = "0";
    }
    else if (c.atl == 0) {
        temp.className = "warn";
        temp.innerText = "0";
    }
    else
        temp.innerText = c.atl.toString();
    r.appendChild(temp);
    temp = document.createElement("div");
    temp.className = "attr";
    temp.innerText = attr(c) + ";" + c.const_attr;
    var t = document.createElement("div");
    t.innerHTML = "Status:" + _status(c);
    temp.appendChild(t);
    r.appendChild(temp);
    if (c.can_t && id[0] == window.id.toString()) {
        var j = document.createElement("button");
        j.innerHTML = 'toggle';
        j.onclick = function () { c.toggle(c), repaint(), _event(); };
        r.appendChild(j);
    }
    if (c.exp >= Max_Exp && c.rare != rarity.LEGENDARY && window.id.toString() == id[0]) {
        var j = document.createElement("button");
        j.innerHTML = "Upgrade";
        j.onclick = function () { to_ld(c), c.exp -= Max_Exp, repaint(), _event(); };
        r.appendChild(j);
    }
    return r;
}
var gl = [];
function goods(c, id) {
    var temp = document.createElement("div"), t = document.createElement("div");
    temp.className = "goods";
    temp.id = id.toString();
    t.className = "cn";
    t.innerHTML = c.c_name + "(<span style='color:goldenrod;'>" + c.value + "</span>)<br>";
    temp.appendChild(t);
    temp.appendChild(document.createTextNode(c.at.tostring() + "/" + c.hp.toString() + (c.shield ? "+" + c.shield.toString() : "")));
    temp.appendChild(document.createElement("br"));
    t = document.createElement("div");
    t.className = "attr";
    t.innerText = c.c_attr;
    temp.appendChild(t);
    if (p_(window.id).money >= c.value) {
        var j = document.createElement("button");
        j.innerHTML = 'purchase';
        c.ma = 0;
        j.onclick = function () { p_(window.id).money -= c.value, p_(window.id).hand.push(new Card(c)), gl.splice(id, 1), repaint(), _event(); };
        temp.appendChild(j);
    }
    return temp;
}
function rt(m) {
    var r = document.createElement("div"), t = refresh();
    r.className = "mn";
    r.setAttribute("rare", m.rare.toString());
    r.innerText = m.c_name + "(" + m.ma + ")";
    t.appendChild(r);
    t.appendChild(document.createTextNode(m.c_eff));
    t.appendChild(document.createElement("br"));
    return t;
}
function s(c, b, id) {
    var temp = document.createElement("div");
    temp.className = (b ? "card" : "unusable");
    temp.id = id;
    temp.setAttribute("rare", c.value.rare.toString());
    if (c.value instanceof Creature) {
        var t = document.createElement("div");
        t.className = "cn";
        t.innerText = c.value.c_name + "(" + c.value.ma.toString() + ")";
        temp.appendChild(t);
        temp.appendChild(document.createTextNode(c.value.at.tostring() + "/" + c.value.hp.toString() + (c.value.shield ? "+" + c.value.shield.toString() : "")));
        temp.appendChild(document.createElement("br"));
        t = document.createElement("div");
        t.className = "attr";
        t.innerText = c.value.c_attr;
        temp.appendChild(t);
    }
    else {
        temp.appendChild(rt(c.value));
    }
    return temp;
}
function skill(s, id) {
    var temp = document.createElement("div"), t = document.createElement("div");
    temp.className = "skill";
    temp.id = id;
    t.className = "sname";
    t.innerText = s.c_name + "(" + s.cost.toString() + ")";
    temp.appendChild(t);
    temp.appendChild(document.createTextNode(s.c_ee));
    temp.appendChild(document.createElement("br"));
    temp.appendChild(document.createTextNode("被动:" + s.cn_));
    temp.appendChild(br());
    return temp;
}
function refresh() { return document.createElement("div"); }
function br() { return document.createElement("br"); }
function to_str(p) {
    var temp = document.createElement("div"), t = document.createElement("div"), j = refresh();
    t.className = (p.id == id ? "warn" : "");
    t.innerText = p.that.c_name;
    temp.appendChild(t);
    t = refresh();
    t.className = (p.pile.length == 0 ? "warn" : "");
    t.innerText = p.pile.length.toString();
    temp.appendChild(t);
    t = refresh();
    t.innerHTML = p.m.toString() + "/" + p.ma.toString() + "(<span style='color:goldenrod;'>" + p.money + "</span>)<br>";
    temp.appendChild(t);
    t = refresh();
    t.className = "creature";
    t.id = p.id.toString();
    t.setAttribute("can", (p.that.atl != 0).toString());
    t.appendChild(document.createTextNode(p.that.at.tostring() + "(" + p.that.max_at.tostring() + "(" + p.ms.toString() + "))/" + p.that.hp.toString() + "(" + p.that.max_hp + ")" + (p.that.shield ? "+" + p.that.shield.toString() : "")));
    t.appendChild(br());
    j.innerText = p.that.atl.toString();
    j.className = (p.that.frozen > 0 ? "frozen" : (p.that.atl == 0 ? "warn" : ""));
    t.appendChild(j);
    j = refresh();
    j.className = "attr";
    j.innerHTML = attr(p.that);
    t.appendChild(j);
    j = refresh();
    j.innerHTML = "Status:" + _status(p.that);
    t.appendChild(j);
    temp.appendChild(t);
    temp.appendChild(skill(p.s, p.id.toString()));
    temp.appendChild(br());
    for (var i in p.deck) {
        if (p.deck[i].hide && p.id != id)
            continue;
        temp.appendChild(str(p.deck[i], (!(p.taunt > 0 && !p.deck[i].taunt) && !p.deck[i].hide), p.id.toString() + (i.length == 2 ? "" : "0") + i, p.deck[i].atl != 0));
    }
    temp.appendChild(br());
    temp.appendChild(br());
    if (p.id != id)
        return temp;
    for (var i in p.hand) {
        t = refresh();
        t.className = "id";
        t.innerText = i.toString() + ":";
        temp.appendChild(t);
        temp.appendChild(s(p.hand[i], p.hand[i].value.ma <= p.m, p.id.toString() + (i.length == 2 ? "" : "0") + i));
    }
    return temp;
}
var code = new map();
code.set("", "");
code.set("rand", "026026026026026026026026026026026026026026026026026026026026026026026026026026026026026026");
