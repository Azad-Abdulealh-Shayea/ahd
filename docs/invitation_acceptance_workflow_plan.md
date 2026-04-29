# Invitation Acceptance Workflow Plan

## Goal

Invitation acceptance should turn a sent contract into an accepted, fundable contract without relying on hardcoded tokens or static contract data. The invite link should load the contract by `inviteToken`, show the invited party exactly what they are accepting, and then bind the invitation to the current user when they accept.

## Current Baseline

The backend already has `Contract.inviteToken`, `ContractParty.acceptedAt`, and the `acceptInvite` service. The invite page now reads the contract by token from the database. The accept dialog calls `contracts.acceptInvite` instead of showing a local-only success toast.

## Workflow

1. Contract creator finishes the creation flow and sends the contract. The server creates the contract with status `SENT`, generates a unique `inviteToken`, and creates two parties: the creator party with `acceptedAt` set, and the invited party with `acceptedAt` empty.

2. The invite URL is `/contracts/invite/[token]`. This page is public-read for the contract preview only. It loads by token and shows contract title, parties, total amount, milestones, deliverables, acceptance criteria, revision rules, and review windows.

3. If the visitor is not signed in, the accept CTA should route them through login and preserve the invite token as a return path. After login, they return to the same invite URL.

4. On accept, the client calls `contracts.acceptInvite({ inviteToken })`. The server verifies that the current user matches the invited party by `email` or `userId`. If not, it returns `FORBIDDEN`.

5. If valid, the server updates the invited `ContractParty` with `userId` and `acceptedAt`, updates the contract to `ACCEPTED`, clears or keeps the token according to product policy, and writes a `CONTRACT_ACCEPTED` audit event.

6. After success, the UI redirects to `/dashboard/contracts/[contractId]`. If the current user is the payer, the first unfunded milestone shows the funding action.

## Edge Cases

- Invalid token: show a not-found state.
- Already accepted by the same user: redirect to the contract detail.
- Token belongs to another email: block with a clear error.
- Contract cancelled or disputed before acceptance: block acceptance.
- Invited user does not exist yet: login/signup should create or select a user with the invited email before acceptance.

## Next Implementation Steps

1. Add a lightweight unauthenticated invite-read query or keep the current server-only `getContractInviteByToken`.
2. Add return-path handling for unauthenticated invite visitors.
3. Add a dedicated acceptance success state instead of relying only on redirect.
4. Add tests for invalid token, wrong user, already accepted invite, and accepted contract enabling funding.
