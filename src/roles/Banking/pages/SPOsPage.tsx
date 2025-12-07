import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/Card";
import ViewIcon from "../../../assets/svg/view.svg";
import { fetchBankSpos, setSelectedBankingSpo, type BankingSpoFilters } from "../../../features/bankingSpo/bankingSpoSlice";
import type { BankingSpoEntry } from "../../../features/bankingSpo/bankingSpoTypes";
import type { AppDispatch, RootState } from "../../../app/store";
import BankingLayoutWrapper from "../layout/LayoutWrapper";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { cn } from "../../../lib/utils";
import BankingSPOsFilterModal from "../components/BankingSPOsFilterModal";
import { exportToCSV } from "../../../lib/csvExport";

const BankingSPOsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, count, isLoading, error } = useSelector((state: RootState) => state.bankingSpo);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<BankingSpoFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Initial fetch on mount
  useEffect(() => {
    dispatch(fetchBankSpos({}) as any);
  }, [dispatch]);

  const handleApplyFilters = (newFilters: BankingSpoFilters) => {
    // Merge with existing search query
    const mergedFilters = { ...newFilters, q: filters.q };
    setFilters(mergedFilters);
    setCurrentPage(1);
    dispatch(fetchBankSpos(mergedFilters) as any);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const newFilters = { ...filters, q: query.trim() || undefined };
    setFilters(newFilters);
    setCurrentPage(1);
    dispatch(fetchBankSpos(newFilters) as any);
  };

  const hasActiveDateFilters = !!(filters.start_date || filters.end_date);

  // Format date range for display
  const formatDateRange = (from?: string, to?: string) => {
    if (!from || !to) {
      return "All Time";
    }
    const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      return "All Time";
    }

    return `${formatter.format(fromDate)} - ${formatter.format(toDate)}`;
  };

  const filterText = useMemo(() => {
    if (filters.start_date && filters.end_date) {
      return formatDateRange(filters.start_date, filters.end_date);
    }
    if (filters.start_date || filters.end_date) {
      // If only one date is selected, show it
      const date = filters.start_date || filters.end_date;
      if (date) {
        const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
        const dateObj = new Date(date);
        if (!Number.isNaN(dateObj.getTime())) {
          return formatter.format(dateObj);
        }
      }
    }
    return "All Time";
  }, [filters.start_date, filters.end_date]);

  const formattedRows = useMemo(() => {
    if (!Array.isArray(items)) {
      return [];
    }
    return items.map((item: BankingSpoEntry) => ({
      id: `#${item.id}`,
      sector: item.focus_sector ?? "-",
      organizationName: item.organization_name ?? "N/A",
      contactEmail: item.email,
      instrument: item.instrument?.name ?? "-",
      loanRequest: item.last_loan_request_submitted_at ? "Submitted" : "Not Submitted",
      raw: item,
    }));
  }, [items]);

  const totalItems = count || formattedRows.length;
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
    if (status === "Submitted") return "text-green-600";
    if (status === "Not Submitted") return "text-gray-500";
    return "text-gray-500";
  };

  // Export all SPO data to CSV
  const handleExport = () => {
    if (items.length === 0) {
      console.warn('No SPO data to export');
      return;
    }

    // Prepare data for export with all relevant fields
    const exportData = items.map((item: BankingSpoEntry) => ({
      ID: item.id,
      'First Name': item.first_name || '',
      'Last Name': item.last_name || '',
      'Email': item.email || '',
      'Status': item.is_active ? 'Active' : 'Inactive',
      'Date Joined': item.date_joined || '',
      'Organization Name': item.organization_name || '',
      'Focus Sector': item.focus_sector || '',
      'Organization Created At': item.org_created_at || '',
      'Last Assessment Submitted At': item.last_assessment_submitted_at || '',
      'Last Loan Request Submitted At': item.last_loan_request_submitted_at || '',
      'Instrument': item.instrument?.name || '',
      'Overall Score': item.scores?.overall || '',
      'Impact Score': item.scores?.sections?.IMPACT || '',
      'Risk Score': item.scores?.sections?.RISK || '',
      'Return Score': item.scores?.sections?.RETURN || '',
    }));

    // Generate filename with current date
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `Banking_SPOs_Export_${dateStr}`;

    // Export to CSV
    exportToCSV(exportData, filename);
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
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={cn(
                  "w-64 h-10 px-4 py-2 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-white",
                  "gradient-border"
                )}
              />
            </div>
            <Button 
              variant="outline" 
              className="px-4 py-2"
              onClick={() => setIsFilterModalOpen(true)}
            >
              Filters
            </Button>
            <Button 
              variant="gradient" 
              className="px-4 py-2"
              onClick={handleExport}
              disabled={isLoading || items.length === 0}
            >
              Export
            </Button>
            {hasActiveDateFilters && (
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                {filterText}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => dispatch(fetchBankSpos(filters) as any)}
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
                                dispatch(setSelectedBankingSpo(item.raw));
                                navigate(`/banking/spos/${item.raw.id}`);
                              }}
                            >
                              <img src={ViewIcon} alt="View" className="h-5 w-5" />
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
      
      <BankingSPOsFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </BankingLayoutWrapper>
  );
};

export default BankingSPOsPage;

