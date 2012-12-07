define(function(require, exports, module) {
	var $ = require("$");
	
	exports.start = function(){
		$("select").on("change",function(){
			var val = $(this).children('option:selected').val();
			console.log(val);
			if(val === "卡号"){
				$("#sao").hide();
			}
			else{
				$("#sao").show();
			}
			$("#number").attr("placeholder",val);
		})
		var url = "",
			data = {a:""};
		$("button").on("click",function(){
			$.ajax({
				type:"POST",
				url:url,
				data:data,
				dataType:"json",
				success:function(){

				}
			});
		})
	}
})