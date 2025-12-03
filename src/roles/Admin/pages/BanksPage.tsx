import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutWrapper from "../layout/LayoutWrapper";
import { Input } from "../../../components/ui/Input";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/utils";
import ViewIcon from "../../../assets/svg/view.svg";
// import EmailIcon from "../../../assets/svg/email.svg";
import type { AppDispatch, RootState } from "../../../app/store";
import {
  clearAdminBankError,
  createAdminBank,
  fetchAdminBanks,
  updateAdminBank,
  deleteAdminBank,
} from "../../../features/adminBank/adminBankSlice";
import type { AdminBankStatus } from "../../../features/adminBank/adminBankTypes";
import ConfirmationModal from "../../../components/ui/ConfirmationModal";
import { showNotification } from "../../../services/notificationService";

const DeleteIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path d="M9 3a1 1 0 0 0-1 1v1H5.5a.75.75 0 0 0 0 1.5h13a.75.75 0 0 0 0-1.5H16V4a1 1 0 0 0-1-1H9Zm1.5 6.25a.75.75 0 0 0-1.5 0v7a.75.75 0 0 0 1.5 0v-7Zm4 0a.75.75 0 0 0-1.5 0v7a.75.75 0 0 0 1.5 0v-7Z" />
    <path d="M6.25 8.5a.75.75 0 0 0-.75.75V18a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V9.25a.75.75 0 0 0-1.5 0V18a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V9.25a.75.75 0 0 0-.75-.75Z" />
  </svg>
);

const BanksPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items,
    isLoading,
    error,
    isCreating,
    createError,
    isUpdating,
    updateError,
    isDeleting,
    deleteError,
  } = useSelector((state: RootState) => state.adminBank);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialFormState: {
    name: string;
    password: string;
    contactEmail: string;
    contactPhone: string;
    status: AdminBankStatus;
  } = {
    name: "",
    password: "",
    contactEmail: "",
    contactPhone: "",
    status: "ACTIVE",
  };
  const [formState, setFormState] = useState(initialFormState);
  const [localError, setLocalError] = useState<string | null>(null);
  const [editingBank, setEditingBank] = useState<number | null>(null);
  const [bankToDelete, setBankToDelete] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchBanks = useCallback(() => {
    void dispatch(fetchAdminBanks());
  }, [dispatch]);

  useEffect(() => {
    if (!items || items.length === 0) {
      fetchBanks();
    }
  }, [fetchBanks, items]);

  const processedBanks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = items.filter((bank) => {
      if (!term) return true;
      return (
        bank.name.toLowerCase().includes(term) ||
        bank.contact_email.toLowerCase().includes(term) ||
        bank.id.toString().includes(term)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return sorted.map((bank) => ({
      raw: bank,
      id: `#${bank.id.toString().padStart(5, "0")}`,
      bankName: bank.name || "N/A",
      contact: bank.contact_email || "N/A",
      emailUpdates: bank.status === "ACTIVE",
    }));
  }, [items, searchTerm]);

  const totalItems = processedBanks.length;
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
    return processedBanks.slice(startIndex, startIndex + pageSize);
  }, [processedBanks, currentPage, pageSize]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
  };

  const openDeleteModal = (id: number) => {
    setLocalError(null);
    dispatch(clearAdminBankError());
    setBankToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) {
      return;
    }
    setIsDeleteModalOpen(false);
    setBankToDelete(null);
  };

  const handleDelete = async () => {
    if (bankToDelete == null || isDeleting) {
      return;
    }

    try {
      await dispatch(deleteAdminBank(bankToDelete)).unwrap();
      closeDeleteModal();
    } catch (err) {
      // Error surface via deleteError
      console.error("Failed to delete bank", err);
    }
  };

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
            <h1
              className="text-gray-800"
              style={{
                fontFamily: "Baskervville",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "30px",
              }}
            >
              List of Banks
            </h1>
          </div>

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
            <Button
              variant="gradient"
              className="px-4 py-2"
              onClick={() => {
                dispatch(clearAdminBankError());
                setLocalError(null);
                setFormState(initialFormState);
                setIsModalOpen(true);
              }}
            >
              Add Bank
            </Button>
          </div>
        </div>
        
        {(error || deleteError) && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error ?? deleteError}</span>
            <button
              type="button"
              onClick={() => {
                setLocalError(null);
                dispatch(clearAdminBankError());
                fetchBanks();
              }}
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
                Loading banks...
              </div>
            ) : totalItems === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-[13px] font-[400] font-golos text-gray-500">
                No banks found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        Username
                      </th>
                      <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        Bank Name
                      </th>
                      <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        Contact
                      </th>
                      <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        ACCESS
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
                          {row.bankName}
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
                          {row.contact}
                        </td>
                        <td
                          className="px-6 whitespace-nowrap text-sm"
                          style={{ paddingTop: "16px", paddingBottom: "16px" }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              const newStatus: AdminBankStatus = row.emailUpdates ? "INACTIVE" : "ACTIVE";
                              void dispatch(
                                updateAdminBank({
                                  id: row.raw.id,
                                  data: {
                                    name: row.raw.name ?? "",
                                    contact_email: row.raw.contact_email ?? "",
                                    contact_phone: row.raw.contact_phone ?? "",
                                    status: newStatus,
                                  },
                                })
                              );
                            }}
                            className={`flex h-5 w-10 items-center rounded-full px-1 transition-colors ${
                              row.emailUpdates ? "bg-[#46B753]" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                                row.emailUpdates ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </td>
                        <td
                          className="px-6 whitespace-nowrap text-center"
                          style={{ paddingTop: "16px", paddingBottom: "16px" }}
                        >
                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                        className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                              title="View"
                          onClick={() => {
                            dispatch(clearAdminBankError());
                            setLocalError(null);
                            setEditingBank(row.raw.id);
                            setFormState({
                              name: row.raw.name ?? "",
                              password: "",
                              contactEmail: row.raw.contact_email ?? "",
                              contactPhone: row.raw.contact_phone?.replace(/^\+91/, '') ?? "",
                              status: row.raw.status ?? "ACTIVE",
                            });
                            setIsModalOpen(true);
                          }}
                            >
                          <img src={ViewIcon} alt="View" className="h-5 w-5" />
                            </button>
                            {/* <button
                              type="button"
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                              title="Email"
                            >
                          <img src={EmailIcon} alt="Email" className="h-5 w-5" />
                            </button> */}
                            <button
                              type="button"
                              className="text-[#FF6B55] hover:text-[#d95340] p-1 rounded hover:bg-red-50 transition-colors"
                              title="Delete"
                              onClick={() => openDeleteModal(row.raw.id)}
                            >
                              <DeleteIcon />
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

      {isModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4"
          onClick={() => {
            setIsModalOpen(false);
            setLocalError(null);
            setEditingBank(null);
            dispatch(clearAdminBankError());
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="mb-6 text-start text-[18px] font-[700] font-golos text-gray-900">
              {editingBank !== null ? "Update Bank Profile" : "Create a Bank Profile"}
            </h2>
            {(localError || createError || updateError) && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-[400] font-golos text-red-600">
                {localError ?? createError ?? updateError}
              </div>
            )}
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                setLocalError(null);
                try {
                  if (editingBank !== null) {
                    const updateData: any = {
                      name: formState.name.trim(),
                      contact_email: formState.contactEmail.trim(),
                      contact_phone: formState.contactPhone.trim() ? `+91${formState.contactPhone.trim()}` : formState.contactPhone.trim(),
                      status: formState.status,
                    };
                    if (formState.password.trim()) {
                      updateData.password = formState.password.trim();
                    }
                    await dispatch(
                      updateAdminBank({
                        id: editingBank,
                        data: updateData,
                      })
                    ).unwrap();
                    showNotification({
                      type: "success",
                      title: "Bank Updated",
                      message: `Bank profile for ${formState.name.trim()} has been successfully updated.`,
                      duration: 4000,
                    });
                  } else {
                    await dispatch(
                      createAdminBank({
                        name: formState.name.trim(),
                        password: formState.password.trim(),
                        contact_email: formState.contactEmail.trim(),
                        contact_phone: formState.contactPhone.trim() ? `+91${formState.contactPhone.trim()}` : formState.contactPhone.trim(),
                        status: formState.status,
                      })
                    ).unwrap();
                    showNotification({
                      type: "success",
                      title: "Bank Created",
                      message: `Bank profile for ${formState.name.trim()} has been successfully created.`,
                      duration: 4000,
                    });
                  }
                  setIsModalOpen(false);
                  setFormState(initialFormState);
                  setEditingBank(null);
                } catch (err) {
                  setLocalError(typeof err === "string" ? err : "Failed to create bank");
                }
              }}
            >
              <div>
                <label className="mb-2 block text-[13px] font-[500] font-golos text-gray-700">
                  Bank Name
                </label>
                <Input
                  required
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Enter bank name"
                  className="gradient-border h-11 bg-white px-4 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-[500] font-golos text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  required={editingBank === null}
                  value={formState.password}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, password: event.target.value }))
                  }
                  placeholder={editingBank !== null ? "Leave blank to keep current password" : "Enter password"}
                  className="gradient-border h-11 bg-white px-4 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-[500] font-golos text-gray-700">
                  Contact Email
                </label>
                <Input
                  required
                  type="email"
                  value={formState.contactEmail}
                  disabled={editingBank !== null}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, contactEmail: event.target.value }))
                  }
                  placeholder="Enter email"
                  className={cn(
                    "gradient-border h-11 px-4 text-sm",
                    editingBank !== null ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"
                  )}
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-[500] font-golos text-gray-700">
                  Contact Phone
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-600 font-golos">
                    +91
                  </span>
                  <Input
                    type="tel"
                    value={formState.contactPhone}
                    onChange={(event) => {
                      // Remove +91 if user tries to type it, and only allow digits
                      const value = event.target.value.replace(/^\+91\s*/, '').replace(/\D/g, '');
                      setFormState((prev) => ({ ...prev, contactPhone: value }));
                    }}
                    placeholder="Enter phone number"
                    className="gradient-border h-11 bg-white pl-12 pr-4 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-[500] font-golos text-gray-700">
                  Status
                </label>
                <select
                  value={formState.status}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      status: event.target.value as typeof formState.status,
                    }))
                  }
                  className="gradient-border h-11 w-full rounded-md bg-white px-4 text-sm text-gray-800 focus:outline-none"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setLocalError(null);
                      setEditingBank(null);
                    dispatch(clearAdminBankError());
                  }}
                  className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-[13px] font-[500] font-golos text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Cancel
                </button>
                  <button
                  type="submit"
                    disabled={isCreating || isUpdating}
                  className="flex-1 rounded-lg py-2.5 text-[13px] font-[500] font-golos text-black transition-opacity hover:opacity-90"
                  style={{
                    background: "linear-gradient(92.06deg, #46B753 0.02%, #E0DC32 100.02%)",
                  }}
                >
                    {editingBank !== null
                      ? isUpdating
                        ? "Updating..."
                        : "Update Profile"
                      : isCreating
                      ? "Creating..."
                      : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Bank"
        message="Are you sure you want to delete this bank profile? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />
    </LayoutWrapper>
  );
};

export default BanksPage;
