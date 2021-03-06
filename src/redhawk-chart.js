//Get the context of the canvas element we want to select
var ctx = document.getElementById("myChart").getContext("2d");

resizingCanvas();

function resizingCanvas(){
	var canvas = document.getElementById("myChart");
	if($(window).height() <= 768 && $(window).width()<=1366){
		canvas.width = 750;
		canvas.height = 480;
	}else{
		canvas.width = 1000;
		canvas.height = 600;
	}
};

function getValueFromTextArea(){
	var textAreaVal = $(".json-text-area").val();
	return JSON.parse(textAreaVal);  
};

function setHeaderLabel(metric){
	$(".performance-label").text(metric);
};

function getSumCountRatio(dataPoints){
	var sumCountRatioList = [];
	for(var i=0;i<dataPoints.length;i++){
		var sumCountRatio = dataPoints[i].sum/dataPoints[i].count;
		sumCountRatioList.push(sumCountRatio);
	}
	return sumCountRatioList;
};

function getTimeList(dataPoints){
	var timeList = [];
	for(var i=0;i<dataPoints.length;i++){
		var time = dataPoints[i].time;
		time = time.substring(time.indexOf(" ")+1,time.length);
		timeList.push(time);
	}
	return timeList;
};

function findAverageValueInArray(array){
	var sum=0;
	for(var i=0;i<array.length;i++){
		sum = sum + array[i];
	}
	return sum/array.length;
};

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}


function plotOneGraph(inputJSON){
	$("#graphLabel").hide();
	$("#minMaxAverageLabel").show();
	var metric = inputJSON.metric
	setHeaderLabel(metric);

	var dataPoints = inputJSON.dataPoints;
	var sumCountRatioList = getSumCountRatio(dataPoints);
	var timeList = getTimeList(dataPoints);

	var maxValue = _.max(sumCountRatioList);
	var minValue = _.min(sumCountRatioList);
	var averageValue = findAverageValueInArray(sumCountRatioList);

	maxValue = roundToTwo(maxValue);
	minValue = roundToTwo(minValue);
	averageValue = roundToTwo(averageValue);

	var data = {
		labels : timeList,
		datasets : [
			{
				fillColor : "rgba(151,187,205,0)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				data : sumCountRatioList
			}
		]
	};

	var options = {
		scaleFontSize: 18,
		scaleLineWidth:3,
		datasetStrokeWidth:3,
		pointDotRadius:3,
		xFreq:50,
		pointDot: false
	};
	if(sumCountRatioList.length > 300){
		options.animation = false;
	}
	var myNewChart = new Chart(ctx).Line(data,options);
	return {max : maxValue,min:minValue,average : averageValue};
};

function plotMultipleGraph(datasets){
	//$(".performance-label").text("multiple datasets");
	$("#graphLabel").show();
	$("#minMaxAverageLabel").hide();
	var datasetsList = [];
	var colorList = [];
	var sumCountRatioListofList = [];
	var tempDataPoint;
	var timeList;
	for(dataset in datasets){
		datasetsList.push(dataset);
		var dataPoints = datasets[dataset].dataPoints;
		tempDataPoint = dataPoints;
		var sumCountRatioList = getSumCountRatio(dataPoints);
		sumCountRatioListofList.push(sumCountRatioList);
	}
	var timeList = getTimeList(tempDataPoint);

	var graphData = {
		labels : timeList,
		datasets : []
	};

	for(var i=0;i<sumCountRatioListofList.length;i++){
		var strokeColor = randomColor();
		var pointColor = strokeColor;
		colorList.push(strokeColor);
		var tempDataset={
			fillColor : "rgba(151,187,205,0)",
			strokeColor : strokeColor,
			pointColor : pointColor,
			pointStrokeColor : "#fff",
			data : sumCountRatioListofList[i]
		}
		graphData.datasets.push(tempDataset);
	}

	var options = {
		scaleFontSize: 18,
		scaleLineWidth:3,
		datasetStrokeWidth:3,
		pointDotRadius:3,
		xFreq:50,
		pointDot: false
	};
	if(sumCountRatioListofList[0].length > 300){
		options.animation = false;
	}
	var myNewChart = new Chart(ctx).Line(graphData,options);

	return {datasetsList : datasetsList,colorList:colorList};
};

function randomColor(){
	var color = "rgba(";
	var r =_.random(0,255);
	var g =_.random(0,255);
	var b =_.random(0,255);
	color = color+r+","+g+","+b+",1)";
	return color;	
};

function renderDatasetList(dataset){
	var text = document.createElement('div');
	text.setAttribute('class', 'text-label');
	text.innerHTML =dataset;
	text.style.width = "100px";
	text.style.height = "15px";
	text.style.margin = "0px 0px 5px 0px";
	text.style.position = "absolute";
	$(text).appendTo(".graph-label");
};

function renderColorList(color){
	var div = document.createElement('div');
	div.style.width = "15px";
	div.style.height = "15px";
	div.style.background = color;
	div.style.margin = "0px 0px 5px 0px";
	$(div).appendTo(".graph-label");
};

function renderLabel(labelList){
	for(var i=0;i<labelList.colorList.length;i++){
		renderDatasetList(labelList.datasetsList[i]);
		renderColorList(labelList.colorList[i]);
	}
};

function removeLabel(){
	var myNode = document.getElementById("graphLabel");
	myNode.innerHTML = '';
};

function removeMinMaxAverageLabel(){
	var myNode = document.getElementById("minMaxAverageLabel");
	myNode.innerHTML = '';
};

function renderMinMaxAverageLabel(minMaxAverageValue){
	var minValue = minMaxAverageValue.min;
	var maxValue = minMaxAverageValue.max;
	var averageValue = minMaxAverageValue.average;
	
	var minDOM = document.createElement('div');
	minDOM.setAttribute('class', 'minDOM-label');
	minDOM.innerHTML ="min : " + minValue;
	minDOM.style.width = "100px";
	minDOM.style.height = "15px";
	minDOM.style.margin = "25px 0px 5px 0px";
	minDOM.style.position = "absolute";
	$(minDOM).appendTo(".min-max-average-label");

	var maxDOM = document.createElement('div');
	maxDOM.setAttribute('class', 'maxDOM-label');
	maxDOM.innerHTML ="max : " + maxValue;
	maxDOM.style.width = "100px";
	maxDOM.style.height = "15px";
	maxDOM.style.margin = "25px 0px 5px 120px";
	maxDOM.style.position = "absolute";
	$(maxDOM).appendTo(".min-max-average-label");

	var averageDOM = document.createElement('div');
	averageDOM.setAttribute('class', 'averageDOM-label');
	averageDOM.innerHTML ="average : " + averageValue;
	averageDOM.style.width = "130px";
	averageDOM.style.height = "15px";
	averageDOM.style.margin = "25px 0px 5px 230px";
	averageDOM.style.position = "absolute";
	$(averageDOM).appendTo(".min-max-average-label");
};

$(".submit-graph-button").click(function(){
	resizingCanvas();
	if($.trim($(".json-text-area").val()) !== ""){
		var inputJSON = getValueFromTextArea();

		if(typeof inputJSON !=="undefined"){
			removeLabel();
			if(typeof inputJSON.dataSets !== "undefined"){
				var labelList = plotMultipleGraph(inputJSON.dataSets);
				renderLabel(labelList);
			}else{
				var minMaxAverageValue = plotOneGraph(inputJSON);
				renderMinMaxAverageLabel(minMaxAverageValue);
			}

		}

	}
});



