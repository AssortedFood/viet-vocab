// app/auth/signin/page.jsx
"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Container, Typography } from "@mui/material";

export default function SignInPage() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    // fetch the list of configured providers (e.g. Google)
    getProviders().then((prov) => setProviders(prov));
  }, []);

  if (!providers) return null; // or a spinner

  return (
    <Container sx={{ mt: 8, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Sign in to VietVocab
      </Typography>

      {Object.values(providers).map((provider) => (
        <Button
          key={provider.id}
          variant="contained"
          sx={{ my: 1 }}
          onClick={() =>
            signIn(provider.id, {
              callbackUrl: "/",      // redirect home on success
            })
          }
        >
          Sign in with {provider.name}
        </Button>
      ))}
    </Container>
  );
}
