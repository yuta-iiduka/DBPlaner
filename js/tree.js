console.log("tree.js is called.");
// ■Treeクラスは以下の機能を提供します
//① 親子関係
//② ルートの取得機能
//③ グループや名前での検索
// ■依存：jquery-3.6.0.min.js
class Tree{
	// 共通カウンタ
	static cnt = 0;
	// 全Treeオブジェクトのリスト
	static list = [];
	// アクティブなTreeオブジェクト
	static active_tree = null;
	// ルート
	static route = [];
	
	//コンストラクタ
	//TODO：カプセル化
	constructor(){
		this.x = 0;
		this.y = 0;
		this.id = Tree.cnt;
		this.group = "";
		this.name = "";
		this.parent = null;
		this.child = [];
		this.original = null;
		Tree.list.push(this);
		Tree.cnt++;
	}
	
	//説明：親Treeのセッター
	//引数：Treeオブジェクト
	//戻値：自インスタンス
	set_parent(t){
		if(t != this){
			this.parent = t;
			if(t.child.includes(this)){
				t.set_child(this);
			}
		}else{
			console.log("Tree id:" + t.id + " Treeオブジェクトは自身を親にすることはできません。");
		}
		return this;
	}
	
	//説明：子Treeのセッター
	//引数：Treeオブジェクト
	//戻値：自インスタンス
	set_child(t){
		if(this.child.includes(t)){
			console.log("Tree id:" + t.id + " 同じTreeオブジェクトは子にすることはできません。");
		}else{
			this.child.push(t);
		}
		if (t.parent = null){
			t.set_parent(this);
		}
		return this;
	}

	//説明：Treeオブジェクトリストのゲッター（Tree名検索）
	//引数：文字列
	//戻値：Treeオブジェクト	
	get_tree_list_by_name(name){
		let target = [];
		for(let i=0; i<Tree.list.length; i++){
			if(Tree.list[i].name == name){
				target.push(Tree.list[i]);
			}
		}
		return target;
	}
	
	//説明：Treeオブジェクトリストのゲッター（Treeグループ検索）
	//引数：文字列
	//戻値：Treeオブジェクト
	get_tree_list_by_group(group){
		let target = [];
		for(let i=0; i<Tree.list.length; i++){
			if(Tree.list[i].group == group){
				target.push(Tree.list[i]);
			}
		}
		return target;
	}
	
	//説明：Treeオブジェクトのゲッター（TreeID検索）
	//引数：文字列
	//戻値：Treeオブジェクト	
	get_tree_by_id(id){
		let target = null;
		for(let i=0; i<Tree.list.length; i++){
			if(Tree.list[i].id == id){
				target = Tree.list[i];
			}
		}
		return target;
	}
	
	//説明：始祖Treeオブジェクトのゲッター
	//引数：なし
	//戻値：Treeオブジェクト	
	get_original(){
		let target = null;
		if(this.parent == null){
			target = this;
		}else{
			target = this.parent.get_original();
		}
		return target;
	}
	
	//説明：起点から始祖までのTreeオブジェクトリストのセッター
	//引数：なし
	//戻値：なし	
	set_route(){
		Tree.route.push(this);
		if(this.parent != null){
			this.parent.set_route();
		}
	}

	//説明：起点から始祖までのTreeオブジェクトリストのゲッター
	//引数：なし
	//戻値：Treeオブジェクトリスト	
	get_route(){
		Tree.route = [];
		this.set_route();
		return Tree.route;
	}
}


// ■TreeObjectクラスは以下の機能を提供します
//①リサイズ・移動可能な親子関係をもつJQueryオブジェクト
class TreeObject extends Tree{
	// 共通カウンタ
	static cnt = 0;
	// 全Treeオブジェクトのリスト
	static list = [];
	
	constructor(id){
		super();
		this.border_default_color = "border border-primary"
		this.border_clicked_color = "border border-warning"
		this.jquery_obj = $("#"+id).addClass(this.border_default_color);
		let title = ""
		if(this.jquery_obj.text().length > 16){
			title = this.jquery_obj.text().substr(0,16) + "…";
		}else{
			title = this.jquery_obj.text();
		}
		this.collider = new Collider()
						.set_jquery_obj(this.jquery_obj)
						.set_collider()
						.set_frame()
						.set_title(title)
						.set_button(true);
		this.set_draw_event();
		TreeObject.list.push(this);
	}
	
