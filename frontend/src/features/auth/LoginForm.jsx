import { useAuth } from "../../hooks/useAuth.js";
import { useFormFields } from "./useFormFields.js";
import AuthField from "./AuthField.jsx";
import AuthSwitchPrompt from "./AuthSwitchPrompt.jsx";

function LoginForm({ handleForm }) {
  const { handleLogin } = useAuth();
  const [formData, handleOnChange] = useFormFields({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(formData.username, formData.password);
    } catch {
      // AuthProvider already shows an error toast.
    }
  };

  return (
    <div>
      <h1 className="auth-title">
        Login on <span>MeetMe</span>
      </h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          id="login-username"
          name="username"
          label="Username or Email"
          value={formData.username}
          onChange={handleOnChange}
          autoComplete="username"
        />
        <AuthField
          id="login-password"
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleOnChange}
          autoComplete="current-password"
        />
        <button className="auth-submit-btn" type="submit">
          Login
        </button>
      </form>
      <AuthSwitchPrompt question="Create an Account?" actionLabel="SignUp" onSwitch={handleForm} />
    </div>
  );
}

export default LoginForm;
