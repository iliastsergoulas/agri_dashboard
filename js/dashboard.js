Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
	c = isNaN(c = Math.abs(c)) ? 2 : c, 
	d = d == undefined ? "," : d, 
	t = t == undefined ? "." : t, 
	s = n < 0 ? "-" : "", 
	i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
function responsivefy(svg) {
	// get container + svg aspect ratio
	var container = d3.select(svg.node().parentNode),
		width = parseInt(svg.style("width")),
		height = parseInt(svg.style("height")),
		aspect = width / height;
	// add viewBox and preserveAspectRatio properties,
	// and call resize so that svg resizes on inital page load
	svg.attr("viewBox", "0 0 " + width + " " + height)
		.attr("perserveAspectRatio", "xMinYMid")
		.call(resize);
	// to register multiple listeners for same event type, 
	// you need to add namespace, i.e., 'click.foo'
	// necessary if you call invoke this function for multiple svgs
	// api docs: https://github.com/mbostock/d3/wiki/Selections#on
	d3.select(window).on("resize." + container.attr("id"), resize);
	// get width of container and resize svg to fit it
	function resize() {
		var targetWidth = parseInt(container.style("width"));
		svg.attr("width", targetWidth);
		svg.attr("height", Math.round(targetWidth / aspect));
	}
}

var e = document.getElementById("#countryselector");
var selText = e.options[e.selectedIndex].text;
var selValue = e.options[e.selectedIndex].value;
$("#countrytitle").text(selText);
var url='http://88.99.13.199:3000/ms_aggregate?letter=eq.';
url=url.concat(selValue);
var stats=[];
var mss;
$.getJSON(url, function(mydata) {
	stats.push(mydata[0]);
	funds=Number(stats[0]['funds']/1000000000).toFixed(2);
	document.getElementById("funds").innerHTML=funds;
	decisions=Number(stats[0]['decisions']/1000000000).toFixed(2);
	document.getElementById("decisions").innerHTML=decisions;
	payments=Number(stats[0]['payments']/1000000000).toFixed(2);
	document.getElementById("payments").innerHTML=payments;
	pct=Number(stats[0]['pct']*100).toFixed(2);
	document.getElementById("pct").innerHTML=pct;
});
$("#countryselector").on('change', function() {
	e = document.getElementById("countryselector");
	selText = e.options[e.selectedIndex].text;
	selValue = e.options[e.selectedIndex].value;
	$("#countrytitle").text(selText);
	var url='http://88.99.13.199:3000/ms_aggregate?letter=eq.';
	url=url.concat(selValue);
	var stats=[];
	$.getJSON(url, function(mydata) {
		stats.push(mydata[0]);
		funds=Number(stats[0]['funds']/1000000000).toFixed(2);
		document.getElementById("funds").innerHTML=funds;
		decisions=Number(stats[0]['decisions']/1000000000).toFixed(2);
		document.getElementById("decisions").innerHTML=decisions;
		payments=Number(stats[0]['payments']/1000000000).toFixed(2);
		document.getElementById("payments").innerHTML=payments;
		pct=Number(stats[0]['pct']*100).toFixed(2);
		document.getElementById("pct").innerHTML=pct;
	});
});

