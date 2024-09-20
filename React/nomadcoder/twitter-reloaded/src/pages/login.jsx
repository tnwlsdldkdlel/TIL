/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./create-account.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onSubmitButton = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, input.email, input.password);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account">
      <h1 className="title">Log into 📱</h1>
      <form>
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={input.email}
          onChange={onChangeInput}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={input.password}
          onChange={onChangeInput}
          required
        />
        <input
          type="submit"
          value={isLoading ? "Loading..." : "Log in"}
          onClick={onSubmitButton}
        />
      </form>
      {error !== "" ? <span className="error-text">{error}</span> : null}
      <span className="link-text">
        Don't have an account?{" "}
        <Link to="/create-account">Create one &rarr;</Link>
      </span>
    </div>
  );
}
