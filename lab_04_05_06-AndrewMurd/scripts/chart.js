// YOUR CODE GOES HERE

function generateGraph(data) {
    d3.select('svg').remove();
    const margin = 50;
    const width = 500;
    const height = 400;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    const colourScale = d3.scaleLinear()
                            .domain([0, 1])
                            .range(['white', 'blue']);
    
    var xScale = d3.scaleBand() // discrete, bucket
                        .domain(data.map((data) => data.grade))
                        .range([0, chartWidth])
                        .padding(0.3);
    
    var yScale = d3.scaleLinear()
                        .domain([0, 1])
                        .range([chartHeight, 0]);

    let svg = d3.select('#chart')
                    .append('svg')
                        .attr('width', width)
                        .attr('height', height);

    // title
    svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin)
            .attr('text-anchor', 'middle')
            .text('Grade Distribution');

    // x-axis label
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 6)
        .attr('text-anchor', 'middle')
        .text('Grade');

    //y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 )
        .attr('x', 0 - (height / 2))
        .attr('dy', '0.75em')
        .style('text-anchor', 'middle')
        .text('Frequency (%)')

    
    // create a group (g) for the bars
    let g = svg.append('g')
                    .attr('transform', `translate(${margin}, ${margin})`);

    // y-axis
    g.append('g')
        .call(d3.axisLeft(yScale));
    
    // x-axis
    g.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale));
    
    let rectangles = g.selectAll('rect')
        .data(data)
        .enter()
            .append('rect')
                .attr('x', (data) => xScale(data.grade))
                .attr('y', (data) => yScale(data.frequency))
                .attr('width', xScale.bandwidth())
                .attr('height', (data) => chartHeight - yScale(data.frequency))
                .attr('fill', (data) => colourScale(data.frequency));

    rectangles.transition()
        .ease(d3.easeElastic)
        .attr('height', (data) => chartHeight - yScale(data.frequency))
        .attr('y', (data) => yScale(data.frequency))
        .duration(1000)
        .delay((data, index) => index * 50);
}
