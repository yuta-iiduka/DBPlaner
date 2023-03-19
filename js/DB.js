console.log("DB.js is called.")

class DB extends TreeObject{
	static sql_list = ["Postgresql","MySQL","SQLite"];
	constructor(){
		super();
		this.name = "db";
		this.group = "group";
		this.user = "";
		this.password = "";
		this.sql = "";
		this.tables = [];
	}
	
	create_table(name, ...columns){
		let t = new Table(name,columns);
		this.tables.push(t);
		return t;
	}
}


class Table extends TreeObject{
	constructor(name,...columns){
		super();
		this.name = name;
		this.group = "table";
		this.active_record_id = 0;
		this.columns = columns[0];
		this.records = [];
		//console.log(columns);
		
	}
	
	//引数：カラムに挿入したい値
	insert(...args){
		let r = new Record(this.columns);
		let values = args;
		//console.log(args);
		this.set_child(r);
		this.records.push(r);
		for(let i=0; i<this.columns.length; i++){
			r.columns[this.columns[i]["name"]] = values[i];
		}
		return this;
	}
	
	select_all(){
		let record_values = [];
		for(let i=0; i<this.records.length; i++){
			record_values.push(this.records[i].columns)
		}
		return record_values;
	}
	
	get_records_count(){
		return this.records.length;
	}
	
	get_record(){
		return this.records[this.active_record_id];
	}
	
	get_record_by_id(id){
		let target = null;
		for(let i=0; i<this.records.length; i++){
			if(this.records[i].id == id){
				target = this.records[i];
			}
		}
		return target;
	}
	
	next(){
		let flag = false;
		if(this.active_record_id < this.records.length){
			flag = true;
		}
		return flag
	}
	
	
}

class Record extends TreeObject{
	static list = [];
	constructor(columns){
		super();
		this.name = "";
		this.type = "";
		this.group = "record";
		this.args = columns;
		this.columns = {}; //{column_name:column_object}
		//console.log(this.args);
		this.set_record();
	}
	
	set_record(){
		for(let i=0; i<this.args.length; i++){
			this.columns[this.args[i].name] = this.args[i];
		}
	}
	
	get_record(){
		return this.columns;
	}
	
}

class Column extends TreeObject{
	static Integer = "Integer";
	static Float   = "Float";
	static String  = "String";
	static Text = "Text";
	static list = [];
	static cnt = 0;
	constructor(name){
		super();
		this.id = Column.cnt
		this.group = "column";
		this.name = name;
		this.default = "";
		this.primary = false;
		this.uniq = false;
		this.type = "";
		this.value = this.default;
		Column.list.push(this);
		Column.cnt++;
	}
	
	get_value(){
		return this.value;
	}
	
	get_name(){
		return this.name;
	}
	
	get_max(){
		let m = Column.list[0];
		for(let i=0; i<Column.list.length ;i++){
			let target = Column.list[i];
			if(isNaN(target)){
				return null;
			}else{
				if(m < Column.list[i]){
					m = Column.list[i];
				}
			}
		}
		return m;
	}
	
	get_min(){
		let m = Column.list[0];
		for(let i=0; i<Column.list.length ;i++){
			let target = Column.list[i];
			if(isNaN(target)){
				return null;
			}else{
				if(m > Column.list[i]){
					m = Column.list[i];
				}
			}
		}
		return m;
	}
}

let db = new DB();
let table = db.create_table("sample", new Column("name"), new Column("password"));
table.insert("aaa","apdjsafpj");
table.insert("bbb","apdjsafpj");
console.log(table.select_all());