var marginmsorder = {top: 25, right: 20, bottom: 80, left: 50},
	widthmsorder = 600 - marginmsorder.left - marginmsorder.right,
	heightmsorder = 300 - marginmsorder.top - marginmsorder.bottom;
  var formatPercent = d3.format(".0%");
  var xmsorder = d3.scale.ordinal()
	.rangeRoundBands([0, widthmsorder], .1, 1);
  var ymsorder = d3.scale.linear()
	.range([heightmsorder, 0]);
  var xAxismsorder = d3.svg.axis()
	.scale(xmsorder)
	.orient("bottom");
  var yAxismsorder = d3.svg.axis()
	.scale(ymsorder)
	.orient("left")
	.tickFormat(formatPercent);
  var svgmsorder = d3.select("#msorder").append("svg")
	.attr("width", widthmsorder + marginmsorder.left + marginmsorder.right)
	.attr("height", heightmsorder + marginmsorder.top + marginmsorder.bottom)
				.call(responsivefy)
	.append("g")
	.attr("transform", "translate(" + marginmsorder.left + "," + marginmsorder.top + ")");
  d3.json("http://88.99.13.199:3000/ms_aggregate", function(error, data) {
	data.forEach(function(d) {
	  d.pct = +d.pct;
	});
	xmsorder.domain(data.map(function(d) { return d.letter; }));
	ymsorder.domain([0, d3.max(data, function(d) { return d.pct; })]);
	var tipmsorder = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	  return "<span style='color:white'>" + d.fullname + ": " + Number(d.pct*100).toFixed(2) + "%</span>";
	});
	svgmsorder.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + heightmsorder + ")")
	  .call(xAxismsorder)
	  .selectAll("text")
	  .attr("transform", "rotate(-65 12 32)");
	svgmsorder.append("g")
	  .attr("class", "y axis")
	  .call(yAxismsorder)
	.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("% Funds paid");
	svgmsorder.selectAll(".barmsorder")
	  .data(data)
	  .enter().append("rect")
	  .attr("class", "barmsorder")
	  .attr("x", function(d) { return xmsorder(d.letter); })
	  .attr("width", xmsorder.rangeBand())
	  .attr("y", function(d) { return ymsorder(d.pct); })
	  .attr("fill", function(d) {
	  if (d.letter =="GR") {
		  return "#61b95f";
	  } 
		  return "#4178b4";
	  })
	  .attr("height", function(d) { return heightmsorder - ymsorder(d.pct); })
	  .on('mouseover', tipmsorder.show)
	  .on('mouseout', tipmsorder.hide);
	svgmsorder.call(tipmsorder);
				d3.select("#input1").on("change", changepro);
	var sortTimeout = setTimeout(function() {
	  d3.select("#input1").property("checked", true).each(changepro);
	}, 2000);
	function changepro() {
	  clearTimeout(sortTimeout);
	  var x0 = xmsorder.domain(data.sort(this.checked
		? function(a, b) { return b.pct - a.pct; }
		: function(a, b) { return d3.ascending(a.letter, b.letter); })
		.map(function(d) { return d.letter; }))
		.copy();
	  svgmsorder.selectAll(".barmsorder")
		.sort(function(a, b) { return x0(a.letter) - x0(b.letter); });
	  var transition = svgmsorder.transition().duration(750),
		delay = function(d, i) { return i * 50; };
	  transition.selectAll(".barmsorder")
		.delay(delay)
		.attr("x", function(d) { return x0(d.letter); });
	  transition.select(".x.axis")
		.call(xAxismsorder)
		.selectAll("g")
		.delay(delay);
	}
  });
  
var pie = new d3pie("pieChart", {
	"size":{
		"canvasHeight":$('#pieChart').outerHeight(),
		"canvasWidth":$('#pieChart').outerWidth()
	},
	"data": {
		"content": [
		  {"label":"Master Course","value":2807},
		  {"label":"Affiliates", "value":1072},
		  {"label":"Ebook", "value": 972}
	]}
});

// Set the dimensions of the canvas / graph
var marginlines = {top: 40, right: 60, bottom: 70, left: 70},
	widthlines = 1000 - marginlines.left - marginlines.right,
	heightlines = 400 - marginlines.top - marginlines.bottom;
// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%d").parse;
// Set the ranges
var xlines = d3.time.scale().range([0, widthlines]);
var ylines = d3.scale.linear().range([heightlines, 0]);
// Define the axes
var xAxislines = d3.svg.axis().scale(xlines)
	.ticks( d3.time.months, 3 )
	.tickFormat( function ( x ) {
		// get the milliseconds since Epoch for the date
		var milli = (x.getTime() - 10000);
		// calculate new date 10 seconds earlier. Could be one second, 
		// but I like a little buffer for my neuroses
		var vanilli = new Date(milli);
		// calculate the month (0-11) based on the new date
		var mon = vanilli.getMonth();
		var yr = vanilli.getFullYear();
		// return appropriate quarter for that month
		if ( mon <= 2 ) {return  "Q1 " + yr;
		} else if ( mon <= 5 ) {return  "Q2 " + yr;
		} else if ( mon <= 8 ) {return  "Q3 " + yr;
		} else {return "Q4 " + yr;
		}
	} )
	.orient( "bottom" );
