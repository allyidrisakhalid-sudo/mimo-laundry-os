"use client";

const ACCESS_TOKEN_KEY = "mimo_access_token";
const USER_ROLE_KEY = "mimo_user_role";
const USER_PHONE_KEY = "mimo_user_phone";

export function saveSession(accessToken: string, role: string, phone: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_ROLE_KEY, role);
  localStorage.setItem(USER_PHONE_KEY, phone);
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(USER_PHONE_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRole() {
  return localStorage.getItem(USER_ROLE_KEY);
}

export function getPhone() {
  return localStorage.getItem(USER_PHONE_KEY);
}