	set_jquery_obj(jquery_obj){
		this.collider.jquery_obj = jquery_obj;
		return this;
	}
	
	//説明：①子TreeObjectオブジェクトのセッター
	//　　　②クリック時のイベント（子->親の可視化）を付与する
	//引数：Treeオブジェクトもしくはそのサブクラスオブジェクト
	//戻値：自インスタンス
	set_child(t){
		super.set_child(t);
		let self = this;
		let cls = this.border_clicked_color
		let def = this.border_default_color
		if (t.jquery_obj != undefined ){
			t.jquery_obj.mousedown(function(e){
				self.jquery_obj.removeClass(def);
				self.jquery_obj.addClass(cls);
				if(t.jquery_obj != undefined){
					t.jquery_obj.removeClass(def);
					t.jquery_obj.addClass(cls);
				}
			});
			t.jquery_obj.mouseup(function(e){
				self.jquery_obj.removeClass(cls);
				self.jquery_obj.addClass(def);
				if(t.jquery_obj != undefined){
					t.jquery_obj.removeClass(cls);
					t.jquery_obj.addClass(def);
				}
			});
		}
	}
	
	//説明：TreeObjectオブジェクトのクリック時イベント（親->子の可視化）を付与する
	set_draw_event(){
		let self = this;
		let cls = this.border_clicked_color
		let def = this.border_default_color
		this.jquery_obj.mousedown(function(e){
			self.jquery_obj.removeClass(def);
			self.jquery_obj.addClass(cls);
			for(let i=0; i<self.child.length; i++){
				if(self.child[i].jquery_obj != undefined){
					self.child[i].jquery_obj.removeClass(def);
					self.child[i].jquery_obj.addClass(cls);
				}
			}
		});
		
		this.jquery_obj.mouseup(function(e){
			self.jquery_obj.removeClass(cls);
			self.jquery_obj.addClass(def);
			for(let i=0; i<self.child.length; i++){
				if(self.child[i].jquery_obj != undefined){
					self.child[i].jquery_obj.removeClass(cls);
					self.child[i].jquery_obj.addClass(def);
				}
			}
		});
	}
}

// ■Gridクラスは以下の機能を提供します
//①JQueryオブジェクトの画面配置管理
//②JQueryオブジェクトのリサイズ監視

class Grid{
	constructor(w,h){
		this.window_w = window.innerWidth;
		this.window_h = window.innerHeight;
		this.default_window_w = 1980;
		this.default_window_h = 1020;
		let ratio_w = this.window_w / this.default_window_w;
		let ratio_h = this.window_h / this.default_window_h;
		this.w = parseInt(w * ratio_w);
		this.h = parseInt(h * ratio_h);
		this.def_w = parseInt(w * ratio_w);
		this.def_h = parseInt(h * ratio_h);
		this.jquery_obj_list = [];
		this.x_list = this.set_gridX();
		this.y_list = this.set_gridY();
		this.body = $("body");
		this.set_grid_event();
		this.set_resize_event();
		this.draw()
		this.active = true;
	}
	
	set_jquery_obj(jquery_obj){
		let self = this;
		jquery_obj.width(self.w * 2);
		jquery_obj.height(self.h * 2);
		jquery_obj.offset({"top":self.h,"left":self.w});
		this.jquery_obj_list.push({"obj":jquery_obj,"w":jquery_obj.width(),"h":jquery_obj.height(),"top":jquery_obj.offset()["top"],"left":jquery_obj.offset()["left"],"x":parseInt(jquery_obj.offset()["left"]/self.w),"y":parseInt(jquery_obj.offset()["top"]/self.h)});
		jquery_obj.click(function(){
			self.active = true;
		});
		return this;
	}
	
	set_gridX(){
		let grid_list = [];
		for(let i=0; i<window.innerWidth; i+=this.w){
			grid_list.push(i);
		}
		return grid_list;
	}
	
