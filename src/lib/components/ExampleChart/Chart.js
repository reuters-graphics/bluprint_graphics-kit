import * as d3 from 'd3';

import { appendSelect } from 'd3-appendselect';
import { merge } from 'lodash-es';

d3.selection.prototype.appendSelect = appendSelect;

/**
 * Write your chart as a class with a single draw method that draws
 * your chart! This component inherits from a base class you can
 * see and customize in the baseClasses folder.
 */
class MyChartClass {
  selection(selector) {
    if (!selector) return this._selection;
    this._selection = d3.select(selector);
    return this;
  }

  data(newData) {
    if (!newData) return this._data || this.defaultData;
    this._data = newData;
    return this;
  }

  props(newProps) {
    if (!newProps) return this._props || this.defaultProps;
    this._props = merge(this._props || this.defaultProps, newProps);
    return this;
  }

  /**
   * Default data for your chart. Generally, it's NOT a good idea to import
   * a big dataset and assign it here b/c it'll make your component quite
   * large in terms of file size. At minimum, though, you should assign an
   * empty Array or Object, depending on what your chart expects.
   */
  defaultData = [
    { x: 10, y: 35, r: 5 },
    { x: 40, y: 30, r: 10 },
    { x: 70, y: 70, r: 15 },
  ];

  /**
   * Default props are the built-in styles your chart comes with
   * that you want to allow a user to customize. Remember, you can
   * pass in complex data here, like default d3 axes or accessor
   * functions that can get properties from your data.
   */
  defaultProps = {
    aspectHeight: 0.7,
    margin: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 35,
    },
    fill: '#99cccc',
  };

  /**
   * Write all your code to draw your chart in this function!
   * Remember to use appendSelect!
   */
  draw() {
    const data = this.data(); // Data passed to your chart
    const props = this.props(); // Props passed to your chart

    const { margin } = props;

    const container = this.selection().node();
    const { width: containerWidth } = container.getBoundingClientRect(); // Respect the width of your container!

    const width = containerWidth - margin.left - margin.right;
    const height =
      containerWidth * props.aspectHeight - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);

    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    const rScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.r))
      .range([10, 25]);

    const plot = this.selection()
      .appendSelect('svg') // 👈 Use appendSelect instead of append for non-data-bound elements!
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .appendSelect('g.plot')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxis = d3.axisBottom(xScale).tickSize(10).ticks(5);

    const yAxis = d3.axisLeft(yScale).tickSize(10).ticks(5);

    plot
      .appendSelect('g.axis.x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    plot.appendSelect('g.axis.y').call(yAxis);

    const transition = plot.transition().duration(500);

    /**
     * We're using d3's new data join method here.
     * Read more about that here: https://observablehq.com/@d3/selection-join
     * ... or feel free to use the old, reliable General Update Pattern.
     */
    plot
      .selectAll('circle')
      .data(data)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('cy', (d) => yScale(d.y))
            .attr('cx', (d) => xScale(d.x))
            .attr('r', (d) => rScale(d.r)),
        (update) =>
          update.call((update) =>
            update
              .transition(transition)
              .attr('cy', (d) => yScale(d.y))
              .attr('cx', (d) => xScale(d.x))
              .attr('r', (d) => rScale(d.r))
          )
      )
      .style('fill', props.fill);

    return this; // Generally, always return the chart class from draw!
  }
}

export default MyChartClass;
