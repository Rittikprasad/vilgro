import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutWrapper from "../layout/LayoutWrapper";
import { Card, CardContent } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import type { AppDispatch, RootState } from "../../../app/store";
import { cn } from "../../../lib/utils";
import {
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
  const [searchTerm, setSearchTerm] = useState("");
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
    // Use date field from API, fallback to created_at
    const dateValue = entry?.date || entry?.created_at;
    const createdDate = dateValue ? new Date(dateValue) : null;
    const dateLabel = createdDate && !isNaN(createdDate.getTime())
      ? createdDate.toLocaleDateString("en-GB")
      : "-";
    
    const statusNormalized = (entry?.status ?? "").toLowerCase();
    const statusLabel = statusNormalized === "completed" ? "Completed" : "Incomplete";
    
    // Use user_email from API, fallback to other fields
    const userLabel =
      entry?.user_email ??
      entry?.user_name ??
      entry?.user?.email ??
      entry?.user?.name ??
      "Unknown user";
    
    const organizationLabel =
      entry?.organization_name ??
      entry?.organization?.name ??
      "N/A";
    const idValue = entry?.id ?? 0;

    return {
      id: `#${idValue.toString().padStart(5, "0")}`,
      date: dateLabel,
      user: userLabel,
      organization: organizationLabel,
      status: statusLabel,
      review: entry?.review ?? "",
      raw: entry,
    };
  };

  const mappedReviews = useMemo(
    () =>
      items
        .filter((entry): entry is AdminReviewEntry => entry !== null && entry !== undefined)
        .map(mapReviewEntry),
    [items]
  );

  const filteredAndSortedReviews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = mappedReviews.filter((review) => {
      if (!term) return true;
      return (
        review.id.toLowerCase().includes(term) ||
        review.user.toLowerCase().includes(term) ||
        review.organization.toLowerCase().includes(term) ||
        review.review.toLowerCase().includes(term) ||
        review.date.toLowerCase().includes(term)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.raw.date ?? a.raw.created_at ?? "").getTime() || 0;
      const dateB = new Date(b.raw.date ?? b.raw.created_at ?? "").getTime() || 0;
      return dateB - dateA;
    });
    return sorted;
  }, [mappedReviews, searchTerm]);

  const totalItems = filteredAndSortedReviews.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedReviews.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedReviews, currentPage, pageSize]);

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
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-64 h-10 px-4 py-2 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-white",
                  "gradient-border"
                )}
              />
            </div>
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
                        {row.review || "-"}
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
