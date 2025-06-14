"use client";
// @flow strict
import { isValidEmail } from "@/utils/check-email";
import axios from "axios";
import { useState } from "react";
import { TbMailForward } from "react-icons/tb";
import { toast } from "react-toastify";

function ContactForm() {
  const [error, setError] = useState({ 
    email: false, 
    name: false,
    message: false 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const validateName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]*$/.test(name);
  };

  const validateMessage = (message) => {
    return message.trim().length >= 10;
  };

  const checkRequired = () => {
    const nameValid = validateName(userInput.name);
    const messageValid = validateMessage(userInput.message);
    const emailValid = isValidEmail(userInput.email);

    setError({
      name: !nameValid,
      message: !messageValid,
      email: !emailValid
    });

    return nameValid && messageValid && emailValid;
  };

  const handleSendMail = async (e) => {
    e.preventDefault();

    if (!checkRequired()) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        '/api/contact',
        userInput
      );

      if (res.data && res.data.success) {
        toast.success(res.data.message || "Message sent successfully!");
        setSuccessMessage(res.data.message || "Your message sent successfully");
        setUserInput({
          name: "",
          email: "",
          message: "",
        });
        setError({
          name: false,
          email: false,
          message: false
        });
      } else {
        toast.error(res.data?.message || "Failed to send message.");
        setSuccessMessage("");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to send message.";
      toast.error(msg);
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    };
  };

  return (
    <div>
      <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">Contact with me</p>
      {successMessage && (
        <div className="mb-4 text-green-400 font-semibold text-center">{successMessage}</div>
      )}
      <div className="max-w-3xl text-white rounded-lg border border-[#464c6a] p-3 lg:p-5">
        <p className="text-sm text-[#d3d8e8]">{"If you have any questions or concerns, please don't hesitate to contact me. I am open to any work opportunities that align with my skills and interests."}</p>
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-base">Your Name: </label>
            <input
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              type="text"
              maxLength="100"
              required={true}
              onChange={(e) => { 
                setUserInput({ ...userInput, name: e.target.value }); 
                setSuccessMessage("");
                setError({ ...error, name: !validateName(e.target.value) });
              }}
              onBlur={checkRequired}
              value={userInput.name}
            />
            {error.name && <p className="text-sm text-red-400">Name must be at least 2 characters and contain only letters and spaces!</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Your Email: </label>
            <input
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              type="email"
              maxLength="100"
              required={true}
              value={userInput.email}
              onChange={(e) => { 
                setUserInput({ ...userInput, email: e.target.value }); 
                setSuccessMessage("");
                setError({ ...error, email: !isValidEmail(e.target.value) });
              }}
              onBlur={checkRequired}
            />
            {error.email && <p className="text-sm text-red-400">Please provide a valid email!</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Your Message: </label>
            <textarea
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              maxLength="500"
              name="message"
              required={true}
              onChange={(e) => { 
                setUserInput({ ...userInput, message: e.target.value }); 
                setSuccessMessage("");
                setError({ ...error, message: !validateMessage(e.target.value) });
              }}
              onBlur={checkRequired}
              rows="4"
              value={userInput.message}
            />
            {error.message && <p className="text-sm text-red-400">Message must be at least 10 characters long!</p>}
          </div>
          <div className="flex flex-col items-center gap-3">
            <button
              className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-5 md:px-12 py-2.5 md:py-3 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
              role="button"
              onClick={handleSendMail}
              disabled={isLoading}
            >
              {
                isLoading ?
                <span>Sending Message...</span>:
                <span className="flex items-center gap-1">
                  Send Message
                  <TbMailForward size={20} />
                </span>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;