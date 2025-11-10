import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutWrapper from "../layout/LayoutWrapper";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import EmailIcon from "../../../assets/svg/email.svg";
import type { AppDispatch, RootState } from "../../../app/store";
import {
  clearAdminReviewsError,
  fetchAdminReviews,
} from "../../../features/adminReviews/adminReviewsSlice";
import type { AdminReviewEntry } from "../../../features/adminReviews/adminReviewsTypes";

interface ReviewRecord {
  id: string;
  date: string;
  user: string;
  organization: string;
  status: "Completed" | "Incomplete";
  review: string;
  raw: AdminReviewEntry;
}

const ReviewsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, error } = useSelector(
    (state: RootState) => state.adminReviews
  );
  const [sortOrder, setSortOrder] = useState<"new_to_old" | "old_to_new">("new_to_old");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchReviews = useCallback(() => {
    void dispatch(fetchAdminReviews());
  }, [dispatch]);

  useEffect(() => {
    if (!items || items.length === 0) {
      fetchReviews();
    }
  }, [fetchReviews, items]);

  const mapReviewEntry = (entry: AdminReviewEntry): ReviewRecord => {
    const createdDate = entry.created_at ? new Date(entry.created_at) : null;
    const dateLabel = createdDate
      ? createdDate.toLocaleDateString("en-GB")
      : "-";
    const statusNormalized = (entry.status ?? "").toLowerCase();
    const statusLabel = statusNormalized === "completed" ? "Completed" : "Incomplete";
    const userLabel =
      entry.user_name ??
      entry.user?.name ??
      entry.user?.email ??
      "Unknown user";
    const organizationLabel =
      entry.organization_name ??
      entry.organization?.name ??
      "N/A";

    return {
      id: `#${entry.id.toString().padStart(5, "0")}`,
      date: dateLabel,
      user: userLabel,
      organization: organizationLabel,
      status: statusLabel,
      review: entry.review ?? "",
      raw: entry,
    };
  };

  const mappedReviews = useMemo(
    () => items.map(mapReviewEntry),
    [items]
  );

  const sortedReviews = useMemo(() => {
    const sorted = [...mappedReviews].sort((a, b) => {
      const dateA = new Date(a.raw.created_at ?? "").getTime() || 0;
      const dateB = new Date(b.raw.created_at ?? "").getTime() || 0;
      if (sortOrder === "new_to_old") {
        return dateB - dateA;
      }
      return dateA - dateB;
    });
    return sorted;
  }, [mappedReviews, sortOrder]);

  const totalItems = sortedReviews.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedReviews.slice(startIndex, startIndex + pageSize);
  }, [sortedReviews, currentPage, pageSize]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const getStatusColor = (status: ReviewRecord["status"]) =>
    status === "Completed" ? "text-green-600" : "text-[#FF6B55]";

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
            Reviews
          </h1>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600"
              onClick={() => dispatch(clearAdminReviewsError())}
            >
              Filters
            </Button>
            <Button
              variant="outline"
              className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600"
              onClick={() =>
                setSortOrder((prev) => (prev === "new_to_old" ? "old_to_new" : "new_to_old"))
              }
            >
              Sort by: {sortOrder === "new_to_old" ? "New to old" : "Old to new"}
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={fetchReviews}
                  className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-500"
                >
                  Retry
                </button>
              </div>
            )}
            {isLoading ? (
              <div className="flex justify-center py-16 text-sm text-gray-500">
                Loading reviews...
              </div>
            ) : totalItems === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-[13px] font-[400] font-golos text-gray-500">
                No reviews found.
              </div>
            ) : (
            <div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                      ID
                    </th>
                    <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                      User
                    </th>
                    <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                      Organization Name
                    </th>
                    <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                      Review
                    </th>
                    <th className="px-6 text-center text-[12px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedRows.map((row, index) => (
                    <tr key={`${row.id}-${index}`} className="hover:bg-gray-50">
                        <td
                          className="px-6 whitespace-nowrap text-sm font-medium text-gray-900"
                          style={{ paddingTop: "16px", paddingBottom: "16px" }}
                        >
                        {row.id}
                      </td>
                        <td
                        className="px-6 whitespace-nowrap text-sm text-gray-900"
                        style={{
                          fontFamily: "Golos Text",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "12px",
                          verticalAlign: "middle",
                          paddingTop: "16px",
                          paddingBottom: "16px",
                        }}
                        >
                          {row.date}
                        </td>
                        <td
                        className="px-6 whitespace-nowrap text-sm text-gray-900"
                        style={{
                          fontFamily: "Golos Text",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "12px",
                          verticalAlign: "middle",
                          paddingTop: "16px",
                          paddingBottom: "16px",
                        }}
                        >
                          {row.user}
                        </td>
                        <td
                        className="px-6 whitespace-nowrap text-sm text-gray-900"
                        style={{
                          fontFamily: "Golos Text",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "12px",
                          verticalAlign: "middle",
                          paddingTop: "16px",
                          paddingBottom: "16px",
                        }}
                        >
                        {row.organization}
                      </td>
                        <td
                          className={`px-6 whitespace-nowrap text-sm ${getStatusColor(row.status)}`}
                          style={{ paddingTop: "16px", paddingBottom: "16px" }}
                        >
                        {row.status}
                      </td>
                        <td
                        className="px-6 text-sm text-gray-900"
                        style={{
                          fontFamily: "Golos Text",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "12px",
                          verticalAlign: "middle",
                          paddingTop: "16px",
                          paddingBottom: "16px",
                        }}
                        >
                        {row.review}
                      </td>
                        <td
                          className="px-6 whitespace-nowrap text-center"
                          style={{ paddingTop: "16px", paddingBottom: "16px" }}
                        >
                        <button
                          type="button"
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                          title="Email"
                        >
                          <img src={EmailIcon} alt="Email" className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-[12px] font-[400] font-golos text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-700">
                    {Math.min(currentPage * pageSize, totalItems)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">{totalItems}</span>{" "}
                  results
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[12px] font-[400] font-golos text-gray-600">
                    Rows per page
                    <select
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-[12px] font-golos text-gray-700 focus:border-[#46B753] focus:outline-none focus:ring-1 focus:ring-[#46B753]"
                    >
                      {[5, 10, 20, 50].map((size) => (
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
                      disabled={currentPage === 1}
                      className="rounded-md border border-gray-300 px-3 py-1 text-[12px] font-[500] font-golos text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white"
                    >
                      Previous
                    </button>
                    <span className="text-[12px] font-[400] font-golos text-gray-600">
                      Page <span className="font-semibold text-gray-800">{currentPage}</span> of{" "}
                      <span className="font-semibold text-gray-800">{totalPages}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
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

export default ReviewsPage;
