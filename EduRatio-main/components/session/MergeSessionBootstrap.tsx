"use client";

import { useEffect } from "react";
import { MERGE_SESSION_STORAGE_KEYS } from "@/lib/mergeSessionKeys";

export function MergeSessionBootstrap() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const studentId = params.get("student_id");
    const sessionId = params.get("session_id");

    if (!token || !studentId || !sessionId) {
      return;
    }

    sessionStorage.setItem(MERGE_SESSION_STORAGE_KEYS.token, token);
    sessionStorage.setItem(MERGE_SESSION_STORAGE_KEYS.studentId, studentId);
    sessionStorage.setItem(MERGE_SESSION_STORAGE_KEYS.sessionId, sessionId);
  }, []);

  return null;
}
