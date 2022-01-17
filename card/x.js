function push(n,c){
	var p=(n==1?p1:p2),ca=dict(c);
	if(!ca)throw "No such card.";
	ca.ma=0;
	p.hand.push(new Card(ca));
	repaint();
	_event();
}

function le(n,c){
	var p=(n==1?p1:p2),ca=dict(c);
	if(ca==null)throw "No such card.";
	while(ca.rare!=2){
		ca=dict(c);
	}
	ca.ma=0;
	p.hand.push(new Card(ca));
	repaint();
	_event();
}

var _cmd_ = "";
var c_dict=[];
function repaint() {
	$("#p1").html(to_str(p1));
	$("#p2").html(to_str(p2));
	$("#fs").html(fs.print());
	var g=document.getElementById("store");
	g.innerHTML="";
	for(var i in gl){
		g.appendChild(goods(dict(gl[i]),i));
	}
}

var c_dict=[],gl=[];
for(var i in card_dict){
	if(dict(card_dict[i]) instanceof Creature)c_dict.push(card_dict[i]);
}

function command(cmd_){
		cmd = cmd_.split(" ");
		$("#p0").text(cmd_);
		var p = ((id == 1) ? p1 : p2),pr = ((id == 2) ? p1 : p2);
		switch (cmd[0]) {
		case "end":
		case "e":
			if(!confirm("end?"))return;
						id = ((id == 1) ? 2 : 1);
						new_turn(pr);
						$("#toggle").show(500);
						$("#store").hide(500)
						$("#p1").hide(500);
						$("#p2").hide(500);
						end_turn(p);
			return;
		case "attack":
		case "a":
						if (cmd.length != 3) {
							alert("Invalid parameter!");
							return;
						}
						if (!((isInt(cmd[1]) || cmd[1] == "") && (isInt(cmd[2]) || cmd[2] == ""))) {
							alert("Invalid parameter!");
							return;
						}
						var er, ed;
						if (cmd[1] == "") er = p.that;
						else {
							var ea = parseInt(cmd[1]);
							if (ea < 0 || ea >= p.deck.length) {
								alert("Index out of range");
								return;
							}
							er = p.deck[ea];
						}
						if (cmd[2] == "") ed = pr.that;
						else {
							var ea = parseInt(cmd[2]);
							if (ea < 0 || ea >= pr.deck.length) {
								alert("Index out of range");
								return;
							}
							ed = pr.deck[ea];
						}
						if (er.atl == 0) {
							alert("Can't attack this turn");
							return;
						}
						if (pr.taunt > 0 && ed.taunt == false) {
							alert("You must attack taunt creature first");
							return;
						}
						if (ed.hide) {
							alert("It can't be attacked");
							return;
						}
						if (er.r == range.GROUND) {
				if(ed.r==range.GROUND||ed.r==range.FAKE_RANGED){
								er.attack(ed);
								ed.attacked(er);
							} else if (ed.r == range.RANGED) {
								ed.attacked(er);
								er.attack(ed);
								ed.attacked(er);
				}else{
								alert("Ground creature cannot attack flying creature");
								return;
							}
						} else if (er.r == range.RANGED){
				if(ed.r==range.GROUND||ed.r==range.FAKE_RANGED){
								er.attack(ed);
							} else if (ed.r == range.RANGED) {
								er.attack(ed);
								ed.attacked(er);
							} else {
								er.attack(ed);
								ed.attacked(er);
							}
						} else {
							er.attack(ed);
							ed.attacked(er);
						}
						clean(p);
						clean(pr);
						return;
					case "use":
					case "u":
						if (!(isInt(cmd[1]))) {
							alert("Invalid parameter!");
							return;
						}
						var num = parseInt(cmd[1]);
						if (num < 0 || num >= p.hand.length) {
							alert("Index out of range");
							return;
						}
						if (p.m < p.hand[num].value.ma) {
							alert("There isn't enough magic");
							return;
						}
						var c = p.hand[num];
						if (c.value instanceof Creature) {
							if (c.value.addictive && cmd[2] != undefined && cmd[2] != "") {
								var n = parseInt(cmd[2]);
								if (n != 1 && n != 0) {
									alert("Index out of range");
									return;
								}
								var pr = ((n == 0) ? p1 : p2);
								if (!cmd[3]) {
									alert("Invalid parameter")
									return;
								}
								n = parseInt(cmd[3]);
								if (n >= pr.deck.length) {
									alert("Index out of range");
									return;
								}
								if(c.value.building){
									alert("It can't attach");
									return;
								}
								if(pr.deck[n].building){
									alert("It can't be attached to");
									return;
								}
								pr.deck[n] = add(pr.deck[n], c.value);
								p.m -= c.value.ma;
								p.hand.splice(num, 1);
								return;
							}
							if(c.value.addictive&&!confirm("Nothing to attach?"))return;
							if (!call(p, c.value)) return;
						} else {
							if (!c.value.effect()) return;
						}
						p.m -= c.value.ma;
						p.hand.splice(num, 1);
						return;
					case "new":
						switch (cmd[1]) {
							case "NORMAL":
								p1 = new Player(1);
								p2 = new Player(2);
								p2.m = 0;
								p2.ma = 0;
								do {
									d = prompt("Input p1 deck code");
								} while (isCode(d) == undefined);
								p1.pile = decode(isCode(d));
								do {
									d = prompt("Input p2 deck code");
								} while (isCode(d) == undefined);
								p2.pile = decode(isCode(d));
								for (var i = 0; i < 4; i++) p2.hand.push(new_card(p2));
								for (var i = 0; i < 4; i++) p1.hand.push(new_card(p1));
								do {
									d = prompt("Input p1 skill name");
								} while (skill_dict(d) == undefined);
								p1.s = skill_dict(d);
								do {
									d = prompt("Input p2 skill name");
								} while (skill_dict(d) == undefined);
								p2.s = skill_dict(d);
								id = 1;
								return;
							case "Rand":
								p1 = new Player(1);
								p2 = new Player(2);
								p2.m = 0;
								p2.ma = 0;
								p1.pile = decode(code.get("rand"));
								p2.pile = decode(code.get("rand"));
								for (var i = 0; i < 4; i++) p2.hand.push(new_card(p2));
								for (var i = 0; i < 4; i++) p1.hand.push(new_card(p1));
								id = 1;
								return;
							default:
								alert("No such mode");
								return;
						}
						case "set":
							switch (cmd[1]) {
								case "language":
								case "lang":
									switch (cmd[2]) {
										case "e":
										case "English":
											l = lang.ENGLISH;
											return;
										case "c":
										case "Chinese":
											l = lang.CHINESE;
											return;
										default:
											alert("Unknown language!");
											return;
									}
									case "description":
									case "des":
										switch (cmd[2]) {
											case "on":
											case "true":
												des = true;
												return;
											case "off":
											case "false":
												des = false;
												return;
											default:
												alert("Invalid parameter!");
												return;
										}
										default:
											alert("No such setting!");
											return;
							}
							case "skill":
								if (p.s.cost > p.m) {
									alert("No enough magic");
									return;
								}
								if (p.s.eff()) p.m -= p.s.cost;
								return;
				}
				alert("Unknown syntax!");
}
			function isCode(str) {
				if (str == null) return undefined;
				if (code.has(str)) {
					if (str == "") return generator();
					return code.get(str);
				}
				if (str.length != 90) {
					return undefined;
				}
				for (var i = 0; i < str.length; i += 3) {
					if (!isInt(str.substr(i, 3)) || parseInt(str.substr(i, 3), 10) < 0 || parseInt(str.substr(i, 3), 10) >= card_dict.length) return undefined;
				}
				return str;
			}
			window.onload = function () {
				$("#p2").css({"width":"30%"});
				$("#p1").css({"width":"30%"});
				document.getElementById("toggle").onclick=function(){$("#toggle").hide();$("#p1").show(500);$("#p2").show(500);$("#store").show(500);}
			}
			function NewG(){
				id=1;
				p1=new Player(1),p2=new Player(2);
				p2.ma=0;
				p2.m=0;
				if(document.getElementById("al").checked)fs.ald=true;
				if(isCode(p1P=document.getElementById("p1p").value)==undefined){
					alert("Invalid deck code for p1!");
					return;
				}
				p1.pile=decode(isCode(document.getElementById("p1p").value));
				if(isCode(p2P=document.getElementById("p2p").value)==undefined){
					alert("Invalid deck code for p2!");
					return;
				}
				p2.pile=decode(isCode(document.getElementById("p2p").value));
				if(REF=document.getElementById("ref").checked)for(x in p1.deck)p2.deck[x]=p1.deck[x];
				var d=skill_dict(p1S=document.getElementById("p1s").value);
				if(d==undefined){
					alert("Invalid skill for p1!")
					return;
				}
				p1.s=d[0];
				p1.that=d[1];
				p1.ms=(d[2]?d[2]:0);
				d=skill_dict(p2S=document.getElementById("p2s").value);
				if(d==undefined){
					alert("Invalid skill for p2!")
					return;
				}
				p2.s=d[0];
				p2.that=d[1];
				p2.ms=(d[2]?d[2]:0);
				if(!(GA=document.getElementById("ga").checked)){
					for(var i=0;i<4;i++)p2.hand.push(new_card(p2));
					for(var i=0;i<4;i++)p1.hand.push(new_card(p1));
				}else{
					p2.hand=p2.pile;
					p1.hand=p1.pile;
					p2.pile=[];
					p1.pile=[];
				}
				p2.hand.push(new Card(dict("m-b")));
				for(i=1;i<10;i+=1){
					var a=random_el(c_dict);
					gl.push(a);
				}
				repaint();_event();
			}
			var p1S="",p1P="",p2P="",p2S="",GA=false,REF=false;
			function newG(){
				$("#p2").html("");
				$("#hs").html("");
				var div=document.getElementById("p1");
				fs.ald=false;
				div.innerHTML="p1:skill:<input type='text' id='p1s'><br>pile:<input type='text' id='p1p'><br>\
				p2:skill:<input type='text' id='p2s'><br>pile:<input type='text' id='p2p'><br>\
				ald:<input type='checkbox' id='al'>Giveall:<input type='checkbox' id='ga'>Reflexing Deck:<input type='checkbox' id='ref'><br>\
				<button onclick='NewG()'>Submit</button>";
				document.getElementById("p1s").value=p1S;
				document.getElementById("p2s").value=p2S;
				document.getElementById("p1p").value=p1P;
				document.getElementById("p2p").value=p2P;
				document.getElementById("al").checked=fs.ald;
				document.getElementById("ga").checked=GA;
				document.getElementById("ref").checked=REF;
			}
			newG();