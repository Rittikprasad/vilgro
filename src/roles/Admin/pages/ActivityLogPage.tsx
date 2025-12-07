import React, { useCallback, useEffect, useMemo, useState } from "react";
import LayoutWrapper from "../layout/LayoutWrapper";
import { Card, CardContent } from "../../../components/ui/Card";
// import { Button } from "../../../components/ui/Button";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearAdminActivityLogError,
  fetchAdminActivityLog,
} from "../../../features/adminActivityLog/adminActivityLogSlice";
import type { AdminActivityLogEntry } from "../../../features/adminActivityLog/adminActivityLogTypes";

const formatTimestamp = (isoString: string) => {
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
};

const ActivityLogPage: React.FC = () => {
  const [sortOrder, setSortOrder] = useState<"new_to_old" | "old_to_new">("new_to_old");
  const [localPage, setLocalPage] = useState<number>(1);
  const [localPageSize, setLocalPageSize] = useState<number>(20);
  const dispatch = useAppDispatch();
  const { items, count, isLoading, error, currentPage, pageSize } = useAppSelector(
    (state) => state.adminActivityLog
  );

  const fetchLogs = useCallback(
    (page: number, size: number) => {
      void dispatch(fetchAdminActivityLog({ page, pageSize: size }));
    },
    [dispatch]
  );

  // Sync local state with Redux state on mount
  useEffect(() => {
    if (currentPage && currentPage !== localPage) {
      setLocalPage(currentPage);
    }
    if (pageSize && pageSize !== localPageSize) {
      setLocalPageSize(pageSize);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchLogs(localPage, localPageSize);
  }, [fetchLogs, localPage, localPageSize]);

  const sortedLogs = useMemo(() => {
    const logs = [...items];
    logs.sort((a, b) => {
      const first = new Date(a.created_at).getTime();
      const second = new Date(b.created_at).getTime();
      return sortOrder === "new_to_old" ? second - first : first - second;
    });
    return logs;
  }, [items, sortOrder]);

  // Use count from API for total pages calculation
  const totalPages = Math.max(1, Math.ceil(count / localPageSize));

  const handlePrev = () => {
    setLocalPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setLocalPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(event.target.value);
    setLocalPageSize(newSize);
    setLocalPage(1);
  };

  const handleRetry = () => {
    dispatch(clearAdminActivityLogError());
    fetchLogs(localPage, localPageSize);
  };

  // The API already handles pagination, so we just use sortedLogs directly
  // No need for client-side pagination slicing since items already contains only the current page
  const displayLogs = sortedLogs;

  useEffect(() => {
    if (localPage > totalPages && totalPages > 0) {
      setLocalPage(totalPages);
    }
  }, [localPage, totalPages]);

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1
            className="text-gray-800"
            style={{
              fontFamily: "Baskervville",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "30px",
            }}
          >
            Activity Log
          </h1>

          {/* <Button
            variant="outline"
            className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600"
            onClick={() =>
              setSortOrder((prev) => (prev === "new_to_old" ? "old_to_new" : "new_to_old"))
            }
          >
            Sort by: {sortOrder === "new_to_old" ? "New to old" : "Old to new"}
          </Button> */}
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            {error && (
              <div className="mb-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-500"
                >
                  Retry
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-16 text-sm text-gray-500">
                Loading activity logs...
              </div>
            ) : displayLogs.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-[13px] font-[400] font-golos text-gray-500">
                No activity logs found.
              </div>
            ) : (
              <div className="space-y-4">
                {displayLogs.map((entry: AdminActivityLogEntry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-[14px] font-[500] font-golos text-gray-800">
                          {entry.help_text}
                        </p>
                        <p className="mt-1 text-[12px] font-[400] font-golos text-gray-500">
                          {entry.actor_email ?? "System"}
                        </p>
                      </div>
                      <p className="text-[12px] font-[400] font-golos text-gray-400">
                        {formatTimestamp(entry.created_at)}
                      </p>
                    </div>
                    <div className="mt-3 grid gap-2 text-[12px] font-[400] font-golos text-gray-600 md:grid-cols-2">
                      <span>
                        <strong className="text-gray-700">Action:</strong> {entry.action}
                      </span>
                      <span>
                        <strong className="text-gray-700">Method:</strong> {entry.meta.method}
                      </span>
                      <span>
                        <strong className="text-gray-700">Status:</strong> {entry.meta.status}
                      </span>
                      <span className="break-all">
                        <strong className="text-gray-700">Path:</strong> {entry.meta.path}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 md:flex-row md:items-center md:justify-between">
                  <div className="text-[12px] font-[400] font-golos text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {count > 0 ? Math.min((localPage - 1) * localPageSize + 1, count) : 0}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-700">
                      {Math.min(localPage * localPageSize, count)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">{count}</span> results
                  </div>

                  <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-4">
                    <div className="flex items-center gap-2 text-[12px] font-[400] font-golos text-gray-600">
                      Rows per page
                      <select
                        value={localPageSize}
                        onChange={handlePageSizeChange}
                        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-[12px] font-golos text-gray-700 focus:border-[#46B753] focus:outline-none focus:ring-1 focus:ring-[#46B753]"
                      >
                        {[10, 20, 50, 100].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={localPage === 1}
                        className="rounded-md border border-gray-300 px-3 py-1 text-[12px] font-[500] font-golos text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white"
                      >
                        Previous
                      </button>
                      <span className="text-[12px] font-[400] font-golos text-gray-600">
                        Page <span className="font-semibold text-gray-800">{localPage}</span> of{" "}
                        <span className="font-semibold text-gray-800">{totalPages}</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={localPage === totalPages}
                        className="rounded-md border border-gray-300 px-3 py-1 text-[12px] font-[500] font-golos text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
};

export default ActivityLogPage;

