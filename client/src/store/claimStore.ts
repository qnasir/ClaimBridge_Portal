import { makeAutoObservable } from "mobx";

import { Claim } from "@/lib/types";

class ClaimsStore {
  claims: Claim[] = [];
  filteredClaims: Claim[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setClaims(claims: Claim[]) {
    this.claims = claims;
    this.filteredClaims = claims;
  }

  filterClaims(filteredClaims: Claim[]) {
    this.filteredClaims = filteredClaims;
  }
}

const claimsStore = new ClaimsStore();
export default claimsStore;
