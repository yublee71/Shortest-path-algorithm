import type { Edge, Node } from "../models/Graph";

interface BellmanFordResult {
  distances: Record<string, number>;
  previousNodes: Record<string, string | null>;
  hasNegativeCycle: boolean;
}

export function bellmanFord(
  nodes: Node[],
  edges: Edge[],
  sourceNodeId: string
): BellmanFordResult {
  const distances: Record<string, number> = {};
  const previousNodes: Record<string, string | null> = {};

  for (const node of nodes) {
    distances[node.id] = node.id === sourceNodeId ? 0 : Infinity;
    previousNodes[node.id] = null;
  }

  for (let i = 0; i < nodes.length - 1; i++) {
    for (const edge of edges) {
      if (distances[edge.fromNodeId] === Infinity) {
        continue;
      }

      const nextDistance = distances[edge.fromNodeId] + edge.weight;

      if (distances[edge.toNodeId] > nextDistance) {
        distances[edge.toNodeId] = nextDistance;
        previousNodes[edge.toNodeId] = edge.fromNodeId;
      }
    }
  }

  const hasNegativeCycle = edges.some((edge) => {
    if (distances[edge.fromNodeId] === Infinity) {
      return false;
    }

    return distances[edge.toNodeId] > distances[edge.fromNodeId] + edge.weight;
  });

  return {
    distances,
    previousNodes,
    hasNegativeCycle,
  };
}


// void BellmanFord(Edge edges[], int edgecount, int nodecount, int source)
// {
// 	int i,j ;
// 	int* distance = malloc(nodecount*sizeof(int));
// 	for(i = 0; i < nodecount; i++)
// 	{
// 		if(i == source) distance[i] = 0;
// 		else distance[i] = INFINITY;
// 	}
// 	for(i = 0; i < nodecount; i++)
// 	{
// 		for(j = 0; j < edgecount; j++)
// 		{
// 			/*
// 			 * Note that INFINITY is actually a finite number in this code, so because of overflow
// 			 * "distance[edges[j].source] + edges[j].weight" can be a very small number,
// 			 * in fact smaller than "distance[edges[j].dest]".
// 			 *
// 			 * One solution is to skip the following if-statement,
// 			 * if "distance[edges[j].source]" == INFINITY
// 			 */
// 			if(distance[edges[j].dest] > distance[edges[j].source] + edges[j].weight)
// 			{
// 				distance[edges[j].dest] = distance[edges[j].source] + edges[j].weight;
// 			}
// 		}
// 	}
// 	for(i = 0; i < edgecount; i++)
// 	{
// 		if(distance[edges[i].dest] > distance[edges[i].source] + edges[i].weight)
// 		{
// 			printf("Error occurred. Negative edge weight cycles detected");
// 			break;
// 		}
// 	}
// 	for(i = 0; i < nodecount; i++)
// 	{
// 		printf("The shortest distance between nodes %i and %i is %i\n", source, i, distance[i]);
// 	}
// }
