import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { UserContext } from '../App';
import { setAuthUser, getAuthUser } from '../utils/auth';

const ChoosePlan = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setRegisteredUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Get current user data and pre-select their plan if they have one
  useEffect(() => {
    const currentUser = getAuthUser();
    if (currentUser?.plan) {
      setSelectedPlan(currentUser.plan);
    }
  }, []);

  const plans = [
    {
      id: 'regular',
      name: 'Regular',
      price: 'Free',
      features: [
        'Basic wall design tools',
        'Up to 10 saved designs',
        'Standard decorators'
        ],
      description: 'Perfect for getting started with wall design'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹299/month',
      features: [
        'Advanced design tools',
        'Unlimited saved designs',
        'Premium templates',
        'Priority support',
        'Export high-resolution images',
        'Collaboration features'
      ],
      description: 'For professional designers and power users'
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setError(''); // Clear any previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5001/api/user/choose-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: selectedPlan })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to select plan');
      }

      // Update user data in localStorage and context with the new plan
      if (data.user) {
        setAuthUser(data.user);
        setRegisteredUser({ ...data.user, isLoggedIn: true });
      }

      // Redirect back to user profile on success
      navigate('/user');
      
    } catch (err) {
      setError(err.message || 'Failed to select plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f1e6cb' }}>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:px-8 lg:px-12">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4" style={{ color: '#625d8c' }}>
              {getAuthUser()?.plan ? 'Change Your Plan' : 'Choose Your Plan'}
            </h1>
            <p className="text-gray-600 text-lg">
              {getAuthUser()?.plan 
                ? 'Select a new plan to change your current subscription'
                : 'Select the plan that best fits your needs'
              }
            </p>
          </div>

          {/* Plan Selection Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plan Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                    selectedPlan === plan.id
                      ? 'border-primary-dark bg-white/90 shadow-lg scale-[1.02]'
                      : 'border-gray-200 bg-white/80 hover:border-primary/50 hover:scale-[1.01]'
                  }`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {/* Selection Indicator */}
                  {selectedPlan === plan.id && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-dark rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#625d8c' }}>
                      {plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-primary-dark mb-2">
                      {plan.price}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading || !selectedPlan}
                className="px-8 py-4 rounded-xl text-white font-semibold text-lg
                         bg-primary-dark hover:bg-primary
                         transition-all duration-200 shadow-md
                         hover:shadow-lg hover:scale-[1.02]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  getAuthUser()?.plan 
                    ? `Update to ${selectedPlan ? plans.find(p => p.id === selectedPlan)?.name : 'Plan'}`
                    : `Continue with ${selectedPlan ? plans.find(p => p.id === selectedPlan)?.name : 'Plan'}`
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChoosePlan; 