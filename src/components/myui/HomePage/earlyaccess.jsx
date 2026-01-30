import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Mail, Phone, Send, Loader2, Sparkles, ShieldCheck, ChevronDown, AlertCircle, Search } from "lucide-react";
import { AlertToast } from "../AlertToast";
import logo from "@/assets/logo/logo2.png";
import logoDark from "@/assets/logo/logo.png";

export default function EarlyAccess({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "Lebanon",
    countryCode: "+961",
    cca2: "LB"
  });

  const [errors, setErrors] = useState({});

  // Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Fetch Countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,idd,cca2");
        const data = await response.json();
        const formatted = data
          .map(c => ({
            name: c.name.common,
            cca2: c.cca2,
            code: c.idd?.root ? (c.idd.root + (c.idd.suffixes?.[0] || "")) : ""
          }))
          .filter(c => c.code && c.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(formatted);
        setIsDataLoaded(true);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCountries();
  }, []);

  // Filter countries based on Search
  const filteredCountries = useMemo(() => {
    return countries.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.code.includes(searchQuery)
    );
  }, [searchQuery, countries]);

  // Block body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle clicking outside custom dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validate = () => {
    const newErrors = {};
    
    // 1. Name Validation (Letters only)
    const nameRegex = /^[\p{L}\s]+$/u; 
    
    if (!formData.firstName.trim()) newErrors.firstName = "الاسم الأول مطلوب";
    else if (!nameRegex.test(formData.firstName)) newErrors.firstName = "أحرف فقط";

    if (!formData.lastName.trim()) newErrors.lastName = "اسم العائلة مطلوب";
    else if (!nameRegex.test(formData.lastName)) newErrors.lastName = "أحرف فقط";

    // 2. Email Validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }

    // 3. Phone Validation
    const digitsOnly = formData.phoneNumber.replace(/\D/g, "");
    const phoneRules = {
        "+961": { min: 7, max: 8, label: "اللبناني" },
        "+966": { min: 9, max: 9, label: "السعودي" },
        "+971": { min: 9, max: 9, label: "الإماراتي" },
        "+20":  { min: 10, max: 11, label: "المصري" },
        "+965": { min: 8, max: 8, label: "الكويتي" },
        "+974": { min: 8, max: 8, label: "القطري" },
    };

    const currentRule = phoneRules[formData.countryCode];
    if (currentRule) {
        if (digitsOnly.length < currentRule.min || digitsOnly.length > currentRule.max) {
            newErrors.phoneNumber = `الرقم غير صحيح (${currentRule.min}-${currentRule.max} خانات)`;
        }
    } else {
        if (digitsOnly.length < 6 || digitsOnly.length > 15) {
            newErrors.phoneNumber = "رقم الهاتف غير صحيح";
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      AlertToast("يرجى التأكد من البيانات المدخلة", "error", "خطأ في التحقق");
      return;
    }
    setLoading(true);

    const payload = {
      firstName: formData.firstName,
      middleName: formData.middleName, 
      lastName: formData.lastName,
      nationality: formData.country,
      email: formData.email,
      phoneNumber: `${formData.countryCode}${formData.phoneNumber.replace(/\s/g, "")}`,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/early-access/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok || result.messageStatus === "SUCCESS") {
        AlertToast(result.message || "تم تسجيل طلبك بنجاح!", "success", "تم بنجاح");
        setFormData(prev => ({ ...prev, firstName: "", lastName: "", email: "", phoneNumber: "" }));
        setErrors({});
        onClose();
      } else {
        AlertToast(result.message || "حدث خطأ ما", "error", "خطأ");
      }
    } catch (error) {
      AlertToast("تعذر الاتصال بالخادم.", "error", "خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 1. Restrict Names to Letters only (Supports Arabic & Latin)
    if (["firstName", "middleName", "lastName"].includes(name)) {
      const letterRegex = /^[\p{L}\s]*$/u;
      if (!letterRegex.test(value)) return;
    }

    // 2. Restrict Phone Number to Digits only
    if (name === "phoneNumber") {
      const digitRegex = /^[0-9\s]*$/;
      if (!digitRegex.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSelectCountry = (country) => {
    setFormData({ 
      ...formData, 
      country: country.name, 
      countryCode: country.code, 
      cca2: country.cca2
    });
    setSearchQuery(""); // Reset search
    setIsDropdownOpen(false); // Close dropdown
    if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: "" }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 10 }}
            className="relative w-full max-w-4xl bg-[#fcfcfc] sm:rounded-[2rem] shadow-[0_25px_80px_rgba(0,0,0,0.15)] flex flex-col md:flex-row h-full max-h-screen sm:max-h-[85vh] border border-black/5 overflow-hidden"
          >
            {/* Fixed Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-6 left-6 z-[100] p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-slate-400 hover:text-slate-600 shadow-sm border border-black/5 transition-all focus:outline-none"
            >
              <X size={20} />
            </button>

            {/* Main Content Area */}
            <div className="w-full h-full flex flex-col md:flex-row overflow-y-auto custom-scrollbar">
              
              {/* Enhanced Sidebar */}
              <div className="hidden md:flex md:w-[40%] bg-gradient-to-br from-slate-900 via-slate-800 to-[#1e293b] p-12 flex-col justify-between border-l border-white/10 sticky top-0 h-auto min-h-full z-0 overflow-hidden relative">
                {/* Decorative Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-60 h-60 bg-[#5de3ba]/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]" />
                
                <div className="relative z-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                  >
                     <img src={logo} alt="Ktab Logo" className="h-12 w-auto object-contain" />
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-extrabold text-white mb-6 leading-tight tracking-tight"
                  >
                    كن جزءاً من <br/>
                    <span className="text-[#5de3ba]">الجيل القادم</span>
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-300 text-base font-medium leading-relaxed"
                  >
                    انضم إلى قائمة الحاصلين على وصول مبكر وحصري لمنصة كُتَّاب الرقمية.
                  </motion.p>
                </div>

                <div className="space-y-6 relative z-10">


                   <div className="space-y-4">
                      {[ 
                        { icon: ShieldCheck, text: "خصوصية بياناتك أولويتنا", color: "text-[#5de3ba]" }, 
                        { icon: Globe, text: "دعم دولي شامل لكل القراء", color: "text-blue-400" } 
                      ].map((item, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + (idx * 0.1) }}
                          className="flex items-center gap-4"
                        >
                          <div className={`p-2 rounded-lg bg-white/5 border border-white/5 ${item.color}`}>
                            <item.icon size={18} />
                          </div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.text}</span>
                        </motion.div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Form Area */}
              <div className="flex-1 p-6 sm:p-12 relative z-20 overflow-visible max-w-full bg-white">
                {/* Mobile Header (Visible only on small screens) */}
                <div className="md:hidden mb-10 mt-6 text-right">
                  <div className="mb-6">
                     <img src={logoDark} alt="Ktab Logo" className="h-10 w-auto mr-0 ml-auto object-contain" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">الوصول المبكر</h2>
                  <p className="text-sm font-medium text-slate-500">انضم إلى قائمة الانتظار الحصرية</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto md:mr-0">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mr-1">الاسم الأول *</label>
                      <input
                        required type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                        className={`w-full h-12 bg-slate-50/50 border rounded-xl px-4 text-slate-800 text-sm focus:bg-white focus:border-[#5de3ba] outline-none transition-all shadow-sm ${errors.firstName ? 'border-red-400' : 'border-slate-200'}`}
                        placeholder="أحمد"
                      />
                      {errors.firstName && <p className="text-[10px] text-red-500">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mr-1">الاسم الأوسط</label>
                      <input
                        type="text" name="middleName" value={formData.middleName} onChange={handleChange}
                        className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl px-4 text-slate-800 text-sm focus:bg-white focus:border-[#5de3ba] outline-none transition-all shadow-sm"
                        placeholder="محمد"
                      />
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mr-1">اسم العائلة *</label>
                      <input
                        required type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                        className={`w-full h-12 bg-slate-50/50 border rounded-xl px-4 text-slate-800 text-sm focus:bg-white focus:border-[#5de3ba] outline-none transition-all shadow-sm ${errors.lastName ? 'border-red-400' : 'border-slate-200'}`}
                        placeholder="العمري"
                      />
                      {errors.lastName && <p className="text-[10px] text-red-500">{errors.lastName}</p>}
                    </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mr-1">البريد الإلكتروني *</label>
                    <div className="relative group">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-300 group-hover:text-slate-400'}`} size={16} />
                      <input
                        required type="email" name="email" value={formData.email} onChange={handleChange}
                        className={`w-full h-12 bg-slate-50/50 border rounded-xl px-12 text-slate-800 text-sm focus:bg-white focus:border-[#5de3ba] outline-none transition-all text-left shadow-sm ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-slate-200'}`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-500 font-bold mr-1 flex items-center gap-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mr-1">رقم الهاتف *</label>
                    <div className={`flex border rounded-xl bg-slate-50/50 relative transition-all shadow-sm focus-within:bg-white focus-within:ring-4 ${errors.phoneNumber ? 'border-red-400 focus-within:ring-red-400/10' : 'border-slate-200 focus-within:ring-[#5de3ba]/10 focus-within:border-[#5de3ba]'}`}>
                       
                       {/* Phone Input - Now on Right (First child in RTL) */}
                       <div className="flex-1 relative" dir="ltr">
                          <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.phoneNumber ? 'text-red-400' : 'text-slate-300'}`} size={16} />
                          <input
                            required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                            className="w-full h-12 bg-transparent pl-10 pr-4 text-slate-800 text-sm outline-none text-left placeholder:text-right"
                            placeholder="70 000 000"
                          />
                       </div>

                       {/* Dropdown Trigger - Now on Left (Second child in RTL) */}
                       <div className="relative border-r border-slate-200/60 bg-slate-50/50 hover:bg-slate-100/80 transition-colors" ref={dropdownRef}>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDropdownOpen(!isDropdownOpen);
                            }}
                            className="flex items-center justify-between px-3 h-12 cursor-pointer gap-2.5 min-w-[120px] outline-none"
                          >
                             <div className="w-7 h-5 rounded overflow-hidden flex-shrink-0 shadow-sm border border-black/10">
                               <img 
                                 src={`https://flagcdn.com/w40/${formData.cca2.toLowerCase()}.png`}
                                 srcSet={`https://flagcdn.com/w80/${formData.cca2.toLowerCase()}.png 2x`}
                                 alt={formData.country}
                                 className="w-full h-full object-cover"
                               />
                             </div>
                             <span className="text-xs font-bold text-slate-600 flex-1 text-right">{formData.countryCode}</span>
                             <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {isDropdownOpen && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-[calc(100%+12px)] left-0 w-[calc(100vw-48px)] sm:w-[320px] bg-white rounded-2xl shadow-[0_-20px_60px_rgba(0,0,0,0.15),0_-8px_20px_rgba(0,0,0,0.1)] border border-black/10 z-[100] overflow-hidden flex flex-col-reverse"
                                style={{ maxWidth: "320px", transformOrigin: "bottom center" }}
                              >
                                <div className="p-3 border-t border-slate-100 bg-gradient-to-t from-slate-50 to-white">
                                  <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                      autoFocus type="text" placeholder="Search country..." value={searchQuery}
                                      onChange={(e) => setSearchQuery(e.target.value)}
                                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#5de3ba] focus:ring-2 focus:ring-[#5de3ba]/20 placeholder:text-slate-400 transition-all"
                                    />
                                  </div>
                                </div>
                                <div className="overflow-y-auto p-2" style={{ maxHeight: '280px', scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
                                  {filteredCountries.length > 0 ? (
                                    <div className="space-y-0.5">
                                      {filteredCountries.map((country) => (
                                        <button
                                          key={country.cca2} type="button" onClick={() => handleSelectCountry(country)}
                                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${formData.cca2 === country.cca2 ? 'bg-gradient-to-r from-[#5de3ba]/20 to-[#5de3ba]/10 border border-[#5de3ba]/30' : 'hover:bg-slate-50 border border-transparent'}`}
                                        >
                                          <div className="w-8 h-6 rounded overflow-hidden flex-shrink-0 shadow-sm border border-black/5">
                                            <img src={`https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`} alt={country.name} className="w-full h-full object-cover" />
                                          </div>
                                          <span className={`flex-1 text-left text-sm font-medium truncate ${formData.cca2 === country.cca2 ? 'text-[#0d9668]' : 'text-slate-700 group-hover:text-slate-900'}`}>{country.name}</span>
                                          <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${formData.cca2 === country.cca2 ? 'bg-[#5de3ba]/20 text-[#0d9668]' : 'bg-slate-100 text-slate-500'}`}>{country.code}</span>
                                        </button>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="p-6 text-center">
                                      <div className="text-slate-300 mb-2 text-xl italic">Search icon</div>
                                      <p className="text-sm text-slate-400">No country found</p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-[10px] text-red-500 font-bold mr-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="pt-8">
                    <button
                      disabled={loading} type="submit"
                      className="w-full h-14 bg-gradient-to-r from-[#5de3ba] via-[#45d1a5] to-[#2563eb] text-white rounded-2xl font-bold text-base transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(93,227,186,0.25)] hover:shadow-[0_25px_50px_rgba(93,227,186,0.35)] flex items-center justify-center gap-3 disabled:opacity-50 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                      {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <span className="relative z-10">تأكيد الانضمام للقائمة</span>
                          <Send size={18} className="rotate-180 relative z-10" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-6 font-medium">
                      بضغطك على تأكيد، أنت توافق على شروط الخدمة وسياسة الخصوصية
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}