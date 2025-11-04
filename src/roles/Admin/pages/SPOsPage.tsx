import React from 'react';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import ViewIcon from '../../../assets/svg/view.svg';
import EmailIcon from '../../../assets/svg/Newspos.svg';

interface SPOData {
  id: string;
  sector: string;
  organizationName: string;
  contactEmail: string;
  instrument: string;
  loanRequest: string;
}

const SPOsPage: React.FC = () => {
  // Dummy data for SPOs
  const spoData: SPOData[] = [
    {
      id: '#12345',
      sector: 'Agriculture',
      organizationName: 'abcd company technology',
      contactEmail: 'yuktiaggarwal@gmail.com',
      instrument: 'Commercial Debt with Impact....',
      loanRequest: 'Eligible'
    },
    {
      id: '#12345',
      sector: 'Waste management / Recycling',
      organizationName: 'abcd company technology',
      contactEmail: 'yuktiaggarwal@gmail.com',
      instrument: 'Commercial Debt with Impact....',
      loanRequest: 'Non Eligible'
    },
    {
      id: '#12345',
      sector: 'Health',
      organizationName: 'abcd company technology',
      contactEmail: 'yuktiaggarwal@gmail.com',
      instrument: 'Not Completed',
      loanRequest: '-'
    },
    {
      id: '#12345',
      sector: 'Livelihood creation',
      organizationName: 'abcd company technology',
      contactEmail: 'yuktiaggarwal@gmail.com',
      instrument: 'Commercial Debt with Impact....',
      loanRequest: 'Submitted'
    },
    {
      id: '#12345',
      sector: 'Others',
      organizationName: 'abcd company technology',
      contactEmail: 'yuktiaggarwal@gmail.com',
      instrument: 'Not Completed',
      loanRequest: 'Eligible'
    },
    {
      id: '#12345',
      sector: 'Agriculture',
      organizationName: 'abcd company technology',
      contactEmail: 'yuktiaggarwal@gmail.com',
      instrument: 'Commercial Debt with Impact....',
      loanRequest: '-'
    },
    {
      id: '#12345',
      sector: 'Waste management / Recycling',
      organizationName: 'abcd company technology',
      contactEmail: 'yuktiaggarwal@gmail.com',
      instrument: 'Commercial Debt with Impact....',
      loanRequest: 'Eligible'
    }
  ];

  const getLoanRequestColor = (status: string) => {
    if (status === 'Eligible') return 'text-green-600';
    if (status === 'Non Eligible') return 'text-red-600';
    if (status === 'Submitted') return 'text-blue-600';
    return 'text-gray-500';
  };

  const getInstrumentColor = (instrument: string) => {
    if (instrument === 'Not Completed') return 'text-red-600';
    return 'text-gray-900';
  };

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header with title and buttons */}
        <div className="flex items-center justify-between">
          <h1 
            className="text-gray-800"
            style={{
              fontFamily: 'Baskervville',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '30px'
            }}
          >
            SPOs Management
          </h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="px-4 py-2">
              Search
            </Button>
            <Button variant="outline" className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600">
              Filters
            </Button>
            <Button variant="outline" className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600">
              Sort by: New to old
            </Button>
            <Button variant="gradient" className="px-4 py-2">
              Generate Report
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      ID
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      Sector
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      Organization Name
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      Contact Email ID
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      Instrument
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      Loan Request
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {spoData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td 
                        className="px-6 whitespace-nowrap text-sm font-medium text-gray-900"
                        style={{
                          fontFamily: 'Golos Text',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '12px',
                          verticalAlign: 'middle',
                          paddingTop: '16px',
                          paddingBottom: '16px'
                        }}
                      >
                        {item.id}
                      </td>
                      <td 
                        className="px-6 whitespace-nowrap text-sm text-gray-900"
                        style={{
                          fontFamily: 'Golos Text',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '12px',
                          verticalAlign: 'middle',
                          paddingTop: '16px',
                          paddingBottom: '16px'
                        }}
                      >
                        {item.sector}
                      </td>
                      <td 
                        className="px-6 whitespace-nowrap text-sm text-gray-900"
                        style={{
                          fontFamily: 'Golos Text',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '12px',
                          verticalAlign: 'middle',
                          paddingTop: '16px',
                          paddingBottom: '16px'
                        }}
                      >
                        {item.organizationName}
                      </td>
                      <td 
                        className="px-6 whitespace-nowrap text-sm text-gray-900"
                        style={{
                          fontFamily: 'Golos Text',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '12px',
                          verticalAlign: 'middle',
                          paddingTop: '16px',
                          paddingBottom: '16px'
                        }}
                      >
                        {item.contactEmail}
                      </td>
                      <td 
                        className={`px-6 whitespace-nowrap text-sm ${getInstrumentColor(item.instrument)}`}
                        style={{
                          fontFamily: 'Golos Text',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '12px',
                          verticalAlign: 'middle',
                          paddingTop: '16px',
                          paddingBottom: '16px'
                        }}
                      >
                        {item.instrument}
                      </td>
                      <td 
                        className={`px-6 whitespace-nowrap text-sm ${getLoanRequestColor(item.loanRequest)}`}
                        style={{
                          fontFamily: 'Golos Text',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '12px',
                          verticalAlign: 'middle',
                          paddingTop: '16px',
                          paddingBottom: '16px'
                        }}
                      >
                        {item.loanRequest}
                      </td>
                      <td 
                        className="px-6 whitespace-nowrap text-center" 
                        style={{ 
                          verticalAlign: 'middle',
                          paddingTop: '16px',
                          paddingBottom: '16px'
                        }}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                            title="View"
                          >
                            <img src={ViewIcon} alt="View" className="w-5 h-5" />
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                            title="Email"
                          >
                            <img src={EmailIcon} alt="Email" className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
};

export default SPOsPage;
