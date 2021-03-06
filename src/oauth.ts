// This module creates the OAuth authentication url of a user.

import { param } from "./schemas.ts";

const oauthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const scopes = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.channel-memberships.creator",
  "https://www.googleapis.com/auth/youtube.force-ssl",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtubepartner",
  "https://www.googleapis.com/auth/youtubepartner-channel-audit",
];

export interface authParams extends param {
  client_id: string;
  redirect_uri: string;
  response_type?: "code" | "token";
  scope: string;
  access_type?: "online" | "offline"; // handle refreshing
  state?: string;
  include_granted_scopes?: boolean;
  login_hint?: string;
  prompt?: "none" | "consent select_account" | "consent" | "select_account";
}

export class authenticator {
  private create_url(creds: authParams): string {
    let url: string = oauthEndpoint + "?response_type=token";

    for (let p in creds) {
      if (p == "response_type") {
        // Don't add to url (pass)
      } else if (p == "scope") {
        url += "&scope=";
        let scope_list: string[] = creds[p].split(" ");
        for (let s of scope_list) {
          if (scopes.includes(s) == false) {
            throw new Error("Invalid scope: " + s);
          }
        }
        let add_scopes: string = scope_list.join("+");
        url += add_scopes;
      } else {
        url += `&${p}=${creds[p].toString()}`;
      }
    }

    return url;
  }

  authenticate(credentials: authParams): string {
    let auth_url: string = this.create_url(credentials);

    // open this auth_url in browser and get the token
    return auth_url;
  }
}
