import React, { useEffect, useState } from "react";
import LayoutWrapper from "../layout/LayoutWrapper";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import BackIcon from "../../../assets/svg/BackIcon.svg";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearAdminProfileError,
  fetchAdminProfile,
} from "../../../features/adminProfile/adminProfileSlice";

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, organization, isLoading, error } = useAppSelector(
    (state) => state.adminProfile
  );
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) {
      void dispatch(fetchAdminProfile());
    } else {
      setFormState({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [dispatch, user]);

  const handleInputChange =
    (key: keyof typeof formState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const formatDate = (value: string | null | undefined) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return value;
    }
  };

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => window.history.back()} aria-label="Go back">
              <img src={BackIcon} alt="Back" className="w-8 h-8" />
            </button>
            <h1
              className="text-gray-800"
              style={{
                fontFamily: "Baskervville",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "30px",
              }}
            >
              Profile
            </h1>
          </div>
          <Button variant="gradient">Change Password</Button>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => {
                dispatch(clearAdminProfileError());
                void dispatch(fetchAdminProfile());
              }}
              className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-500"
            >
              Retry
            </button>
          </div>
        )}

        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-8">
            {isLoading && !user ? (
              <div className="flex justify-center py-16 text-sm text-gray-500">
                Loading profile...
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr]">
                <div className="space-y-6">
                  <EditableField
                    label="First Name"
                    value={formState.first_name}
                    onChange={handleInputChange("first_name")}
                  />
                  <EditableField
                    label="Last Name"
                    value={formState.last_name}
                    onChange={handleInputChange("last_name")}
                  />
                  <EditableField
                    label="Email"
                    value={formState.email}
                    onChange={handleInputChange("email")}
                  />
                  <EditableField
                    label="Phone Number"
                    value={formState.phone}
                    onChange={handleInputChange("phone")}
                  />
                </div>

                <div className="hidden h-full w-px rounded-full bg-[#69C24E] lg:block" />

                <div className="space-y-6">
                  <ReadOnlyField label="Name of Organisation" value={organization?.name ?? "-"} />
                  <ReadOnlyField
                    label="Date of incorporation"
                    value={formatDate(organization?.date_of_incorporation ?? null)}
                  />
                  <ReadOnlyField label="DPIIT Number" value={organization?.gst_number ?? "-"} />
                  <ReadOnlyField
                    label="Legal Registration type"
                    value={organization?.registration_type ?? "-"}
                  />
                  <ReadOnlyField label="CIN Number" value={organization?.cin_number ?? "-"} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-start">
          <Button variant="gradient">
            Update Profile
          </Button>
        </div>
      </div>
    </LayoutWrapper>
  );
};

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onChange }) => (
  <div className="flex items-center gap-2">
    <span className="w-40 font-golos text-[14px] font-[500] text-gray-600">{label}</span>
    <Input
      value={value}
      onChange={onChange}
      className="flex-1 rounded-none border-0 border-b border-[#69C24E] bg-transparent font-golos text-sm text-gray-900 focus:border-[#46B753] focus:outline-none focus:ring-0"
    />
  </div>
);

interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({ label, value }) => (
  <div className="flex items-center gap-4">
    <span className="w-40 font-golos text-[14px] font-[500] text-gray-800">{label}</span>
    <span className="flex-1 border-b border-transparent px-0 py-2 font-golos text-[14px] text-gray-600">
      {value}
    </span>
  </div>
);

export default ProfilePage;

