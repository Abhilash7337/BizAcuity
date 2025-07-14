import React, { useState } from 'react';
import { authFetch } from '../../utils/auth';

const ReportsExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const quickReports = [
    {
      id: 'users',
      title: 'Users Report',
      description: 'Export all user data',
      icon: '👥',
      action: () => downloadReport('users')
    },
    {
      id: 'payments',
      title: 'Payments Report',
      description: 'Export payment and revenue data',
      icon: '💳',
      action: () => downloadReport('payments')
    },
    {
      id: 'drafts',
      title: 'Drafts Report',
      description: 'Export all draft/altar data',
      icon: '📄',
      action: () => downloadReport('content')
    },
    {
      id: 'flagged',
      title: 'Flagged Content',
      description: 'Export moderation reports',
      icon: '🚩',
      action: () => downloadReport('flagged')
    }
  ];

  const downloadReport = async (reportType) => {
    try {
      setLoading(true);
      setError('');

      // Simple report configuration
      const params = new URLSearchParams({
        reportType,
        format: 'csv',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      });

      const response = await authFetch(`http://localhost:5001/admin/reports?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Download CSV file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Report download error:', error);
      setError(`Failed to download ${reportType} report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadAllData = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        reportType: 'comprehensive',
        format: 'csv',
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      });

      const response = await authFetch(`http://localhost:5001/admin/reports?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate comprehensive report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprehensive_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Comprehensive report error:', error);
      setError(`Failed to download comprehensive report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Reports & Export</h2>
        <p className="text-gray-600 mb-6">
          Download reports for the last 30 days in CSV format. Perfect for analysis in Excel or Google Sheets.
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Quick Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickReports.map((report) => (
            <button
              key={report.id}
              onClick={report.action}
              disabled={loading}
              className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className="text-3xl mb-3">{report.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{report.title}</h3>
              <p className="text-sm text-gray-600">{report.description}</p>
            </button>
          ))}
        </div>

        {/* Complete Data Export */}
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">📋</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Complete Data Export</h3>
                <p className="text-gray-600 mb-4">
                  Download all your data from the last 90 days in one comprehensive report. 
                  Includes users, payments, drafts, and system activity.
                </p>
                <button
                  onClick={downloadAllData}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>📥</span>
                      <span>Download Complete Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">ℹ️ How it works:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Click any report button to instantly download CSV data</li>
            <li>• Reports include data from the last 30 days (90 days for complete export)</li>
            <li>• Open CSV files in Excel, Google Sheets, or any spreadsheet app</li>
            <li>• All sensitive data is included only for authorized admin access</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportsExport;
