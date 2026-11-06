import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.jsx";

const withAuth = (WrappedComponent) => {

  const AuthenticatedComponent = (props) => {
    const { isAuthenticated } = useContext(AuthContext);
    const router = useNavigate();
    const [loading, setLoading] = useState(true);
    // React rule kehta hai:
    // "Agar tum useEffect ke andar koi function use karte ho (router), to usko dependency me daalo."
    useEffect(() => {
      const verify = async () => {
        try {
          const status = await isAuthenticated();
          if (!status) {
            router("/users/login", { replace: true });
            return;  // important: below code skip agar age ka code execute hoga to  redirect hone se pehle aur  setLoading(false); iski vajah se re-render hone se pehle wrapped component render ho jayega 1s ke liye 
          }
        } catch (err) {
          router("/users/login", { replace: true });
          return;
        } finally {
          setLoading(false);
        }
      };

      verify();
    }, [isAuthenticated, router]); // Agar router change hua → effect dubara run // Agar AuthContext me isAuthenticated function update hua → effect dubara run

    if (loading) return <h1>Checking authentication...</h1>;

    return (
      <>
        <WrappedComponent {...props} />

      </>
    );
  };

  return AuthenticatedComponent;
};

export default withAuth;

// ❌ Dependency array empty → only once

// Agar user authenticated hai → WrappedComponent show ho jayega

// Agar nahi hai → redirect ho chuka hoga and return ho jayega before reaching to the WrappedComponent
