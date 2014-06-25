function getValueFromStartDateAndTimePicker(){
	var startDate = $(".start-date-time-value").val();
	if(startDate === ""){
		setFlashMessage("error","Start date Information is mandatory");
		if(getFlag === true){
			$("#dataSetTextBox").attr("disabled",true);
		}
		return;
	}
	//var startDate = startDate.substring(startDate.indexOf(" ")+1,startDate.length);
	return startDate;  
};

function getValueFromEndDateAndTimePicker(){
	var endDate = $(".end-date-time-value").val();
	if(endDate === ""){
		setFlashMessage("error","End date Information is mandatory");
		if(getFlag === true){
			$("#dataSetTextBox").attr("disabled",true);
		}
		return;
	}
	//var endDate = endDate.substring(endDate.indexOf(" ")+1,endDate.length);
	return endDate;  
};