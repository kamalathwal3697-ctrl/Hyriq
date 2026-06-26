import React, { useState } from 'react';
import { User, Briefcase, Mail, Lock, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface AuthPageProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onSignup: (details: {
    email: string;
    pass: string;
    role: 'candidate' | 'recruiter';
    name: string;
    phone?: string;
    bio?: string;
    paymentConfirmed?: boolean;
  }) => Promise<void>;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  
  // Shared Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Paywall states
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onSignup({
          email,
          pass: password,
          role,
          name,
          phone,
          bio
        });
      }
    } catch (err: any) {
      if (err.requiresPayment) {
        setShowPayment(true);
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Simulate bank gateway delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await onSignup({
        email,
        pass: password,
        role,
        name,
        phone,
        bio,
        paymentConfirmed: true
      });
      setShowPayment(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed. Please try again.');
      setShowPayment(false);
    } finally {
      setLoading(false);
    }
  };

  if (showPayment) {
    return (
      <div className="container animate-fade-in" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '40px 0'
      }}>
        <div className="glass-panel animate-glow" style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background glow orbs */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(6, 182, 212, 0.15)',
            filter: 'blur(30px)',
            pointerEvents: 'none'
          }}></div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span className="badge badge-danger" style={{ marginBottom: '12px', fontSize: '11px' }}>
              Slots Filled
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>
              Activate Your Account
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
              Early Bird Free Registrations have closed. Complete the ₹99 membership activation to unlock your dashboard.
            </p>
          </div>

          <div className="glass-panel" style={{
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center',
            border: '1px solid var(--border-color)'
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>MEMBERSHIP FEE</span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)' }}>₹99.00</span>
          </div>

          {/* Payment Type Switcher */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '10px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
            <button
              type="button"
              onClick={() => setPaymentType('upi')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: paymentType === 'upi' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: paymentType === 'upi' ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              UPI / QR
            </button>
            <button
              type="button"
              onClick={() => setPaymentType('card')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: paymentType === 'card' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: paymentType === 'card' ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              Credit/Debit Card
            </button>
          </div>

          <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {paymentType === 'upi' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>UPI ID</label>
                <input
                  type="text"
                  placeholder="e.g. mobile@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="glass-input"
                  required
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Card Number</label>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="glass-input"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="glass-input"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>CVV</label>
                    <input
                      type="password"
                      placeholder="***"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="glass-input"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-secondary animate-glow"
              style={{ width: '100%', padding: '14px', marginTop: '12px' }}
              disabled={loading}
            >
              {loading ? 'Processing ₹99 Secure Checkout...' : 'Pay ₹99 & Complete Registration'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowPayment(false);
                setErrorMsg('');
              }}
              className="btn btn-ghost"
              style={{ width: '100%' }}
              disabled={loading}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '40px 0'
    }}>
      <div className="glass-panel animate-glow" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow bubble */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.15)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}></div>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
            <Sparkles size={12} style={{ marginRight: '6px' }} />
            Join the Vibe
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>
            {isLogin ? 'Welcome to ' : 'Create Account on '}<span className="text-gradient-primary">Hyriq</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
            {isLogin ? 'Sign in to access your direct career matches' : 'Choose your role and start networking instantly'}
          </p>
        </div>

        {/* Role Switcher (Sign Up only) */}
        {!isLogin && (
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <button
              type="button"
              onClick={() => setRole('candidate')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: role === 'candidate' ? 'var(--primary)' : 'transparent',
                color: role === 'candidate' ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              <User size={14} /> Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: role === 'recruiter' ? 'var(--secondary)' : 'transparent',
                color: role === 'recruiter' ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              <Briefcase size={14} /> Recruiter
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fda4af',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '20px',
            fontWeight: 500
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Name Field (Sign Up only) */}
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {role === 'candidate' ? 'Full Name' : 'Recruiter Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="glass-input"
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '15px' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@domain.com"
                className="glass-input"
                style={{ paddingLeft: '44px', width: '100%' }}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '15px' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input"
                style={{ paddingLeft: '44px', width: '100%' }}
                required
              />
            </div>
          </div>

          {/* Bio Field (Sign Up only) */}
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {role === 'candidate' ? 'Short Professional Bio' : 'Company Intro'}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={role === 'candidate' ? 'What makes you unique?' : 'What does your organization build?'}
                className="glass-input"
                rows={3}
                style={{ resize: 'none' }}
              />
            </div>
          )}

          {/* Phone Field (Sign Up only) */}
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="glass-input"
              />
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px', padding: '14px' }}
            disabled={loading}
          >
            {loading ? (
              'Processing...'
            ) : isLogin ? (
              <>
                Sign In <LogIn size={16} />
              </>
            ) : (
              <>
                Create Account <UserPlus size={16} />
              </>
            )}
          </button>
        </form>

        {/* Auth Toggle */}
        <div style={{
          textAlign: 'center',
          marginTop: '28px',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '20px',
          fontSize: '13px'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account yet?" : 'Already registered?'}
          </span>{' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};
