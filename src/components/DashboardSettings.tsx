import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import SpotlightCard from "./SpotlightCard";

type DashboardSettingsProps = {
  acceptMessages: boolean;
  isSwitchLoading: boolean;
  handleSwitchChange: () => void;
  register: UseFormRegister<{ acceptMessages: boolean }>;
};

export function DashboardSettings({
  acceptMessages,
  isSwitchLoading,
  handleSwitchChange,
  register,
}: DashboardSettingsProps) {
  return (
    <SpotlightCard className="p-6 flex items-center justify-center md:justify-start">
      <div className="flex items-center space-x-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          id="accept-messages"
          className="data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-700"
        />
        <label
          htmlFor="accept-messages"
          className="text-lg text-white font-medium"
        >
          Accepting Messages: {acceptMessages ? "Yes" : "No"}
        </label>
      </div>
    </SpotlightCard>
  );
}
