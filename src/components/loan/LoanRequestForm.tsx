import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../ui/Navbar";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/Card";
import { Input } from "../ui/Input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/Select";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import {
  fetchLoanMeta,
  fetchLoanPrefill,
  submitLoanRequest,
} from "../../features/loan/loanSlice";
import type { RootState } from "../../app/store";
import BackIcon from "../../assets/svg/BackIcon.svg";

const LoanRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assessmentId } = useParams<{ assessmentId?: string }>();
  
  const { fundTypes, prefillData, isLoading, isSubmitting, error, submitError } =
    useSelector((state: RootState) => state.loan);

  const [founderName, setFounderName] = useState("");
  const [founderEmail, setFounderEmail] = useState("");
  const [fundsNeeded, setFundsNeeded] = useState("");
  const [fundsNeededDisplay, setFundsNeededDisplay] = useState("");
  const [fundType, setFundType] = useState("");

  // Format number with Indian number system (e.g., 23,34,000)
  const formatIndianNumber = (value: string): string => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, "");
    
    if (!numericValue) return "";
    
    // Convert to number and format with Indian number system
    const num = parseFloat(numericValue);
    if (isNaN(num)) return "";
    
    // Format with Indian numbering system (lakhs and crores)
    return num.toLocaleString("en-IN");
  };

  // Handle funds needed input change
  const handleFundsNeededChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove all non-digit characters for storage
    const numericValue = inputValue.replace(/\D/g, "");
    setFundsNeeded(numericValue);
    // Format for display
    setFundsNeededDisplay(formatIndianNumber(inputValue));
  };

  // Fetch loan meta and prefill data on mount
  useEffect(() => {
    dispatch(fetchLoanMeta() as any);
    
    if (assessmentId) {
      const assessmentIdNum = parseInt(assessmentId, 10);
      if (!isNaN(assessmentIdNum)) {
        dispatch(fetchLoanPrefill(assessmentIdNum) as any);
      }
    }
  }, [dispatch, assessmentId]);

  // Format date helper
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  // Format currency helper
  const formatCurrency = (value: string | null | undefined): string => {
    if (!value) return "-";
    // If it's a number, format it
    const num = parseFloat(value);
    if (!isNaN(num)) {
      if (num >= 10000000) {
        return `${(num / 10000000).toFixed(1)} Crores`;
      } else if (num >= 100000) {
        return `${(num / 100000).toFixed(1)} Lakhs`;
      }
      return num.toLocaleString("en-IN");
    }
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assessmentId) {
      console.error("Assessment ID is required");
      return;
    }

    const assessmentIdNum = parseInt(assessmentId, 10);
    if (isNaN(assessmentIdNum)) {
      console.error("Invalid assessment ID");
      return;
    }

    if (!founderName || !founderEmail || !fundsNeeded || !fundType) {
      console.error("Please fill all required fields");
      return;
    }

    const payload = {
      assessment: assessmentIdNum,
      founder_name: founderName,
      founder_email: founderEmail,
      amount_in_inr: parseFloat(fundsNeeded).toFixed(2),
      fund_type: fundType,
    };

    const result = await dispatch(submitLoanRequest(payload) as any);
    
    if (submitLoanRequest.fulfilled.match(result)) {
      // Navigate back to submission success page
      navigate(`/assessment/${assessmentId}/success`);
    }
  };

  const org = prefillData?.organization;

  const handleBack = () => {
    if (assessmentId) {
      navigate(`/assessment/${assessmentId}/success`);
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-30">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-gray-200">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
                  aria-label="Go back"
                >
                  <img src={BackIcon} alt="Back" className="w-8 h-8" />
                </button>
                <h1 className="text-[24px] font-[400] text-gray-700 font-[Baskervville]">
                  Loan Request Submission
                </h1>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {error && (
                <div className="mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800">
                  {error}
                </div>
              )}
              {submitError && (
                <div className="mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800">
                  {submitError}
                </div>
              )}

              {/* Organization details from prefill API */}
              <section className="space-y-4">
                {isLoading && !prefillData ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">Loading organization details...</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-[14px] font-[300] text-golos text-gray-900">
                    <div className="flex justify-between md:justify-start md:space-x-8">
                      <span className="w-50 text-gray-600 font-[400]">Name of organisation</span>
                      <span className="font-[400]">{org?.name || "-"}</span>
                    </div>
                    <div className="flex justify-between md:justify-start md:space-x-8">
                      <span className="w-50 text-gray-600 font-[400]">Date of incorporation</span>
                      <span className="font-[400]">{formatDate(org?.date_of_incorporation)}</span>
                    </div>

                    <div className="flex justify-between md:justify-start md:space-x-8">
                      <span className="w-50 text-gray-600 font-[400]">DPIIT number</span>
                      <span className="font-[400]">{org?.dpiit_number || "-"}</span>
                    </div>
                    <div className="flex justify-between md:justify-start md:space-x-8">
                      <span className="w-50 text-gray-600 font-[400]">Legal registration type</span>
                      <span className="font-[400]">{org?.legal_registration_type || "-"}</span>
                    </div>

                    <div className="flex justify-between md:justify-start md:space-x-8">
                      <span className="w-50 text-gray-600 font-[400]">CIN number</span>
                      <span className="font-[400]">{org?.cin_number || "-"}</span>
                    </div>
                    <div className="flex justify-between md:justify-start md:space-x-8">
                      <span className="w-50 text-gray-600 font-[400]">POC email</span>
                      <span className="font-[400]">{org?.poc_email || "-"}</span>
                    </div>

                    <div className="flex justify-between md:justify-start md:space-x-8">
                      <span className="w-50 text-gray-600 font-[400]">Focus area</span>
                      <span className="font-[400]">{org?.focus_area || "-"}</span>
                    </div>
                    <div className="flex justify-between md:justify-start md:space-x-8">
                      <span className="w-50 text-gray-600 font-[400]">Type of company</span>
                      <span className="font-[400]">{org?.company_type || "-"}</span>
                    </div>

                    <div className="flex justify-between md:justify-start md:space-x-8">
                      <span className="w-50 text-gray-600 font-[400]">Annual operating budget</span>
                      <span className="font-[400]">{formatCurrency(org?.annual_operating_budget)}</span>
                    </div>
                    <div className="flex justify-between md:justify-start md:space-x-8">
                      <span className="w-50 text-gray-600 font-[400]">Geographical scope of work</span>
                      <span className="font-[400]">{org?.geo_scope || "-"}</span>
                    </div>
                  </div>
                )}
              </section>

              <hr className="border-gray-300" />

              <section className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[14px] font-[400] text-gray-700">
                      Founder's name
                    </label>
                    <Input
                      placeholder="Founder's name"
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      className={cn(
                        "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-[#F5F5F5]",
                        "gradient-border"
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[14px] font-[400] text-gray-700">
                      Founder's email
                    </label>
                    <Input
                      type="email"
                      placeholder="Founder's email"
                      value={founderEmail}
                      onChange={(e) => setFounderEmail(e.target.value)}
                      className={cn(
                        "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-[#F5F5F5]",
                        "gradient-border"
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[14px] font-[400] text-gray-700">
                      Funds needed (in rupees)
                    </label>
                    <Input
                      type="text"
                      placeholder="Type here"
                      value={fundsNeededDisplay}
                      onChange={handleFundsNeededChange}
                      className={cn(
                        "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-[#F5F5F5]",
                        "gradient-border"
                      )}
                      inputMode="numeric"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[14px] font-[400] text-gray-700">
                      Type of fund
                    </label>
                    <Select value={fundType} onValueChange={setFundType}>
                      <SelectTrigger className="gradient-border h-11 bg-[#F5F5F5]">
                        <SelectValue placeholder="Select type of fund" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoading && fundTypes.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
                        ) : (
                          fundTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>
            </CardContent>

            <CardFooter className="pt-4">
              <Button
                type="submit"
                variant={isSubmitting || !founderName || !founderEmail || !fundsNeeded || !fundType ? "outline" : "gradient"}
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting || !founderName || !founderEmail || !fundsNeeded || !fundType}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LoanRequestForm;


