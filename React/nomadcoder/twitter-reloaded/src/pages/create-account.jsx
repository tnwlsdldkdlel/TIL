/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./create-account.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState({
    name: "",
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
      const credentials = await createUserWithEmailAndPassword(
        auth,
        input.email,
        input.password
      );

      await updateProfile(credentials.user, { displayName: input.name });
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
      <h1 className="title">Join into 📱</h1>
      <form>
        <input
          name="name"
          placeholder="Name"
          type="text"
          value={input.name}
          onChange={onChangeInput}
          required
        />
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
          value={isLoading ? "Loading..." : "Create Account"}
          onClick={onSubmitButton}
        />
      </form>
      {error !== "" ? <span className="error-text">{error}</span> : null}
      <span className="link-text">
        Already have an account <Link to="/login">Log in &rarr;</Link>
      </span>
    </div>
  );
}