var yAxislines = d3.svg.axis().scale(ylines)
	.orient("left").ticks(5);
// Define the line
var priceline = d3.svg.line()   
	.x(function(d) { return xlines(d.date); })
	.y(function(d) { return ylines(d.price); });
// Adds the svg canvas
var svglines = d3.select("#chart-line1")
	.append("svg")
		.attr("width", widthlines + marginlines.left + marginlines.right)
		.attr("height", heightlines + marginlines.top + marginlines.bottom)
		.call(responsivefy)
	.append("g")
		.attr("transform", 
				"translate(" + marginlines.left + "," + marginlines.top + ")");
// Get the data
d3.json("http://88.99.13.199:3000/poreiapaa", function(error, data) {
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.price = +d.value;
	});
	// Scale the range of the data
	xlines.domain(d3.extent(data, function(d) { return d.date; }));
	ylines.domain([0, d3.max(data, function(d) { return d.value; })]);
	// Nest the entries by symbol
	var dataNest = d3.nest()
		.key(function(d) {return d.variable;})
		.entries(data);
	var colorlines = d3.scale.category10();   // set the colour scale
	legendSpace = widthlines/dataNest.length; // spacing for legend
	// Loop through each symbol / key
	dataNest.forEach(function(d,i) { 
		svglines.append("path")
			.attr("class", "line")
			.style("stroke", function() { // Add the colours dynamically
				return d.color = colorlines(d.key); })
			.attr("d", priceline(d.values));
		// Add the Legend
		svglines.append("text")
			.attr("x", (legendSpace/2)+i*legendSpace) // spacing
			.attr("y", heightlines + (marginlines.bottom/2)+ 5)
			.attr("class", "legend")    // style the legend
			.style("fill", function() { // dynamic colours
				return d.color = colorlines(d.key); })
			.text(d.key);
	});
	// Add the X Axis
	svglines.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + heightlines + ")")
		.call(xAxislines);
	// Add the Y Axis
	svglines.append("g")
		.attr("class", "y axis")
		.call(yAxislines);
});

