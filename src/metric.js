function getSelectedItemFromMetricDropDownList(){
	var metricDropdownList = document.getElementById("metricList");
	var metricDropdownList2 = document.getElementById("metricList2");
	var metricDropdownList3 = document.getElementById("metricList3");
	var metricValue1 = metricDropdownList.options[metricDropdownList.selectedIndex].text;
	var metricValue2 = metricDropdownList2.options[metricDropdownList2.selectedIndex].text;
	var metricValue3 = metricDropdownList3.options[metricDropdownList3.selectedIndex].text;
	if(metricValue2 === "none"){
		return metricValue1;
	}else if(metricValue2 !== "none" && metricValue3 === "none"){
		return metricValue1+"."+metricValue2;
	}else{
		return metricValue1+"."+metricValue2+"."+metricValue3;
	}
};

function getSelectedItemFromGraphMetricDropDownList(){
	var metricDropdownList = document.getElementById("metricGraphList");
	var metricDropdownList2 = document.getElementById("metricGraphList2");
	var metricDropdownList3 = document.getElementById("metricGraphList3");
	var metricValue1 = metricDropdownList.options[metricDropdownList.selectedIndex].text;
	var metricValue2 = metricDropdownList2.options[metricDropdownList2.selectedIndex].text;
	var metricValue3 = metricDropdownList3.options[metricDropdownList3.selectedIndex].text;
	if(metricValue2 === "none"){
		return metricValue1;
	}else if(metricValue2 !== "none" && metricValue3 === "none"){
		return metricValue1+"."+metricValue2;
	}else{
		return metricValue1+"."+metricValue2+"."+metricValue3;
	}
};