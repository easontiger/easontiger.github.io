var _cmd_="";

function _event(){
	$(".skill").on("click",function(e){
		var p=((id==1)?p1:p2);
		if(parseInt(e.currentTarget.id)==parseInt(id))
		if(p.s.attr==0){
			if (p.s.cost>p.m) {
				alert("No enough magic");
				return;
			}
			if(p.s.eff()) p.m -= p.s.cost,repaint(), _event();
			return;
		}else{
			_cmd_="skill";
		}
		repaint();
		_event();
	});
	$(".card").on("click",function(e){
		var p=((id==1)?p1:p2);
		if(parseInt(e.currentTarget.id[0])==parseInt(id))
			if(p.hand[parseInt(e.currentTarget.id.slice(1))].value.attr==0){
				var num=parseInt(e.currentTarget.id.slice(1));
				if (num < 0 || num >= p.hand.length) return;
				if (p.m < p.hand[num].value.ma) {
					alert("There isn't enough magic");
					return;
				}
				var c = p.hand[num];
				if (c.value instanceof Creature) {
					if(c.value.attr!=0){
						_cmd_="u "+num.toString();
						return;
					}
					if (c.value.addictive){
						if(!confirm("Nothing to attach?")){
						_cmd_="u "+num.toString();
						return;
						}
					}
					if (!call(p, c.value)) return;
				} else {
					if(c.value.attr!=0){
						_cmd_="u "+num.toString();
						return;
					}
					if(!c.value.effect()) return;
				}
				p.m -= c.value.ma;
				p.hand.splice(num, 1);
				repaint();
				_event();
				return;
			}else{
				_cmd_="u "+e.currentTarget.id.slice(1);
			}
	});
	$(".creature").on("click",function(e){
		var ids=e.currentTarget.id;
		if(_cmd_==""&&ids==(id==1?"2":"1")){
			command("e");
			repaint(),_event(),_cmd_="";
			return;
		}
		if(_cmd_[0]=="a"&&ids[0]==(id==1?"2":"1")){
			if(ids[1]==undefined)command(_cmd_+" ");
			else command(_cmd_+" "+ids.slice(1))
			_cmd_="";
			repaint(),_event(),_cmd_="";
			return;
		}
		var cmd=_cmd_.split(" ");
		if(cmd[0]=="skill"||cmd[0]=="u"){
			command(_cmd_+" "+(parseInt(ids[0])-1).toString()+(ids[1]?" "+ids.slice(1):""));
			_cmd_=""
			repaint(),_event(),_cmd_="";
			return;
		}
		if(ids[0]==id.toString()){
			_cmd_="a "+(ids[1]?ids.slice(1):"");
			return;
		}
	});
	$(".unable").on("click",function(e){
		var ids=e.currentTarget.id;
		if(_cmd_==""&&ids==(id==1?"2":"1")){
			command("e");
			repaint(),_event(),_cmd_="";
			return;
		}
		if(_cmd_[0]=="a"&&ids[0]==(id==1?"2":"1")){
			if(ids[1]==undefined)command(_cmd_+" ");
			else command(_cmd_+" "+ids.slice(1));
			_cmd_="";
			repaint(),_event(),_cmd_="";
			return;
		}
		var cmd=_cmd_.split(" ");
		if(cmd[0]=="skill"||cmd[0]=="u"){
			command(_cmd_+" "+(parseInt(ids[0])-1).toString()+(ids[1]?" "+ids.slice(1):""));
			_cmd_=""
			repaint(),_event(),_cmd_="";
			return;
		}
		if(ids[0]==id.toString()){
			_cmd_="a "+(ids[1]?ids.slice(1):"");
			return;
		}
	});
};

function repaint(){
	$("#p1").html(to_str(p1));
	$("#p2").html(to_str(p2));
}