	set_gridY(){
		let grid_list = [];
		for(let i=0; i<window.innerHeight; i+=this.h){
			grid_list.push(i);
		}
		return grid_list;
	}
	
	set_grid_event(){
		let self = this;
		this.body.mouseup(function(e){
			self.fit(e);
		});
		return this;
	}
	
	fit(e){
		let self = this;
		if (self.active == true){
			for(let i=0; i<self.jquery_obj_list.length; i++){
				let obj = self.jquery_obj_list[i].obj;
				let grid_x = obj.offset()["left"] - (obj.offset()["left"] % self.w);
				if(obj.offset()["left"] % self.w > self.w / 2){
					grid_x = obj.offset()["left"] - (obj.offset()["left"] % self.w) + self.w;
				}
				let grid_y = obj.offset()["top"]  - (obj.offset()["top"]  % self.h);
				if(obj.offset()["top"] % self.h > self.h / 2){
					grid_y = obj.offset()["top"] - (obj.offset()["top"] % self.h) + self.h;
				}
				let remaining_w = obj.width() % self.w;
				let remaining_h = obj.height() % self.h;
				let grid_w = obj.width()  - remaining_w;
				let grid_h = obj.height() - remaining_h;
				//グリッド横幅
				if (grid_w > self.w){
					if(remaining_w < self.w / 2){
						obj.width(grid_w);
					}else{
						obj.width(grid_w + self.w);
					}
				}else{
					obj.width(self.w * 2);
				}
				
				//グリッド縦幅
				if (grid_h > self.h){
					if(remaining_h < self.h / 2){
						obj.height(grid_h);
					}else{
						obj.height(grid_h + self.h)
					}
				}else{
					obj.height(self.h * 2);
				}
				//グリッド座標
				obj.offset({"top":grid_y,"left":grid_x});
				self.jquery_obj_list[i].w    = parseInt(obj.width()  / self.w);
				self.jquery_obj_list[i].h    = parseInt(obj.height() / self.h);
				self.jquery_obj_list[i].top  = grid_y;
				self.jquery_obj_list[i].left = grid_x;
				self.jquery_obj_list[i].x    = parseInt(obj.offset()["left"] / self.w);
				self.jquery_obj_list[i].y    = parseInt(obj.offset()["top"]  / self.h);
			}
		}
	}
	
	set_resize_event(){
		let self = this;
		window.addEventListener("resize",function(e){
			if (self.active == true){
				let window_w = window.innerWidth;
				let window_h = window.innerHeight;
				let ratio_width  = window_w / self.window_w;
				let ratio_height = window_h / self.window_h;
				
				self.w = parseInt(self.def_w * ratio_width);
				self.h = parseInt(self.def_h * ratio_height);
				for(let i=0; i<self.jquery_obj_list.length; i++){
					let obj = self.jquery_obj_list[i].obj;
					let obj_top  = self.jquery_obj_list[i].y * self.h;
					let obj_left = self.jquery_obj_list[i].x * self.w;
					let obj_h    = self.jquery_obj_list[i].h * self.h;
					let obj_w    = self.jquery_obj_list[i].w * self.w; 
					obj.width(obj_w);
					obj.height(obj_h);
					obj.offset({"top":obj_top,"left":obj_left});
				}
				self.draw();
			};
		});
		return this;
	}
	
	reposition(jquery_obj,top,left,height,width){
		jquery_obj.offset({"top":top * this.h,"left":left * this.w}).height(height * this.h).width(width * this.w);
	}
	
	draw(){
		this.body.css("background-size",this.w + "px " + this.h + "px")
				.css("background-position","0% 0%")
				.css("background-image","repeating-linear-gradient(90deg,#aaa,#aaa 1px,transparent 1px,transparent "+this.w+"px),repeating-linear-gradient(0deg,#aaa,#aaa 1px,transparent 1px,transparent "+this.h+"px)")
		return this;
	}
}

//■Linkオブジェクトは以下の機能を提供します
//マウス操作による親子関係の生成

class Link extends TreeObject{
	constructor(){
		console.log("link is called.");
	}
}

