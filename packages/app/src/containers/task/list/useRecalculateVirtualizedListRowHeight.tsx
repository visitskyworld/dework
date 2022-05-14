import { MutableRefObject, ReactNode, useEffect, useMemo } from "react";
import { List, CellMeasurerCache } from "react-virtualized";
import { usePrevious } from "@dewo/app/util/hooks";
import _ from "lodash";
import { useTaskViewFields } from "../views/hooks";

export interface VirtualizedListRow {
  id: string;
  hidden?: boolean;
  render(): ReactNode;
}

export function useRecalculateVirtualizedListRowHeight(
  cache: CellMeasurerCache,
  list: MutableRefObject<List | null>,
  rows: VirtualizedListRow[]
) {
  const ids = useMemo(() => rows.map((r) => r.id), [rows]);
  const prevIds = usePrevious(ids);

  useEffect(() => {
    if (!!prevIds && !_.isEqual(ids, prevIds)) {
      const prevHeights = prevIds?.map((_id, index) =>
        cache.rowHeight({ index })
      );

      const width = cache.columnWidth({ index: 0 });
      const prevIndexById = prevIds.reduce<Record<string, number>>(
        (acc, id, index) => ({ ...acc, [id]: index }),
        {}
      );

      cache.clearAll();
      ids.forEach((id, index) => {
        const height = prevHeights[prevIndexById[id]];
        if (!!height && height !== cache.defaultHeight) {
          cache.set(index, 0, width, height);
        }
      });

      list.current?.recomputeRowHeights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, cache, list]);

  const fields = useTaskViewFields();

  const deps = [fields];
  const prevDeps = deps.map(usePrevious);
  const reset = !deps.every((dep, index) => prevDeps[index] === dep);
  if (reset) {
    cache.clearAll();
    list.current?.recomputeRowHeights();
  }
}
