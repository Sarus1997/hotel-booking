import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../AuthContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^0\d{8,9}$/;

interface FormState {
  email: string;
  full_name: string;
  phone: string;
  password: string;
  confirm_password: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.full_name.trim()) {
    errors.full_name = "กรุณากรอกชื่อ-นามสกุล";
  }
  if (!EMAIL_PATTERN.test(form.email)) {
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง เช่น name@example.com";
  }
  if (form.phone && !PHONE_PATTERN.test(form.phone)) {
    errors.phone = "เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก ขึ้นต้นด้วย 0";
  }
  if (form.password.length < 6) {
    errors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
  }
  if (form.confirm_password !== form.password) {
    errors.confirm_password = "รหัสผ่านไม่ตรงกัน";
  }
  return errors;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    email: "",
    full_name: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      const { confirm_password: _confirm, ...payload } = form;
      await register(payload);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h2>สมัครสมาชิก</h2>
      {error && <p className="alert error">{error}</p>}
      <form onSubmit={onSubmit} noValidate>
        <label>
          ชื่อ-นามสกุล
          <input
            value={form.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            required
          />
          {fieldErrors.full_name && (
            <span className="field-error">{fieldErrors.full_name}</span>
          )}
        </label>
        <label>
          อีเมล
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </label>
        <label>
          เบอร์โทรศัพท์
          <input
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
          {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
        </label>
        <label>
          รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)
          <input
            type="password"
            minLength={6}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
          />
          {fieldErrors.password && (
            <span className="field-error">{fieldErrors.password}</span>
          )}
        </label>
        <label>
          ยืนยันรหัสผ่าน
          <input
            type="password"
            minLength={6}
            value={form.confirm_password}
            onChange={(e) => update("confirm_password", e.target.value)}
            required
          />
          {fieldErrors.confirm_password && (
            <span className="field-error">{fieldErrors.confirm_password}</span>
          )}
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>
      </form>
      <p className="muted">
        มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
      </p>
    </div>
  );
}
