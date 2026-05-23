"use client";

import { useEffect, useState } from "react";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function PhoneAuth() {
  const [phone, setPhone] = useState("+525512345678");
  const [code, setCode] = useState("");

  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "normal"
          }
        );

        window.recaptchaVerifier.render();
      }
    }
  }, []);

  async function sendCode() {
    try {
      console.log(phone);

      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );

      setConfirmationResult(result);
      console.log(result);
      alert("Código enviado");
    } catch (error) {
      console.error(error);
    }
  }

  async function verifyCode() {
    try {
      const result = await confirmationResult.confirm(code);

      const user = result.user;

      const idToken = await user.getIdToken();

      console.log("TOKEN:", idToken);

      // enviar al backend
      await fetch(`http://localhost:4000/api/client/confirm-client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone,
          idToken
        })
      });

      console.log(JSON.stringify({
          phone,
          idToken
        }))
      alert("Número verificado");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+525512345678"
      />

      <button onClick={sendCode}>
        Enviar código
      </button>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="123456"
      />

      <button onClick={verifyCode}>
        Verificar
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}