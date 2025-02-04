import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./Login.module.scss";
import { apiRequest } from "../../../utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";

type Errors = {
  name?: string;
  email?: string;
};

export const Login = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/search");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your name";
    }

    if (!email.trim()) {
      newErrors.email = "Please enter your email";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);

    if (errors.name) {
      setErrors((prev: Errors) => ({ ...prev, name: undefined }));
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (errors.email) {
      setErrors((prev: Errors) => ({ ...prev, email: undefined }));
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors: Errors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        toast.error("Login Failed!");

        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      toast.success("Login Successful!");
      setIsAuthenticated(true);
      navigate("/search");
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form noValidate onSubmit={handleLogin} className={styles.loginForm}>
        <h2>Welcome</h2>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
            required
            className={errors.name && styles.error}
          />
          {errors.name && <div className={styles.error}>{errors.name}</div>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            required
            className={errors.email && styles.error}
          />
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
