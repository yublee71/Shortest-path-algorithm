import { useRef, useEffect } from "react";
import * as d3 from "d3";
import type { Node } from "./graph";

export function GraphCanvas({ nodes }: { nodes: Node[] }) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const w = 600;
    const h = 400;
    const svg = d3.select(svgRef.current).attr("width", w).attr("height", h);
    const xScale = d3.scaleLinear().domain([0, 400]).range([0, w]);
    const yScale = d3.scaleLinear().domain([0, 400]).range([0, h]);

    svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 20)
      .attr("fill", "steelblue");
  }, [nodes]);

  return (
    <svg
      ref={svgRef}
      width="600"
      height="400"
      style={{
        border: "1px solid #ccc",
      }}
    ></svg>
  );
}
