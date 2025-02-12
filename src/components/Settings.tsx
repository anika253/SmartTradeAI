import React from 'react';
import { useStore } from '../store/useStore';

export function Settings() {
  const { settings, updateSettings } = useStore();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.autoTrade}
              onChange={(e) => updateSettings({ autoTrade: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">Enable Automated Trading</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Allow AI to automatically execute trades based on analysis
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Risk Level</label>
          <select
            value={settings.riskLevel}
            onChange={(e) => updateSettings({ riskLevel: e.target.value as any })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSettings({ notifications: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">Enable Notifications</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Receive alerts for important trading signals and executed trades
          </p>
        </div>
      </div>
    </div>
  );
}