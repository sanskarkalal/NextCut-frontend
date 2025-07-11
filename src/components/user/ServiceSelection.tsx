import React, { useState } from "react";
import type { ServiceType, ServiceOption } from "../../types";

interface ServiceSelectionProps {
  onSelect: (service: ServiceType) => void;
  onCancel: () => void;
  barberName: string;
  isLoading?: boolean;
}

const serviceOptions: ServiceOption[] = [
  {
    id: "haircut",
    name: "Haircut",
    duration: 20,
    description: "Professional haircut and styling",
  },
  {
    id: "beard",
    name: "Beard Trim",
    duration: 5,
    description: "Beard trimming and shaping",
  },
  {
    id: "haircut+beard",
    name: "Haircut + Beard",
    duration: 25,
    description: "Complete haircut and beard service",
  },
];

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  onSelect,
  onCancel,
  barberName,
  isLoading = false,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  );

  const handleConfirm = () => {
    if (selectedService) {
      onSelect(selectedService);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Choose Your Service
          </h3>
          <p className="text-gray-600">
            Select the service you want from{" "}
            <span className="font-medium">{barberName}</span>
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {serviceOptions.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              disabled={isLoading}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedService === service.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${
                isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">
                      {service.name}
                    </h4>
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      ~{service.duration} min
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {service.description}
                  </p>
                </div>
                <div className="ml-4">
                  {selectedService === service.id ? (
                    <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedService || isLoading}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Joining..." : "Join Queue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;
