'use client';

import { Container, Theme } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <Theme accentColor="violet">
      <Container maxWidth="95vw" maxHeight={"95vh"} align={"center"}>
        {children}
      </Container>
    </Theme>
  );
}
