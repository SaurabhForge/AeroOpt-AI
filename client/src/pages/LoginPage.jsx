import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, RotateCw, HelpCircle, AlertTriangle, ShieldAlert, Lock, Info } from 'lucide-react';
import api from '../lib/api';
import useAppStore from '../store/useAppStore';
import iafLogo from '../assets/iaf-logo.png';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', captchaInput: '' });
  const [captchaCode, setCaptchaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [caution, setCaution] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockUntil, setLockUntil] = useState(null);
  const [remainingAttempts, setRemainingAttempts] = useState(10);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAppStore();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Generate random 6-digit captcha
  const generateCaptcha = () => {
    const chars = '0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  // Draw authentic captcha on canvas
  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (!captchaCode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Gradient background: Yellow -> Light Green -> Cyan (exact as screenshot)
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, '#eab308');   // Yellow
    grad.addColorStop(0.4, '#a3e635'); // Lime green
    grad.addColorStop(0.8, '#06b6d4'); // Cyan
    grad.addColorStop(1, '#38bdf8');   // Sky blue

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Strike-through line across numbers (as in screenshot)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(8, height * 0.52);
    ctx.bezierCurveTo(width * 0.3, height * 0.45, width * 0.7, height * 0.58, width - 8, height * 0.52);
    ctx.stroke();

    // Noise dots
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render characters
    ctx.font = 'bold 30px "Arial", sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'middle';

    const startX = 14;
    const stepX = (width - 35) / 6;

    for (let i = 0; i < captchaCode.length; i++) {
      ctx.save();
      const x = startX + i * stepX;
      const y = height / 2;
      const angle = (Math.random() - 0.5) * 0.25; // slight tilt
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(captchaCode[i], 0, 2);
      ctx.restore();
    }
  }, [captchaCode]);

  // Check client-side storage for active lock state on mount
  useEffect(() => {
    const storedLockUntil = localStorage.getItem('aeroopt_lock_until');
    if (storedLockUntil) {
      const lockDate = new Date(storedLockUntil);
      if (lockDate > new Date()) {
        setIsLocked(true);
        setLockUntil(lockDate);
      } else {
        localStorage.removeItem('aeroopt_lock_until');
      }
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    // Validate captcha
    if (form.captchaInput.trim() !== captchaCode.trim()) {
      setCaution({
        type: 'warning',
        title: 'CAPTCHA VERIFICATION FAILED',
        message: 'Type the exact numbers shown in the image box.'
      });
      generateCaptcha();
      setForm(f => ({ ...f, captchaInput: '' }));
      return;
    }

    setLoading(true);
    setCaution(null);

    try {
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      });

      localStorage.removeItem('aeroopt_lock_until');
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err) {
      const res = err.response?.data;
      generateCaptcha(); // regenerate captcha on any failed login
      setForm(f => ({ ...f, captchaInput: '' }));

      // Fallback for cloud deployment (when S3 cannot reach local API directly)
      if (!err.response) {
        const cleanId = (form.email || '').trim().toLowerCase();
        const validUsers = {
          'planner@aeroopt.ai': { name: 'Sqn Ldr Patel', role: 'PLANNER' },
          'planner': { name: 'Sqn Ldr Patel', role: 'PLANNER' },
          'admin@aeroopt.ai': { name: 'Air Marshal Singh', role: 'ADMIN' },
          'admin': { name: 'Air Marshal Singh', role: 'ADMIN' },
          'saurabhkr': { name: 'Wg Cdr Saurabh Kumar', role: 'ADMIN' },
          'saurabhkr@aeroopt.ai': { name: 'Wg Cdr Saurabh Kumar', role: 'ADMIN' },
          'saurabh': { name: 'Wg Cdr Saurabh Kumar', role: 'ADMIN' }
        };
        const validPasswords = ['Planner@1234', 'Admin@1234', 'Password@1234'];

        if (validUsers[cleanId] && validPasswords.includes(form.password)) {
          setAuth(
            { id: 'cloud-ops-01', email: cleanId, name: validUsers[cleanId].name, role: validUsers[cleanId].role },
            'cloud-demo-jwt'
          );
          navigate('/');
          return;
        } else if (validUsers[cleanId]) {
          setCaution({
            type: 'warning',
            title: 'CAUTION: INCORRECT PASSWORD',
            message: 'Incorrect password. Please enter the correct password.'
          });
          return;
        }
      }

      if (err.response?.status === 423 || res?.error === 'ACCOUNT_LOCKED') {
        const lockDate = res?.lockUntil ? new Date(res.lockUntil) : new Date(Date.now() + 24 * 3600000);
        setIsLocked(true);
        setLockUntil(lockDate);
        setRemainingAttempts(0);
        localStorage.setItem('aeroopt_lock_until', lockDate.toISOString());
        setCaution({
          type: 'lock',
          title: 'TERMINAL LOCKED // ACCESS SUSPENDED',
          message: res?.message || '10 failed authentication attempts exceeded. Terminal access locked for 24 hours.'
        });
      } else if (res?.error === 'INVALID_PASSWORD') {
        const remaining = res.remainingAttempts !== undefined ? res.remainingAttempts : remainingAttempts - 1;
        setRemainingAttempts(remaining);
        setCaution({
          type: 'warning',
          title: 'CAUTION: INCORRECT PASSWORD',
          message: 'Incorrect password. Please enter the correct password.',
          attempts: res.attempts || (10 - remaining),
          remaining
        });
      } else {
        setCaution({
          type: 'error',
          title: 'AUTHENTICATION REJECTED',
          message: res?.message || `User ID "${form.email}" not recognized. Please use an authorized ops ID (e.g. planner@aeroopt.ai, admin@aeroopt.ai, or saurabhkr).`
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f0f2f5] font-sans">
      {/* ── LEFT PANEL: SIGN IN FORM (MATCHING IAF PORTAL) ── */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#f0f2f5]">
        <div className="w-full max-w-[440px] mx-auto my-auto py-8">
          {/* Sign In Heading */}
          <h1 className="text-3xl sm:text-4xl text-[#1e293b] font-normal text-center mb-6 tracking-tight">
            Sign In
          </h1>

          {/* Authorized Credentials Helper Banner */}
          <div className="mb-6 p-2.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-start gap-2 shadow-xs">
            <Info size={15} className="text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="font-semibold">Authorized Ops Clearance:</strong><br />
              • User: <span className="font-mono font-bold text-blue-800">planner@aeroopt.ai</span> (or <span className="font-mono">planner</span>) | Pass: <span className="font-mono font-bold text-blue-800">Planner@1234</span><br />
              • User: <span className="font-mono font-bold text-blue-800">saurabhkr</span> | Pass: <span className="font-mono font-bold text-blue-800">Password@1234</span>
            </div>
          </div>

          {/* Caution / Warning / Lockout Message */}
          {caution && (
            <div
              className={`mb-6 p-3.5 rounded border text-xs leading-relaxed transition-all shadow-sm ${
                caution.type === 'lock'
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : caution.type === 'warning'
                  ? 'bg-amber-50 border-amber-400 text-amber-900'
                  : 'bg-red-50 border-red-400 text-red-800'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {caution.type === 'lock' ? (
                  <ShieldAlert size={16} className="text-red-600 shrink-0" />
                ) : (
                  <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                )}
                <span>{caution.title}</span>
              </div>
              <p className="text-[12px]">{caution.message}</p>
              {caution.type === 'warning' && caution.attempts !== undefined && (
                <div className="mt-2 pt-2 border-t border-amber-200 flex justify-between text-[11px] font-mono">
                  <span>Failed Attempts: <strong className="text-amber-700">{caution.attempts} / 10</strong></span>
                  <span>Lockout Policy: <strong className="text-red-600">24 Hours</strong></span>
                </div>
              )}
              {caution.type === 'lock' && lockUntil && (
                <div className="mt-2 pt-2 border-t border-red-200 text-[11px] font-mono">
                  Locked until: <strong className="text-red-700">{lockUntil.toLocaleString()}</strong>
                </div>
              )}
            </div>
          )}

          {/* Locked Terminal State */}
          {isLocked ? (
            <div className="bg-white p-8 rounded-lg border border-red-200 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
                <Lock size={26} />
              </div>
              <h2 className="text-lg font-bold text-red-700">Terminal Access Restricted</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Maximum incorrect attempts reached (10/10). Security policy enforced. Access locked for 24 hours.
              </p>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-gray-700">
                Unlock Scheduled: <span className="font-bold text-blue-700">{lockUntil?.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            /* Official Form */
            <form onSubmit={submit} className="space-y-5" autoComplete="off">
              {/* USER ID (Email ID) */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase mb-1.5 tracking-wide">
                  USER ID (Email ID): <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="Enter User ID (e.g. planner@aeroopt.ai or saurabhkr)"
                  className="w-full bg-white border border-[#cbd5e1] rounded px-3 py-2 text-sm text-gray-800 placeholder-[#94a3b8] focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-colors shadow-sm"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase mb-1.5 tracking-wide">
                  PASSWORD: <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Enter Password"
                    className={`w-full bg-white border rounded px-3 pr-10 py-2 text-sm text-gray-800 placeholder-[#94a3b8] focus:outline-none transition-colors shadow-sm ${
                      caution?.type === 'warning'
                        ? 'border-amber-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-500'
                        : 'border-[#cbd5e1] focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* CAPTCHA BOX */}
              <div className="flex items-start gap-3">
                <div className="bg-white border border-[#cbd5e1] p-2.5 rounded shadow-sm inline-block">
                  {/* Captcha Image display with refresh icon */}
                  <div className="relative inline-flex items-center border border-[#94a3b8] rounded overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={180}
                      height={46}
                      className="cursor-pointer select-none"
                      onClick={generateCaptcha}
                      title="Click to refresh captcha"
                    />
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-gray-800 hover:text-blue-900 transition-colors bg-white/70 rounded-full hover:bg-white"
                      title="Refresh Captcha"
                    >
                      <RotateCw size={13} />
                    </button>
                  </div>

                  {/* Captcha input */}
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      value={form.captchaInput}
                      onChange={(e) => setForm(f => ({ ...f, captchaInput: e.target.value }))}
                      placeholder="Type numbers as shown in image"
                      className="w-full bg-white border border-[#cbd5e1] rounded px-2.5 py-1.5 text-xs text-gray-800 placeholder-[#94a3b8] focus:outline-none focus:border-[#1e3a8a] font-mono shadow-inner"
                    />
                  </div>
                </div>

                {/* Help Icon */}
                <div className="pt-2 text-gray-500 hover:text-gray-800 cursor-pointer" title="Enter the digits displayed in the image box">
                  <HelpCircle size={16} />
                </div>
              </div>

              {/* ACTIONS ROW: Forgot Password ? & Sign In */}
              <div className="flex items-center justify-between pt-2">
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link has been dispatched to authorized squadron personnel.');
                  }}
                  className="text-sm font-semibold text-[#1d4ed8] hover:text-[#1e3a8a] hover:underline"
                >
                  Forgot Password ?
                </a>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1a2d54] hover:bg-[#101e38] text-white text-sm font-semibold px-8 py-2 rounded-full transition-all duration-150 shadow hover:shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>
          )}

          {/* Bottom Advisory Note */}
          <div className="mt-10 pt-4 text-[11px] text-gray-600 leading-relaxed border-t border-gray-200">
            <p>
              <strong>Note:</strong> It is advised to check your SPAM folder along with your INBOX for verification communications and security alerts.
            </p>
            <p className="mt-1 text-gray-500 font-mono text-[10px]">
              AeroOpt AI • Air Power: Dynamic Air Operations & Resource Optimisation
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: OFFICIAL IAF CREST & BRANDING ── */}
      <div className="w-full md:w-1/2 min-h-screen bg-[#111e38] flex flex-col items-center justify-center p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col items-center max-w-lg">
          {/* Authentic IAF Logo from user image */}
          <div className="mb-4">
            <img
              src={iafLogo}
              alt="Indian Air Force Official Emblem"
              className="w-64 h-auto sm:w-80 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* Project Titles */}
          <div className="space-y-1.5 mt-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white font-sans uppercase drop-shadow-sm">
              INDIAN AIR FORCE
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold tracking-wide text-[#38bdf8] uppercase font-sans">
              AEROOPT AI
            </h3>
            <p className="text-xs sm:text-sm tracking-widest text-[#93c5fd] font-medium uppercase pt-1">
              AIR OPERATIONS PLANNING & RESOURCE OPTIMISATION SYSTEM
            </p>
            <div className="inline-block mt-3 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-mono text-cyan-200">
              AIR POWER DECISION SUPPORT PLATFORM
            </div>
          </div>
        </div>

        {/* Footer classification */}
        <div className="absolute bottom-6 text-[10px] text-gray-400 font-mono tracking-wider">
          RESTRICTED FLIGHT OPERATIONS TERMINAL // AUTHORIZED ACCESS ONLY
        </div>
      </div>
    </div>
  );
}
