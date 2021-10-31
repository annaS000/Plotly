function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h5").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    //  5. Create a variable that holds the first sample in the array.
    var result = data.samples.filter(i => i.id == sample)[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var  otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels.slice(0, 10).reverse();
    var sample_values = result.sample_values.slice(0,10).reverse();

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.map(i => `OTU ${i} `).slice(0,10).reverse();

    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values,
      y: yticks,
      type: "bar",
      marker: {color: 'rgb(255,48,174)'},
      orientation: "h",
      text: otu_labels 
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     xaxis: {color:'rgba(245,246,249,1)'},
     font: {
      size: 14,
      color: 'rgba(245,246,249,1)'},
     paper_bgcolor: "rgb(43, 43, 44)",
     plot_bgcolor: "rgb(43, 43, 44)"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

     // 1. Create the trace for the bubble chart.
     var bubble_labels = result.otu_labels;
    var bubble_values = result.sample_values;

     var bubbleData = [{
      x: otu_ids,
      y: bubble_values,
      text: bubble_labels,
      mode: "markers",
       marker: {
        size: bubble_values,
        color: bubble_values,
        colorscale: 'Blues',
        opacity: 1
       }
     }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      paper_bgcolor: "rgb(43, 43, 44)",
      plot_bgcolor: "rgb(43, 43, 44)",
      font: {
        size: 14,
        color: 'rgba(245,246,249,1)'},
      xaxis: {
        title: "OTU ID",
        color:'rgba(245,246,249,1)'},
      yaxis: {color:'rgba(245,246,249,1)'},
      autosize: true,
      automargin: true,
      hovermode: "closest"
  };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    

    // 4. Create the trace for the gauge chart.
    var gauge_result = data.metadata.filter(i => i.id == sample)[0];
    var wfreq = gauge_result.wfreq;
    console.log(wfreq)

    var gaugeData = [{
      value: wfreq,
      title: {
        text: "Belly Button Washing Frequency <br></br> Scrubs per Week",
        size: 12},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null,10], dtick:2},
        bar: {color: "black"},
        steps:[
          {range: [0, 2], color: "rgb(255,177,177)"},
          {range: [2, 4], color: "rgb(255,211,128)"},
          {range: [4, 6], color: "rgb(252,253,118)"},
          {range: [6, 8], color: "rgb(161,251,134)"},
          {range: [8, 10], color: "rgb(113,178,251)"}
        ],
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     xaxis: {title: 'Scrubs per Week'},
     paper_bgcolor: "rgb(43, 43, 44)",
     autosize: true,
     automargin: true,
     font: {
      color: 'rgba(245,246,249,1)'},
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
