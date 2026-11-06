import { useState } from "react";

// Labelled text input styled like the guest page fields.
// Password fields get an eye button that toggles the text between hidden and visible.
function AuthField({ id, name, label, type = "text", value, onChange, autoComplete }) {
  const isPassword = type === "password";
  const [isVisible, setIsVisible] = useState(false);
  const inputType = isPassword && isVisible ? "text" : type;

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrapper">
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={isPassword ? "has-toggle" : undefined}
        />
        {isPassword && (
          <button
            type="button"
            className="auth-password-toggle"
            onClick={() => setIsVisible((visible) => !visible)}
            aria-label={isVisible ? "Hide password" : "Show password"}
            title={isVisible ? "Hide password" : "Show password"}
          >
            <i className={`fa-solid ${isVisible ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        )}
      </div>
    </div>
  );
}

export default AuthField;
