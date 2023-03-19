console.log("form checker is called.");

// ■依存：jquery-3.6.0.min.js
class FormChecker{
	static cnt = 0;
	static sepa = "\r\n";
	static message1 = "値を入力してください";
	constructor(){
		this.id = FormChecker.cnt;
		this.message = "";
		this.inputs = null;
		this.form = null;
	}
	
	//オーバーライド用関数
	//引数：Jqueryオブジェクトのフォーム
	check(form_obj){
		let txt = this.check_null(form_obj);
		if (txt.length > 0){
			this.message = this.message + txt + FormChecker.sepa;
		}
		this.emphasize(form_obj,txt);
		//this.message = this.message.split("txt-form").join("テキストフォーム");
	}
	
	//説明：評価関数
	//戻値：正常(false),異常(true)
	evaluate(){
		let flag = false;
		if(this.inputs != null){
			for(let i=0; i<this.inputs.length; i++){
				this.check(this.inputs.eq(i));
			}
		}
		if (this.message.length > 0){
			window.alert(this.message);
			flag = true;
			this.message = "";
		}
		return flag;
	}
	
	//スタイル操作
	emphasize(form_obj,message){
		if(message != ""){
			form_obj.addClass("border border-danger bg-warning");
			form_obj.attr("title",message);
		}else{	
			form_obj.removeClass("border border-danger bg-warning");
			form_obj.attr("title","");
		}
	}
	
	set_trigger(jquery_obj){
		let self = this;
		jquery_obj.click(function(){
			if(self.evaluate()){
				return ;
			}else{
				if(self.form != null){
					self.form.submit();
				}
			}
		});
		return this;
	}
	
	set_inputs(jquery_inputs){
		this.inputs = jquery_inputs;
		return this;
	};
	
	set_form(jquery_form){
		this.form = jquery_form;
		return this;
	}
	
	check_null(form_obj){
		let target = form_obj.val();
		let target_id = form_obj.attr("id");
		let txt = "";
		let flag = false;
		if(target == "" || target == null || target == undefined){
			txt = target_id + "：" + FormChecker.message1 + FormChecker.sepa
		}
		return txt;
	}
}

class SampleFormChecker extends FormChecker{
	constructor(){
		super();
	}
	check(form_obj){
		let txt = this.check_null(form_obj);
		txt = txt.split("txt-form").join("テキストフォーム");
		if (txt.length > 0){
			this.message = this.message + txt + FormChecker.sepa;
		}
		this.emphasize(form_obj,txt);
	}
}

let sfc = new SampleFormChecker()
			.set_inputs($(".txt"))
			.set_trigger($("#submit-btn"));



