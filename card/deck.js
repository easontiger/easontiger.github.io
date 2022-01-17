var str_i=[]

$("#b").click(function(){
	if(str_i.length!=30){
		alert("Deck not full");
		return;
	}
	$("#1").text(encode(str_i));
	var x=document.getElementById("1");
	x.select();
	document.execCommand("Copy");
	alert("successfully exported");
});

function s_(i){
	var t=refresh(),temp=refresh();
	temp.style="margin:auto;width:35%";
	t.className="id";
	temp.id=i.toString();
	t.innerText=i.toString()+":";
	temp.appendChild(t);
	var c=new Card(dict(card_dict[i]));
	temp.appendChild(s(c,true,i.toString()));
	temp.onclick=function(){
		if(str_i.length==30){
			alert("Deck full!");
			return;
		}
		str_i.push(card_dict[this.id]);
		var str_a="",cnt=0;
		for(var i=0;i<str_i.length;i++){
			str_a+=i.toString()+":"+str_i[i]+"<br>";
			cnt+=dict(str_i[i]).ma;
		}
		$("#2").html(str_a);
		$("#1").html((cnt/str_i.length).toString()+"<br>"+str_i.length);
	}.bind(temp);
	return temp;
}

for(var i=0;i<card_dict.length;i++){
	$("#3").after(s_(i));
}

document.onkeydown=function(e){
	if(e.keyCode==13){
		var a=$("#a").val().split(" ");
		if(a[0]==undefined){
			alert("Invalid parameter!");
			return;
		}
		switch(a[0]){
			case "delete":
			case "d":
				if(a[1]==undefined||a[1]>=str_i.length||a[1]<0||!isInt(a[1])){
					alert("Invalid parameter!");
					return;
				}
				str_i.splice(parseInt(a[1]),1);
				break;
			case "import":
			case "i":
				if(code.has(a[1])){
					str_i=[];
					var b=code.get(a[1])
					for(var i=0;i<30;i++){
						str_i.push(card_dict[parseInt(b.substr(3*i,3),10)]);
					}
				}else{
					alert("Deck not defined!")
				}
				break;
			case "empty":
			case "e":
				str_i=[];
				break;
			default:
				if(a[0]==undefined||a[0]>=card_dict.length||a[0]<0||!isInt(a[0])){
					alert("Invalid parameter!");
					return;
				}
				if(a[1]!=undefined&&!isInt(a[1])){
					alert("Invalid parameter!");
					return;
				}
				var num=(a[1]==undefined?1:parseInt(a[1]));
				if(str_i.length==30){
					alert("Deck full!");
					return;
				}
				while(num--&&str_i.length!=30)str_i.push(card_dict[parseInt(a[0])]);
		}
		var str_a="";
		for(var i=0;i<str_i.length;i++){
			str_a+=i.toString()+":"+str_i[i]+"<br>";
		}
		$("#2").html(str_a);
	}
}

document.getElementById("1").style="position:fixed;right:0";