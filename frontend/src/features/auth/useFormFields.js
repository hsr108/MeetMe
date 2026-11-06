import { useCallback, useState } from "react";

// Controlled-form state keyed by each input's `name` attribute.
export const useFormFields = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return [values, handleChange];
};
