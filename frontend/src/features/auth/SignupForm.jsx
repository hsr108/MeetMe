import { useAuth } from "../../hooks/useAuth.js";
import { useFormFields } from "./useFormFields.js";
import AuthField from "./AuthField.jsx";
import AuthSwitchPrompt from "./AuthSwitchPrompt.jsx";

function SignupForm({ handleForm }) {
  const { handleSignup } = useAuth();
  const [formData, handleOnChange] = useFormFields({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSignup(formData.name, formData.username, formData.email, formData.password);
    } catch {
      // AuthProvider already shows an error toast.
    }
  };

  return (
    <div>
      <h1 className="auth-title">
        SignUp on <span>MeetMe</span>
      </h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          id="signup-name"
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleOnChange}
          autoComplete="name"
        />
        <AuthField
          id="signup-username"
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleOnChange}
          autoComplete="username"
        />
        <AuthField
          id="signup-email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleOnChange}
          autoComplete="email"
        />
        <AuthField
          id="signup-password"
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleOnChange}
          autoComplete="new-password"
        />
        <button className="auth-submit-btn" type="submit">
          Create Account
        </button>
      </form>
      <AuthSwitchPrompt
        question="Already Have an Account?"
        actionLabel="Login"
        onSwitch={handleForm}
      />
    </div>
  );
}

export default SignupForm;
