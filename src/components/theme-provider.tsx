"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import { useEffect } from "react";
import { useSettingsStore } from "@/lib/store";
import { PRIMARY_APP_COLORS } from "@/lib/types";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    const primaryAppColor = useSettingsStore((state) => state.primaryAppColor);

    useEffect(() => {
        document.documentElement.classList.remove(...PRIMARY_APP_COLORS);
        document.documentElement.classList.add(primaryAppColor);
    }, [primaryAppColor]);

    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
