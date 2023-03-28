class Editor{
	static cnt = 0;
	static list = [];
	static off = "<i class='bi bi-check-circle-fill'></i>" //"編集モードOFF";
	static on  = "<i class='bi bi-pencil-square'></i>"     //"編集モードON" ;
	static font_bold   = "<i class='bi bi-type-bold'></i>"
	static font_normal = "<i class='bi bi-eraser'></i>";
	static link   = "<i class='bi bi-link-45deg'></i>"
	constructor(id){
		this.id = Editor.cnt;
		this.editable = true;
		this.obj = document.getElementById(id);
		this.jquery_obj = $("#"+id);
		this.target = this.jquery_obj.children("div");
		this.target.prop("contenteditable",true);
		this.target.css("padding-left","4px");
		this.contextmenu = this.get_contextmenu();
		this.set_context_event();
		
		//this.startNode = null;
		//this.endNode   = null;
		
		
		Editor.list.push(this);
	}
	
	style(cs){
		this.obj.focus();
		let selection = window.getSelection();
		if(! selection.rangeCount){return;}
		let range = selection.getRangeAt(0);
		if(this.jquery_obj.find($(range.commonAncestorContainer)).length == 0){return;}
		let newNode = document.createElement("span");
		newNode.setAttribute("style",cs);
		newNode.innerHTML = selection.toString();
		range.deleteContents();
		range.insertNode(newNode);
		window.getSelection().removeAllRanges();
	}
	
	style_font_bold(){
		this.style("font-weight:bold;");
	}
	
	style_font_normal(){
		this.style("font-weight:normal;");
	}
	
	bg_color(val){
		this.css("background-color",val);
	}
	
	css(key,val){
		this.obj.focus();
		let selection = window.getSelection();
		if(! selection.rangeCount){return;}
		let range = selection.getRangeAt(0);
		console.log(range);
		let span = document.createElement("span");
			//span.setAttribute("style","color:yellow;");
			span.setAttribute("style",key+":"+val+";");
		
		let startNode = range.startContainer;
		let startRange = document.createRange();
			startRange.setStart(startNode,range.startOffset);
			startRange.setEnd(startNode,startNode.textContent.length);
			console.log("startRange",startRange);
		
		let endNode = range.endContainer;
		let endRange   = document.createRange();
			endRange.setStart(endNode,0);
			endRange.setEnd(endNode,range.endOffset);
			console.log("endRange",endRange)
			
		if(range.commonAncestorContainer.nodeType == 1){
			let midNodes = range.commonAncestorContainer.querySelectorAll("div");
			let midRange = document.createRange();
				midRange.setStartAfter(startNode);
				midRange.setEndBefore(endNode);
			for(let i=0; i<midNodes.length; i++){
				//console.log("midNode",midNodes[i]);
				let midNode = midNodes[i];
				if(midRange.intersectsNode(midNode) == true && midNodes[i].contains(startNode) == false && midNodes[i].contains(endNode) == false){
					let targetRange = document.createRange();
						targetRange.selectNodeContents(midNode);
						for(let j=0; j<midNode.children.length; j++){
							let midNode_child = midNode.children[j];
							if(this.node_equal(midNode_child,span)){
								//this.set_style(midNode_child,"color","yellow");
								this.set_style(midNode_child,key,val);
							}
						}
						if(this.node_only(midNode,span) == false){
							targetRange.surroundContents(span.cloneNode());
						}else{
							this.set_style(midNode.children[0],key,val);
						}
				}
			}

			if(this.node_parent_equal(startNode,span.cloneNode()) == false){
				startRange.surroundContents(span.cloneNode());
			}else{
				console.log("startNode equal parent.");
			}
			if(this.node_parent_equal(endNode,span.cloneNode()) == false){
				endRange.surroundContents(span.cloneNode());
			}else{
				console.log("endNode equal parent.");
			}
		}else if(range.commonAncestorContainer.nodeType == 3){
			if(this.node_parent_equal(range.commonAncestorContainer,span.cloneNode()) == false){
				range.surroundContents(span.cloneNode());
			}
		}


	}
	
	set_style(node,key,val){
		let target = "";
		if(node == null){
			target = key + ":" + val + ";";
			return target;
		}
		//親ノードと同じstyleの場合は変化なし
		if(node.parentNode != null && node.parentNode.nodeName == "SPAN"){
			let span = document.createElement("span");
			span.setAttribute("style",key + val);
			if(this.node_parent_equal(node,span)){return;}
		}
		
		let style_string = node.getAttribute("style");
		let exist = false;
		let style_list = style_string.split(";");
		for(let i=0; i<style_list.length; i++){
			let cs = style_list[i];
			if(style_list[i].split(":")[0] == key){
				style_list[i] = key + ":" + val; 
				exist = true;
			}
		}
		
		if(exist = false){
			style_list.push(key + ":" + val + ";");
		}
		node.setAttribute("style",style_list.join(";"));
	}
	
	node_equal(n1,n2){
		let flag = false;
		if(n1.getAttribute("style").includes(n2.getAttribute("style"))){
			flag = true;
		}
		return flag;
	}
	
	node_parent_equal(c,p){
		let flag = false;
		if(c.parentNode != null && c.parentNode.getAttribute("style") != null){
			if(c.parentNode.getAttribute("style").includes(p.getAttribute("style"))){
				flag = true;
			}
		}
		return flag;
	}
	
	node_only(node,target){
		let flag = false;
		if(node.children.length == 1 && node.textContent == node.children[0].textContent){
				flag = true;
		}
		return flag;
	}
	
	link(){
		this.obj.focus();
		let selection = window.getSelection();
		if(! selection.rangeCount){return;}
		let link = selection.toString().replace(/\r?\n/g,'');
		let range = selection.getRangeAt(0);
		if(this.jquery_obj.find($(range.commonAncestorContainer)).length == 0){return;}
		let newNode = document.createElement("a");
		newNode.setAttribute("href",link)
		newNode.innerHTML = link
		range.deleteContents();
		range.insertNode(newNode);
		window.getSelection().removeAllRanges();
	}
	
	set_context_event(){
		let self = this;
		this.target.parent().append(this.contextmenu);
		this.target.contextmenu(function(e){
			$("#editor-contextmenu"+self.id)
							.css("display","inline-block")
							.css("position","fixed")
							.prop("contenteditable",false)
							.offset({"left":e.clientX,"top":e.clientY-24});
			$("#editor-mode" + self.id).css("display","inline-block")
			
		});
		
		//編集モードON/OFF切り替えボタン
		this.target.parent().find("#editor-mode" + this.id).click(function(){
			if(self.editable){
				$(this).html(Editor.on)
				$(this).css("display","none")
				self.editable = false;
				self.target.prop("contenteditable",false);
				
			}else{
				$(this).html(Editor.off)
				$(this).css("display","none")
				self.editable = true;
				self.target.prop("contenteditable",true);
				
			}
		});
		
		//太文字
		this.target.parent().find("#editor-font-bold" + this.id).mousedown(function(){
			//self.style_font_bold();
			self.bg_color("blue");
		})
		//スタイルリセット(普通文字）
		this.target.parent().find("#editor-font-normal" + this.id).mousedown(function(){
			self.style_font_normal();
		})
		//リンク
		this.target.parent().find("#editor-link" + this.id).mousedown(function(){
			self.link();
		})
		
		$("body").click(function(){
			$("#editor-contextmenu"+self.id).css("display","none")
		})
		
		return this;
	}
	
	get_contextmenu(){
		// background-color:grey;
		let txt = "<div id='editor-contextmenu" + this.id + "' style='display:none; font-size:normal;'>"
						+"<span id='editor-mode" + this.id + "'        title='編集モードのON/OFFを切り替えます'>" + Editor.off + "</span>"
						+"<span id='editor-font-bold" + this.id + "'   title='文字の太さを太くします'>" + Editor.font_bold + "</span>"
						+"<span id='editor-font-normal" + this.id + "' title='文字の太さを普通にします'>" + Editor.font_normal + "</span>"
						+"<span id='editor-link" + this.id + "'        title='選択文字をリンクにします'>" + Editor.link + "</span>"
					+"</div>";
		return txt;
	}
}

ed = new Editor("header");
