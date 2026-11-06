// "Already have an account? Login" style toggle under each auth form.
function AuthSwitchPrompt({ question, actionLabel, onSwitch }) {
  return (
    <p className="auth-switch">
      {question}{" "}
      <button type="button" onClick={onSwitch}>
        {actionLabel}
      </button>
    </p>
  );
}

export default AuthSwitchPrompt;
