
// Create array of Id's for dropdown
var dropdownMenu = d3.select("#selDataset");
d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    
    sampleNames.forEach((sampleID) => {
        dropdownMenu
            .append("option")
            .text(sampleID)
            .property("value", sampleID);
    });
});


// Populate demo panel
function ShowDemoInfo(desiredSampleID)
{
    console.log("ShowDemoInfo: sample = ", desiredSampleID);

// Make array of metadata
    d3.json("samples.json").then((data) =>
     {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == desiredSampleID);
        var result = resultArray[0];
        console.log(result);

        var demoPanel = d3.select("#sample-metadata");
       
// loop to display each set of metadata
       Object.entries(result).forEach(([key, value]) => 
       {
           var demoText = `${key}: ${value}`;

           demoPanel.append("h6").text(demoText);
         });
    });
}
// Draw bar graph
function DrawBargraph(desiredSampleID)
{
    // console.log("DrawBargraph: sample = ", sampleID);
    d3.json("samples.json").then((data) => 
    {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == desiredSampleID);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
    
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var  barData = [
            {
                x: sample_values.slice(0, 10).reverse(),
                y: yticks,
                type: "bar",
                text: otu_labels.slice(0, 10).reverse(),
                orientation: "h"
            }
        ];

        var barLayout = {
                    title:"Bellybutton Microbes",
                    margin: {t: 30, l:150}
        };
        
        Plotly.newPlot("bar", barData, barLayout);

    });
}

// Draw bubble chart
function DrawBubbleChart(desiredSampleID)
{
    console.log("DrawBubbleChart: sample = ", desiredSampleID);

    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == desiredSampleID);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var bubbleData = [
            {x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
                }   
            }
        ]
        var bubbleLayout ={
            title: 'OTU ID',
            height: 500,
            width: 1200
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}
// Write option change function
function optionChanged(newSampleID) 
{
    console.log("Dropdown changed to: ", newSampleID); 

    ShowDemoInfo(newSampleID);
    DrawBargraph(newSampleID);
    DrawBubbleChart(newSampleID);    
}

//Write init function to build metadata and charts
function Init() 
{
    console.log ("Initializing screen");


    //Put the ID's in the drop down box
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
    
        sampleNames.forEach((sampleID) =>
        {
            selector
                .append("option")
                .text(sampleID)
                .property("value", sampleID);
        });

        var sampleID = sampleNames[0];

        DrawBargraph(sampleID);
        DrawBubbleChart(sampleID);
        ShowDemoInfo(sampleID);

    });

}

Init();