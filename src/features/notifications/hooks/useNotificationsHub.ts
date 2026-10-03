"use client";

import { useEffect, useRef } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import type { HubConnection } from "@microsoft/signalr";

import { getHubAccessToken } from "../lib/service";
import type { Notification } from "../types/notification";

export const NOTIFICATION_EVENT = "ReceiveNotification";

// SignalR's default policy gives up after four attempts (~42s). Keep
// retrying for as long as the user is signed in, backing off to 30s.
const RETRY_DELAYS_MS = [0, 2_000, 10_000, 30_000];

function retryDelay(attempt: number): number {
  return RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)];
}

interface NotificationsHubOptions {
  // null disables the connection (e.g. API_URL isn't configured).
  hubUrl: string | null;
  onNotification: (notification: Notification) => void;
  // Fires whenever the connection comes back after being down, so the
  // caller can refetch anything pushed while it was disconnected.
  onReconnected: () => void;
}

export function useNotificationsHub({
  hubUrl,
  onNotification,
  onReconnected,
}: NotificationsHubOptions) {
  // Callbacks live in refs so a new function identity on each render
  // doesn't tear down and rebuild the connection.
  const onNotificationRef = useRef(onNotification);
  const onReconnectedRef = useRef(onReconnected);
  useEffect(() => {
    onNotificationRef.current = onNotification;
    onReconnectedRef.current = onReconnected;
  });

  useEffect(() => {
    if (!hubUrl) return;

    let disposed = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const connection: HubConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, { accessTokenFactory: getHubAccessToken })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: ({ previousRetryCount }) =>
          retryDelay(previousRetryCount),
      })
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on(NOTIFICATION_EVENT, (notification: Notification) => {
      onNotificationRef.current(notification);
    });
    connection.onreconnected(() => onReconnectedRef.current());

    // withAutomaticReconnect only covers drops after a successful start, so
    // a failed initial start is retried here.
    const start = async (attempt: number) => {
      try {
        await connection.start();
        if (attempt > 0) onReconnectedRef.current();
      } catch (error) {
        // stop() during negotiate (unmount, Strict Mode's double effect)
        // rejects start() — expected, not an error.
        if (disposed) return;
        console.warn("Notifications hub connection failed, retrying.", error);
        retryTimer = setTimeout(() => start(attempt + 1), retryDelay(attempt + 1));
      }
    };

    void start(0);

    return () => {
      disposed = true;
      clearTimeout(retryTimer);
      void connection.stop();
    };
  }, [hubUrl]);
}
