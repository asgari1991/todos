import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Index() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    fetch("/api/auth/me").then((res) =>{
      if (res.status===200) {
        router.replace('/todos')
      }
      
    } )
    ;
    ;
  }, []);
  const signIn = async (event) => {
    event.preventDefault();
    const user = { identifier, password };
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (res.status === 200) {
      setIdentifier("");
      setPassword("");
      alert("Logged in successfully");
      router.replace("/todos");
    } else if (res.status === 404) {
      alert("user is not found");
    } else if (res.status === 422) {
      alert("username or password is not correct");
    }
  };
  return (
    <div className="box">
      <h1 align="center">Login Form</h1>
      <form role="form" method="post">
        <div className="inputBox">
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="off"
            required
          />
          <label>Username|Email</label>
        </div>
        <div className="inputBox">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            required
          />
          <label>Password</label>
        </div>

        <input
          type="submit"
          className="register-btn"
          value="Sign In"
          onClick={signIn}
        />
      </form>
    </div>
  );
}

export default Index;
