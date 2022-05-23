import { MutableRefObject, ReactNode, useCallback, useMemo } from "react";
import { List, CellMeasurerCache } from "react-virtualized";
import { usePrevious } from "@dewo/app/util/hooks";
import _ from "lodash";
import { useTaskViewFields } from "../views/hooks";

export interface VirtualizedListRow {
  id?: string;
  key: string;
  hidden?: boolean;
  render(): ReactNode;
}

export function useRecalculateVirtualizedListRowHeight(
  cache: CellMeasurerCache,
  list: MutableRefObject<List | null>,
  rows: VirtualizedListRow[]
): {
  recalculateRowHeight(id: string): void;
} {
  const ids = useMemo(() => rows.map((r) => r.id), [rows]);
  const keys = useMemo(() => rows.map((r) => r.key), [rows]);
  const prevKeys = usePrevious(keys);

  const recalculateDeps = [keys, cache, list];
  const prevPecalculateDeps = recalculateDeps.map(usePrevious);
  const recalculate = !recalculateDeps.every(
    (dep, index) => prevPecalculateDeps[index] === dep
  );
  if (recalculate) {
    if (!!prevKeys && !_.isEqual(keys, prevKeys)) {
      const prevHeights = prevKeys?.map((_key, index) =>
        cache.rowHeight({ index })
      );

      const width = cache.columnWidth({ index: 0 });
      const prevIndexByKey = prevKeys.reduce<Record<string, number>>(
        (acc, keys, index) => ({ ...acc, [keys]: index }),
        {}
      );

      cache.clearAll();
      keys.forEach((key, index) => {
        const height = prevHeights[prevIndexByKey[key]];
        if (!!height && height !== cache.defaultHeight) {
          cache.set(index, 0, width, height);
        }
      });

      list.current?.recomputeRowHeights();
    }
  }

  const fields = useTaskViewFields();
  const resetDeps = [fields];
  const prevResetDeps = resetDeps.map(usePrevious);
  const reset = !resetDeps.every((dep, index) => prevResetDeps[index] === dep);
  if (reset) {
    cache.clearAll();
    list.current?.recomputeRowHeights();
  }

  const recalculateRowHeight = useCallback(
    (id: string) => {
      const index = ids.indexOf(id);
      cache.clear(index, 0);
      list.current?.recomputeRowHeights();
    },
    [ids, cache, list]
  );

  return { recalculateRowHeight };
}
