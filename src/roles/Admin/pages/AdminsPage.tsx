import React, { useCallback, useEffect, useMemo, useState } from "react";
import LayoutWrapper from "../layout/LayoutWrapper";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import ViewIcon from "../../../assets/svg/view.svg";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Input } from "../../../components/ui/Input";
import { cn } from "../../../lib/utils";
import { Eye, EyeOff } from "lucide-react";
import {
  clearAdminDetailsError,
  createAdminDetail,
  fetchAdminDetails,
  updateAdminDetail,
} from "../../../features/adminDetails/adminDetailsSlice";
import type { AdminDetailsEntry } from "../../../features/adminDetails/adminDetailsTypes";
import { showNotification } from "../../../services/notificationService";

const AdminsPage: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const {
    items,
    count,
    isLoading,
    error,
    isCreating,
    createError,
    isUpdating,
    updateError,
  } = useAppSelector((state) => state.adminDetails);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminDetailsEntry | null>(null);
  const initialFormState = useMemo(
    () => ({
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    }),
    []
  );
  const [formState, setFormState] = useState(initialFormState);
  const [localError, setLocalError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleToggleAccess = useCallback(
    async (admin: AdminDetailsEntry) => {
      const nextStatus = !admin.is_active;
      setTogglingId(admin.id);
      try {
        await dispatch(
          updateAdminDetail({
            id: admin.id,
            data: { is_active: nextStatus },
          })
        ).unwrap();

        showNotification({
          type: "success",
          title: "Admin Updated",
          message: `${admin.email} is now ${nextStatus ? "active" : "inactive"}.`,
          duration: 4000,
        });
      } catch (err) {
        showNotification({
          type: "error",
          title: "Status Update Failed",
          message:
            typeof err === "string"
              ? err
              : "We could not update the admin status. Please try again.",
          duration: 5000,
        });
      } finally {
        setTogglingId(null);
      }
    },
    [dispatch]
  );


  // Fetch all admins once on mount and when needed (no pagination params)
  const fetchAdmins = useCallback(() => {
    void dispatch(fetchAdminDetails(undefined));
  }, [dispatch]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const adminList = useMemo(() => {
    return items.map((admin: AdminDetailsEntry) => {
      const fullName = [admin.first_name, admin.last_name].filter(Boolean).join(" ").trim();
      return {
        id: `#${admin.id}`,
        name: fullName.length > 0 ? fullName : admin.email,
        status: admin.is_active ? "Active" : "Inactive",
        access: admin.is_active,
        email: admin.email,
        raw: admin,
      };
    });
  }, [items]);

  const filteredAdmins = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = adminList.filter(
      (admin) =>
        admin.id.toLowerCase().includes(term) ||
        admin.name.toLowerCase().includes(term) ||
        admin.email.toLowerCase().includes(term)
    );

    return filtered.sort((a, b) => {
      return b.id.localeCompare(a.id);
    });
  }, [adminList, searchTerm]);

  const totalItems = searchTerm ? filteredAdmins.length : count || filteredAdmins.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAdmins.slice(startIndex, startIndex + pageSize);
  }, [filteredAdmins, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
            Admins
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
            <Button
              variant="gradient"
              className="px-4 py-2"
              onClick={() => {
                dispatch(clearAdminDetailsError());
                setLocalError(null);
                setEditingAdmin(null);
                setShowPassword(false);
                setFormState(initialFormState);
                setIsModalOpen(true);
              }}
            >
              Add Admin
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
                  onClick={fetchAdmins}
                  className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-500"
                >
                  Retry
                </button>
              </div>
            )}
            {isLoading ? (
              <div className="flex justify-center py-16 text-sm text-gray-500">
                Loading admins...
              </div>
            ) : paginatedRows.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-[13px] font-[400] font-golos text-gray-500">
                No admin records found.
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
                        Admin Name
                      </th>
                      <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 text-left text-[10px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        Access
                      </th>
                      <th className="px-6 text-center text-[12px] font-[400] font-golos uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paginatedRows.map((admin, index) => (
                      <tr key={`${admin.id}-${index}`} className="hover:bg-gray-50">
                        <td
                          className="px-6 whitespace-nowrap text-sm font-medium text-gray-900"
                          style={{ paddingTop: "16px", paddingBottom: "16px" }}
                        >
                          {admin.id}
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
                          {admin.name}
                        </td>
                        <td
                          className={`px-6 whitespace-nowrap text-sm ${
                            admin.status === "Active" ? "text-green-600" : "text-[#FF6B55]"
                          }`}
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
                          {admin.status}
                        </td>
                        <td
                          className="px-6 whitespace-nowrap text-sm"
                          style={{ paddingTop: "16px", paddingBottom: "16px" }}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleAccess(admin.raw)}
                            disabled={togglingId === admin.raw.id || isUpdating}
                            className={cn(
                              "flex h-5 w-10 items-center rounded-full px-1 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                              admin.raw.is_active ? "bg-[#46B753] focus:ring-[#46B753]" : "bg-gray-300 focus:ring-gray-400",
                              (togglingId === admin.raw.id || isUpdating) && "opacity-60 cursor-not-allowed"
                            )}
                            aria-pressed={admin.raw.is_active}
                            aria-label={`Toggle access for ${admin.name}`}
                          >
                            <span
                              className={cn(
                                "h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
                                admin.raw.is_active ? "translate-x-4" : "translate-x-0"
                              )}
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
                            dispatch(clearAdminDetailsError());
                            setLocalError(null);
                            setEditingAdmin(admin.raw);
                            setShowPassword(false);
                            setFormState({
                              email: admin.raw.email ?? "",
                              firstName: admin.raw.first_name ?? "",
                              lastName: admin.raw.last_name ?? "",
                              password: "",
                            });
                            setIsModalOpen(true);
                          }}
                            >
                              <img src={ViewIcon} alt="View" className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              className="text-[#FF6B55] hover:text-[#d95340] p-1 rounded hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                              >
                                <path d="M9 3a1 1 0 0 0-1 1v1H5.5a.75.75 0 0 0 0 1.5h13a.75.75 0 0 0 0-1.5H16V4a1 1 0 0 0-1-1H9Zm1.5 6.25a.75.75 0 0 0-1.5 0v7a.75.75 0 0 0 1.5 0v-7Zm4 0a.75.75 0 0 0-1.5 0v7a.75.75 0 0 0 1.5 0v-7Z" />
                                <path d="M6.25 8.5a.75.75 0 0 0-.75.75V18a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V9.25a.75.75 0 0 0-1.5 0V18a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V9.25a.75.75 0 0 0-.75-.75Z" />
                              </svg>
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
            setEditingAdmin(null);
            setShowPassword(false);
            dispatch(clearAdminDetailsError());
            setFormState(initialFormState);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="mb-6 text-start text-[18px] font-[700] font-golos text-gray-900">
              {editingAdmin ? "Update Admin Profile" : "Create Admin Profile"}
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
                const trimmedEmail = formState.email.trim();
                const trimmedFirstName = formState.firstName.trim();
                const trimmedLastName = formState.lastName.trim();
                const trimmedPassword = formState.password.trim();

                if (!trimmedEmail || !trimmedFirstName || !trimmedLastName) {
                  setLocalError("Email, first name, and last name are mandatory.");
                  return;
                }

                if (!editingAdmin && !trimmedPassword) {
                  setLocalError("Password is required when creating a new admin.");
                  return;
                }

                const payloadBase = {
                  email: trimmedEmail,
                  first_name: trimmedFirstName,
                  last_name: trimmedLastName,
                  ...(trimmedPassword ? { password: trimmedPassword } : {}),
                };

                try {
                  if (editingAdmin) {
                    await dispatch(
                      updateAdminDetail({
                        id: editingAdmin.id,
                        data: payloadBase,
                      })
                    ).unwrap();
                    showNotification({
                      type: "success",
                      title: "Admin Updated",
                      message: `Admin profile for ${trimmedEmail} has been successfully updated.`,
                      duration: 4000,
                    });
                  } else {
                    await dispatch(createAdminDetail(payloadBase)).unwrap();
                    showNotification({
                      type: "success",
                      title: "Admin Created",
                      message: `Admin profile for ${trimmedEmail} has been successfully created.`,
                      duration: 4000,
                    });
                  }

                  fetchAdmins();
                  setIsModalOpen(false);
                  setEditingAdmin(null);
                  setShowPassword(false);
                  setFormState(initialFormState);
                } catch (err) {
                  if (typeof err === "string") {
                    setLocalError(err);
                  } else {
                    setLocalError("Something went wrong. Please try again.");
                  }
                }
              }}
            >
              <div>
                <label className="mb-2 block text-[13px] font-[500] font-golos text-gray-700">
                  Email
                </label>
                <Input
                  required
                  type="email"
                  value={formState.email}
                  disabled={editingAdmin !== null}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="Enter admin email"
                  className={cn(
                    "gradient-border h-11 px-4 text-sm",
                    editingAdmin !== null ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"
                  )}
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-[500] font-golos text-gray-700">
                  First Name
                </label>
                <Input
                  required
                  value={formState.firstName}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, firstName: event.target.value }))
                  }
                  placeholder="Enter first name"
                  className="gradient-border h-11 bg-white px-4 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-[500] font-golos text-gray-700">
                  Last Name
                </label>
                <Input
                  required
                  value={formState.lastName}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, lastName: event.target.value }))
                  }
                  placeholder="Enter last name"
                  className="gradient-border h-11 bg-white px-4 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-[500] font-golos text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formState.password}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, password: event.target.value }))
                    }
                    placeholder={editingAdmin ? "Leave blank to keep current password" : "Enter password"}
                    className="gradient-border h-11 bg-white px-4 pr-12 text-sm"
                    required={!editingAdmin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#46b753] transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setLocalError(null);
                    setEditingAdmin(null);
                    setShowPassword(false);
                    dispatch(clearAdminDetailsError());
                    setFormState(initialFormState);
                  }}
                  className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-[13px] font-[500] font-golos text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 rounded-lg py-2.5 text-[13px] font-[500] font-golos text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    background: "linear-gradient(92.06deg, #46B753 0.02%, #E0DC32 100.02%)",
                  }}
                >
                  {editingAdmin
                    ? isUpdating
                      ? "Updating..."
                      : "Update Admin"
                    : isCreating
                    ? "Creating..."
                    : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
};

export default AdminsPage;
