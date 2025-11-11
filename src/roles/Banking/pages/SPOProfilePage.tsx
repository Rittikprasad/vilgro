import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import BackIcon from "../../../assets/svg/BackIcon.svg";
import BankingLayoutWrapper from "../layout/LayoutWrapper";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearAdminSpoDetailError,
  fetchAdminSpoById,
  fetchAdminSpoReport,
  clearAdminSpoReportError,
} from "../../../features/adminSpo/adminSpoSlice";
import type { AdminSpoEntry } from "../../../features/adminSpo/adminSpoTypes";

const formatDate = (value: string | null | undefined) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return value;
  }
};

const BankingSPOProfilePage: React.FC = () => {
  const { spoId } = useParams<{ spoId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const numericId = spoId ? Number(spoId) : NaN;

  const { selected, isDetailLoading, detailError, isReportDownloading, reportError } =
    useAppSelector((state) => state.adminSpo);

  const activeSpo: AdminSpoEntry | null =
    selected && !Number.isNaN(numericId) && selected.id === numericId ? selected : null;

  useEffect(() => {
    if (Number.isNaN(numericId)) return;
    if (!activeSpo) {
      void dispatch(fetchAdminSpoById(numericId));
    }
  }, [dispatch, numericId, activeSpo]);

  const assessmentRows = useMemo(() => {
    if (!activeSpo) return [];
    const incorporationDate = formatDate(activeSpo.organization?.date_of_incorporation);
    const loanStatus = activeSpo.loan_eligible ? "Eligible" : "Not eligible";
    return [
      {
        id: `assessment-${activeSpo.id}`,
        date: incorporationDate,
        score: "Impact: –  Risk: –  Return: –",
        instrument: activeSpo.organization?.type_of_innovation ?? "Not specified",
        loanRequest: loanStatus,
      },
    ];
  }, [activeSpo]);

  const organization = activeSpo?.organization;
  const displayName =
    organization?.name ??
    ([activeSpo?.first_name, activeSpo?.last_name].filter(Boolean).join(" ").trim() ||
      activeSpo?.email ||
      "SPO Profile");

  const handleRetry = () => {
    if (Number.isNaN(numericId)) return;
    dispatch(clearAdminSpoDetailError());
    void dispatch(fetchAdminSpoById(numericId));
  };

  const handleGenerateReport = async () => {
    if (!activeSpo) return;
    try {
      const result = await dispatch(fetchAdminSpoReport(activeSpo.id)).unwrap();
      const blobUrl = window.URL.createObjectURL(result.blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", result.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      dispatch(clearAdminSpoReportError());
    } catch (error) {
      console.error("Banking SPO report generation failed", error);
    }
  };

  if (Number.isNaN(numericId)) {
    return (
      <BankingLayoutWrapper>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          Invalid SPO identifier.&nbsp;
          <button type="button" className="underline" onClick={() => navigate("/banking/dashboard")}>
            Go back to list.
          </button>
        </div>
      </BankingLayoutWrapper>
    );
  }

  return (
    <BankingLayoutWrapper>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center"
              aria-label="Go back"
            >
              <img src={BackIcon} alt="Back" className="w-8 h-8" />
            </button>
            <h1
              className="text-gray-800"
              style={{
                fontFamily: "Baskervville",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "30px",
                textTransform: "capitalize",
              }}
            >
              {displayName}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="gradient" onClick={handleGenerateReport} disabled={isReportDownloading || !activeSpo}>
              {isReportDownloading ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </div>

        {reportError && (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs font-golos text-yellow-800">
            {reportError}
          </div>
        )}

        {detailError && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{detailError}</span>
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-500"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-[400] font-golos text-gray-800">Assessment Summary</h2>
                  <p className="text-[13px] font-[400] font-golos text-gray-400">
                    Overall instrument and scoring breakdown
                  </p>
                </div>
              </div>

              {isDetailLoading && !activeSpo ? (
                <div className="flex justify-center py-16 text-sm text-gray-500">Loading SPO profile...</div>
              ) : assessmentRows.length === 0 ? (
                <div className="mt-6 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-[13px] font-[300] font-golos text-gray-500">
                  Assessment information is not available yet.
                </div>
              ) : (
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="text-left text-[11px] font-[400] font-golos uppercase tracking-wider text-gray-400">
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Score</th>
                        <th className="px-4 py-3">Instrument</th>
                        <th className="px-4 py-3">Loan Request</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                      {assessmentRows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{row.date}</td>
                          <td className="px-4 py-3">{row.score}</td>
                          <td className="px-4 py-3">{row.instrument}</td>
                          <td className="px-4 py-3">{row.loanRequest}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              className="text-[#69C24E] underline transition-colors hover:text-[#46B753]"
                            >
                              View Answers
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
              <div>
                <h2 className="text-[18px] font-[400] font-golos text-gray-800">Organization Info</h2>
                <div className="mt-4 space-y-3 text-[13px] font-[400] font-golos text-gray-600">
                  <div className="flex justify-between gap-4">
                    <span className="font-[400] font-golos text-gray-700">Name of Organisation</span>
                    <span className="text-right text-gray-500">{organization?.name ?? "Not provided"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-[400] font-golos text-gray-700">Date of incorporation</span>
                    <span className="text-right text-gray-500">
                      {formatDate(organization?.date_of_incorporation)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-[400] font-golos text-gray-700">Focus Sector</span>
                    <span className="text-right text-gray-500">
                      {organization?.focus_sector ?? "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-[400] font-golos text-gray-700">Registration Type</span>
                    <span className="text-right text-gray-500">
                      {organization?.registration_type ?? "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-[400] font-golos text-gray-700">CIN Number</span>
                    <span className="text-right text-gray-500">{organization?.cin_number ?? "Not provided"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-[400] font-golos text-gray-700">GST Number</span>
                    <span className="text-right text-gray-500">{organization?.gst_number ?? "Not provided"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <h3 className="font-[400] font-golos text-gray-800">Point of Contact</h3>
                <div className="flex justify-between gap-4">
                  <span className="font-[400] font-golos text-gray-700">Name</span>
                  <span className="text-right text-gray-500">
                    {[activeSpo?.first_name, activeSpo?.last_name].filter(Boolean).join(" ") || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-[400] font-golos text-gray-700">Email ID</span>
                  <span className="text-right text-gray-500">{activeSpo?.email ?? "Not provided"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-[400] font-golos text-gray-700">Phone</span>
                  <span className="text-right text-gray-500">{activeSpo?.phone ?? "Not provided"}</span>
                </div>
              </div>

              <Button
                variant="gradient"
                onClick={() => {
                  if (activeSpo?.email) {
                    window.location.href = `mailto:${activeSpo.email}`;
                  }
                }}
                disabled={!activeSpo?.email}
              >
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </BankingLayoutWrapper>
  );
};

export default BankingSPOProfilePage;

