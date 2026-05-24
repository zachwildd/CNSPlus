# CNSPlus.Shared

DTOs and the NSwag-generated API client.

In phase 1 this project is intentionally empty. Phase 2 wires in:

- `openapi/openapi.json` (committed snapshot of the API contract)
- An NSwag MSBuild target that regenerates `ApiClient.cs` at build time
- The typed client interfaces consumers inject via DI

See the design doc, §6.
