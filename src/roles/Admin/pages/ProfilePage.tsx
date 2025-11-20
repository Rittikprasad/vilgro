import React, { useEffect, useMemo, useState } from "react";
import LayoutWrapper from "../layout/LayoutWrapper";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import BackIcon from "../../../assets/svg/BackIcon.svg";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearAdminProfileError,
  clearUpdateError,
  fetchAdminProfile,
  updateAdminProfile,
} from "../../../features/adminProfile/adminProfileSlice";
import { showNotification } from "../../../services/notificationService";

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isUpdating, updateError } = useAppSelector(
    (state) => state.adminProfile
  );
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [originalValues, setOriginalValues] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) {
      void dispatch(fetchAdminProfile());
    } else {
      const initialValues = {
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      };
      setFormState(initialValues);
      setOriginalValues({
        first_name: initialValues.first_name,
        last_name: initialValues.last_name,
        phone: initialValues.phone,
      });
    }
  }, [dispatch, user]);

  // Check if form has changes
  const hasChanges = useMemo(() => {
    return (
      formState.first_name !== originalValues.first_name ||
      formState.last_name !== originalValues.last_name ||
      formState.phone !== originalValues.phone
    );
  }, [formState, originalValues]);

  const handleInputChange =
    (key: keyof typeof formState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleUpdate = async () => {
    try {
      await dispatch(
        updateAdminProfile({
          first_name: formState.first_name,
          last_name: formState.last_name,
          phone: formState.phone,
        })
      ).unwrap();
      
      // Update original values to reflect the new state
      setOriginalValues({
        first_name: formState.first_name,
        last_name: formState.last_name,
        phone: formState.phone,
      });
      
      // Show success notification
      showNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.',
        duration: 4000,
      });
    } catch (err) {
      console.error("Failed to update profile", err);
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

        {updateError && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{updateError}</span>
            <button
              type="button"
              onClick={() => {
                dispatch(clearUpdateError());
              }}
              className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-500"
            >
              Dismiss
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
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
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
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <ReadOnlyField
                    label="Email"
                    value={formState.email}
                  />
                  <EditableField
                    label="Phone Number"
                    value={formState.phone}
                    onChange={handleInputChange("phone")}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-start">
          <Button 
            variant="gradient" 
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Profile"}
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
  <div className="flex items-center gap-2">
    <span className="w-40 font-golos text-[14px] font-[500] text-gray-600">{label}</span>
    <div className="flex-1 rounded-none border-0 border-b border-gray-300 bg-transparent font-golos text-sm text-gray-500 py-2">
      {value}
    </div>
  </div>
);

export default ProfilePage;

