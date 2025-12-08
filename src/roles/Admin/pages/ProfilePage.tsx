import React, { useEffect, useState } from "react";
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
import { validatePhoneNumber } from "../../../lib/validations";

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
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      void dispatch(fetchAdminProfile());
    } else {
      // Strip +91 prefix from phone for display
      const phoneValue = user.phone?.replace(/^\+91/, '') ?? "";
      setFormState({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        phone: phoneValue,
      });
    }
  }, [dispatch, user]);

  const handleInputChange =
    (key: keyof typeof formState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleUpdate = async () => {
    // Validate phone number before submission
    const fullPhone = formState.phone.trim() ? `+91${formState.phone.trim()}` : '';
    const phoneValidationError = validatePhoneNumber(fullPhone);
    
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }
    
    setPhoneError(null);
    
    try {
      await dispatch(
        updateAdminProfile({
          first_name: formState.first_name,
          last_name: formState.last_name,
          phone: fullPhone,
        })
      ).unwrap();
      
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
                  <PhoneField
                    label="Phone Number"
                    value={formState.phone}
                    onChange={handleInputChange("phone")}
                    error={phoneError}
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

interface PhoneFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneField: React.FC<PhoneFieldProps & { error?: string | null }> = ({ label, value, onChange, error }) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/[^+\d]/g, ""); // Keep only + and digits
    const digitsOnly = inputValue.replace("+", "");
    
    // If user starts typing without +91, auto-prepend 91
    let processedValue = digitsOnly;
    if (digitsOnly.length > 0 && !digitsOnly.startsWith("91")) {
      // If starts with 0, remove it
      if (digitsOnly.startsWith("0")) {
        processedValue = "91" + digitsOnly.substring(1);
      } else if (digitsOnly.length <= 10) {
        processedValue = "91" + digitsOnly;
      }
    }
    
    // Limit to 12 digits (91 + 10 digits)
    processedValue = processedValue.substring(0, 12);
    
    // Display only digits after +91
    const displayValue = processedValue.length > 2 ? processedValue.substring(2) : processedValue;
    
    // Update the input value (show only digits after +91)
    e.target.value = displayValue;
    onChange({ ...e, target: { ...e.target, value: displayValue } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex flex-col gap-1">
  <div className="flex items-center gap-2">
    <span className="w-40 font-golos text-[14px] font-[500] text-gray-600">{label}</span>
    <div className="relative flex-1">
      <span className="absolute left-0 top-1/2 -translate-y-1/2 font-golos text-sm text-gray-600">
        +91
      </span>
      <Input
        type="tel"
        value={value}
            onChange={handlePhoneChange}
            maxLength={10}
            className={`rounded-none border-0 border-b bg-transparent pl-10 pr-0 font-golos text-sm text-gray-900 focus:outline-none focus:ring-0 ${
              error ? "border-red-500" : "border-[#69C24E] focus:border-[#46B753]"
            }`}
      />
    </div>
      </div>
      {error && (
        <p className="ml-[168px] text-red-500 text-xs">{error}</p>
      )}
  </div>
);
};

export default ProfilePage;

