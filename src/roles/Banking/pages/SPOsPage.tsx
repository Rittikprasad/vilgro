import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/Card";
import ViewIcon from "../../../assets/svg/view.svg";
import EmailIcon from "../../../assets/svg/email.svg";
import { fetchAdminSpos, setSelectedAdminSpo } from "../../../features/adminSpo/adminSpoSlice";
import type { AdminSpoEntry } from "../../../features/adminSpo/adminSpoTypes";
import type { AppDispatch, RootState } from "../../../app/store";
import BankingLayoutWrapper from "../layout/LayoutWrapper";
import { Button } from "../../../components/ui/Button";

const BankingSPOsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, isLoading, error } = useSelector((state: RootState) => state.adminSpo);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchSpos = useCallback(() => {
    void dispatch(fetchAdminSpos());
  }, [dispatch]);

  useEffect(() => {
    if (!items || items.length === 0) {
      fetchSpos();
    }
  }, [fetchSpos, items]);

  const formattedRows = useMemo(() => {
    return items.map((item: AdminSpoEntry) => ({
      id: `#${item.id}`,
      sector: item.organization?.focus_sector ?? "-",
      organizationName: item.organization?.name ?? "N/A",
      contactEmail: item.email,
      instrument: item.organization?.type_of_innovation ?? "-",
      loanRequest: item.loan_eligible ? "Eligible" : "Non Eligible",
      raw: item,
    }));
  }, [items]);

  const totalItems = formattedRows.length;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, totalItems]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return formattedRows.slice(startIndex, startIndex + pageSize);
  }, [formattedRows, currentPage, pageSize]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(event.target.value);
    setPageSize(newSize);
  };

  const getLoanRequestColor = (status: string) => {
    if (status === "Eligible") return "text-green-600";
    if (status === "Non Eligible") return "text-red-600";
    if (status === "Submitted") return "text-blue-600";
    return "text-gray-500";
  };

  return (
    <BankingLayoutWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1
            className="text-gray-800"
            style={{
              fontFamily: "Baskervville",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "35px",
            }}
          >
            SPOs Management
          </h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="px-4 py-2">
              Search
            </Button>
            <Button variant="outline" className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600">
              Filters
            </Button>
            <Button variant="outline" className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600">
              Sort by: New to old
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>
            <button
              type="button"
              onClick={fetchSpos}
              className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-500"
            >
              Retry
            </button>
          </div>
        )}

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-16 text-sm text-gray-500">
                Loading SPOs...
              </div>
            ) : totalItems === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-[13px] font-[400] font-golos text-gray-500">
                No SPO records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        ID
                      </th>
                      <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        Sector
                      </th>
                      <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        Organization Name
                      </th>
                      <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        Contact Email ID
                      </th>
                      <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        Instrument
                      </th>
                      <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        Loan Request
                      </th>
                      <th className="px-6 text-center text-[12px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paginatedRows.map((item, index) => (
                      <tr key={`${item.id}-${index}`} className="hover:bg-gray-50">
                        <td
                          className="px-6 whitespace-nowrap text-sm font-medium text-gray-900"
                          style={{ paddingTop: "16px", paddingBottom: "16px" }}
                        >
                          {item.id}
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
                          {item.sector}
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
                          {item.organizationName}
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
                          {item.contactEmail}
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
                          {item.instrument}
                        </td>
                        <td
                          className={`px-6 whitespace-nowrap text-sm ${getLoanRequestColor(item.loanRequest)}`}
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
                          {item.loanRequest}
                        </td>
                        <td
                          className="px-6 whitespace-nowrap text-center"
                          style={{ paddingTop: "16px", paddingBottom: "16px" }}
                        >
                          <div className="flex items-center justify-center gap-3">
                            <button
                              className="rounded p-1 text-green-600 transition-colors hover:bg-green-50 hover:text-green-800"
                              title="View"
                              type="button"
                              onClick={() => {
                                dispatch(setSelectedAdminSpo(item.raw));
                                navigate(`/banking/spos/${item.raw.id}`);
                              }}
                            >
                              <img src={ViewIcon} alt="View" className="h-5 w-5" />
                            </button>
                            <button
                              className="rounded p-1 text-green-600 transition-colors hover:bg-green-50 hover:text-green-800"
                              title="Email"
                              type="button"
                            >
                              <img src={EmailIcon} alt="Email" className="h-5 w-5" />
                            </button>
                          </div>
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
    </BankingLayoutWrapper>
  );
};

export default BankingSPOsPage;

