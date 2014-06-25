function setFlashMessage(status,message){
	if(status === "success"){
		$(".flash-alert-message").removeClass("alert-danger").addClass("alert-success");
		$(".alert-link").css("color","#169E3C");

	}else if(status === "error"){
		$(".flash-alert-message").removeClass("alert-success").addClass("alert-danger");
		$(".alert-link").css("color","#a94442");
	}
	$(".alert-link").html(message);
	$(".flash-alert-message").show();
	$(".flash-alert-message").delay(2000).fadeOut();
};

function setGraphFlashMessage(status,message){
	if(status === "success"){
		$(".flash-alert-message2").removeClass("alert-danger").addClass("alert-success");
		$(".alert-link2").css("color","#169E3C");

	}else if(status === "error"){
		$(".flash-alert-message2").removeClass("alert-success").addClass("alert-danger");
		$(".alert-link2").css("color","#a94442");
	}
	$(".alert-link2").html(message);
	$(".flash-alert-message2").show();
	$(".flash-alert-message2").delay(2000).fadeOut();
};