function dashboard(id, fData){ /*Creating dashboard for priorities*/
	var barColor = 'steelblue';
	function segColor(c){ return {"Employment and social inclusion":"#807dba", "Environment, climate change and risk prevention":"#e08214",
	"Transport":"#41ab5d", "Tourism and cultural heritage":"#00520b", "Climate Change Adaptation & Risk Prevention":"#f7f322",
	"Competitiveness of SMEs":"#b3b1b6", "Discontinued Measures":"#26dddd",
	"Educational & Vocational Training":"#807dba", "Efficient Public Administration":"#e08214",
	"Environment Protection & Resource Efficiency":"#41ab5d", "Low-Carbon Economy":"#00520b", "Outermost & Sparsely Populated":"#f7f322",
	"Research & Innovation":"#b3b1b6", "Social Inclusion":"#26dddd",
	"Sustainable & Quality Employment":"#807dba", "Technical Assistance":"#e08214",
	"Technical Assistance (IPA)":"#41ab5d", "Multiple Thematic Objectives (ERDF/CF/ESF)":"#00520b", "Network Infrastructures in Transport and Energy":"#f7f322",}[c]; }
	// compute total for each state.
	fData.forEach(function(d){
		d.total=d.freq["Employment and social inclusion"]+d.freq["Environment, climate change and risk prevention"]+d.freq["Transport"]+
		d.freq["Tourism and cultural heritage"]+d.freq["Climate Change Adaptation & Risk Prevention"]+d.freq["Competitiveness of SMEs"]+d.freq["Discontinued Measures"]+
		d.freq["Educational & Vocational Training"]+d.freq["Efficient Public Administration"]+d.freq["Environment Protection & Resource Efficiency"]+
		d.freq["Low-Carbon Economy"]+d.freq["Outermost & Sparsely Populated"]+d.freq["Research & Innovation"]+
		d.freq["Social Inclusion"]+d.freq["Sustainable & Quality Employment"]+d.freq["Technical Assistance"]+
		d.freq["Technical Assistance (IPA)"]+d.freq["Multiple Thematic Objectives (ERDF/CF/ESF)"]+d.freq["Network Infrastructures in Transport and Energy"];
		d.total=Number(d.total.toFixed(2));
	});
	// function to handle histogram.
	function histoGram(fD){
		var hG={},    hGDim = {t: 70, r: 30, b: 20, l: 10};
		hGDim.w = 360 - hGDim.l - hGDim.r, 
		hGDim.h = 300 - hGDim.t - hGDim.b;  
		//create svg for histogram.
		var hGsvg = d3.select(id).append("svg")
			.attr("width", hGDim.w + hGDim.l + hGDim.r)
			.attr("height", hGDim.h + hGDim.t + hGDim.b)
			.append("g")
			.attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");
		// create function for x-axis mapping.
		var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
				.domain(fD.map(function(d) { return d[0]; }));
		// Add x-axis to the histogram svg.
		hGsvg.append("g").attr("class", "x axis")
			.attr("transform", "translate(0," + hGDim.h + ")")
			.call(d3.svg.axis().scale(x).orient("bottom"));
		// Create function for y-axis map.
		var y = d3.scale.linear().range([hGDim.h, 0])
				.domain([0, d3.max(fD, function(d) { return d[1]; })]);
		// Create bars for histogram to contain rectangles and freq labels.
		var bars = hGsvg.selectAll(".bar").data(fD).enter()
				.append("g").attr("class", "bar");
		//create the rectangles.
		bars.append("rect")
			.attr("x", function(d) { return x(d[0]); })
			.attr("y", function(d) { return y(d[1]); })
			.attr("width", x.rangeBand())
			.attr("height", function(d) { return hGDim.h - y(d[1]); })
			.attr('fill',barColor)
			.on("mouseover",mouseover)// mouseover is defined below.
			.on("mouseout",mouseout);// mouseout is defined below.
		//Create the frequency labels above the rectangles.
		bars.append("text").text(function(d){ return d3.format(",")(d[1])})
			.attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
			.attr("y", function(d) { return y(d[1])-5; })
			.style("font-size", "80%") 
			.attr("text-anchor", "middle");
		function mouseover(d){  // utility function to be called on mouseover.
			// filter for selected state.
			var st = fData.filter(function(s){ return s.fund == d[0];})[0],
				nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
			// call update functions of pie-chart and legend.    
			pC.update(nD);
			leg.update(nD);
		}
		function mouseout(d){    // utility function to be called on mouseout.
			// reset the pie-chart and legend.    
			pC.update(tF);
			leg.update(tF);
		}
		// create function to update the bars. This will be used by pie-chart.
		hG.update = function(nD, color){
			// update the domain of the y-axis map to reflect change in frequencies.
			y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
			// Attach the new data to the bars.
			var bars = hGsvg.selectAll(".bar").data(nD);
			// transition the height and color of rectangles.
			bars.select("rect").transition().duration(500)
				.attr("y", function(d) {return y(d[1]); })
				.attr("height", function(d) { return hGDim.h - y(d[1]); })
				.attr("fill", color);
			// transition the frequency labels location and change value.
			bars.select("text").transition().duration(500)
				.text(function(d){ return d3.format(",")(d[1])})
				.attr("y", function(d) {return y(d[1])-5; });            
		}        
		return hG;
	}
	// function to handle pieChart.
	function pieChart(pD){
		var pC ={},    pieDim ={w:200, h: 200};
		pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
		// create svg for pie chart.
		var piesvg = d3.select(id).append("svg")
			.attr("width", pieDim.w).attr("height", pieDim.h)
			.append("g")
			.attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
		// create function to draw the arcs of the pie slices.
		var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);
		// create a function to compute the pie slice angles.
		var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });
		// Draw the pie slices.
		piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
			.each(function(d) { this._current = d; })
			.style("fill", function(d) { return segColor(d.data.type); })
			.on("mouseover",mouseover).on("mouseout",mouseout);
		// create function to update pie-chart. This will be used by histogram.
		pC.update = function(nD){
			piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
				.attrTween("d", arcTween);
		}        
		// Utility function to be called on mouseover a pie slice.
		function mouseover(d){
			// call the update function of histogram with new data.
			hG.update(fData.map(function(v){ 
				return [v.fund,v.freq[d.data.type]];}),segColor(d.data.type));
		}
		//Utility function to be called on mouseout a pie slice.
		function mouseout(d){
			// call the update function of histogram with all data.
			hG.update(fData.map(function(v){
				return [v.fund,v.total];}), barColor);
		}
		// Animating the pie-slice requiring a custom function which specifies
		// how the intermediate paths should be drawn.
		function arcTween(a) {
			var i = d3.interpolate(this._current, a);
			this._current = i(0);
			return function(t) { return arc(i(t));    };
		}    
		return pC;
	}
	// function to handle legend.
	function legend(lD){
		var leg = {};
		// create table for legend.
		var legend = d3.select(id).append("table").attr('class','legend');
		// create one row per segment.
		var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
		// create the first column for each segment.
		tr.append("td").append("svg").attr("width", '10').attr("height", '15').append("rect")
			.attr("width", '10').attr("height", '15')
			.attr("fill",function(d){ return segColor(d.type); });
		// create the second column for each segment.
		tr.append("td").text(function(d){ return d.type;});
		// create the third column for each segment.
		tr.append("td").attr("class",'legendFreq')
			.text(function(d){ return d3.format(",")(d.freq);});
		// create the fourth column for each segment.
		tr.append("td").attr("class",'legendPerc')
			.text(function(d){ return getLegend(d,lD);});
		// Utility function to be used to update the legend.
		leg.update = function(nD){
			// update the data attached to the row elements.
			var l = legend.select("tbody").selectAll("tr").data(nD);
			// update the frequencies.
			l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});
			// update the percentage column.
			l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});        
		}
		function getLegend(d,aD){ // Utility function to compute percentage.
			return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
		}
		return leg;
	}
	// calculate total frequency by segment for all state.
	var tF = ["Employment and social inclusion", "Environment, climate change and risk prevention", "Transport", "Tourism and cultural heritage", "Climate Change Adaptation & Risk Prevention", 
		"Competitiveness of SMEs", "Discontinued Measures","Educational & Vocational Training", "Efficient Public Administration", "Environment Protection & Resource Efficiency",
		"Low-Carbon Economy", "Outermost & Sparsely Populated", "Research & Innovation","Social Inclusion", "Sustainable & Quality Employment", "Technical Assistance",
		"Technical Assistance (IPA)", "Multiple Thematic Objectives (ERDF/CF/ESF)", "Network Infrastructures in Transport and Energy"].map(function(d){ 
		return {type:d, freq: Number(d3.sum(fData.map(function(t){ return t.freq[d];})).toFixed(2))
		}; 
	});    
	// calculate total frequency by state for all segment.
	var sF = fData.map(function(d){return [d.fund,d.total];});
	var hG = histoGram(sF), // create the histogram.
		pC = pieChart(tF), // create the pie-chart.
		leg= legend(tF);  // create the legend.
};
/*Data for dashboard*/
freqData2=[];
d3.json('http://88.99.13.199:3000/ms_fund_to_aggregate_df?ms=eq.GR', function(err, mydata) { 
	mydata.forEach(function(val) { 
		var freqData1 = {};
		freqData1["fund"] = val.fund; 
		freqData1["freq"] = { "Employment and social inclusion": val.to1, "Environment, climate change and risk prevention": val.to2, 
		"Transport": val.to3, "Tourism and cultural heritage": val.to4, "Climate Change Adaptation & Risk Prevention": val.to5, 
		"Competitiveness of SMEs":val.to6, "Discontinued Measures":val.to7,
		"Educational & Vocational Training": val.to8, "Efficient Public Administration": val.to9, "Environment Protection & Resource Efficiency": val.to10,
		"Low-Carbon Economy": val.to11, "Outermost & Sparsely Populated": val.to12, "Research & Innovation": val.to13,
		"Social Inclusion": val.to14, "Sustainable & Quality Employment": val.to15, "Technical Assistance": val.to16,
		"Technical Assistance (IPA)": val.to17, "Multiple Thematic Objectives (ERDF/CF/ESF)": val.to18, "Network Infrastructures in Transport and Energy": val.to19,}; 
		freqData2.push(freqData1); 
	}); 
	dashboard('#dashboard',freqData2);
});