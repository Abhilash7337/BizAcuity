import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { UserContext } from '../App';
import { setAuthUser, getAuthUser } from '../utils/auth';

const ChoosePlan = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [polling, setPolling] = useState(false);
  const pollIntervalRef = useRef(null);
  const [pollError, setPollError] = useState('');
  const { setRegisteredUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Get current user data and pre-select their plan if they have one
  useEffect(() => {
    const currentUser = getAuthUser();
    if (currentUser?.plan) {
      setSelectedPlan(currentUser.plan);
    }
    
    // Fetch available plans
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setPlansLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/plans`);
      const data = await response.json();
      
      if (response.ok) {
        // Convert backend plan structure to frontend format
        const formattedPlans = data.plans.map(plan => ({
          id: plan.name.toLowerCase().replace(/\s+/g, ''),
          name: plan.name,
          price: plan.monthlyPrice === 0 ?  `₹${plan.monthlyPrice}/month` : `₹${plan.monthlyPrice}/month`,
          features: plan.features || [],
          description: plan.description,
          limits: plan.limits
        }));
        setPlans(formattedPlans);
      } else {
        throw new Error(data.error || 'Failed to fetch plans');
      }
    } catch (err) {
      console.error('Fetch plans error:', err);
      setError('Failed to load subscription plans');
    } finally {
      setPlansLoading(false);
    }
  };

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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/choose-plan`, {
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
      // Show waiting for approval page
      setWaitingApproval(true);
      setPolling(true);
      pollForApproval(token, selectedPlan);
    } catch (err) {
      setError(err.message || 'Failed to select plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Poll for approval status
  const pollForApproval = (token, planId) => {
    let attempts = 0;
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    const poll = async () => {
      try {
        setPollError('');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/plan-upgrade-request`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const req = data.request;
          if (req) {
            if (req.status === 'approved') {
              setPolling(false);
              setWaitingApproval(false);
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
              // Fetch updated user info and update context/localStorage before redirect
              try {
                const userRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                const userData = await userRes.json();
                if (userRes.ok && userData.user) {
                  setAuthUser(userData.user);
                  setRegisteredUser({ ...userData.user, isLoggedIn: true });
                }
              } catch (e) { /* ignore fetch error, still redirect */ }
              navigate('/user');
              return;
            } else if (req.status === 'rejected') {
              setPolling(false);
              setWaitingApproval(false);
              setError('Your plan change request was rejected by the admin.');
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
              return;
            }
          }
        } else {
          setPollError(data.error || 'Failed to check approval status');
        }
      } catch (e) {
        setPollError('Failed to check approval status');
      }
      attempts++;
      if (attempts > 120) { // Stop after 10 minutes
        setPolling(false);
        setWaitingApproval(false);
        setError('Timed out waiting for admin approval.');
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      }
    };
    pollIntervalRef.current = setInterval(poll, 3000);
    poll(); // Run immediately
  };

  // Cleanup polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 overflow-hidden relative">
      {/* Animated SVG lines and gradient overlay above the gradient background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* Flowing lines effect with SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M0,50 Q25,25 50,50 T100,50" 
            stroke="url(#flowGradient)" 
            strokeWidth="0.5" 
            fill="none"
            style={{animation: 'backgroundFlow 40s ease-in-out infinite'}}
          />
          <path 
            d="M0,30 Q25,5 50,30 T100,30" 
            stroke="url(#flowGradient)" 
            strokeWidth="0.3" 
            fill="none"
            style={{animation: 'backgroundFlow 50s ease-in-out infinite reverse', animationDelay: '-10s'}}
          />
          <path 
            d="M0,70 Q25,95 50,70 T100,70" 
            stroke="url(#flowGradient)" 
            strokeWidth="0.4" 
            fill="none"
            style={{animation: 'backgroundFlow 35s ease-in-out infinite', animationDelay: '-25s'}}
          />
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="#a16207" />
              <stop offset="100%" stopColor="#b45309" />
              <stop offset="150%" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
        {/* Subtle gradient overlay that shifts */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{animation: 'gradientShift 80s ease-in-out infinite'}}
        ></div>
      </div>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16 md:px-8 lg:px-12">
        <div className="w-full max-w-5xl">
          {/* Waiting for approval state */}
          {waitingApproval ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-500 mb-8"></div>
              <h2 className="text-3xl font-bold text-white mb-4">Waiting for Admin Approval</h2>
              <p className="text-lg text-slate-300 mb-2">Your plan change request has been submitted and is pending admin approval.</p>
              <p className="text-base text-slate-400 mb-6">This page will automatically update once your request is approved or rejected.</p>
              {pollError && <div className="text-red-400 font-semibold mb-4">{pollError}</div>}
              <div className="text-orange-400 text-sm">You can close this tab and return later if you wish.</div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-5xl sm:text-6xl font-bold font-poppins mb-4 leading-tight text-white drop-shadow-lg animate-fade-in-rotate">
                  {getAuthUser()?.plan ? 'Change Your Plan' : 'Choose Your Plan'}
                </h1>
                <p className="text-xl sm:text-2xl text-slate-300 font-inter mb-6 animate-fade-in">
                  {getAuthUser()?.plan 
                    ? 'Select a new plan to change your current subscription'
                    : 'Select the plan that best fits your needs'
                  }
                </p>
              </div>

              {/* Loading State */}
              {plansLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto mb-6"></div>
                  <p className="text-orange-400 text-xl font-semibold">Loading subscription plans...</p>
                </div>
              ) : (
                <>
                  {/* Plan Selection Form */}
                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Plan Cards */}
                    <div className="grid md:grid-cols-2 gap-10 mb-12">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`relative p-10 rounded-3xl border-4 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-2xl transform ${
                            selectedPlan === plan.id
                              ? 'border-orange-500 bg-gradient-to-br from-slate-700 to-slate-800 scale-105'
                              : 'border-slate-600 bg-slate-800/90 hover:border-orange-400 hover:scale-102'
                          } group`}
                          style={{ minHeight: 440 }}
                          onClick={() => handlePlanSelect(plan.id)}
                        >
                          {/* Selection Indicator */}
                          {selectedPlan === plan.id && (
                            <div className="absolute -top-4 -right-4 w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}

                          {/* Plan Header */}
                          <div className="text-center mb-8">
                            <h3 className="text-4xl font-extrabold mb-2 text-white group-hover:text-orange-400 transition-colors duration-200 drop-shadow-md">
                              {plan.name}
                            </h3>
                            <div className="text-5xl font-extrabold text-orange-400 mb-2 drop-shadow-lg">
                              {plan.price}
                            </div>
                            <p className="text-lg text-slate-300 font-medium">
                              {plan.description}
                            </p>
                          </div>

                          {/* Plan Limits */}
                          {plan.limits && (
                            <div className="mb-8 p-5 bg-slate-700/50 border border-orange-500/30 rounded-2xl flex flex-col items-center shadow-sm">
                              <h4 className="text-lg font-semibold text-orange-400 mb-2">Plan Limits</h4>
                              <ul className="text-lg text-slate-300 space-y-1 font-medium">
                                <li>
                                  <span className="inline-flex items-center gap-2"><svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Saved Drafts: {plan.limits.designsPerMonth === -1 ? 'Unlimited' : `${plan.limits.designsPerMonth} draft${plan.limits.designsPerMonth !== 1 ? 's' : ''}`}</span>
                                </li>
                                <li>
                                  <span className="inline-flex items-center gap-2"><svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Image Uploads per Design: {plan.limits.imageUploadsPerDesign === -1 ? 'Unlimited' : plan.limits.imageUploadsPerDesign}</span>
                                </li>
                              </ul>
                            </div>
                          )}

                          {/* Features List */}
                          <ul className="space-y-4 mt-6">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-xl font-semibold text-green-400 bg-green-900/20 rounded-xl px-5 py-3 shadow-sm border border-green-500/30">
                                <svg className="w-7 h-7 text-green-500 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/50 text-red-400 text-center text-lg font-semibold">
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="text-center mt-8">
                      <button
                        type="submit"
                        disabled={loading || !selectedPlan}
                        className="group px-12 py-5 rounded-2xl text-slate-900 font-bold text-2xl bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChoosePlan; 